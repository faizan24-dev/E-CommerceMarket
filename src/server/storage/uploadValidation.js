import { FILE_KIND_LABELS } from "../../config/marketplace.js";
import { badRequest, payloadTooLarge } from "../errors.js";

/*
 * Uploads are identified by their first bytes ("magic numbers"), never by the
 * file name or the browser-supplied MIME type, which are trivial to fake.
 * SVG is deliberately not accepted: it can carry scripts.
 */
const SIGNATURES = {
  pdf: { contentType: "application/pdf", extension: "pdf", test: (b) => startsWith(b, [0x25, 0x50, 0x44, 0x46, 0x2d]) },
  zip: { contentType: "application/zip", extension: "zip", test: (b) => startsWith(b, [0x50, 0x4b, 0x03, 0x04]) },
  png: {
    contentType: "image/png",
    extension: "png",
    test: (b) => startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  },
  jpeg: { contentType: "image/jpeg", extension: "jpg", test: (b) => startsWith(b, [0xff, 0xd8, 0xff]) },
  webp: {
    contentType: "image/webp",
    extension: "webp",
    test: (b) => startsWith(b, [0x52, 0x49, 0x46, 0x46]) && b.subarray(8, 12).toString("ascii") === "WEBP",
  },
};

function startsWith(buffer, bytes) {
  return buffer.length >= bytes.length && bytes.every((byte, i) => buffer[i] === byte);
}

export function detectFileKind(buffer) {
  return Object.keys(SIGNATURES).find((kind) => SIGNATURES[kind].test(buffer)) ?? null;
}

/** Keeps a readable, header-safe file name: letters, digits, dot, dash, underscore, space. */
export function sanitizeFilename(name, extension) {
  const base = String(name ?? "")
    .replace(/\.[^.]*$/, "")
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
  return `${base || "file"}.${extension}`;
}

/**
 * Validates an uploaded File from FormData against a rule from UPLOAD_LIMITS.
 * Returns `{ buffer, kind, contentType, filename, size }`.
 */
export async function validateUpload(file, rule, label) {
  if (!file || typeof file === "string" || file.size === 0) {
    throw badRequest(`Please choose a ${label}.`);
  }
  if (file.size > rule.maxBytes) {
    throw payloadTooLarge(`The ${label} must be ${Math.floor(rule.maxBytes / (1024 * 1024))} MB or smaller.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = detectFileKind(buffer);
  if (!kind || !rule.kinds.includes(kind)) {
    const allowed = rule.kinds.map((k) => FILE_KIND_LABELS[k]).join(", ");
    throw badRequest(`The ${label} must be one of: ${allowed}.`);
  }

  const { contentType, extension } = SIGNATURES[kind];
  return { buffer, kind, contentType, filename: sanitizeFilename(file.name, extension), size: buffer.length };
}
