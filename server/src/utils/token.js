import jwt from "jsonwebtoken";

const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

/**
 * We send the JWT as an httpOnly cookie rather than handing it to JS.
 * Trade-off: JS can't read it, so an XSS bug can't exfiltrate the token —
 * but it is attached to every request automatically, so CSRF becomes the
 * risk instead. sameSite: "lax" covers the normal cases; the API is also
 * CORS-locked to the app origin with credentials required.
 */
export function setAuthCookie(res, token) {
  res.cookie("mm_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res) {
  res.clearCookie("mm_token", { path: "/" });
}

/**
 * Admin sessions use their own cookie and carry `kind: "admin"`, so a
 * buyer/seller token can never satisfy an admin route. They're also shorter
 * lived — a privileged session left open is worth more to an attacker.
 */
export function signAdminToken(adminId) {
  return jwt.sign({ sub: adminId, kind: "admin" }, process.env.JWT_SECRET, { expiresIn: "12h" });
}

export function setAdminCookie(res, token) {
  res.cookie("mm_admin", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 12 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAdminCookie(res) {
  res.clearCookie("mm_admin", { path: "/" });
}
