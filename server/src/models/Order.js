import mongoose from "mongoose";

// Commission is read from config, not hard-coded at the call site, so a rate
// change can't leave historical orders inconsistent — each order stores the
// rate that was applied to it.
export const DEFAULT_COMMISSION_RATE = Number(process.env.PLATFORM_COMMISSION_RATE || 0.06);

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },

    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

    // Snapshotted so an order still reads correctly after a listing is edited
    // or removed.
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },

    totalAmount: { type: Number, required: true, min: 0 },
    commissionRate: { type: Number, required: true },
    platformCommission: { type: Number, required: true, min: 0 },
    sellerEarning: { type: Number, required: true, min: 0 },

    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ["confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "confirmed",
      index: true,
    },

    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String },

    deliveryAddress: { type: addressSchema, required: true },
    trackingNumber: { type: String },
    courier: { type: String },
    deliveredAt: { type: Date },

    payoutStatus: {
      type: String,
      enum: ["pending", "scheduled", "paid"],
      default: "pending",
      index: true,
    },
    payoutId: { type: mongoose.Schema.Types.ObjectId, ref: "Payout" },
  },
  { timestamps: true }
);

/**
 * Money is derived here rather than accepted from the client. The frontend
 * sends a product and a quantity; every rupee is recomputed from the price
 * stored in the database.
 */
orderSchema.statics.priceOrder = function (unitPrice, quantity, rate = DEFAULT_COMMISSION_RATE) {
  const totalAmount = Math.round(unitPrice * quantity);
  const platformCommission = Math.round(totalAmount * rate);
  return {
    totalAmount,
    commissionRate: rate,
    platformCommission,
    sellerEarning: totalAmount - platformCommission,
  };
};

export default mongoose.model("Order", orderSchema);
