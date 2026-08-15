import Admin from "../models/Admin.js";
import { verifyToken } from "../utils/token.js";

/**
 * Admin sessions are entirely separate from buyer/seller sessions: a different
 * cookie, and a token that must carry `kind: "admin"`. A regular user token
 * therefore cannot reach an admin route even if it were replayed here.
 */
export async function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.mm_admin;
    if (!token) return res.status(401).json({ message: "Admin sign-in required" });

    const payload = verifyToken(token);
    if (payload.kind !== "admin") {
      return res.status(401).json({ message: "Admin sign-in required" });
    }

    const admin = await Admin.findById(payload.sub);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "This admin account is no longer active" });
    }

    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ message: "Session expired, please sign in again" });
  }
}

/** Settings hold live payment credentials, so they are super-admin only. */
export function requireSuperAdmin(req, res, next) {
  if (req.admin?.role !== "super-admin") {
    return res.status(403).json({ message: "Only a super admin can access this" });
  }
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.admin?.role)) {
      return res.status(403).json({ message: "You don't have permission for this action" });
    }
    next();
  };
}
