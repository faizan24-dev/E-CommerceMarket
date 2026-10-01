const unsplash = (id, width = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`;

export const categories = [
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

export const products = [
  {
    id: "notion-life-business-os",
    title: "Life & Business OS for Notion",
    description:
      "An all-in-one Notion workspace for solo founders: projects, CRM, content calendar, finances and weekly reviews, linked together with smart relations.",
    price: 39,
    category: "Templates",
    rating: 4.9,
    reviewCount: 1284,
    image: unsplash("1506784983877-45594efa4cbe"),
    fileType: "Notion Template",
    seller: "Studio Ordinal",
    tag: "Bestseller",
    includes: ["12 linked databases", "Video walkthrough", "Free lifetime updates"],
  },
  {
    id: "brand-identity-kit-figma",
    title: "Brand Identity Kit for Figma",
    description:
      "Launch a cohesive brand in an afternoon. 140+ editable frames covering logo grids, type scales, social templates and a one-page brand guideline.",
    price: 49,
    category: "Templates",
    rating: 4.8,
    reviewCount: 642,
    image: unsplash("1522542550221-31fd19575a2d"),
    fileType: "Figma (.fig)",
    seller: "Northbound Type Co.",
    tag: "New",
    includes: ["140+ frames", "Auto-layout components", "Commercial license"],
  },
  {
    id: "the-freelance-playbook",
    title: "The Freelance Playbook",
    description:
      "A practical 212-page guide to pricing, proposals and client systems, written by a designer who scaled from side gigs to a seven-person studio.",
    price: 24,
    category: "E-books",
    rating: 4.7,
    reviewCount: 918,
    image: unsplash("1544716278-ca5e3f4abd8c"),
    fileType: "PDF + EPUB",
    seller: "Maren Holt",
    tag: "Editor's Pick",
    includes: ["212 pages", "Proposal templates", "Pricing calculator sheet"],
  },
  {
    id: "designing-calm-interfaces",
    title: "Designing Calm Interfaces",
    description:
      "Principles and case studies for building products that respect attention: notification design, progressive disclosure and quiet visual hierarchy.",
    price: 19,
    category: "E-books",
    rating: 4.6,
    reviewCount: 356,
    image: unsplash("1455390582262-044cdead277a"),
    fileType: "PDF",
    seller: "Field Notes Press",
    tag: null,
    includes: ["148 pages", "18 case studies", "Printable checklist"],
  },
  {
    id: "focus-flow-app",
    title: "Focus Flow — Deep Work Timer",
    description:
      "A distraction-free desktop timer that blocks noisy sites, tracks focus sessions and syncs your daily goals, all without an account or subscription.",
    price: 29,
    category: "Software",
    rating: 4.8,
    reviewCount: 2107,
    image: unsplash("1498050108023-c5249f4df085"),
    fileType: "macOS / Windows",
    seller: "Quietware Labs",
    tag: "Bestseller",
    includes: ["2 device activations", "Offline-first", "Free v2.x updates"],
  },
  {
    id: "ledger-lite-invoicing",
    title: "Ledger Lite — Invoicing & Insights",
    description:
      "Beautiful invoices, expense tracking and a revenue dashboard for freelancers. Exports to CSV and PDF, and stores everything locally on your machine.",
    price: 59,
    category: "Software",
    rating: 4.7,
    reviewCount: 488,
    image: unsplash("1551288049-bebda4e38f71"),
    fileType: "macOS / Windows",
    seller: "Tally & Co.",
    tag: null,
    includes: ["Unlimited clients", "Multi-currency", "Lifetime license"],
  },
  {
    id: "fluid-gradients-3d-pack",
    title: "Fluid Gradients 3D Shape Pack",
    description:
      "60 high-resolution abstract 3D forms with soft gradients, ready for hero sections, slide decks and social posts. Includes transparent PNG and SVG.",
    price: 18,
    category: "Vector Packs",
    rating: 4.9,
    reviewCount: 731,
    image: unsplash("1618005182384-a83a8bd57fbe"),
    fileType: "SVG / PNG / AI",
    seller: "Soft Matter",
    tag: "Trending",
    includes: ["60 shapes", "8K resolution", "Commercial license"],
  },
  {
    id: "hand-drawn-line-illustrations",
    title: "Hand-Drawn Line Illustrations",
    description:
      "120 minimal line drawings of people, workspaces and everyday objects. Fully editable strokes so you can recolor and resize without losing detail.",
    price: 22,
    category: "Vector Packs",
    rating: 4.8,
    reviewCount: 412,
    image: unsplash("1558655146-9f40138edfeb"),
    fileType: "SVG / AI / Figma",
    seller: "Linework Studio",
    tag: "New",
    includes: ["120 illustrations", "Editable strokes", "Figma library"],
  },
];

// Homepage slider: each slide spotlights one product with a wide, editorial image.
export const heroSlides = [
  {
    productId: "notion-life-business-os",
    image: unsplash("1506784983877-45594efa4cbe", 2000),
    headline: "Run your whole business from one calm workspace.",
    subline: "Projects, clients, content and finances, linked together in a single Notion system.",
  },
  {
    productId: "brand-identity-kit-figma",
    image: unsplash("1522542550221-31fd19575a2d", 2000),
    headline: "Launch a polished brand in an afternoon.",
    subline: "140+ editable Figma frames for logos, type, social posts and brand guidelines.",
  },
  {
    productId: "focus-flow-app",
    image: unsplash("1498050108023-c5249f4df085", 2000),
    headline: "Deep work, without the distractions.",
    subline: "A focus timer that blocks noisy sites and tracks your best hours, with no subscription.",
  },
  {
    productId: "fluid-gradients-3d-pack",
    image: unsplash("1618005182384-a83a8bd57fbe", 2000),
    headline: "Bold 3D shapes for modern visuals.",
    subline: "60 high-resolution gradient forms for hero sections, decks and social posts.",
  },
  {
    productId: "the-freelance-playbook",
    image: unsplash("1544716278-ca5e3f4abd8c", 2000),
    headline: "Price, pitch and grow like a studio.",
    subline: "The 212-page guide to proposals, pricing and client systems for independent creatives.",
  },
];
export const authImage = unsplash("1542435503-956c469947f6", 1200);
export const sellerImage = unsplash("1542744094-3a31f272c490", 1200);

// Feature banner shown directly below the hero slider.
export const valueProps = [
  {
    id: "instant",
    title: "Instant Download",
    description: "Get your digital products instantly—no waiting, no delays",
  },
  {
    id: "quality",
    title: "Premium Quality Products",
    description: "Instant access to premium digital products",
  },
  {
    id: "support",
    title: "24/7 Friendly Support",
    description: "Our support team will always be ready to help you online",
  },
  {
    id: "secure",
    title: "100% Safe & Secure Payment",
    description: "We ensure secure payment and accept all major credit cards",
  },
];

export const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/products" },
      ...categories.map((c) => ({ label: c.name, href: `/products?category=${c.slug}` })),
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Create account", href: "/signup" },
      { label: "Sell on Ecommerce Market", href: "/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Featured products", href: "/#featured" },
      { label: "Browse categories", href: "/#categories" },
      { label: "Why Ecommerce Market", href: "/#why-us" },
    ],
  },
];
