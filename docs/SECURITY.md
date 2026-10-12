# Security

## Login sessions

- Logging in creates a random 256-bit token stored in an **httpOnly, SameSite=Lax** cookie
  (Secure and `__Host-` prefixed in production). JavaScript can't read it, so XSS can't steal it.
- Only the token's SHA-256 hash is stored (`sessions` collection), so a database leak can't be
  replayed as logins.
- Sessions expire after `SESSION_TTL_DAYS` of inactivity; activity slides the expiry forward.
- Users see every signed-in device in **Account settings** and can sign out any of them.
- Changing the password signs out all other sessions. Suspending an account signs it out
  everywhere immediately.
- Passwords are hashed with bcrypt (12 rounds). Unknown emails and wrong passwords get the same
  message and take the same time, so accounts can't be discovered by guessing.

## Authorization

- Rules live in `src/server/auth/policies.js` and are enforced in services, not just the UI.
- Every private page re-checks the session on the server (`requireUser/Seller/Admin`).
  `proxy.js` only provides a fast redirect.
- Non-admins get **404** on admin pages, so the admin area isn't revealed.
- Prices are always read from the database at checkout; the client only sends product ids.
- Clients can never set `role` or `status` on signup.

## Attacks covered

| Attack                     | Protection                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------- |
| CSRF                       | SameSite=Lax cookies + Origin / Sec-Fetch-Site check on every state-changing request |
| Brute force / credential stuffing | Rate limits per IP and per target email (MongoDB-backed, shared by all instances) |
| Spam signups, upload abuse | Per-IP limits on signup, uploads, checkout, downloads and all writes                |
| NoSQL injection            | zod schemas only accept strings where strings are expected                          |
| Regex injection / ReDoS    | Search terms are escaped and length-limited                                         |
| XSS                        | React escaping, no `dangerouslySetInnerHTML`, Content Security Policy               |
| Clickjacking               | `X-Frame-Options: DENY` and `frame-ancestors 'none'`                                |
| Malicious uploads          | File type detected from content (magic bytes), size limits, no SVG, sanitized file names, files served with `nosniff` and a sandbox CSP |
| Unauthorized downloads     | Files are private in GridFS; `/api/downloads` checks a paid order, ownership or admin |
| Double payment / payout    | Atomic status transitions and unique indexes                                        |
| Open redirects             | `?next=` only accepts same-site paths                                               |
| Information leaks          | Unexpected errors return a generic message; details stay in server logs            |
| Downgrade                  | HSTS in production                                                                  |

Response headers are configured in `next.config.mjs`.

## Sensitive data

- Seller account numbers are encrypted with **AES-256-GCM** using `ENCRYPTION_KEY`. Only the last
  4 digits are stored in clear text. Sellers only ever see the masked value; admins see the
  full number on the Payouts page to make the transfer.
- Keep `ENCRYPTION_KEY` stable and backed up. Changing it makes saved payout details unreadable,
  and sellers would need to enter them again.
- `.env` is git-ignored. Use your host's secret settings (e.g. Vercel environment variables).

## Operational notes

- `PAYMENT_MODE=simulated` gives products away and is refused in production unless
  `ALLOW_SIMULATED_PAYMENTS=true` is set deliberately.
- Rate limiting relies on the client IP from `x-forwarded-for`, which is trustworthy behind
  Vercel or another proxy. If you self-host without a proxy, put one in front.
- The CSP allows inline scripts because Next.js needs them without a nonce setup. Moving to
  nonce-based CSP in `proxy.js` would tighten it further.
- Consider adding email verification and password reset (needs an email provider), and
  two-factor authentication for admin accounts.
