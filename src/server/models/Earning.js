import mongoose from "mongoose";
import { EARNING_STATUS } from "../../config/marketplace.js";

const { Schema } = mongoose;

/**
 * One seller's share of one sold item. Created when an order is paid, and
 * marked "paid" when an admin records a payout that includes it. This ledger is
 * what both the seller dashboard and the admin payout screen read from.
 */
const earningSchema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    orderNumber: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productTitle: { type: String, required: true },
    gross: { type: Number, required: true, min: 0 },
    commission: { type: Number, required: true, min: 0 },
    net: { type: Number, required: true, min: 0 },
    status: { type: String, enum: Object.keys(EARNING_STATUS), default: "unpaid" },
    payout: { type: Schema.Types.ObjectId, ref: "Payout" },
    earnedAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// Guarantees an order item can only ever be credited once.
earningSchema.index({ order: 1, product: 1 }, { unique: true });
earningSchema.index({ seller: 1, status: 1 });
earningSchema.index({ seller: 1, earnedAt: -1 });

export const Earning = mongoose.models.Earning || mongoose.model("Earning", earningSchema);
