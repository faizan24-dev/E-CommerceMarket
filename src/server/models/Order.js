import mongoose from "mongoose";
import { CURRENCY, ORDER_STATUS } from "../../config/marketplace.js";

const { Schema } = mongoose;

// A snapshot of the product at the time of purchase, including how the price
// was split between the seller and the platform.
const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    coverUrl: String,
    fileType: String,
    price: { type: Number, required: true, min: 0 },
    commissionRate: { type: Number, required: true, min: 0, max: 1 },
    commission: { type: Number, required: true, min: 0 },
    sellerEarning: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    number: { type: String, required: true, unique: true },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], validate: (items) => items.length > 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: CURRENCY },
    status: { type: String, enum: Object.keys(ORDER_STATUS), required: true },
    payment: {
      method: { type: String, enum: ["free", "simulated", "manual"], required: true },
      reference: { type: String, trim: true, maxlength: 120 },
      submittedAt: Date,
      confirmedBy: { type: Schema.Types.ObjectId, ref: "User" },
      confirmedAt: Date,
    },
    paidAt: Date,
    cancelledAt: Date,
    cancelReason: { type: String, trim: true, maxlength: 300 },
  },
  { timestamps: true },
);

orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ buyer: 1, status: 1, "items.product": 1 });

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
