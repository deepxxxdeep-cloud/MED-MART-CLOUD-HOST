import { Router } from "express";
import { body, param } from "express-validator";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Message from "../models/Message.js";
import Product from "../models/Product.js";
import PayoutBatch from "../models/PayoutBatch.js";
import PlatformConfig from "../models/PlatformConfig.js";
import AdminActivityLog from "../models/AdminActivityLog.js";
import { requireAdmin, requireRole } from "../middleware/adminAuth.js";
import { validate } from "../middleware/validate.js";
import { newId } from "../utils/razorpay.js";

const router = Router();
router.use(requireAdmin);

/* ---------------------------------------------------------------- overview */

router.get("/dashboard-stats", async (_req, res, next) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const startOfLast = new Date(startOfMonth);
    startOfLast.setMonth(startOfLast.getMonth() - 1);
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const paid = { paymentStatus: "completed" };

    const [
      buyers, sellers, verifiedSellers, pendingSellers,
      ordersThisMonth, ordersLastMonth, revenueThisMonth,
      pendingPayouts, signupsToday, flaggedUsers, series,
    ] = await Promise.all([
      User.countDocuments({ role: "buyer" }),
      User.countDocuments({ role: "seller" }),
      User.countDocuments({ role: "seller", isVerified: true }),
      User.countDocuments({ role: "seller", isVerified: false }),
      Order.countDocuments({ ...paid, createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ ...paid, createdAt: { $gte: startOfLast, $lt: startOfMonth } }),
      Order.aggregate([
        { $match: { ...paid, createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, gmv: { $sum: "$totalAmount" }, commission: { $sum: "$platformCommission" } } },
      ]),
      Order.aggregate([
        { $match: { ...paid, orderStatus: "delivered", payoutStatus: { $ne: "paid" } } },
        { $group: { _id: null, amount: { $sum: "$sellerEarning" }, count: { $sum: 1 } } },
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: startOfDay } } },
        { $group: { _id: "$role", count: { $sum: 1 } } },
      ]),
      User.countDocuments({ isFlagged: true }),
      Order.aggregate([
        { $match: paid },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            gmv: { $sum: "$totalAmount" },
            commission: { $sum: "$platformCommission" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 180 },
      ]),
    ]);

    return res.json({
      users: { buyers, sellers, total: buyers + sellers },
      sellers: { verified: verifiedSellers, pending: pendingSellers },
      orders: { thisMonth: ordersThisMonth, lastMonth: ordersLastMonth },
      revenue: {
        gmv: revenueThisMonth[0]?.gmv || 0,
        commission: revenueThisMonth[0]?.commission || 0,
      },
      pendingPayouts: {
        amount: pendingPayouts[0]?.amount || 0,
        count: pendingPayouts[0]?.count || 0,
      },
      signupsToday: Object.fromEntries(signupsToday.map((s) => [s._id, s.count])),
      flaggedUsers,
      series,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/activity", async (_req, res, next) => {
  try {
    const logs = await AdminActivityLog.find().sort({ createdAt: -1 }).limit(50);
    return res.json({ logs });
  } catch (err) {
    next(err);
  }
});

/* ------------------------------------------------------------------- users */

function buildUserQuery(req, role) {
  const q = { role };
  if (req.query.status === "banned") q.isSuspended = true;
  if (req.query.status === "active") q.isSuspended = { $ne: true };
  if (req.query.verification === "pending") q.isVerified = false;
  if (req.query.verification === "verified") q.isVerified = true;
  if (req.query.search) {
    const rx = new RegExp(String(req.query.search).trim(), "i");
    q.$or = [{ fullName: rx }, { email: rx }, { phone: rx }, { businessName: rx }];
  }
  return q;
}

router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find(buildUserQuery(req, "buyer")).sort({ createdAt: -1 }).limit(200);

    // Order counts and spend come from the orders collection rather than a
    // denormalised field, so they can't drift out of date.
    const stats = await Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: "$buyerId", orders: { $sum: 1 }, spent: { $sum: "$totalAmount" } } },
    ]);
    const byId = Object.fromEntries(stats.map((s) => [String(s._id), s]));

    return res.json({
      users: users.map((u) => ({
        ...u.toPublic(),
        isSuspended: u.isSuspended,
        totalOrders: byId[String(u._id)]?.orders || 0,
        totalSpent: byId[String(u._id)]?.spent || 0,
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/sellers", async (req, res, next) => {
  try {
    const sellers = await User.find(buildUserQuery(req, "seller")).sort({ createdAt: -1 }).limit(200);

    const [productCounts, salesStats] = await Promise.all([
      Product.aggregate([{ $group: { _id: "$sellerId", count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { paymentStatus: "completed" } },
        { $group: { _id: "$sellerId", sales: { $sum: "$totalAmount" }, orders: { $sum: 1 } } },
      ]),
    ]);
    const products = Object.fromEntries(productCounts.map((p) => [String(p._id), p.count]));
    const sales = Object.fromEntries(salesStats.map((s) => [String(s._id), s]));

    return res.json({
      sellers: sellers.map((s) => ({
        ...s.toPublic(),
        isSuspended: s.isSuspended,
        totalProducts: products[String(s._id)] || 0,
        totalSales: sales[String(s._id)]?.sales || 0,
        totalOrders: sales[String(s._id)]?.orders || 0,
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/users/:id/ban",
  requireRole("super-admin", "admin", "support"),
  [param("id").notEmpty(), body("reason").trim().notEmpty().withMessage("A reason is required")],
  validate,
  async (req, res, next) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: { isSuspended: true, banReason: req.body.reason, bannedAt: new Date() } },
        { new: true }
      );
      if (!user) return res.status(404).json({ message: "User not found" });

      await AdminActivityLog.record(req, {
        action: "user.ban",
        targetType: "User",
        targetId: user._id,
        detail: `${user.email || user.phone}: ${req.body.reason}`,
      });
      return res.json({ user: user.toPublic() });
    } catch (err) {
      next(err);
    }
  }
);

router.patch("/users/:id/unban", async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isSuspended: false }, $unset: { banReason: "", bannedAt: "" } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    await AdminActivityLog.record(req, {
      action: "user.unban",
      targetType: "User",
      targetId: user._id,
      detail: user.email || user.phone,
    });
    return res.json({ user: user.toPublic() });
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/sellers/:id/verify",
  [param("id").notEmpty(), body("approved").isBoolean(), body("reason").optional().trim()],
  validate,
  async (req, res, next) => {
    try {
      const { approved, reason } = req.body;
      const seller = await User.findByIdAndUpdate(
        req.params.id,
        { $set: { isVerified: approved, ...(reason && { verificationNote: reason }) } },
        { new: true }
      );
      if (!seller) return res.status(404).json({ message: "Seller not found" });

      await AdminActivityLog.record(req, {
        action: approved ? "seller.verify" : "seller.reject",
        targetType: "User",
        targetId: seller._id,
        detail: `${seller.businessName || seller.email}${reason ? `: ${reason}` : ""}`,
      });
      return res.json({ seller: seller.toPublic() });
    } catch (err) {
      next(err);
    }
  }
);

/* -------------------------------------------------------------- chat flags */

router.get("/chat-flags", async (req, res, next) => {
  try {
    const q = { isBlocked: true };
    if (req.query.status === "unreviewed") q.reviewedAt = { $exists: false };
    if (req.query.status === "reviewed") q.reviewedAt = { $exists: true };

    const flags = await Message.find(q)
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("senderId", "fullName businessName email role communicationViolations isFlagged")
      .populate("receiverId", "fullName businessName role");

    const summary = await Message.aggregate([
      { $match: { isBlocked: true } },
      { $unwind: "$blockedCodes" },
      { $group: { _id: "$blockedCodes", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return res.json({ flags, summary });
  } catch (err) {
    next(err);
  }
});

router.patch("/chat-flags/:id/dismiss", async (req, res, next) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { $set: { reviewedAt: new Date() } },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: "Flag not found" });

    // A dismissed flag was a false positive, so the sender shouldn't keep
    // carrying it toward a suspension.
    await User.updateOne({ _id: msg.senderId }, { $inc: { communicationViolations: -1 } });

    await AdminActivityLog.record(req, {
      action: "chatflag.dismiss",
      targetType: "Message",
      targetId: msg._id,
      detail: "Marked as false positive",
    });
    return res.json({ message: msg });
  } catch (err) {
    next(err);
  }
});

/* --------------------------------------------------------- orders + payouts */

router.get("/orders", async (req, res, next) => {
  try {
    const q = {};
    if (req.query.status) q.orderStatus = req.query.status;
    if (req.query.search) {
      q.$or = [
        { orderId: new RegExp(String(req.query.search).trim(), "i") },
        { productName: new RegExp(String(req.query.search).trim(), "i") },
      ];
    }
    const orders = await Order.find(q)
      .sort({ createdAt: -1 })
      .limit(500)
      .populate("buyerId", "fullName businessName")
      .populate("sellerId", "fullName businessName");
    return res.json({ orders });
  } catch (err) {
    next(err);
  }
});

router.get("/payouts/pending", async (_req, res, next) => {
  try {
    const pending = await Order.aggregate([
      {
        $match: {
          paymentStatus: "completed",
          orderStatus: "delivered",
          payoutStatus: { $ne: "paid" },
        },
      },
      {
        $group: {
          _id: "$sellerId",
          pendingAmount: { $sum: "$sellerEarning" },
          orderIds: { $push: "$_id" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { pendingAmount: -1 } },
    ]);

    const sellers = await User.find({ _id: { $in: pending.map((p) => p._id) } });
    const byId = Object.fromEntries(sellers.map((s) => [String(s._id), s]));

    const minimum = Number(await PlatformConfig.getValue("minimum_payout_amount")) || 0;

    return res.json({
      minimum,
      pending: pending.map((p) => {
        const s = byId[String(p._id)];
        return {
          sellerId: p._id,
          sellerName: s?.businessName || s?.fullName || "Unknown",
          accountLast4: s?.payout?.accountLast4 || null,
          bankVerified: Boolean(s?.payout?.verified),
          pendingAmount: p.pendingAmount,
          orders: p.orders,
          orderIds: p.orderIds,
          // Below-threshold balances roll into the next cycle rather than
          // generating a payout whose fee exceeds its value.
          eligible: p.pendingAmount >= minimum && Boolean(s?.payout?.verified),
        };
      }),
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/payouts/process",
  requireRole("super-admin", "finance"),
  [body("sellerIds").isArray({ min: 1 })],
  validate,
  async (req, res, next) => {
    try {
      const results = [];

      for (const sellerId of req.body.sellerIds) {
        const orders = await Order.find({
          sellerId,
          paymentStatus: "completed",
          orderStatus: "delivered",
          payoutStatus: { $ne: "paid" },
        });
        if (!orders.length) {
          results.push({ sellerId, status: "skipped", reason: "nothing pending" });
          continue;
        }

        const seller = await User.findById(sellerId);
        if (!seller?.payout?.verified) {
          results.push({ sellerId, status: "skipped", reason: "bank details not verified" });
          continue;
        }

        const total = orders.reduce((s, o) => s + o.sellerEarning, 0);

        // Recorded as "processing" — the actual transfer is handed to
        // RazorpayX Route, which confirms asynchronously via webhook.
        const batch = await PayoutBatch.create({
          batchId: newId("PO"),
          sellerId,
          orderIds: orders.map((o) => o._id),
          totalAmount: total,
          status: "processing",
          bankAccountUsed: seller.payout.accountLast4
            ? `••••${seller.payout.accountLast4}`
            : seller.payout.upiId,
          processedBy: req.admin._id,
          processedAt: new Date(),
        });

        await Order.updateMany(
          { _id: { $in: orders.map((o) => o._id) } },
          { $set: { payoutStatus: "scheduled" } }
        );

        await AdminActivityLog.record(req, {
          action: "payout.process",
          targetType: "PayoutBatch",
          targetId: batch._id,
          detail: `₹${total} to ${seller.businessName || seller.email} across ${orders.length} orders`,
        });

        results.push({ sellerId, status: "processing", batchId: batch.batchId, amount: total });
      }

      return res.json({ results });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/payouts/history", async (_req, res, next) => {
  try {
    const batches = await PayoutBatch.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("sellerId", "businessName fullName");
    return res.json({ batches });
  } catch (err) {
    next(err);
  }
});

export default router;
