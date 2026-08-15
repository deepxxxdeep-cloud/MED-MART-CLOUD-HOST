import mongoose from "mongoose";

/**
 * Every privileged action is recorded. Bans, payouts and credential changes
 * all need to be attributable after the fact — without this, "who changed the
 * Razorpay key" has no answer.
 */
const logSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true, index: true },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true, index: true },
    targetType: { type: String },
    targetId: { type: String },
    // Deliberately holds descriptions only — never the value of a secret.
    detail: { type: String },
    ip: { type: String },
  },
  { timestamps: true }
);

logSchema.statics.record = function (req, { action, targetType, targetId, detail }) {
  return this.create({
    adminId: req.admin._id,
    adminEmail: req.admin.email,
    action,
    targetType,
    targetId: targetId ? String(targetId) : undefined,
    detail,
    ip: req.ip,
  });
};

export default mongoose.model("AdminActivityLog", logSchema);
