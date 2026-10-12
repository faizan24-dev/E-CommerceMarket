import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * A login session. The browser holds a random token in an httpOnly cookie; only
 * its SHA-256 hash is stored here, so sessions can be listed and revoked.
 */
const sessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    userAgent: { type: String, maxlength: 300, default: "" },
    ip: { type: String, maxlength: 64, default: "" },
    lastSeenAt: { type: Date, default: Date.now },
    // MongoDB deletes the document automatically once this date passes.
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);
