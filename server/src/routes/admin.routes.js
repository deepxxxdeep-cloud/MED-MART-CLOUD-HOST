import { Router } from "express";
import { body, param } from "express-validator";
import User from "../models/User.js";
import Message from "../models/Message.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

/**
 * Admin gate.
 *
 * There's no admin role on the User model yet, so this reads an allow-list of
 * emails from the environment. That's deliberate: it keeps a privileged area
 * from being reachable just because someone signed up, and it can be replaced
 * by a proper role field without touching the routes.
 */
function requireAdmin(req, res, next) {
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!allowed.length || !allowed.includes(String(req.user.email).toLowerCase())) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

router.get("/flagged-users", requireAuth, requireAdmin, async (_req, res, next) => {
  try {
    const users = await User.find({ isFlagged: true }).sort({ flaggedAt: -1 }).limit(200);

    // Attach the blocked messages behind each flag, so review is based on what
    // was actually attempted rather than just a count.
    const withEvidence = await Promise.all(
      users.map(async (u) => {
        const evidence = await Message.find({ senderId: u._id, isBlocked: true })
          .sort({ createdAt: -1 })
          .limit(5)
          .select("content blockedReason blockedCodes createdAt");
        return { user: u.toPublic(), evidence };
      })
    );

    return res.json({ users: withEvidence });
  } catch (err) {
    next(err);
  }
});

router.patch(
  "/users/:id/review",
  requireAuth,
  requireAdmin,
  [param("id").notEmpty(), body("action").isIn(["dismiss", "warn", "suspend"])],
  validate,
  async (req, res, next) => {
    try {
      const { action } = req.body;
      const update =
        action === "dismiss"
          ? { isFlagged: false, communicationViolations: 0, flaggedAt: null }
          : action === "warn"
            ? { isFlagged: false, flaggedAt: null }
            : { isSuspended: true };

      const user = await User.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json({ user: user.toPublic() });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
