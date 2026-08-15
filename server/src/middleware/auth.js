import User from "../models/User.js";
import { verifyToken } from "../utils/token.js";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.mm_token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const { sub } = verifyToken(token);
    const user = await User.findById(sub);
    if (!user) return res.status(401).json({ message: "Account no longer exists" });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Session expired, please log in again" });
  }
}
