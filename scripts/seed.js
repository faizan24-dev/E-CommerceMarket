/*
 * Database seeding.
 *
 *   npm run seed:admin   Creates (or promotes) the admin account from ADMIN_EMAIL,
 *                        ADMIN_PASSWORD and ADMIN_NAME in .env. Safe to re-run.
 *   npm run seed:admin -- --reset-password
 *                        Also resets that admin's password to ADMIN_PASSWORD.
 *   npm run seed:demo    Also loads the demo catalog: the launch products, demo seller
 *                        accounts and a sample PDF for each product. Skips anything
 *                        that already exists. Intended for development databases.
 *
 * Runs under plain Node (see package.json), so it imports server modules by
 * relative path. `--conditions=react-server` lets those modules import "server-only".
 */
import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../src/server/db.js";
import { Product, Session, User } from "../src/server/models/index.js";
import { saveFile } from "../src/server/storage/fileStorage.js";
import { encrypt } from "../src/server/utils/crypto.js";
import { slugify, uniqueSlug } from "../src/server/utils/text.js";
import { demoProducts } from "./demo-catalog.js";

const PLATFORM_STORE = "Ecommerce Market Studio";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set. Add it to .env (see .env.example).`);
  return value;
}

async function seedAdmin() {
  const email = requireEnv("ADMIN_EMAIL").trim().toLowerCase();
  const password = requireEnv("ADMIN_PASSWORD");
  const name = process.env.ADMIN_NAME?.trim() || "Store Admin";
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");

  const store = {
    status: "active",
    storeName: PLATFORM_STORE,
    // Unique, so a second admin doesn't collide with the first admin's store address.
    storeSlug: await uniqueSlug(User, "seller.storeSlug", PLATFORM_STORE),
    bio: "Products made and curated by the Ecommerce Market team.",
  };

  let admin = await User.findOne({ email });
  if (admin) {
    const resetPassword = process.argv.includes("--reset-password");
    admin.role = "admin";
    admin.status = "active";
    admin.seller ??= store;
    if (resetPassword) {
      admin.password = await bcrypt.hash(password, 12);
      admin.passwordChangedAt = new Date();
    }
    await admin.save();
    if (resetPassword) {
      // Sign out every existing session, like a normal password change.
      await Session.deleteMany({ user: admin._id });
      console.log(`[seed] ${email}: admin role ensured and password reset from ADMIN_PASSWORD.`);
    } else {
      console.log(`[seed] ${email} already exists: ensured admin role (password unchanged; add --reset-password to change it).`);
    }
  } else {
    admin = await User.create({ name, email, password: await bcrypt.hash(password, 12), role: "admin", seller: store });
    console.log(`[seed] created admin ${email}.`);
  }
  return admin;
}

/** A small, valid one-page PDF with a title and a few lines of text. */
function makeSamplePdf(lines) {
  const escape = (text) => text.replace(/[\\()]/g, (char) => `\\${char}`).replace(/[^\x20-\x7e]/g, "");
  const content = [
    "BT",
    "/F1 20 Tf",
    "72 740 Td",
    `(${escape(lines[0])}) Tj`,
    "/F1 12 Tf",
    ...lines.slice(1).flatMap((line) => ["0 -26 Td", `(${escape(line)}) Tj`]),
    "ET",
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${Buffer.byteLength(content, "latin1")} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = objects.map((object, index) => {
    const offset = Buffer.byteLength(pdf, "latin1");
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    return offset;
  });
  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, "latin1");
}

/** Demo sellers can't log in (random password) but have a payout method, so the payout flow can be tried. */
async function findOrCreateDemoSeller(storeName) {
  const storeSlug = slugify(storeName);
  const existing = await User.findOne({ "seller.storeSlug": storeSlug });
  if (existing) return existing;

  const accountNumber = `PK00DEMO${String(Math.floor(Math.random() * 1e12)).padStart(12, "0")}`;
  return User.create({
    name: storeName,
    email: `${storeSlug}@demo.invalid`,
    password: await bcrypt.hash(crypto.randomUUID(), 12),
    seller: {
      status: "active",
      storeName,
      storeSlug,
      bio: `${storeName} is a demo seller created by the seed script.`,
      payoutMethod: {
        type: "bank_transfer",
        accountHolder: storeName,
        provider: "Demo Bank",
        accountNumberEncrypted: encrypt(accountNumber),
        accountLast4: accountNumber.slice(-4),
      },
    },
  });
}

async function seedDemoCatalog(admin) {
  let created = 0;
  for (const item of demoProducts) {
    if (await Product.exists({ slug: item.slug })) continue;

    const seller = item.store === PLATFORM_STORE ? admin : await findOrCreateDemoSeller(item.store);
    const filename = `${item.slug}.pdf`;
    const pdf = makeSamplePdf([
      item.title,
      `by ${item.store}`,
      "This is a sample file created by the demo seed script.",
      "Replace it by editing the product in the seller dashboard.",
    ]);
    const fileId = await saveFile({ buffer: pdf, filename, contentType: "application/pdf", visibility: "private", ownerId: seller._id });

    await Product.create({
      slug: item.slug,
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      fileType: item.fileType,
      includes: item.includes,
      tag: item.tag,
      coverImage: { url: item.image },
      file: { fileId, filename, size: pdf.length, contentType: "application/pdf" },
      seller: seller._id,
      status: "published",
      publishedAt: new Date(),
      isFeatured: item.isFeatured,
      rating: item.rating,
      reviewCount: item.reviewCount,
    });
    created += 1;
  }
  console.log(`[seed] demo catalog: ${created} products created, ${demoProducts.length - created} already existed.`);
}

async function main() {
  const mode = process.argv[2];
  if (!["admin", "demo"].includes(mode)) throw new Error('Usage: node scripts/seed.js <admin|demo>');

  await connectDB();
  const admin = await seedAdmin();
  if (mode === "demo") await seedDemoCatalog(admin);
}

main()
  .catch((error) => {
    console.error(`[seed] failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(disconnectDB);
