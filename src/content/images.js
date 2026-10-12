/** Builds an Unsplash CDN URL (allowed in next.config.mjs). */
export const unsplash = (id, width = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`;

export const authImage = unsplash("1542435503-956c469947f6", 1200);
export const sellerImage = unsplash("1542744094-3a31f272c490", 1200);
export const aboutImage = unsplash("1493421419110-74f4e85ba126", 1200);
