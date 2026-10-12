/*
 * Session cookie name. Kept free of server-only imports because proxy.js reads it too.
 * In production the "__Host-" prefix makes browsers refuse the cookie unless it is
 * Secure, has Path=/ and no Domain, which blocks subdomain cookie injection.
 */
export const SESSION_COOKIE = process.env.NODE_ENV === "production" ? "__Host-em_session" : "em_session";
