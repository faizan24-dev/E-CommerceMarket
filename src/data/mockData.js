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
  {
    id: "modern-saas-pitch-deck",
    title: "Modern SaaS Pitch Deck Kit",
    description:
      "A 40-slide investor and sales deck for software startups, with traction charts, pricing tables and product screenshots ready to drop in.",
    price: 29,
    category: "Templates",
    rating: 4.9,
    reviewCount: 312,
    image: unsplash("1541462608143-67571c6738dd", 1400),
    fileType: "Keynote / PowerPoint / Figma",
    seller: "Northbound Type Co.",
    tag: "Editor's Pick",
    includes: [
      "40 fully editable slides",
      "Light and dark themes",
      "Editable charts and device mockups",
      "Keynote, PowerPoint and Figma files",
    ],
  },
  {
    id: "weekly-planner-freebie",
    title: "Weekly Planner Template",
    description:
      "This week's free download: a clean weekly planner with goals, a habit tracker and a Sunday review page. Works in Notion and as a printable PDF.",
    price: 0,
    category: "Templates",
    rating: 4.8,
    reviewCount: 1873,
    image: unsplash("1484480974693-6ca0a78fb36b"),
    fileType: "Notion Template + PDF",
    seller: "Ecommerce Market Studio",
    tag: "Free this week",
    includes: ["Weekly and monthly views", "Habit tracker", "Printable PDF version"],
  },
];

// Product grouped and sold together; the cart applies its 10% bundle discount automatically.
export const bundles = [
  {
    slug: "studio-starter",
    title: "Ultimate Studio Starter Pack",
    subtitle: "Everything you need to pitch and win clients.",
    productIds: [
      "modern-saas-pitch-deck",
      "brand-identity-kit-figma",
      "the-freelance-playbook",
      "ledger-lite-invoicing",
    ],
  },
];

export const freebieProductId = "weekly-planner-freebie";
export const spotlightProductId = "modern-saas-pitch-deck";

// Trust stats row. The rating is calculated from the catalog (see TrustStats) so it
// always matches the reviews shown elsewhere on the site.
export const trustStats = [
  { id: "downloads", value: "15,000+", label: "Digital Downloads Delivered" },
  { id: "rating", label: "Average Customer Rating" },
  { id: "instant", value: "100% Instant", label: "Automated Delivery" },
  { id: "support", value: "24/7", label: "Dedicated Support" },
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
      { label: "About us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Customer reviews", href: "/#reviews" },
      { label: "FAQs", href: "/#faq" },
    ],
  },
];

// ---- About -------------------------------------------------------------------

export const aboutImage = unsplash("1493421419110-74f4e85ba126", 1200);

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

// ---- Reviews -----------------------------------------------------------------

export const testimonials = [
  {
    id: "t1",
    name: "Priya Nair",
    role: "Product designer, Lisbon",
    rating: 5,
    quote:
      "The Brand Identity Kit saved me a week of setup on a client project. Everything is organised exactly how a designer would want it.",
    productId: "brand-identity-kit-figma",
  },
  {
    id: "t2",
    name: "Marcus Tran",
    role: "Indie founder",
    rating: 5,
    quote:
      "I run my whole company out of the Life & Business OS now. It replaced three separate tools and the setup video was genuinely helpful.",
    productId: "notion-life-business-os",
  },
  {
    id: "t3",
    name: "Sofia Martins",
    role: "Freelance illustrator",
    rating: 5,
    quote:
      "The Freelance Playbook finally gave me the confidence to raise my rates. Practical, honest and beautifully written.",
    productId: "the-freelance-playbook",
  },
  {
    id: "t4",
    name: "Daniel Okafor",
    role: "Software engineer",
    rating: 4,
    quote:
      "Focus Flow is the first timer app I've kept using past a week. No account, no subscription, it just works offline.",
    productId: "focus-flow-app",
  },
  {
    id: "t5",
    name: "Hannah Becker",
    role: "Social media manager",
    rating: 5,
    quote:
      "The 3D gradient shapes make every post look premium. I download, drop them into Canva and I'm done in minutes.",
    productId: "fluid-gradients-3d-pack",
  },
  {
    id: "t6",
    name: "Leo Park",
    role: "Studio owner",
    rating: 5,
    quote:
      "Checkout to download took seconds, and the files were exactly as described. It feels like shopping in a design store.",
    productId: "ledger-lite-invoicing",
  },
];

// ---- Blog --------------------------------------------------------------------

export const blogPosts = [
  {
    slug: "pricing-digital-products",
    title: "How to price digital products without underselling your work",
    category: "Guides",
    excerpt:
      "A simple framework for choosing a price that reflects the value you deliver, plus the three mistakes most first-time sellers make.",
    image: unsplash("1460925895917-afdab827c52f", 1200),
    author: "Maren Holt",
    date: "2026-09-18",
    readTime: "6 min read",
    content: [
      "Pricing is the decision most creators agonise over, and the one they most often get wrong. The instinct is to price low so the first sale feels easy. But a low price also tells buyers your work is a small thing.",
      "Start with the outcome, not the hours. A Notion template that saves a founder two hours a week is worth far more than the evening it took to build. Write down the result your product delivers, then ask what that result is worth to the person buying it.",
      "Next, look at the shelf. Compare three to five products your buyer would also consider and place yourself deliberately: cheaper and simpler, or premium and more complete. Sitting awkwardly in the middle rarely works.",
      "Finally, test. Digital products cost nothing to reprice. Raise your price after every handful of sales until conversion visibly drops, then step back slightly. Most sellers are surprised how far they can go.",
    ],
  },
  {
    slug: "building-a-notion-os",
    title: "Inside the studio: how we built a Notion operating system",
    category: "Editorial",
    excerpt:
      "Studio Ordinal walks through the design decisions behind their best-selling Life & Business OS, from database structure to onboarding.",
    image: unsplash("1497032628192-86f99bcd76bc", 1200),
    author: "Studio Ordinal",
    date: "2026-09-10",
    readTime: "8 min read",
    content: [
      "When we started building the Life & Business OS, we gave ourselves one rule: a new user should feel at home within ten minutes. Everything else followed from that.",
      "We cut our first draft from twenty-two databases to twelve. Each one had to earn its place by answering a question a solo founder actually asks every week, like who to follow up with or what is due on Friday.",
      "Relations do the heavy lifting. A single project page pulls in its tasks, client, invoices and content, so nobody has to remember where anything lives.",
      "The final piece was onboarding. A short walkthrough video and a pre-filled example workspace turned out to matter more than any feature we added.",
    ],
  },
  {
    slug: "e-book-covers-that-sell",
    title: "Designing e-book covers that stand out in a crowded grid",
    category: "E-books",
    excerpt:
      "Your cover is shown at thumbnail size far more often than full size. Here's how to design for the grid first.",
    image: unsplash("1481627834876-b7833e8f5570", 1200),
    author: "Field Notes Press",
    date: "2026-08-29",
    readTime: "5 min read",
    content: [
      "Most buyers meet your e-book as a small square in a grid of other small squares. If the title can't be read at that size, the cover isn't doing its job.",
      "Use one strong focal point: a single image, shape or word. Covers that try to illustrate the whole book become noise when shrunk down.",
      "Choose contrast over decoration. A dark title on a light field, or the reverse, will always read better than a clever texture.",
      "Before you publish, place your cover next to ten competitors at thumbnail size. If your eye doesn't land on it first, simplify again.",
    ],
  },
  {
    slug: "selling-figma-templates",
    title: "A beginner's guide to selling Figma templates",
    category: "Templates",
    excerpt:
      "From naming layers to writing a product page, everything you need to turn a design file into a product people buy.",
    image: unsplash("1587440871875-191322ee64b0", 1200),
    author: "Northbound Type Co.",
    date: "2026-08-21",
    readTime: "7 min read",
    content: [
      "A good template is a design file that someone else can understand without you in the room. That means clear page names, tidy layers and components that behave predictably.",
      "Use auto layout everywhere it makes sense. Buyers expect to change a headline without the whole frame breaking.",
      "Include a short getting-started page inside the file itself: which fonts to install, how colours are set up and where to begin.",
      "On your product page, show the template in use. Real-looking mockups convert far better than screenshots of empty frames.",
    ],
  },
  {
    slug: "deep-work-for-creators",
    title: "Deep work for creators: a simple weekly ritual",
    category: "Productivity",
    excerpt:
      "Protecting focused time is the most valuable habit an independent creator can build. Here is a weekly rhythm that holds up.",
    image: unsplash("1488190211105-8b0e65b80b4e", 1200),
    author: "Quietware Labs",
    date: "2026-08-12",
    readTime: "4 min read",
    content: [
      "Every Sunday evening, choose the one piece of work that would make the coming week a success. Write it at the top of your plan.",
      "Block three ninety-minute focus sessions for it before anything else goes on the calendar. Treat them like meetings with your most important client.",
      "During a session, close everything except the work itself. A timer that blocks distracting sites removes the need for willpower.",
      "On Friday, review what moved forward. Small, honest reviews compound into a remarkable year.",
    ],
  },
  {
    slug: "why-vector-packs",
    title: "Why vector packs are a designer's best shortcut",
    category: "Graphics",
    excerpt:
      "Well-made vector assets let small teams ship polished visuals fast. Here's how to choose, customise and combine them.",
    image: unsplash("1523726491678-bf852e717f6a", 1200),
    author: "Linework Studio",
    date: "2026-08-03",
    readTime: "5 min read",
    content: [
      "Vectors scale to any size without losing quality, which makes them ideal for everything from favicons to billboards.",
      "Look for packs with editable strokes and consistent line weights. They are far easier to recolour and mix with your own work.",
      "Customise rather than copy. Changing colours to your palette and combining two or three assets quickly makes a pack feel original.",
      "Always check the licence. Commercial licences let you use assets in client work and products you sell.",
    ],
  },
];

// ---- FAQs --------------------------------------------------------------------

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
