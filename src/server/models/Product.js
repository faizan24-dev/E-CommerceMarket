import mongoose from "mongoose";
import { CATEGORY_SLUGS } from "../../config/categories.js";
import { PRICE_MAX_CENTS, PRODUCT_STATUS } from "../../config/marketplace.js";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    // Money is stored in cents to avoid floating point rounding errors.
    price: { type: Number, required: true, min: 0, max: PRICE_MAX_CENTS },
    category: { type: String, required: true, enum: CATEGORY_SLUGS },
    fileType: { type: String, trim: true, maxlength: 60, required: true },
    includes: { type: [{ type: String, trim: true, maxlength: 100 }], default: [] },
    tag: { type: String, trim: true, maxlength: 30 },

    // Public header image: either an uploaded file (served by /api/files/:id) or an external URL.
    coverImage: {
      url: { type: String, required: true },
      fileId: { type: Schema.Types.ObjectId },
    },
    // The downloadable file. Private: only served to buyers, the seller and admins.
    file: {
      fileId: { type: Schema.Types.ObjectId },
      filename: String,
      size: Number,
      contentType: String,
    },

    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: Object.keys(PRODUCT_STATUS), default: "pending" },
    reviewNote: { type: String, trim: true, maxlength: 500 },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
    publishedAt: Date,
    isFeatured: { type: Boolean, default: false },

    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, min: 0, default: 0 },
    salesCount: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true },
);

productSchema.index({ status: 1, category: 1, createdAt: -1 });
productSchema.index({ status: 1, isFeatured: -1, createdAt: -1 });
productSchema.index({ seller: 1, createdAt: -1 });

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
