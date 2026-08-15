import crypto from "crypto";
import Razorpay from "razorpay";

let client = null;

/**
 * Lazily constructed so the server still boots without payment keys — useful
 * in development, where the rest of the API is worth running before Razorpay
 * is configured.
 */
export function razorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const err = new Error("Payments aren't configured on this server yet");
    err.status = 503;
    throw err;
  }
  client ??= new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  return client;
}

export const paymentsConfigured = () =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

/**
 * Razorpay signs `order_id|payment_id` with the key secret. Recomputing that
 * HMAC is what proves the browser's "payment succeeded" callback is genuine
 * and not someone calling our endpoint directly.
 */
export function verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, signature }) {
  // Fail closed. Without a secret there is nothing to verify against, and
  // throwing here would surface as a 500 — which reads as a server fault
  // rather than the rejection it actually is.
  if (!process.env.RAZORPAY_KEY_SECRET) return false;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  // Constant-time compare — a plain === leaks timing information.
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Webhooks are signed with a separate secret over the raw request body. */
export function verifyWebhookSignature(rawBody, signature) {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const newId = (prefix) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
