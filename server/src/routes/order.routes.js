import { Router } from "express";
import { body, param } from "express-validator";
import Order, { DEFAULT_COMMISSION_RATE } from "../models/Order.js";
import Transaction from "../models/Transaction.js";
import Product from "../models/Product.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import PlatformConfig from "../models/PlatformConfig.js";
import {
  razorpay,
  verifyPaymentSignature,
  newId,
  paymentsConfigured,
} from "../utils/razorpay.js";

const router = Router();

// The key id is public by design — it identifies the merchant to the checkout
// script. The secret never leaves the server.
router.get("/config", async (_req, res, next) => {
  try {
    const configured = await paymentsConfigured();
    const keyId = await PlatformConfig.getValue("razorpay_key_id");
    const commissionRate = Number(await PlatformConfig.getValue("platform_commission_rate")) || DEFAULT_COMMISSION_RATE;
    return res.json({ configured, keyId: keyId || null, commissionRate });
  } catch (err) { next(err); }
});
/**
 * Creates a Razorpay order for an intended purchase.
 *
 * The client sends only a product id and a quantity. Price, total, commission
 * and seller earning are all recomputed from the database — a client that
 * posts its own amount is ignored, which is what stops someone paying ₹1 for
 * a ₹2,50,000 machine.
 */
router.post(
  "/create",
  requireAuth,
  [
    body("productId").notEmpty(),
    body("quantity").isInt({ min: 1 }).toInt(),
    body("deliveryAddress.fullName").trim().notEmpty(),
    body("deliveryAddress.phone").trim().notEmpty(),
    body("deliveryAddress.line1").trim().notEmpty(),
    body("deliveryAddress.city").trim().notEmpty(),
    body("deliveryAddress.state").trim().notEmpty(),
    body("deliveryAddress.pincode").trim().isPostalCode("IN"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { productId, quantity, deliveryAddress } = req.body;

      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "That product no longer exists" });
      if (quantity < (product.moq || 1)) {
        return res
          .status(422)
          .json({ message: `Minimum order for this product is ${product.moq} units` });
      }

      const rate = Number(await PlatformConfig.getValue("platform_commission_rate")) || DEFAULT_COMMISSION_RATE;
      const money = Order.priceOrder(product.price, quantity, rate);
      const orderId = newId("MM");

      const client = await razorpay();
      const rzpOrder = await client.orders.create({
        // Razorpay works in paise.
        amount: money.totalAmount * 100,
        currency: "INR",
        receipt: orderId,
        notes: { orderId, productId: String(product._id), buyerId: String(req.user._id) },
      });

      const order = await Order.create({
        orderId,
        buyerId: req.user._id,
        sellerId: product.sellerId,
        productId: product._id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        ...money,
        razorpayOrderId: rzpOrder.id,
        deliveryAddress,
        paymentStatus: "pending",
      });

      await Transaction.create({
        transactionId: newId("TXN"),
        orderId: order._id,
        amount: money.totalAmount,
        type: "payment",
        status: "created",
        razorpayOrderId: rzpOrder.id,
      });

      return res.status(201).json({
        order: {
          orderId: order.orderId,
          amount: money.totalAmount,
          platformCommission: money.platformCommission,
          sellerEarning: money.sellerEarning,
        },
        razorpay: { orderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency },
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Confirms an order once checkout reports success. The signature check is the
 * only thing that makes this trustworthy; the webhook below is the backstop
 * for when the browser never comes back.
 */
router.post(
  "/verify-payment",
  requireAuth,
  [
    body("razorpayOrderId").notEmpty(),
    body("razorpayPaymentId").notEmpty(),
    body("signature").notEmpty(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { razorpayOrderId, razorpayPaymentId, signature } = req.body;

      if (!(await verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, signature }))) {
        await Transaction.updateOne(
          { razorpayOrderId },
          { $set: { status: "failed", notes: "signature mismatch" } }
        );
        return res.status(400).json({ message: "We couldn't verify that payment" });
      }

      const order = await Order.findOne({ razorpayOrderId, buyerId: req.user._id });
      if (!order) return res.status(404).json({ message: "Order not found" });

      // Idempotent — the webhook and this callback race by design.
      if (order.paymentStatus !== "completed") {
        order.paymentStatus = "completed";
        order.orderStatus = "confirmed";
        order.razorpayPaymentId = razorpayPaymentId;
        await order.save();

        await Transaction.updateOne(
          { razorpayOrderId },
          { $set: { status: "captured", razorpayPaymentId, razorpaySignature: signature } }
        );
      }

      return res.json({ order });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/buyer/mine", requireAuth, async (req, res, next) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ orders });
  } catch (err) {
    next(err);
  }
});

router.get("/seller/mine", requireAuth, async (req, res, next) => {
  try {
    const orders = await Order.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ orders });
  } catch (err) {
    next(err);
  }
});

const FLOW = ["confirmed", "processing", "shipped", "delivered"];

router.patch(
  "/:orderId/status",
  requireAuth,
  [
    param("orderId").notEmpty(),
    body("orderStatus").isIn([...FLOW, "cancelled"]),
    body("trackingNumber").optional().trim(),
    body("courier").optional().trim(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const order = await Order.findOne({ orderId: req.params.orderId });
      if (!order) return res.status(404).json({ message: "Order not found" });

      // Only the seller fulfilling the order may move it along.
      if (String(order.sellerId) !== String(req.user._id)) {
        return res.status(403).json({ message: "That isn't your order to update" });
      }

      const { orderStatus, trackingNumber, courier } = req.body;

      // Statuses move forward only — a delivered order can't quietly become
      // "processing" again, which would reopen its payout.
      if (orderStatus !== "cancelled") {
        const from = FLOW.indexOf(order.orderStatus);
        const to = FLOW.indexOf(orderStatus);
        if (to < from) {
          return res.status(422).json({ message: `Can't move an order back to ${orderStatus}` });
        }
      }

      order.orderStatus = orderStatus;
      if (trackingNumber) order.trackingNumber = trackingNumber;
      if (courier) order.courier = courier;
      if (orderStatus === "delivered") {
        order.deliveredAt = new Date();
        // Payout becomes eligible only once the buyer has the goods.
        order.payoutStatus = "scheduled";
      }
      await order.save();

      return res.json({ order });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
