import crypto from "crypto";

/**
 * Envelope encryption for values stored in PlatformConfig.
 *
 * AES-256-GCM rather than CBC: GCM is authenticated, so a value that has been
 * tampered with in the database fails to decrypt instead of quietly returning
 * corrupted bytes that then get sent to a payment gateway.
 *
 * One master key lives in the environment (CONFIG_ENCRYPTION_KEY). Every other
 * credential — Razorpay, SMTP, Twilio — is encrypted with it and kept in
 * MongoDB, editable from the admin UI. That is the whole point: rotating a
 * Razorpay key becomes a form submission, not a redeploy.
 */

const ALGO = "aes-256-gcm";

function masterKey() {
  const raw = process.env.CONFIG_ENCRYPTION_KEY;
  if (!raw) {
    const err = new Error(
      "CONFIG_ENCRYPTION_KEY is not set — platform settings cannot be read or written"
    );
    err.status = 500;
    throw err;
  }
  const key = Buffer.from(raw, "hex");
  if (key.length !== 32) {
    const err = new Error("CONFIG_ENCRYPTION_KEY must be 32 bytes of hex (64 characters)");
    err.status = 500;
    throw err;
  }
  return key;
}

/** @returns {string} "iv:authTag:ciphertext", all hex */
export function encryptValue(plain) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, masterKey(), iv);
  const enc = Buffer.concat([cipher.update(String(plain), "utf8"), cipher.final()]);
  return [iv.toString("hex"), cipher.getAuthTag().toString("hex"), enc.toString("hex")].join(":");
}

export function decryptValue(payload) {
  const [ivHex, tagHex, dataHex] = String(payload).split(":");
  if (!ivHex || !tagHex || !dataHex) throw new Error("Stored value is malformed");

  const decipher = crypto.createDecipheriv(ALGO, masterKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]).toString(
    "utf8"
  );
}

/**
 * What the admin UI is allowed to see. Never send a decrypted secret back to
 * the browser — the point of storing it encrypted is defeated if it round-trips
 * through a page every time someone opens Settings.
 */
export function maskValue(plain) {
  const s = String(plain ?? "");
  if (!s) return "";
  if (s.length <= 8) return "••••••••";
  return `${s.slice(0, 4)}${"•".repeat(Math.min(16, s.length - 8))}${s.slice(-4)}`;
}

export const generateMasterKey = () => crypto.randomBytes(32).toString("hex");
