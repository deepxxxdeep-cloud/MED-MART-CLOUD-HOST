// Admin auth, encrypted settings and role gating. Run: node admin.test.mjs
import "dotenv/config";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "./src/app.js";
import Admin from "./src/models/Admin.js";
import User from "./src/models/User.js";
import PlatformConfig from "./src/models/PlatformConfig.js";
import { encryptValue, decryptValue, maskValue } from "./src/utils/secrets.js";

const mongo = await MongoMemoryServer.create();
await mongoose.connect(mongo.getUri());
const server = app.listen(5097);
const base = "http://localhost:5097/api";

let pass = 0, fail = 0;
const check = (n, c, d = "") => {
  if (c) { pass++; console.log(`  PASS  ${n}`); }
  else { fail++; console.log(`  FAIL  ${n} ${d}`); }
};

const jars = {};
async function call(jar, path, body, opts = {}) {
  const res = await fetch(base + path, {
    method: opts.method || "POST",
    headers: { "Content-Type": "application/json", ...(jars[jar] ? { Cookie: jars[jar] } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const sc = res.headers.get("set-cookie");
  if (sc) jars[jar] = sc.split(";")[0];
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

console.log("\nEncryption\n");

const SECRET = "rzp_live_51H8sKdNqPzXyZa";
const enc = encryptValue(SECRET);
check("ciphertext does not contain the plaintext", !enc.includes(SECRET));
check("round-trips back to the original", decryptValue(enc) === SECRET);
check("two encryptions of the same value differ (random IV)", encryptValue(SECRET) !== enc);
check("masking hides the middle", maskValue(SECRET).startsWith("rzp_") && maskValue(SECRET).endsWith("XyZa") && !maskValue(SECRET).includes("51H8sKdNqP"));

let tampered = enc.split(":");
tampered[2] = tampered[2].slice(0, -2) + (tampered[2].endsWith("00") ? "11" : "00");
let detected = false;
try { decryptValue(tampered.join(":")); } catch { detected = true; }
check("tampered ciphertext is rejected, not silently returned", detected);

console.log("\nAdmin auth and roles\n");

await Admin.create({ name: "Super", email: "super@medmart.in", password: "SuperPass1", role: "super-admin" });
await Admin.create({ name: "Sup", email: "support@medmart.in", password: "SupportPass1", role: "support" });

let r = await call("anon", "/admin/dashboard-stats", null, { method: "GET" });
check("admin routes reject anonymous requests", r.status === 401);

r = await call("super", "/admin/auth/login", { email: "super@medmart.in", password: "WrongPass1" });
check("a wrong password is rejected", r.status === 401);

r = await call("super", "/admin/auth/login", { email: "super@medmart.in", password: "SuperPass1" });
check("super admin can sign in", r.status === 200 && r.body.admin.role === "super-admin");
check("the admin cookie is separate from the user cookie", (jars.super || "").startsWith("mm_admin="));

r = await call("support", "/admin/auth/login", { email: "support@medmart.in", password: "SupportPass1" });
check("support admin can sign in", r.status === 200);

r = await call("support", "/admin/settings", null, { method: "GET" });
check("support admin is refused platform settings", r.status === 403, JSON.stringify(r.body));

r = await call("super", "/admin/settings", null, { method: "GET" });
check("super admin can read settings", r.status === 200);
check("payment gateway starts unconfigured", r.body.paymentGatewayConnected === false);

console.log("\nSettings storage\n");

r = await call("super", "/admin/settings", {
  updates: { razorpay_key_id: "rzp_test_ABC123", razorpay_key_secret: "secret_XYZ789", platform_commission_rate: 0.08 },
}, { method: "PUT" });
check("settings save", r.status === 200 && r.body.saved.length === 3, JSON.stringify(r.body));

const stored = await PlatformConfig.findOne({ key: "razorpay_key_secret" });
check("the secret is stored encrypted, not in plain text", Boolean(stored.encryptedValue) && !JSON.stringify(stored).includes("secret_XYZ789"));
check("a non-secret setting stays queryable in plain form", (await PlatformConfig.findOne({ key: "platform_commission_rate" })).plainValue === 0.08);
check("the server can still read the secret back", (await PlatformConfig.getValue("razorpay_key_secret")) === "secret_XYZ789");

r = await call("super", "/admin/settings", null, { method: "GET" });
check("the API never returns the raw secret", !JSON.stringify(r.body).includes("secret_XYZ789"));
check("it reports the secret as configured", r.body.settings.payment.razorpay_key_secret.configured === true);
check("gateway now shows connected", r.body.paymentGatewayConnected === true);
check("commission rate reads back", Number(r.body.settings.general.platform_commission_rate.value) === 0.08);

// Empty values must not wipe stored secrets — the UI never holds them.
r = await call("super", "/admin/settings", { updates: { razorpay_key_secret: "" } }, { method: "PUT" });
check("saving a blank secret leaves the stored one intact", (await PlatformConfig.getValue("razorpay_key_secret")) === "secret_XYZ789");

console.log("\nModeration\n");

const buyer = await User.create({ fullName: "B", email: "b@x.com", password: "StrongPass1", role: "buyer", authProvider: "email" });

r = await call("super", `/admin/users/${buyer._id}/ban`, {}, { method: "PATCH" });
check("banning without a reason is refused", r.status === 422);

r = await call("super", `/admin/users/${buyer._id}/ban`, { reason: "Repeated off-platform contact" }, { method: "PATCH" });
check("banning with a reason works", r.status === 200);
check("the ban is persisted", (await User.findById(buyer._id)).isSuspended === true);

r = await call("super", "/admin/activity", null, { method: "GET" });
check("admin actions are logged", r.body.logs?.some((l) => l.action === "user.ban"));
check("logs never contain credential values", !JSON.stringify(r.body).includes("secret_XYZ789"));

console.log(`\n${pass} passed, ${fail} failed\n`);
await mongoose.disconnect();
await mongo.stop();
server.close();
process.exit(fail ? 1 : 0);
