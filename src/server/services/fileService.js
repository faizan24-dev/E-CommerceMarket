import "server-only";
import { isAdmin, ownsProduct } from "../auth/policies.js";
import { forbidden, notFound, unauthorized } from "../errors.js";
import { Product } from "../models/index.js";
import { getFileInfo, openFileStream } from "../storage/fileStorage.js";
import { assertObjectId } from "../validators/parse.js";
import { hasPurchased } from "./orderService.js";

/** A public file (product cover image). Private files are reported as not found. */
export async function getPublicFile(fileId) {
  const info = await getFileInfo(fileId);
  if (!info || info.metadata?.visibility !== "public") throw notFound("File not found.");
  return { stream: openFileStream(info._id), contentType: info.metadata.contentType, size: info.length };
}

/**
 * A product's downloadable file, for buyers who paid for it, its seller and admins.
 * Buyers keep access even if the product is later archived.
 */
export async function getProductDownload(user, productId) {
  if (!user) throw unauthorized("Please log in to download your files.");
  assertObjectId(productId, "product");

  const product = await Product.findById(productId).select("seller title file").lean();
  if (!product?.file?.fileId) throw notFound("This file is not available.");

  const allowed = isAdmin(user) || ownsProduct(user, product) || (await hasPurchased(user._id, product._id));
  if (!allowed) throw forbidden("Buy this product to download it.");

  const info = await getFileInfo(product.file.fileId);
  if (!info) throw notFound("This file is missing. Please contact support.");
  return {
    stream: openFileStream(info._id),
    filename: product.file.filename,
    contentType: product.file.contentType,
    size: info.length,
  };
}
