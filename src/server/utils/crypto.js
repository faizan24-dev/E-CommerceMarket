import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { getEnv } from "../config/env.js";

/** A URL-safe random token, e.g. for session cookies. */
export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

/** SHA-256 hex digest. Session tokens are stored hashed so a database leak can't be replayed. */
export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

const ALGORITHM = "aes-256-gcm";
const VERSION = "v1";

function getKey() {
  return Buffer.from(getEnv().ENCRYPTION_KEY, "hex");
}

/** Encrypts a string with AES-256-GCM. Output: "v1.<iv>.<authTag>.<ciphertext>" (base64url parts). */
export function encrypt(plaintext) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, iv, tag, ciphertext].map((part) => (typeof part === "string" ? part : part.toString("base64url"))).join(".");
}

/** Reverses `encrypt`. Returns null if the value is missing or can't be decrypted with the current key. */
export function decrypt(payload) {
  if (!payload) return null;
  const [version, iv, tag, ciphertext] = payload.split(".");
  if (version !== VERSION || !iv || !tag || !ciphertext) return null;
  try {
    const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(iv, "base64url"));
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(ciphertext, "base64url")), decipher.final()]).toString("utf8");
  } catch {
    console.error("[crypto] failed to decrypt a value; was ENCRYPTION_KEY changed?");
    return null;
  }
}
