import { z } from "zod";
import mongoose from "mongoose";
import { badRequest } from "../errors.js";

/**
 * Validates `data` against a zod schema. On failure throws a 400 with the first
 * message plus per-field messages the client can show next to inputs.
 */
export function parseInput(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) return result.data;

  const fieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path.join(".") || "form";
    fieldErrors[field] ??= issue.message;
  }
  throw badRequest(result.error.issues[0]?.message ?? "Invalid input.", { fieldErrors });
}

export const objectId = (label = "id") =>
  z.string().refine((value) => mongoose.isValidObjectId(value), `Invalid ${label}.`);

export function assertObjectId(value, label = "id") {
  if (typeof value !== "string" || !mongoose.isValidObjectId(value)) throw badRequest(`Invalid ${label}.`);
  return value;
}

/** Reads a query value from URLSearchParams (API routes) or a plain object (page `searchParams`). */
export function readParam(source, key) {
  const value = typeof source?.get === "function" ? source.get(key) : source?.[key];
  return typeof value === "string" ? value : "";
}

/** Parses ?page= with safe bounds. */
export function parsePagination(source, { limit = 20 } = {}) {
  const page = Math.max(1, Math.min(10_000, Number.parseInt(readParam(source, "page"), 10) || 1));
  return { page, limit, skip: (page - 1) * limit };
}
