import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false, minlength: 8 },

    // super-admin is the only role that may read or write platform settings —
    // day-to-day moderation shouldn't come with access to payment credentials.
    role: {
      type: String,
      enum: ["super-admin", "admin", "support", "finance"],
      default: "support",
      required: true,
    },

    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

adminSchema.methods.comparePassword = function (candidate) {
  return this.password ? bcrypt.compare(candidate, this.password) : false;
};

adminSchema.methods.toPublic = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
  };
};

export default mongoose.model("Admin", adminSchema);
