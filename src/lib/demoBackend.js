/**
 * In-browser stand-in for the API, so the whole product can be demonstrated
 * without a database or payment gateway.
 *
 * OFF by default — every request goes to the real API. Opt back in with
 * VITE_DEMO_MODE=true to demo the product without a database or gateway;
 * api.js then routes here instead of over the network.
 *
 * Opt-in rather than opt-out on purpose: a build that silently fakes orders
 * is the more dangerous default to ship.
 *
 * State lives in localStorage so a demo survives a refresh, which matters when
 * you sign up, close the tab, and want to still be logged in.
 */

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const KEY = "medmart_demo_v1";

const seed = () => ({
  users: [
    {
      id: "demo-buyer",
      fullName: "Demo Buyer",
      businessName: "Apex Multispecialty Hospital",
      email: "buyer@demo.in",
      password: "demo1234",
      role: "buyer",
      authProvider: "email",
      isVerified: true,
    },
    {
      id: "demo-seller",
      fullName: "Demo Seller",
      businessName: "Precision Surgico",
      email: "seller@demo.in",
      password: "demo1234",
      role: "seller",
      authProvider: "email",
      isVerified: true,
      businessType: "Manufacturer",
      city: "New Delhi",
    },
  ],
  session: null,
  orders: [],
});

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : seed();
  } catch {
    return seed();
  }
}

function write(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* private mode — the demo still works for this session */
  }
}

export function resetDemo() {
  localStorage.removeItem(KEY);
}

const publicUser = (u) => {
  const { password, ...rest } = u;
  return rest;
};

const fail = (status, message, errors) => {
  const err = new Error(message);
  err.status = status;
  err.errors = errors || {};
  throw err;
};

const delay = (ms = 260) => new Promise((r) => setTimeout(r, ms));

const orderId = () =>
  `MM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000)}`;

/** Routes a request the same way the Express app would. */
export async function demoRequest(path, { method = "POST", body } = {}) {
  await delay();
  const state = read();

  /* ------------------------------------------------------------------ auth */

  if (path === "/auth/signup") {
    const { fullName, email, password, confirmPassword, role, acceptedTerms } = body || {};

    // The same validation the server does, so the demo teaches the real rules
    // rather than accepting anything and surprising you later.
    const errors = {};
    if (!fullName?.trim()) errors.fullName = "Full name is required";
    if (!email?.trim()) errors.email = "Enter a valid email";
    if (!password || password.length < 8) errors.password = "Use at least 8 characters";
    else if (!/[a-z]/.test(password)) errors.password = "Include a lowercase letter";
    else if (!/[A-Z]/.test(password)) errors.password = "Include an uppercase letter";
    else if (!/[0-9]/.test(password)) errors.password = "Include a number";
    if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    if (String(acceptedTerms) !== "true") errors.acceptedTerms = "Please accept the Terms & Conditions";
    if (Object.keys(errors).length) fail(422, "Please check the highlighted fields", errors);

    if (state.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      fail(409, "That email is already registered", {
        email: "An account with this email already exists",
      });
    }

    const user = {
      id: `u-${Date.now()}`,
      fullName,
      businessName: body.businessName || "",
      email: email.toLowerCase(),
      password,
      role: role || "buyer",
      authProvider: "email",
      isVerified: false,
      ...(role === "seller"
        ? { businessType: body.businessType, city: body.city, gstNumber: body.gstNumber }
        : {}),
    };
    state.users.push(user);
    state.session = user.id;
    write(state);
    return { user: publicUser(user) };
  }

  if (path === "/auth/login") {
    const { email, password } = body || {};
    const user = state.users.find((u) => u.email.toLowerCase() === String(email || "").toLowerCase());

    // Demo convenience: an unknown email signs in as a new buyer rather than
    // dead-ending, but a known email still checks its password so the failure
    // path is demonstrable.
    if (!user) {
      const created = {
        id: `u-${Date.now()}`,
        fullName: String(email || "guest").split("@")[0].replace(/^\w/, (c) => c.toUpperCase()),
        businessName: "Demo Account",
        email: String(email || "guest@demo.in").toLowerCase(),
        password: password || "demo1234",
        role: "buyer",
        authProvider: "email",
        isVerified: true,
      };
      state.users.push(created);
      state.session = created.id;
      write(state);
      return { user: publicUser(created) };
    }

    if (password !== user.password) fail(401, "Invalid email or password");

    state.session = user.id;
    write(state);
    return { user: publicUser(user) };
  }

  if (path === "/auth/me") {
    const user = state.users.find((u) => u.id === state.session);
    if (!user) fail(401, "Not authenticated");
    return { user: publicUser(user) };
  }

  if (path === "/auth/logout") {
    state.session = null;
    write(state);
    return { message: "Logged out" };
  }

  if (path === "/auth/forgot-password") {
    return { message: "If that email is registered, a reset link is on its way" };
  }

  /* ---------------------------------------------------------------- orders */

  if (path === "/orders/config") {
    // Reported as configured so checkout runs its full flow; the payment step
    // itself is simulated below.
    return { configured: true, keyId: "rzp_test_demo", commissionRate: 0.07, demo: true };
  }

  if (path === "/orders/create") {
    const { quantity = 1, unitPrice = 0, productName } = body || {};
    const totalAmount = Math.round(unitPrice * quantity);
    const platformCommission = Math.round(totalAmount * 0.07);
    const id = orderId();

    const order = {
      orderId: id,
      productName,
      quantity,
      unitPrice,
      totalAmount,
      platformCommission,
      sellerEarning: totalAmount - platformCommission,
      paymentStatus: "pending",
      orderStatus: "confirmed",
      deliveryAddress: body?.deliveryAddress,
      createdAt: new Date().toISOString(),
    };
    state.orders.unshift(order);
    write(state);

    return {
      order: { orderId: id, amount: totalAmount, platformCommission },
      razorpay: { orderId: `order_demo_${id}`, amount: totalAmount * 100, currency: "INR" },
      demo: true,
    };
  }

  if (path === "/orders/verify-payment") {
    const order = state.orders[0];
    if (order) {
      order.paymentStatus = "completed";
      write(state);
    }
    return { order };
  }

  if (path === "/orders/buyer/mine") return { orders: state.orders };

  /* -------------------------------------------------------------- messages */

  if (path === "/messages/check" || path === "/messages/send") {
    // Filtering is pure client-safe logic, so the real guard runs even here.
    const { checkMessage } = await import("./messageGuard.js");
    const verdict = checkMessage(body?.content || "");
    if (path === "/messages/check") return { allowed: verdict.allowed, ...verdict };
    if (!verdict.allowed) fail(422, "Message blocked", {});
    return { message: { content: body.content, createdAt: new Date().toISOString() } };
  }

  fail(404, `Demo backend has no route for ${method} ${path}`);
}
