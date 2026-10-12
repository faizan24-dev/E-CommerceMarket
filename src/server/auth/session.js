import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { getEnv } from "../config/env.js";
import { connectDB } from "../db.js";
import { Session, User } from "../models/index.js";
import { randomToken, sha256 } from "../utils/crypto.js";
import { SESSION_COOKIE } from "./sessionCookie.js";

// Activity is recorded at most this often, to avoid a database write on every request.
const TOUCH_INTERVAL_MS = 10 * 60 * 1000;

function cookieOptions(expiresAt) {
  return {
    httpOnly: true, // not readable from JavaScript, so XSS can't steal it
    secure: getEnv().isProduction,
    sameSite: "lax", // not sent on cross-site POSTs (CSRF)
    path: "/",
    expires: expiresAt,
  };
}

/** Starts a new session for `userId` and sets the session cookie. Call from a Route Handler. */
export async function createSession(userId, { userAgent = "", ip = "" } = {}) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + getEnv().sessionTtlMs);
  const session = await Session.create({
    user: userId,
    tokenHash: sha256(token),
    userAgent: userAgent.slice(0, 300),
    ip,
    expiresAt,
  });
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(expiresAt));
  return session;
}

/** Resolves the current request's session and user once per request. */
const loadSession = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 128) return null;

  await connectDB();
  const session = await Session.findOne({ tokenHash: sha256(token), expiresAt: { $gt: new Date() } }).lean();
  if (!session) return null;

  const user = await User.findById(session.user).lean();
  if (!user || user.status !== "active") return null;

  if (Date.now() - new Date(session.lastSeenAt).getTime() > TOUCH_INTERVAL_MS) {
    await Session.updateOne({ _id: session._id }, { lastSeenAt: new Date() });
  }
  return { session, user };
});

/** The logged-in user (a plain object), or null. Works in Server Components and Route Handlers. */
export async function getCurrentUser() {
  return (await loadSession())?.user ?? null;
}

export async function getCurrentSession() {
  return (await loadSession())?.session ?? null;
}

/** Extends the current session (sliding expiry) and re-issues its cookie. Route Handlers only. */
export async function extendCurrentSession() {
  const current = await loadSession();
  if (!current) return;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const expiresAt = new Date(Date.now() + getEnv().sessionTtlMs);
  await Session.updateOne({ _id: current.session._id }, { expiresAt, lastSeenAt: new Date() });
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(expiresAt));
}

/** Ends the current session in the database and clears the cookie. Route Handlers only. */
export async function destroyCurrentSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await connectDB();
    await Session.deleteOne({ tokenHash: sha256(token) });
  }
  store.delete(SESSION_COOKIE);
}
