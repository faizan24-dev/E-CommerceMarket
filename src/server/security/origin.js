import { forbidden } from "../errors.js";

/**
 * CSRF protection for cookie-authenticated requests.
 *
 * Session cookies are SameSite=Lax, which already stops most cross-site
 * submissions. As a second layer, state-changing requests sent by a browser
 * must come from this site: the Origin header (or Sec-Fetch-Site) is checked.
 * Requests without either header come from non-browser clients, which cannot
 * carry a victim's cookies, so they are allowed.
 */
export function assertSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (origin) {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    let originHost;
    try {
      originHost = new URL(origin).host;
    } catch {
      throw forbidden("Cross-site request blocked.");
    }
    if (originHost !== host) throw forbidden("Cross-site request blocked.");
    return;
  }

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    throw forbidden("Cross-site request blocked.");
  }
}
