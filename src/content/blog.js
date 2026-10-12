import { unsplash } from "./images.js";

/** Journal articles. Static content: edit here and redeploy. */
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

export function getPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
