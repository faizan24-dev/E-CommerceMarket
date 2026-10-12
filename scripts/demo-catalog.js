/*
 * Demo catalog for `npm run seed:demo`: the products the site launched with.
 * Prices are in cents. Each `store` becomes a demo seller account.
 */
export const demoProducts = [
  {
    slug: "notion-life-business-os",
    title: "Life & Business OS for Notion",
    description: "An all-in-one Notion workspace for solo founders: projects, CRM, content calendar, finances and weekly reviews, linked together with smart relations.",
    price: 3900,
    category: "templates",
    fileType: "Notion Template",
    store: "Studio Ordinal",
    tag: "Bestseller",
    rating: 4.9,
    reviewCount: 1284,
    includes: [
      "12 linked databases",
      "Video walkthrough",
      "Free lifetime updates"
    ],
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=75",
    isFeatured: true
  },
  {
    slug: "brand-identity-kit-figma",
    title: "Brand Identity Kit for Figma",
    description: "Launch a cohesive brand in an afternoon. 140+ editable frames covering logo grids, type scales, social templates and a one-page brand guideline.",
    price: 4900,
    category: "templates",
    fileType: "Figma (.fig)",
    store: "Northbound Type Co.",
    tag: "New",
    rating: 4.8,
    reviewCount: 642,
    includes: [
      "140+ frames",
      "Auto-layout components",
      "Commercial license"
    ],
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=75",
    isFeatured: false
  },
  {
    slug: "the-freelance-playbook",
    title: "The Freelance Playbook",
    description: "A practical 212-page guide to pricing, proposals and client systems, written by a designer who scaled from side gigs to a seven-person studio.",
    price: 2400,
    category: "e-books",
    fileType: "PDF + EPUB",
    store: "Maren Holt",
    tag: "Editor's Pick",
    rating: 4.7,
    reviewCount: 918,
    includes: [
      "212 pages",
      "Proposal templates",
      "Pricing calculator sheet"
    ],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=75",
    isFeatured: true
  },
  {
    slug: "designing-calm-interfaces",
    title: "Designing Calm Interfaces",
    description: "Principles and case studies for building products that respect attention: notification design, progressive disclosure and quiet visual hierarchy.",
    price: 1900,
    category: "e-books",
    fileType: "PDF",
    store: "Field Notes Press",
    rating: 4.6,
    reviewCount: 356,
    includes: [
      "148 pages",
      "18 case studies",
      "Printable checklist"
    ],
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=75",
    isFeatured: false
  },
  {
    slug: "focus-flow-app",
    title: "Focus Flow — Deep Work Timer",
    description: "A distraction-free desktop timer that blocks noisy sites, tracks focus sessions and syncs your daily goals, all without an account or subscription.",
    price: 2900,
    category: "software",
    fileType: "macOS / Windows",
    store: "Quietware Labs",
    tag: "Bestseller",
    rating: 4.8,
    reviewCount: 2107,
    includes: [
      "2 device activations",
      "Offline-first",
      "Free v2.x updates"
    ],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=75",
    isFeatured: true
  },
  {
    slug: "ledger-lite-invoicing",
    title: "Ledger Lite — Invoicing & Insights",
    description: "Beautiful invoices, expense tracking and a revenue dashboard for freelancers. Exports to CSV and PDF, and stores everything locally on your machine.",
    price: 5900,
    category: "software",
    fileType: "macOS / Windows",
    store: "Tally & Co.",
    rating: 4.7,
    reviewCount: 488,
    includes: [
      "Unlimited clients",
      "Multi-currency",
      "Lifetime license"
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=75",
    isFeatured: false
  },
  {
    slug: "fluid-gradients-3d-pack",
    title: "Fluid Gradients 3D Shape Pack",
    description: "60 high-resolution abstract 3D forms with soft gradients, ready for hero sections, slide decks and social posts. Includes transparent PNG and SVG.",
    price: 1800,
    category: "vector-packs",
    fileType: "SVG / PNG / AI",
    store: "Soft Matter",
    tag: "Trending",
    rating: 4.9,
    reviewCount: 731,
    includes: [
      "60 shapes",
      "8K resolution",
      "Commercial license"
    ],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=75",
    isFeatured: false
  },
  {
    slug: "hand-drawn-line-illustrations",
    title: "Hand-Drawn Line Illustrations",
    description: "120 minimal line drawings of people, workspaces and everyday objects. Fully editable strokes so you can recolor and resize without losing detail.",
    price: 2200,
    category: "vector-packs",
    fileType: "SVG / AI / Figma",
    store: "Linework Studio",
    tag: "New",
    rating: 4.8,
    reviewCount: 412,
    includes: [
      "120 illustrations",
      "Editable strokes",
      "Figma library"
    ],
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=75",
    isFeatured: false
  },
  {
    slug: "modern-saas-pitch-deck",
    title: "Modern SaaS Pitch Deck Kit",
    description: "A 40-slide investor and sales deck for software startups, with traction charts, pricing tables and product screenshots ready to drop in.",
    price: 2900,
    category: "templates",
    fileType: "Keynote / PowerPoint / Figma",
    store: "Northbound Type Co.",
    tag: "Editor's Pick",
    rating: 4.9,
    reviewCount: 312,
    includes: [
      "40 fully editable slides",
      "Light and dark themes",
      "Editable charts and device mockups",
      "Keynote, PowerPoint and Figma files"
    ],
    image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&w=1400&q=75",
    isFeatured: true
  },
  {
    slug: "weekly-planner-freebie",
    title: "Weekly Planner Template",
    description: "This week's free download: a clean weekly planner with goals, a habit tracker and a Sunday review page. Works in Notion and as a printable PDF.",
    price: 0,
    category: "templates",
    fileType: "Notion Template + PDF",
    store: "Ecommerce Market Studio",
    tag: "Free this week",
    rating: 4.8,
    reviewCount: 1873,
    includes: [
      "Weekly and monthly views",
      "Habit tracker",
      "Printable PDF version"
    ],
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=900&q=75",
    isFeatured: false
  }
];
