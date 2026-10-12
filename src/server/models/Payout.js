import mongoose from "mongoose";

const { Schema } = mongoose;

/** A manual transfer an admin made to a seller, settling a set of unpaid earnings. */
const payoutSchema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    earningsCount: { type: Number, required: true, min: 1 },
    // Masked copy of the payout method used, so history stays accurate if the seller changes it later.
    method: {
      type: { type: String },
      provider: String,
      accountHolder: String,
      accountLast4: String,
    },
    reference: { type: String, trim: true, maxlength: 120, required: true },
    note: { type: String, trim: true, maxlength: 500 },
    paidBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

payoutSchema.index({ paidAt: -1 });

export const Payout = mongoose.models.Payout || mongoose.model("Payout", payoutSchema);
