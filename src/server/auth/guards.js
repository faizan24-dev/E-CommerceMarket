import "server-only";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "./session.js";
import { canSell, isAdmin } from "./policies.js";

/*
 * Guards for Server Component pages and layouts. proxy.js already redirects
 * visitors without a session cookie; these perform the real check against the
 * database on every render.
 */

export async function requireUser(returnTo = "/") {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  return user;
}

/** Non-admins get a 404, so the admin area's existence isn't confirmed. */
export async function requireAdmin() {
  const user = await requireUser("/admin");
  if (!isAdmin(user)) notFound();
  return user;
}

/** Users who haven't opened a shop yet are sent to the seller onboarding page. */
export async function requireSeller(returnTo = "/sell") {
  const user = await requireUser(returnTo);
  if (!canSell(user)) redirect("/sell");
  return user;
}
