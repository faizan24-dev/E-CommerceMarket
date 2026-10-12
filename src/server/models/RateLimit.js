import mongoose from "mongoose";

const { Schema } = mongoose;

/** Fixed-window request counters, shared by every server instance (unlike in-memory limits). */
const rateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, required: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export const RateLimit = mongoose.models.RateLimit || mongoose.model("RateLimit", rateLimitSchema);
