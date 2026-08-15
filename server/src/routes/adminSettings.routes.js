import { Router } from "express";
import { body } from "express-validator";
import Razorpay from "razorpay";
import PlatformConfig, { CONFIG_DEFAULTS, SECRET_KEYS } from "../models/PlatformConfig.js";
import AdminActivityLog from "../models/AdminActivityLog.js";
import { requireAdmin, requireSuperAdmin } from "../middleware/adminAuth.js";
import { validate } from "../middleware/validate.js";
import { maskValue } from "../utils/secrets.js";

const router = Router();

// Everything below is super-admin only: these are live payment credentials.
router.use(requireAdmin, requireSuperAdmin);

const GROUPS = {
  payment: [
    "razorpay_mode",
    "razorpay_key_id",
    "razorpay_key_secret",
    "razorpay_webhook_secret",
  ],
  email: ["smtp_host", "smtp_port", "smtp_user", "smtp_password", "sendgrid_api_key"],
  sms: ["twilio_account_sid", "twilio_auth_token", "firebase_project_id", "firebase_private_key"],
  general: [
    "platform_commission_rate",
    "payout_schedule_days",
    "minimum_payout_amount",
    "support_email",
  ],
};

/**
 * Secrets come back masked, never in full. Once a credential is saved the UI
 * only ever needs to know whether it is set — sending the real value back on
 * every page load would undo the reason for encrypting it.
 */
router.get("/", async (_req, res, next) => {
  try {
    const out = {};
    for (const [category, keys] of Object.entries(GROUPS)) {
      out[category] = {};
      for (const key of keys) {
        const value = await PlatformConfig.getValue(key);
        out[category][key] = SECRET_KEYS.has(key)
          ? { configured: Boolean(value), masked: value ? maskValue(value) : "" }
          : { value: value ?? CONFIG_DEFAULTS[key] ?? "" };
      }
    }

    const [id, secret] = await Promise.all([
      PlatformConfig.getValue("razorpay_key_id"),
      PlatformConfig.getValue("razorpay_key_secret"),
    ]);

    return res.json({ settings: out, paymentGatewayConnected: Boolean(id && secret) });
  } catch (err) {
    next(err);
  }
});

router.put(
  "/",
  [body("updates").isObject()],
  validate,
  async (req, res, next) => {
    try {
      const { updates } = req.body;
      const allowed = new Set(Object.values(GROUPS).flat());
      const saved = [];

      for (const [key, value] of Object.entries(updates)) {
        if (!allowed.has(key)) continue;
        // An empty string means "leave it alone" — otherwise opening the page
        // and saving would wipe every secret, since the UI never holds them.
        if (SECRET_KEYS.has(key) && String(value).trim() === "") continue;

        const category =
          Object.entries(GROUPS).find(([, keys]) => keys.includes(key))?.[0] || "general";

        const coerced =
          key === "platform_commission_rate"
            ? Number(value)
            : key === "payout_schedule_days" || key === "minimum_payout_amount"
              ? Number(value)
              : value;

        await PlatformConfig.setValue(key, coerced, { adminId: req.admin._id, category });
        saved.push(key);
      }

      await AdminActivityLog.record(req, {
        action: "settings.update",
        targetType: "PlatformConfig",
        // Key names only — logging a credential would defeat encrypting it.
        detail: `Updated: ${saved.join(", ") || "nothing"}`,
      });

      return res.json({ saved });
    } catch (err) {
      next(err);
    }
  }
);

/** Proves a saved key pair actually works before anyone flips to live mode. */
router.post("/test-razorpay-connection", async (req, res, next) => {
  try {
    const [keyId, keySecret] = await Promise.all([
      PlatformConfig.getValue("razorpay_key_id"),
      PlatformConfig.getValue("razorpay_key_secret"),
    ]);

    if (!keyId || !keySecret) {
      return res.status(400).json({ ok: false, message: "Add a key id and secret first" });
    }

    const client = new Razorpay({ key_id: keyId, key_secret: keySecret });
    // A ₹1 order is the cheapest authenticated round trip; it is never paid,
    // and unpaid Razorpay orders simply expire.
    await client.orders.create({ amount: 100, currency: "INR", receipt: `test-${Date.now()}` });

    await AdminActivityLog.record(req, {
      action: "settings.test_razorpay",
      detail: `Succeeded for ${keyId.slice(0, 12)}…`,
    });

    return res.json({
      ok: true,
      message: `Connected. Key ${keyId.startsWith("rzp_live") ? "is LIVE" : "is in test mode"}.`,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      message: err?.error?.description || err.message || "Razorpay rejected these credentials",
    });
  }
});

export default router;
