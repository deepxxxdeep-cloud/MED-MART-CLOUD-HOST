import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, unique: true, index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    orderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    totalAmount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["scheduled", "processing", "completed", "failed"],
      default: "scheduled",
      index: true,
    },

    // Masked at rest. The full account stays with Razorpay.
    bankAccountUsed: { type: String },
    razorpayPayoutId: { type: String },
    failureReason: { type: String },
    processedAt: { type: Date },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("PayoutBatch", batchSchema);
