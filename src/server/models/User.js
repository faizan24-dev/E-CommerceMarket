import mongoose from "mongoose";
import { PAYOUT_METHOD_TYPES } from "../../config/marketplace.js";
import { EMAIL_PATTERN, NAME_MAX_LENGTH } from "../../lib/validation.js";

const { Schema } = mongoose;

export const USER_ROLES = ["user", "admin"];
export const ACCOUNT_STATUSES = ["active", "suspended"];

// Where a seller wants their earnings sent. The account number is encrypted at rest
// (see src/server/utils/crypto.js) and only the last 4 digits are kept in clear text.
const payoutMethodSchema = new Schema(
  {
    type: { type: String, enum: Object.keys(PAYOUT_METHOD_TYPES), required: true },
    accountHolder: { type: String, trim: true, maxlength: 100, required: true },
    provider: { type: String, trim: true, maxlength: 100, required: true },
    accountNumberEncrypted: { type: String, required: true, select: false },
    accountLast4: { type: String, maxlength: 4 },
    notes: { type: String, trim: true, maxlength: 300 },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const sellerSchema = new Schema(
  {
    status: { type: String, enum: ACCOUNT_STATUSES, default: "active" },
    storeName: { type: String, trim: true, maxlength: 60, required: true },
    storeSlug: { type: String, lowercase: true, trim: true, required: true },
    bio: { type: String, trim: true, maxlength: 600, default: "" },
    joinedAt: { type: Date, default: Date.now },
    payoutMethod: { type: payoutMethodSchema, default: undefined },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: NAME_MAX_LENGTH },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_PATTERN, "Please provide a valid email address"],
    },
    // bcrypt hash. The field keeps its original name so existing accounts still log in.
    password: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, default: "user" },
    status: { type: String, enum: ACCOUNT_STATUSES, default: "active" },
    seller: { type: sellerSchema, default: undefined },
    passwordChangedAt: Date,
    lastLoginAt: Date,
  },
  { timestamps: true },
);

userSchema.index(
  { "seller.storeSlug": 1 },
  { unique: true, partialFilterExpression: { "seller.storeSlug": { $type: "string" } } },
);
userSchema.index({ role: 1, createdAt: -1 });

export const User = mongoose.models.User || mongoose.model("User", userSchema);
