import { Readable } from "node:stream";
import mongoose from "mongoose";

/*
 * File storage backed by MongoDB GridFS, so uploads live in the same database
 * as everything else and need no extra service. Every function here works with
 * an opaque file id; swapping in S3 or Vercel Blob later only means rewriting
 * this module.
 */

const BUCKET_NAME = "uploads";

function getBucket() {
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database is not connected.");
  return new mongoose.mongo.GridFSBucket(db, { bucketName: BUCKET_NAME });
}

function toObjectId(id) {
  return typeof id === "string" ? new mongoose.Types.ObjectId(id) : id;
}

/**
 * Stores a file and returns its id.
 * `visibility` is "public" (cover images, served to anyone) or "private" (product files).
 */
export async function saveFile({ buffer, filename, contentType, visibility, ownerId }) {
  const upload = getBucket().openUploadStream(filename, {
    metadata: { contentType, visibility, owner: ownerId ? toObjectId(ownerId) : undefined },
  });
  await new Promise((resolve, reject) => {
    upload.once("finish", resolve);
    upload.once("error", reject);
    upload.end(buffer);
  });
  return upload.id;
}

/** Returns the stored file's info, or null if it doesn't exist. */
export async function getFileInfo(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  const [file] = await getBucket().find({ _id: toObjectId(id) }).limit(1).toArray();
  return file ?? null;
}

/** A web ReadableStream of the file's bytes, ready to pass to `new Response()`. */
export function openFileStream(id) {
  return Readable.toWeb(getBucket().openDownloadStream(toObjectId(id)));
}

export async function deleteFile(id) {
  if (!id) return;
  try {
    await getBucket().delete(toObjectId(id));
  } catch (error) {
    // Already gone is fine; anything else is logged but never blocks the caller.
    if (!/FileNotFound|File not found/i.test(error.message)) {
      console.error(`[storage] could not delete file ${id}: ${error.message}`);
    }
  }
}
