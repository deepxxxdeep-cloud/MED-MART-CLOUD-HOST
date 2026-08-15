import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 80 },
    businessName: { type: String, trim: true, maxlength: 120 },

    // sparse so multiple docs may omit these without colliding on the unique index
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, unique: true, sparse: true, trim: true },

    // absent for google/phone accounts — never returned by default
    password: { type: String, select: false, minlength: 8 },

    authProvider: {
      type: String,
      enum: ["email", "google", "phone"],
      required: true,
      default: "email",
    },
    googleId: { type: String, unique: true, sparse: true },
    profilePicture: { type: String },

    role: { type: String, enum: ["buyer", "seller"], required: true, default: "buyer" },

    // seller-only, collected conditionally by the signup form
    businessType: { type: String, trim: true },
    gstNumber: { type: String, trim: true, uppercase: true },
    city: { type: String, trim: true },

    isVerified: { type: Boolean, default: false },

    // Off-platform contact attempts. Counted rather than acted on immediately
    // so a single mistyped message doesn't cost someone their account.
    communicationViolations: { type: Number, default: 0 },
    isFlagged: { type: Boolean, default: false, index: true },
    flaggedAt: { type: Date },
    isSuspended: { type: Boolean, default: false },

    // Payout destination — only ever stored masked plus a token from the
    // payment provider. Full account numbers stay with Razorpay.
    payout: {
      method: { type: String, enum: ["bank", "upi"] },
      accountLast4: { type: String },
      upiId: { type: String },
      beneficiaryName: { type: String },
      razorpayContactId: { type: String },
      razorpayFundAccountId: { type: String },
      verified: { type: Boolean, default: false },
    },

    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

// An account must be reachable by at least one identifier.
// Mongoose 9 does not pass `next` to these hooks — throw or return a promise.
userSchema.pre("validate", function () {
  if (!this.email && !this.phone) {
    throw new Error("An email or phone number is required");
  }
  if (this.authProvider === "email" && !this.password) {
    throw new Error("Password is required for email accounts");
  }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

// Shape sent to the client — never leaks password or reset fields.
userSchema.methods.toPublic = function () {
  return {
    id: this._id,
    fullName: this.fullName,
    businessName: this.businessName,
    email: this.email,
    phone: this.phone,
    role: this.role,
    authProvider: this.authProvider,
    businessType: this.businessType,
    gstNumber: this.gstNumber,
    city: this.city,
    isVerified: this.isVerified,
    profilePicture: this.profilePicture,
    communicationViolations: this.communicationViolations,
    isFlagged: this.isFlagged,
    payout: this.payout
      ? {
          method: this.payout.method,
          accountLast4: this.payout.accountLast4,
          upiId: this.payout.upiId,
          verified: this.payout.verified,
        }
      : undefined,
    createdAt: this.createdAt,
  };
};

export default mongoose.model("User", userSchema);
