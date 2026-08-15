import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", index: true },

    amount: { type: Number, required: true },
    type: { type: String, enum: ["payment", "refund", "payout"], required: true },
    status: {
      type: String,
      enum: ["created", "captured", "failed", "processed"],
      default: "created",
    },

    // We keep Razorpay's identifiers only. Card data never reaches this server
    // — Razorpay's checkout collects it directly, which is what keeps the
    // platform out of PCI-DSS scope.
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String, index: true },
    razorpaySignature: { type: String },

    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
