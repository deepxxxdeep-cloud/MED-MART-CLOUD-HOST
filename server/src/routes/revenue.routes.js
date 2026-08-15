import { Router } from "express";
import Order from "../models/Order.js";
import Payout from "../models/Payout.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * Revenue is always aggregated for the authenticated seller — the route
 * deliberately takes no seller id, so one seller can't read another's numbers
 * by changing a URL.
 */
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const sellerId = req.user._id;
    const paid = { sellerId, paymentStatus: "completed" };

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    const [totals, thisMonth, lastMonth, pendingPayout, byCategory, byProduct, byState, series] =
      await Promise.all([
        Order.aggregate([
          { $match: paid },
          { $group: { _id: null, revenue: { $sum: "$sellerEarning" }, orders: { $sum: 1 } } },
        ]),
        Order.aggregate([
          { $match: { ...paid, createdAt: { $gte: startOfMonth } } },
          { $group: { _id: null, revenue: { $sum: "$sellerEarning" }, orders: { $sum: 1 } } },
        ]),
        Order.aggregate([
          { $match: { ...paid, createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } } },
          { $group: { _id: null, revenue: { $sum: "$sellerEarning" } } },
        ]),
        Order.aggregate([
          { $match: { ...paid, orderStatus: "delivered", payoutStatus: { $ne: "paid" } } },
          { $group: { _id: null, amount: { $sum: "$sellerEarning" }, orders: { $sum: 1 } } },
        ]),
        Order.aggregate([
          { $match: paid },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "product",
            },
          },
          { $unwind: "$product" },
          { $group: { _id: "$product.category", revenue: { $sum: "$sellerEarning" } } },
          { $sort: { revenue: -1 } },
        ]),
        Order.aggregate([
          { $match: paid },
          {
            $group: {
              _id: "$productName",
              revenue: { $sum: "$sellerEarning" },
              units: { $sum: "$quantity" },
            },
          },
          { $sort: { revenue: -1 } },
          { $limit: 5 },
        ]),
        Order.aggregate([
          { $match: paid },
          {
            $group: {
              _id: "$deliveryAddress.state",
              revenue: { $sum: "$sellerEarning" },
              orders: { $sum: 1 },
            },
          },
          { $sort: { revenue: -1 } },
        ]),
        Order.aggregate([
          { $match: paid },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              revenue: { $sum: "$sellerEarning" },
              orders: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

    const thisMonthRevenue = thisMonth[0]?.revenue || 0;
    const lastMonthRevenue = lastMonth[0]?.revenue || 0;
    const trend = lastMonthRevenue
      ? Number((((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1))
      : null;

    return res.json({
      totals: {
        revenue: totals[0]?.revenue || 0,
        orders: totals[0]?.orders || 0,
        thisMonthRevenue,
        trend,
        pendingPayout: pendingPayout[0]?.amount || 0,
        pendingPayoutOrders: pendingPayout[0]?.orders || 0,
      },
      byCategory,
      byProduct,
      byState,
      series,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/transactions", requireAuth, async (req, res, next) => {
  try {
    const orders = await Order.find({ sellerId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(500)
      .populate("buyerId", "fullName businessName");
    return res.json({ orders });
  } catch (err) {
    next(err);
  }
});

router.get("/payouts", requireAuth, async (req, res, next) => {
  try {
    const payouts = await Payout.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ payouts });
  } catch (err) {
    next(err);
  }
});

export default router;
