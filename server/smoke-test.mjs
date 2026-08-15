// Throwaway end-to-end check of the email auth flow against an in-memory
// Mongo, so the API can be verified without a running database.
// Run: node smoke-test.mjs
import "dotenv/config";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "./src/app.js";

const mongo = await MongoMemoryServer.create();
await mongoose.connect(mongo.getUri());

const server = app.listen(5099);
const base = "http://localhost:5099/api/auth";
let cookie = "";
let pass = 0;
let fail = 0;

async function call(path, body, opts = {}) {
  const res = await fetch(base + path, {
    method: opts.method || "POST",
    headers: { "Content-Type": "application/json", ...(opts.cookie ? { Cookie: cookie } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];
  return { status: res.status, body: await res.json() };
}

function check(name, cond, detail = "") {
  if (cond) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name} ${detail}`);
  }
}

const buyer = {
  fullName: "Gyan Mishra",
  businessName: "Mishra Clinic",
  email: "gyan@example.com",
  password: "StrongPass1",
  confirmPassword: "StrongPass1",
  role: "buyer",
  acceptedTerms: "true",
};

console.log("\nEmail auth flow\n");

let r = await call("/signup", buyer);
check("signup creates a buyer", r.status === 201 && r.body.user.role === "buyer", JSON.stringify(r.body));
check("password is never returned", r.status === 201 && r.body.user.password === undefined);
check("auth cookie is httpOnly", (cookie || "").startsWith("mm_token="));

r = await call("/signup", buyer);
check("duplicate email is rejected", r.status === 409, JSON.stringify(r.body));

r = await call("/signup", { ...buyer, email: "weak@example.com", password: "abc", confirmPassword: "abc" });
check("weak password is rejected", r.status === 422 && !!r.body.errors.password);

r = await call("/signup", {
  ...buyer,
  email: "mismatch@example.com",
  confirmPassword: "Different1",
});
check("password mismatch is rejected", r.status === 422 && !!r.body.errors.confirmPassword);

r = await call("/signup", { ...buyer, email: "noterms@example.com", acceptedTerms: "false" });
check("terms must be accepted", r.status === 422 && !!r.body.errors.acceptedTerms);

r = await call("/signup", {
  ...buyer,
  email: "seller@example.com",
  role: "seller",
});
check("seller without businessType/city is rejected", r.status === 422 && !!r.body.errors.businessType);

r = await call("/signup", {
  ...buyer,
  email: "seller@example.com",
  role: "seller",
  businessType: "Manufacturer",
  city: "Pune",
  gstNumber: "27AAAAA0000A1Z5",
});
check("valid seller signup succeeds", r.status === 201 && r.body.user.businessType === "Manufacturer", JSON.stringify(r.body));

r = await call("/login", { email: "gyan@example.com", password: "WrongPass1" });
check("wrong password is rejected", r.status === 401);

r = await call("/login", { email: "nobody@example.com", password: "StrongPass1" });
check("unknown email gives the same generic error", r.status === 401 && r.body.message === "Invalid email or password");

r = await call("/login", { email: "gyan@example.com", password: "StrongPass1" });
check("correct credentials log in", r.status === 200 && r.body.user.email === "gyan@example.com", JSON.stringify(r.body));

r = await call("/me", null, { method: "GET", cookie: true });
check("/me returns the session user", r.status === 200 && r.body.user.email === "gyan@example.com", JSON.stringify(r.body));

const noCookie = await fetch(base + "/me");
check("/me without a cookie is 401", noCookie.status === 401);

r = await call("/forgot-password", { email: "gyan@example.com" });
check("forgot-password succeeds for a real account", r.status === 200);

r = await call("/forgot-password", { email: "ghost@example.com" });
check("forgot-password does not leak unknown emails", r.status === 200);

console.log(`\n${pass} passed, ${fail} failed\n`);

await mongoose.disconnect();
await mongo.stop();
server.close();
process.exit(fail ? 1 : 0);
