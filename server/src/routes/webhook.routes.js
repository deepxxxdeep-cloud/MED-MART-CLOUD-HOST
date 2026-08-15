import { Router } from "express";
import express from "express";
import Order from "../models/Order.js";
import Transaction from "../models/Transaction.js";
import { verifyWebhookSignature } from "../utils/razorpay.js";

const router = Router();

/**
 * Razorpay's server-to-server confirmation.
 *
 * This exists because the browser callback can't be relied on — the buyer may
 * close the tab, lose signal, or never return from a UPI app. Razorpay retries
 * this endpoint until it gets a 2xx, so payment state converges even when the
 * frontend never reports back.
 *
 * The signature is computed over the exact raw bytes, so this route needs the
 * unparsed body — hence express.raw here rather than the app-wide JSON parser.
 */
router.post(
  "/razorpay",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.get("x-razorpay-signature");
    if (!verifyWebhookSignature(req.body, signature)) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    let event;
    try {
      event = JSON.parse(req.body.toString("utf8"));
    } catch {
      return res.status(400).json({ message: "Malformed payload" });
    }

    try {
      const payment = event.payload?.payment?.entity;
      if (!payment) return res.json({ received: true });

      const razorpayOrderId = payment.order_id;

      if (event.event === "payment.captured") {
        // Same transition as the browser callback, and deliberately
        // idempotent — whichever arrives first wins, the other is a no-op.
        await Order.updateOne(
          { razorpayOrderId, paymentStatus: { $ne: "completed" } },
          {
            $set: {
              paymentStatus: "completed",
              orderStatus: "confirmed",
              razorpayPaymentId: payment.id,
            },
          }
        );
        await Transaction.updateOne(
          { razorpayOrderId },
          { $set: { status: "captured", razorpayPaymentId: payment.id } }
        );
      }

      if (event.event === "payment.failed") {
        await Order.updateOne({ razorpayOrderId }, { $set: { paymentStatus: "failed" } });
        await Transaction.updateOne(
          { razorpayOrderId },
          { $set: { status: "failed", notes: payment.error_description || "payment failed" } }
        );
      }

      if (event.event === "refund.processed") {
        await Order.updateOne({ razorpayOrderId }, { $set: { paymentStatus: "refunded" } });
      }

      return res.json({ received: true });
    } catch (err) {
      // A 500 makes Razorpay retry, which is what we want on a transient fault.
      console.error("[webhook]", err.message);
      return res.status(500).json({ message: "Processing failed" });
    }
  }
);

export default router;
