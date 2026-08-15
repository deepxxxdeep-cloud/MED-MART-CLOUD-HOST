import { Router } from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import Admin from "../models/Admin.js";
import AdminActivityLog from "../models/AdminActivityLog.js";
import { validate } from "../middleware/validate.js";
import { requireAdmin, requireSuperAdmin } from "../middleware/adminAuth.js";
import { signAdminToken, setAdminCookie, clearAdminCookie } from "../utils/token.js";

const router = Router();

// Tighter than the public login limiter — admin credentials are worth more.
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Try again in a few minutes." },
});

router.post(
  "/login",
  limiter,
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      const admin = await Admin.findOne({ email: req.body.email }).select("+password");
      // One message for both cases so this can't be used to discover which
      // emails are admin accounts.
      const invalid = { message: "Invalid credentials" };
      if (!admin || !admin.isActive) return res.status(401).json(invalid);
      if (!(await admin.comparePassword(req.body.password))) return res.status(401).json(invalid);

      admin.lastLogin = new Date();
      await admin.save();

      setAdminCookie(res, signAdminToken(admin._id));
      return res.json({ admin: admin.toPublic() });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/logout", (_req, res) => {
  clearAdminCookie(res);
  return res.json({ message: "Signed out" });
});

router.get("/me", requireAdmin, (req, res) => res.json({ admin: req.admin.toPublic() }));

router.get("/team", requireAdmin, async (_req, res, next) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 });
    return res.json({ admins: admins.map((a) => a.toPublic()) });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/team",
  requireAdmin,
  requireSuperAdmin,
  [
    body("name").trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
    body("role").isIn(["super-admin", "admin", "support", "finance"]),
  ],
  validate,
  async (req, res, next) => {
    try {
      const exists = await Admin.findOne({ email: req.body.email });
      if (exists) return res.status(409).json({ message: "That admin already exists" });

      const admin = await Admin.create(req.body);
      await AdminActivityLog.record(req, {
        action: "admin.create",
        targetType: "Admin",
        targetId: admin._id,
        detail: `Created ${admin.email} as ${admin.role}`,
      });
      return res.status(201).json({ admin: admin.toPublic() });
    } catch (err) {
      next(err);
    }
  }
);

router.patch("/team/:id", requireAdmin, requireSuperAdmin, async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: { ...(role && { role }), ...(isActive !== undefined && { isActive }) } },
      { new: true }
    );
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    await AdminActivityLog.record(req, {
      action: "admin.update",
      targetType: "Admin",
      targetId: admin._id,
      detail: `role=${admin.role} active=${admin.isActive}`,
    });
    return res.json({ admin: admin.toPublic() });
  } catch (err) {
    next(err);
  }
});

export default router;
