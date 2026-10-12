// Relative import (not "@/"): this module is also loaded by scripts/seed.js under plain Node.
import { unsplash } from "../content/images.js";

/** Shop categories. A product's `category` field stores the slug. */
export const CATEGORIES = [
  {
    slug: "templates",
    name: "Templates",
    tagline: "Notion, Figma & planning systems",
    image: unsplash("1531403009284-440f080d1e12"),
  },
  {
    slug: "e-books",
    name: "E-books",
    tagline: "Guides from working creators",
    image: unsplash("1512820790803-83ca734da794"),
  },
  {
    slug: "software",
    name: "Software",
    tagline: "Desktop apps & utilities",
    image: unsplash("1517694712202-14dd9538aa97"),
  },
  {
    slug: "vector-packs",
    name: "Vector Packs",
    tagline: "Illustrations, icons & shapes",
    image: unsplash("1561070791-2526d30994b5"),
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((category) => category.slug);

export function getCategory(slug) {
  return CATEGORIES.find((category) => category.slug === slug) ?? null;
}
