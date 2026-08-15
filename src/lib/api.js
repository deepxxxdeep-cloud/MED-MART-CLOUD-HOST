// Relative by default — Vite proxies /api to the server in dev (see
// vite.config.js), so requests stay same-origin and the cookie is first-party.
const BASE = import.meta.env.VITE_API_URL || "/api";

/**
 * credentials:"include" is required so the httpOnly auth cookie is sent.
 * Throws an Error carrying { status, errors } so forms can map failures
 * back onto individual fields.
 */
export async function api(path, { method = "POST", body } = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    const err = new Error("Can't reach the server. Is the API running?");
    err.status = 0;
    throw err;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong");
    err.status = res.status;
    err.errors = data.errors || {};
    throw err;
  }
  return data;
}
