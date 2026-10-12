/** "Life & Business OS!" -> "life-business-os" */
export function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Returns a slug not yet used in `field` of `Model`, adding -2, -3... if needed. */
export async function uniqueSlug(Model, field, source, excludeId) {
  const base = slugify(source) || "item";
  for (let attempt = 1; attempt < 50; attempt += 1) {
    const candidate = attempt === 1 ? base : `${base}-${attempt}`;
    const filter = { [field]: candidate };
    if (excludeId) filter._id = { $ne: excludeId };
    if (!(await Model.exists(filter))) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

/** Escapes user input for safe use inside a RegExp (prevents regex injection / ReDoS). */
export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
