// End-to-end checks for messaging safety + order pricing, against an
// in-memory Mongo. Run: node commerce.test.mjs
import "dotenv/config";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "./src/app.js";
import User from "./src/models/User.js";
import Product from "./src/models/Product.js";
import Order from "./src/models/Order.js";

const mongo = await MongoMemoryServer.create();
await mongoose.connect(mongo.getUri());
const server = app.listen(5098);
const base = "http://localhost:5098/api";

let pass = 0;
let fail = 0;
const check = (name, cond, detail = "") => {
  if (cond) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name} ${detail}`);
  }
};

let cookie = "";
async function call(path, body, opts = {}) {
  const res = await fetch(base + path, {
    method: opts.method || "POST",
    headers: { "Content-Type": "application/json", ...(cookie ? { Cookie: cookie } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const sc = res.headers.get("set-cookie");
  if (sc) cookie = sc.split(";")[0];
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

// --- fixtures -------------------------------------------------------------
const seller = await User.create({
  fullName: "Seller One",
  email: "seller@example.com",
  password: "StrongPass1",
  role: "seller",
  authProvider: "email",
});
const product = await Product.create({
  sellerId: seller._id,
  name: "Surgical Kit 20pc",
  category: "Surgical Instruments",
  price: 9200,
  moq: 10,
  status: "active",
});

await call("/auth/signup", {
  fullName: "Buyer One",
  email: "buyer@example.com",
  password: "StrongPass1",
  confirmPassword: "StrongPass1",
  role: "buyer",
  acceptedTerms: "true",
});

console.log("\nMessaging safety\n");

let r = await call("/messages/send", {
  receiverId: String(seller._id),
  content: "Please quote 40 kits with GST, delivery to Mumbai.",
});
check("a normal B2B message is delivered", r.status === 201, JSON.stringify(r.body));

r = await call("/messages/send", {
  receiverId: String(seller._id),
  content: "call me on 9876543210",
});
check("a phone number is blocked", r.status === 422 && r.body.blocked === true);
check("the block explains the policy", /Med-Mart/.test(r.body.message || ""));
check("violation count reaches 1", r.body.violations === 1, JSON.stringify(r.body));

r = await call("/messages/send", {
  receiverId: String(seller._id),
  content: "mail me at rahul (at) gmail (dot) com",
});
check("an obfuscated email is blocked", r.status === 422 && r.body.violations === 2);

r = await call("/messages/send", {
  receiverId: String(seller._id),
  content: "nine eight seven six five four three two one zero",
});
check("a spelled-out number is blocked", r.status === 422);
check("the account is flagged on the third violation", r.body.flagged === true, JSON.stringify(r.body));

const buyer = await User.findOne({ email: "buyer@example.com" });
check("the flag is persisted on the user", buyer.isFlagged === true && buyer.communicationViolations === 3);

r = await call("/messages/check", { content: "reach me at 98765 43210" });
check("the preview endpoint reports a violation", r.body.allowed === false);

console.log("\nOrder pricing\n");

// Payments aren't configured in this test, so /orders/create can't reach
// Razorpay — the pricing maths is verified directly instead.
const money = Order.priceOrder(product.price, 40, 0.06);
check(
  "total is quantity times the stored unit price",
  money.totalAmount === 9200 * 40,
  `got ${money.totalAmount}`
);
check("commission is 6% of the total", money.platformCommission === Math.round(9200 * 40 * 0.06));
check(
  "seller earning is the remainder",
  money.sellerEarning === money.totalAmount - money.platformCommission
);

r = await call("/orders/create", {
  productId: String(product._id),
  quantity: 40,
  // A tampered amount — the route must ignore it entirely.
  totalAmount: 1,
  deliveryAddress: {
    fullName: "Buyer One",
    phone: "9000000000",
    line1: "1 Test Road",
    city: "Mumbai",
    state: "MH",
    pincode: "400001",
  },
});
check(
  "an unconfigured gateway fails closed rather than creating a free order",
  r.status === 503,
  `status ${r.status}`
);

r = await call("/orders/create", {
  productId: String(product._id),
  quantity: 2,
  deliveryAddress: {
    fullName: "Buyer One",
    phone: "9000000000",
    line1: "1 Test Road",
    city: "Mumbai",
    state: "MH",
    pincode: "400001",
  },
});
check("an order below MOQ is rejected", r.status === 422, JSON.stringify(r.body));

r = await call("/orders/verify-payment", {
  razorpayOrderId: "order_fake",
  razorpayPaymentId: "pay_fake",
  signature: "deadbeef",
});
check("a forged payment signature is rejected", r.status === 400 || r.status === 503);

console.log("\nAdmin\n");

r = await call("/admin/flagged-users", null, { method: "GET" });
check("admin routes are closed without an allow-listed email", r.status === 403);

console.log(`\n${pass} passed, ${fail} failed\n`);

await mongoose.disconnect();
await mongo.stop();
server.close();
process.exit(fail ? 1 : 0);
