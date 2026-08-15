import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    payoutId: { type: String, required: true, unique: true, index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    amount: { type: Number, required: true, min: 0 },
    orderCount: { type: Number, required: true },
    orderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],

    status: {
      type: String,
      enum: ["scheduled", "processing", "paid", "failed"],
      default: "scheduled",
    },

    // Only the last four digits are stored — enough to identify the account
    // in the UI, useless to anyone who gets hold of the database.
    accountLast4: { type: String },
    method: { type: String, enum: ["bank", "upi"], default: "bank" },

    razorpayPayoutId: { type: String },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Payout", payoutSchema);
