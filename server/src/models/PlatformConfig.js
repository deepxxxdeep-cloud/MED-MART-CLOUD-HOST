import mongoose from "mongoose";
import { encryptValue, decryptValue } from "../utils/secrets.js";

const configSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },

    // Secrets are stored here, encrypted. Non-sensitive settings (commission
    // rate, payout schedule) use plainValue so they stay queryable.
    encryptedValue: { type: String },
    plainValue: { type: mongoose.Schema.Types.Mixed },
    isSecret: { type: Boolean, default: false },

    category: {
      type: String,
      enum: ["payment", "email", "sms", "general"],
      required: true,
      index: true,
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

/** Defaults used when nothing has been configured through the UI yet. */
export const CONFIG_DEFAULTS = {
  platform_commission_rate: 0.07,
  payout_schedule_days: 7,
  minimum_payout_amount: 1000,
  razorpay_mode: "test",
  support_email: "support@med-mart.in",
};

export const SECRET_KEYS = new Set([
  "razorpay_key_id",
  "razorpay_key_secret",
  "razorpay_webhook_secret",
  "smtp_password",
  "sendgrid_api_key",
  "twilio_auth_token",
  "firebase_private_key",
]);

configSchema.statics.setValue = async function (key, value, { adminId, category } = {}) {
  const isSecret = SECRET_KEYS.has(key);
  const update = {
    category: category || "general",
    isSecret,
    updatedBy: adminId,
    ...(isSecret
      ? { encryptedValue: encryptValue(value), plainValue: undefined }
      : { plainValue: value, encryptedValue: undefined }),
  };
  return this.findOneAndUpdate({ key }, { $set: update }, { upsert: true, new: true });
};

/**
 * Reads a setting, falling back to the environment and then to a built-in
 * default. The env fallback means an existing deployment keeps working after
 * this system is introduced, before anything has been entered in the UI.
 */
configSchema.statics.getValue = async function (key) {
  const doc = await this.findOne({ key });
  if (doc) {
    if (doc.isSecret && doc.encryptedValue) {
      try {
        return decryptValue(doc.encryptedValue);
      } catch {
        // A key rotation without re-encrypting leaves unreadable values.
        // Returning null degrades to "not configured" rather than crashing.
        console.error(`[config] could not decrypt ${key} — was the master key changed?`);
        return null;
      }
    }
    if (doc.plainValue !== undefined) return doc.plainValue;
  }

  const envKey = key.toUpperCase();
  if (process.env[envKey] !== undefined) return process.env[envKey];

  return CONFIG_DEFAULTS[key] ?? null;
};

configSchema.statics.getMany = async function (keys) {
  const out = {};
  for (const k of keys) out[k] = await this.getValue(k);
  return out;
};

export default mongoose.model("PlatformConfig", configSchema);
