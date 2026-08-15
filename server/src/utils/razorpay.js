import crypto from "crypto";
import Razorpay from "razorpay";
import PlatformConfig from "../models/PlatformConfig.js";

/**
 * Credentials are read from PlatformConfig (encrypted in MongoDB, editable
 * from the admin Settings page) and fall back to the environment. That is what
 * lets live keys be entered through the UI without a redeploy.
 *
 * The client is rebuilt whenever the key id changes, so saving new keys takes
 * effect on the next payment rather than needing a restart.
 */
let client = null;
let clientKeyId = null;

export async function getPaymentCredentials() {
  const [keyId, keySecret] = await Promise.all([
    PlatformConfig.getValue("razorpay_key_id"),
    PlatformConfig.getValue("razorpay_key_secret"),
  ]);
  return { keyId, keySecret };
}

export async function razorpay() {
  const { keyId, keySecret } = await getPaymentCredentials();
  if (!keyId || !keySecret) {
    const err = new Error("Payments aren't configured yet — add Razorpay keys in Admin → Settings");
    err.status = 503;
    throw err;
  }
  if (!client || clientKeyId !== keyId) {
    client = new Razorpay({ key_id: keyId, key_secret: keySecret });
    clientKeyId = keyId;
  }
  return client;
}

export async function paymentsConfigured() {
  const { keyId, keySecret } = await getPaymentCredentials();
  return Boolean(keyId && keySecret);
}

async function keySecret() {
  return (await getPaymentCredentials()).keySecret;
}

async function webhookSecret() {
  return PlatformConfig.getValue("razorpay_webhook_secret");
}

/**
 * Razorpay signs `order_id|payment_id` with the key secret. Recomputing that
 * HMAC is what proves the browser's "payment succeeded" callback is genuine
 * and not someone calling our endpoint directly.
 */
export async function verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, signature }) {
  // Fail closed. Without a secret there is nothing to verify against, and
  // throwing here would surface as a 500 — which reads as a server fault
  // rather than the rejection it actually is.
  const secret = await keySecret();
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  // Constant-time compare — a plain === leaks timing information.
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Webhooks are signed with a separate secret over the raw request body. */
export async function verifyWebhookSignature(rawBody, signature) {
  const secret = await webhookSecret();
  if (!secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export const newId = (prefix) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
