import "server-only";
import { CATEGORIES } from "../../config/categories.js";
import { FILE_KIND_LABELS, REQUIRE_PRODUCT_REVIEW, UPLOAD_LIMITS } from "../../config/marketplace.js";
import { canManageProduct, isAdmin } from "../auth/policies.js";
import { toManagedProductDTO, toProductDTO } from "../dto.js";
import { badRequest, forbidden, notFound } from "../errors.js";
import { Product, User } from "../models/index.js";
import { deleteFile, saveFile } from "../storage/fileStorage.js";
import { validateUpload } from "../storage/uploadValidation.js";
import { escapeRegex, uniqueSlug } from "../utils/text.js";
import { assertObjectId, parseInput } from "../validators/parse.js";
import { moderationSchema, productFieldsSchema } from "../validators/schemas.js";

const SELLER_FIELDS = "name seller.storeName seller.storeSlug";

const SORTS = {
  newest: { publishedAt: -1, _id: -1 },
  popular: { salesCount: -1, reviewCount: -1, _id: -1 },
  price_asc: { price: 1, _id: 1 },
  price_desc: { price: -1, _id: -1 },
  featured: { isFeatured: -1, publishedAt: -1, _id: -1 },
};
export const PRODUCT_SORT_OPTIONS = Object.keys(SORTS);

// ---- Public catalog ----------------------------------------------------------

/** Builds a search filter that matches title, description, format, tag, category name and store name. */
async function buildSearchFilter(q) {
  const needle = q.trim().slice(0, 80);
  if (!needle) return null;
  const pattern = new RegExp(escapeRegex(needle), "i");

  const matchingSellers = await User.find({ "seller.storeName": pattern }).select("_id").limit(50).lean();
  const matchingCategories = CATEGORIES.filter((c) => pattern.test(c.name)).map((c) => c.slug);

  return [
    { title: pattern },
    { description: pattern },
    { fileType: pattern },
    { tag: pattern },
    ...(matchingCategories.length ? [{ category: { $in: matchingCategories } }] : []),
    ...(matchingSellers.length ? [{ seller: { $in: matchingSellers.map((s) => s._id) } }] : []),
  ];
}

/** Published products, filtered and paginated. */
export async function listPublishedProducts({
  q = "",
  category = "",
  featured = false,
  free,
  sellerId,
  excludeId,
  sort = "newest",
  page = 1,
  limit = 24,
} = {}) {
  const filter = { status: "published" };
  if (category) filter.category = category;
  if (featured) filter.isFeatured = true;
  if (free === true) filter.price = 0;
  if (free === false) filter.price = { $gt: 0 };
  if (sellerId) filter.seller = sellerId;
  if (excludeId) filter._id = { $ne: excludeId };
  const search = await buildSearchFilter(q);
  if (search) filter.$or = search;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(SORTS[sort] ?? SORTS.newest)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("seller", SELLER_FIELDS)
      .lean(),
    Product.countDocuments(filter),
  ]);
  return { products: products.map(toProductDTO), total, page, pageCount: Math.max(1, Math.ceil(total / limit)) };
}

export async function getPublishedProductBySlug(slug) {
  if (typeof slug !== "string") return null;
  const product = await Product.findOne({ slug, status: "published" }).populate("seller", SELLER_FIELDS).lean();
  return product ? toProductDTO(product) : null;
}

export async function getPublishedProductsBySlugs(slugs) {
  const products = await Product.find({ slug: { $in: slugs }, status: "published" })
    .populate("seller", SELLER_FIELDS)
    .lean();
  return products.map(toProductDTO);
}

/** Products from the same category first, then anything else, excluding `product`. */
export async function getRelatedProducts(product, limit = 4) {
  const sameCategory = await listPublishedProducts({ category: product.category, excludeId: product.id, limit, sort: "popular" });
  if (sameCategory.products.length >= limit) return sameCategory.products;
  const others = await Product.find({
    status: "published",
    _id: { $nin: [product.id, ...sameCategory.products.map((p) => p.id)] },
  })
    .sort(SORTS.popular)
    .limit(limit - sameCategory.products.length)
    .populate("seller", SELLER_FIELDS)
    .lean();
  return [...sameCategory.products, ...others.map(toProductDTO)];
}

/** Store-wide numbers for the home and about pages. */
export async function getCatalogStats() {
  const [totals] = await Product.aggregate([
    { $match: { status: "published" } },
    {
      $group: {
        _id: null,
        productCount: { $sum: 1 },
        totalReviews: { $sum: "$reviewCount" },
        ratingWeight: { $sum: { $multiply: ["$rating", "$reviewCount"] } },
        totalSales: { $sum: "$salesCount" },
      },
    },
  ]);
  const byCategory = await Product.aggregate([
    { $match: { status: "published" } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const totalReviews = totals?.totalReviews ?? 0;
  return {
    productCount: totals?.productCount ?? 0,
    categoryCount: CATEGORIES.length,
    totalReviews,
    totalSales: totals?.totalSales ?? 0,
    averageRating: totalReviews ? Math.round((totals.ratingWeight / totalReviews) * 10) / 10 : 0,
    countsByCategory: Object.fromEntries(byCategory.map((row) => [row._id, row.count])),
  };
}

// ---- Seller & admin management ----------------------------------------------

function readProductFields(formData) {
  return parseInput(productFieldsSchema, {
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    price: formData.get("price") ?? "",
    category: formData.get("category") ?? "",
    includes: formData
      .getAll("includes")
      .map((value) => String(value).trim())
      .filter(Boolean),
    tag: formData.get("tag") || undefined,
  });
}

function hasUpload(value) {
  return value && typeof value !== "string" && value.size > 0;
}

/** Saves validated uploads; returns the new file ids plus a cleanup function for failures. */
async function storeUploads(user, { cover, file }) {
  const saved = [];
  const cleanup = () => Promise.all(saved.map(deleteFile));
  try {
    const result = {};
    if (cover) {
      result.coverId = await saveFile({ ...cover, visibility: "public", ownerId: user._id });
      saved.push(result.coverId);
    }
    if (file) {
      result.fileId = await saveFile({ ...file, visibility: "private", ownerId: user._id });
      saved.push(result.fileId);
    }
    return { ...result, cleanup };
  } catch (error) {
    await cleanup();
    throw error;
  }
}

/**
 * Creates a product from the multipart seller form (fields + `cover` image + `file`).
 * Admin products go live immediately; seller products wait for review.
 */
export async function createProduct(user, formData) {
  const fields = readProductFields(formData);
  const cover = await validateUpload(formData.get("cover"), UPLOAD_LIMITS.coverImage, "cover image");
  const file = await validateUpload(formData.get("file"), UPLOAD_LIMITS.productFile, "product file");

  const { coverId, fileId, cleanup } = await storeUploads(user, { cover, file });
  const publishNow = isAdmin(user) || !REQUIRE_PRODUCT_REVIEW;

  try {
    const product = await Product.create({
      ...fields,
      slug: await uniqueSlug(Product, "slug", fields.title),
      fileType: FILE_KIND_LABELS[file.kind],
      coverImage: { url: `/api/files/${coverId}`, fileId: coverId },
      file: { fileId, filename: file.filename, size: file.size, contentType: file.contentType },
      seller: user._id,
      status: publishNow ? "published" : "pending",
      publishedAt: publishNow ? new Date() : undefined,
    });
    return toManagedProductDTO(product.toObject());
  } catch (error) {
    await cleanup();
    throw error;
  }
}

async function loadManagedProduct(user, productId) {
  assertObjectId(productId, "product");
  const product = await Product.findById(productId);
  if (!product) throw notFound("Product not found.");
  if (!canManageProduct(user, product)) throw forbidden("You can only manage your own products.");
  return product;
}

export async function getManagedProduct(user, productId) {
  const product = await loadManagedProduct(user, productId);
  return toManagedProductDTO(product.toObject());
}

/**
 * Updates a product. A new cover or file is optional. When a seller edits a
 * live or rejected product it goes back to review, so buyers only ever see
 * approved content.
 */
export async function updateProduct(user, productId, formData) {
  const product = await loadManagedProduct(user, productId);
  const fields = readProductFields(formData);

  const cover = hasUpload(formData.get("cover"))
    ? await validateUpload(formData.get("cover"), UPLOAD_LIMITS.coverImage, "cover image")
    : null;
  const file = hasUpload(formData.get("file"))
    ? await validateUpload(formData.get("file"), UPLOAD_LIMITS.productFile, "product file")
    : null;

  const { coverId, fileId, cleanup } = await storeUploads(user, { cover, file });
  const replacedFiles = [];

  // The slug is kept even if the title changes, so existing links keep working.
  product.set(fields);
  if (!fields.tag) product.tag = undefined;
  if (coverId) {
    if (product.coverImage?.fileId) replacedFiles.push(product.coverImage.fileId);
    product.coverImage = { url: `/api/files/${coverId}`, fileId: coverId };
  }
  if (fileId) {
    if (product.file?.fileId) replacedFiles.push(product.file.fileId);
    product.file = { fileId, filename: file.filename, size: file.size, contentType: file.contentType };
    product.fileType = FILE_KIND_LABELS[file.kind];
  }

  const isSellerEdit = !isAdmin(user);
  if (isSellerEdit && REQUIRE_PRODUCT_REVIEW && ["published", "rejected", "archived"].includes(product.status)) {
    product.status = "pending";
    product.isFeatured = false;
  }

  try {
    await product.save();
  } catch (error) {
    await cleanup();
    throw error;
  }
  await Promise.all(replacedFiles.map(deleteFile));
  return toManagedProductDTO(product.toObject());
}

/**
 * Removes a product from the shop. Products are archived rather than deleted,
 * so buyers keep access to files they paid for.
 */
export async function archiveProduct(user, productId) {
  const product = await loadManagedProduct(user, productId);
  product.status = "archived";
  product.isFeatured = false;
  await product.save();
  return toManagedProductDTO(product.toObject());
}

export async function listSellerProducts(sellerId) {
  const products = await Product.find({ seller: sellerId }).sort({ createdAt: -1 }).limit(200).lean();
  return products.map(toManagedProductDTO);
}

// ---- Admin moderation --------------------------------------------------------

export async function listProductsForAdmin({ status = "", q = "", page = 1, limit = 25 } = {}) {
  const filter = {};
  if (status) filter.status = status;
  const search = await buildSearchFilter(q);
  if (search) filter.$or = search;

  const [products, total] = await Promise.all([
    Product.find(filter)
      // Products waiting for review come first, oldest first, so nothing gets stuck.
      .sort(status === "pending" ? { createdAt: 1 } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("seller", SELLER_FIELDS)
      .lean(),
    Product.countDocuments(filter),
  ]);
  return { products: products.map(toManagedProductDTO), total, page, pageCount: Math.max(1, Math.ceil(total / limit)) };
}

export async function moderateProduct(admin, productId, input) {
  const { action, note } = parseInput(moderationSchema, input);
  assertObjectId(productId, "product");
  const product = await Product.findById(productId);
  if (!product) throw notFound("Product not found.");

  switch (action) {
    case "approve":
      if (!product.file?.fileId) throw badRequest("This product has no downloadable file yet.");
      product.status = "published";
      product.publishedAt ??= new Date();
      product.reviewNote = undefined;
      break;
    case "reject":
      if (!note) throw badRequest("Add a note so the seller knows what to fix.");
      product.status = "rejected";
      product.reviewNote = note;
      product.isFeatured = false;
      break;
    case "unpublish":
      product.status = "archived";
      product.reviewNote = note;
      product.isFeatured = false;
      break;
    case "feature":
    case "unfeature":
      if (product.status !== "published") throw badRequest("Only published products can be featured.");
      product.isFeatured = action === "feature";
      break;
  }

  if (action !== "feature" && action !== "unfeature") {
    product.reviewedBy = admin._id;
    product.reviewedAt = new Date();
  }
  await product.save();
  return toManagedProductDTO(product.toObject());
}
