import { unsplash } from "./images.js";

/*
 * Marketing copy for the home and about pages. Product data lives in the database;
 * slides and testimonials link to products by slug and skip any that are not published.
 */

// Homepage slider: each slide spotlights one product with a wide, editorial image.
export const heroSlides = [
  {
    productSlug: "notion-life-business-os",
    category: "templates",
    image: unsplash("1506784983877-45594efa4cbe", 2000),
    headline: "Run your whole business from one calm workspace.",
    subline: "Projects, clients, content and finances, linked together in a single Notion system.",
  },
  {
    productSlug: "brand-identity-kit-figma",
    category: "templates",
    image: unsplash("1522542550221-31fd19575a2d", 2000),
    headline: "Launch a polished brand in an afternoon.",
    subline: "140+ editable Figma frames for logos, type, social posts and brand guidelines.",
  },
  {
    productSlug: "focus-flow-app",
    category: "software",
    image: unsplash("1498050108023-c5249f4df085", 2000),
    headline: "Deep work, without the distractions.",
    subline: "A focus timer that blocks noisy sites and tracks your best hours, with no subscription.",
  },
  {
    productSlug: "fluid-gradients-3d-pack",
    category: "vector-packs",
    image: unsplash("1618005182384-a83a8bd57fbe", 2000),
    headline: "Bold 3D shapes for modern visuals.",
    subline: "60 high-resolution gradient forms for hero sections, decks and social posts.",
  },
  {
    productSlug: "the-freelance-playbook",
    category: "e-books",
    image: unsplash("1544716278-ca5e3f4abd8c", 2000),
    headline: "Price, pitch and grow like a studio.",
    subline: "The 212-page guide to proposals, pricing and client systems for independent creatives.",
  },
];

// Feature band shown directly below the hero slider.
export const valueProps = [
  {
    id: "instant",
    title: "Instant Download",
    description: "Your files are ready in your library as soon as payment clears",
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
    title: "Verified, Secure Payments",
    description: "Every payment is verified before your files unlock",
  },
];

// Trust stats row. The rating is calculated from the catalog so it matches the reviews shown elsewhere.
export const trustStats = [
  { id: "downloads", value: "15,000+", label: "Digital Downloads Delivered" },
  { id: "rating", label: "Average Customer Rating" },
  { id: "instant", value: "100% Instant", label: "Automated Delivery" },
  { id: "support", value: "24/7", label: "Dedicated Support" },
];

export const aboutValues = [
  {
    title: "Curated, not crowded",
    description: "Every product is reviewed by our team before it goes live, so you only see work worth buying.",
  },
  {
    title: "Fair to creators",
    description: "Independent makers set their own prices and keep the majority of every sale.",
  },
  {
    title: "Yours for good",
    description: "Pay once, download instantly and keep lifetime access to every update.",
  },
];

export const testimonials = [
  {
    id: "t1",
    name: "Priya Nair",
    role: "Product designer, Lisbon",
    rating: 5,
    quote:
      "The Brand Identity Kit saved me a week of setup on a client project. Everything is organised exactly how a designer would want it.",
    productSlug: "brand-identity-kit-figma",
  },
  {
    id: "t2",
    name: "Marcus Tran",
    role: "Indie founder",
    rating: 5,
    quote:
      "I run my whole company out of the Life & Business OS now. It replaced three separate tools and the setup video was genuinely helpful.",
    productSlug: "notion-life-business-os",
  },
  {
    id: "t3",
    name: "Sofia Martins",
    role: "Freelance illustrator",
    rating: 5,
    quote:
      "The Freelance Playbook finally gave me the confidence to raise my rates. Practical, honest and beautifully written.",
    productSlug: "the-freelance-playbook",
  },
  {
    id: "t4",
    name: "Daniel Okafor",
    role: "Software engineer",
    rating: 4,
    quote:
      "Focus Flow is the first timer app I've kept using past a week. No account, no subscription, it just works offline.",
    productSlug: "focus-flow-app",
  },
  {
    id: "t5",
    name: "Hannah Becker",
    role: "Social media manager",
    rating: 5,
    quote:
      "The 3D gradient shapes make every post look premium. I download, drop them into Canva and I'm done in minutes.",
    productSlug: "fluid-gradients-3d-pack",
  },
  {
    id: "t6",
    name: "Leo Park",
    role: "Studio owner",
    rating: 5,
    quote:
      "Checkout to download took seconds, and the files were exactly as described. It feels like shopping in a design store.",
    productSlug: "ledger-lite-invoicing",
  },
];

export const faqs = [
  {
    question: "How do I receive my files after purchase?",
    answer:
      "Downloads are available the moment checkout completes. You'll find every purchase in your account library, ready to download again at any time.",
  },
  {
    question: "What file formats are included?",
    answer:
      "Each product page lists its exact formats, such as Notion templates, Figma files, PDF and EPUB, or SVG and PNG. Software includes installers for the listed operating systems.",
  },
  {
    question: "Can I use products in commercial projects?",
    answer:
      "Most templates and graphics include a commercial licence for client work and your own projects. Reselling or redistributing the files themselves isn't allowed.",
  },
  {
    question: "Do I get future updates?",
    answer:
      "Yes. When a creator releases an update, it's added to your library automatically at no extra cost.",
  },
  {
    question: "Do I need an account to buy?",
    answer:
      "An account keeps your purchases safe in one place and lets you re-download them on any device. Creating one takes less than a minute.",
  },
  {
    question: "What if a file doesn't work as expected?",
    answer:
      "Contact our support team with your order details. We'll help you get it working or arrange a refund if the product doesn't match its description.",
  },
];
