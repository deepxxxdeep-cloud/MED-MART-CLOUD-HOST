import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    name: { type: String, required: true, trim: true, maxlength: 200 },
    category: { type: String, required: true, index: true },
    subcategory: { type: String },
    brand: { type: String },
    shortDescription: { type: String, maxlength: 400 },
    description: { type: String },

    images: [{ type: String }],

    // The price the server bills against. Orders never trust a client-sent
    // amount; they read this.
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 },
    priceType: { type: String, enum: ["fixed", "range", "quote"], default: "fixed" },
    maxPrice: { type: Number, min: 0 },

    moq: { type: Number, default: 1, min: 1 },
    unit: { type: String, default: "Pieces" },
    stock: { type: Number, default: 0, min: 0 },

    specifications: [{ key: String, value: String }],
    certifications: [{ type: String }],

    status: {
      type: String,
      enum: ["active", "draft", "out-of-stock"],
      default: "draft",
      index: true,
    },

    views: { type: Number, default: 0 },
    inquiryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", shortDescription: "text" });

export default mongoose.model("Product", productSchema);
