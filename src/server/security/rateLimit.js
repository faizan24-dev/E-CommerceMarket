import { RateLimit } from "../models/RateLimit.js";
import { tooManyRequests } from "../errors.js";

/**
 * Named limits used across the API. `limit` requests per `windowSec` seconds,
 * counted per key (usually the client IP, sometimes the target email).
 */
export const RATE_LIMITS = {
  login: { limit: 10, windowSec: 15 * 60 },
  loginEmail: { limit: 8, windowSec: 15 * 60 },
  signup: { limit: 5, windowSec: 60 * 60 },
  password: { limit: 5, windowSec: 15 * 60 },
  checkout: { limit: 20, windowSec: 60 * 60 },
  upload: { limit: 30, windowSec: 60 * 60 },
  download: { limit: 60, windowSec: 10 * 60 },
  write: { limit: 120, windowSec: 10 * 60 },
  search: { limit: 120, windowSec: 60 },
};

/**
 * Counts one request against `name:key` and throws 429 once the window's limit is exceeded.
 * Counters live in MongoDB so every serverless instance shares them.
 */
export async function consumeRateLimit(name, key, override) {
  const { limit, windowSec } = override ?? RATE_LIMITS[name];
  const now = new Date();
  const freshExpiry = new Date(now.getTime() + windowSec * 1000);
  const isLive = { $gt: ["$expiresAt", now] };

  // One atomic upsert: increment inside a live window, otherwise start a new one.
  const update = [
    {
      $set: {
        count: { $cond: [isLive, { $add: ["$count", 1] }, 1] },
        expiresAt: { $cond: [isLive, "$expiresAt", freshExpiry] },
      },
    },
  ];
  const options = { upsert: true, returnDocument: "after", updatePipeline: true, lean: true };
  const id = `${name}:${key}`;

  let doc;
  try {
    doc = await RateLimit.findOneAndUpdate({ key: id }, update, options);
  } catch (error) {
    if (error.code !== 11000) throw error;
    // Two first requests raced to create the counter; the second attempt updates it.
    doc = await RateLimit.findOneAndUpdate({ key: id }, update, options);
  }

  if (doc.count > limit) {
    const minutes = Math.max(1, Math.ceil((new Date(doc.expiresAt) - now) / 60000));
    throw tooManyRequests(
      `Too many attempts. Please try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`,
    );
  }
}
