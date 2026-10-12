import "server-only";
import mongoose from "mongoose";
import { toEarningDTO, toPayoutDTO, toPayoutMethodDTO, toSellerSummaryDTO, toUserDTO } from "../dto.js";
import { conflict, notFound } from "../errors.js";
import { Earning, Payout, Product, User } from "../models/index.js";
import { encrypt } from "../utils/crypto.js";
import { uniqueSlug } from "../utils/text.js";
import { parseInput } from "../validators/parse.js";
import { payoutMethodSchema, storeSchema } from "../validators/schemas.js";

/** Opens a seller shop for an existing account. */
export async function becomeSeller(userId, input) {
  const { storeName, bio } = parseInput(storeSchema, input);
  const user = await User.findById(userId);
  if (!user) throw notFound("Account not found.");
  if (user.seller) throw conflict("You already have a seller shop.");

  user.seller = {
    status: "active",
    storeName,
    storeSlug: await uniqueSlug(User, "seller.storeSlug", storeName),
    bio,
    joinedAt: new Date(),
  };
  await user.save();
  return toUserDTO(user.toObject());
}

/** Updates the public store profile. The store URL stays the same. */
export async function updateStore(userId, input) {
  const { storeName, bio } = parseInput(storeSchema, input);
  const user = await User.findOneAndUpdate(
    { _id: userId, seller: { $exists: true } },
    { "seller.storeName": storeName, "seller.bio": bio },
    { returnDocument: "after" },
  ).lean();
  if (!user) throw notFound("Seller shop not found.");
  return toUserDTO(user);
}

/** Saves where the seller wants to be paid. The account number is encrypted before storage. */
export async function setPayoutMethod(userId, input) {
  const { type, accountHolder, provider, accountNumber, notes } = parseInput(payoutMethodSchema, input);
  const digits = accountNumber.replace(/\s+/g, "");
  const user = await User.findOneAndUpdate(
    { _id: userId, seller: { $exists: true } },
    {
      "seller.payoutMethod": {
        type,
        accountHolder,
        provider,
        accountNumberEncrypted: encrypt(digits),
        accountLast4: digits.slice(-4),
        notes,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  ).lean();
  if (!user) throw notFound("Seller shop not found.");
  return toPayoutMethodDTO(user.seller.payoutMethod);
}

/** The seller's own payout method, masked. */
export async function getPayoutMethod(userId) {
  const user = await User.findById(userId).select("seller.payoutMethod").lean();
  return toPayoutMethodDTO(user?.seller?.payoutMethod);
}

// ---- Public storefront -------------------------------------------------------

export async function getStorefront(storeSlug) {
  if (typeof storeSlug !== "string") return null;
  const user = await User.findOne({ "seller.storeSlug": storeSlug, "seller.status": "active", status: "active" }).lean();
  if (!user) return null;
  return {
    ...toSellerSummaryDTO(user),
    bio: user.seller.bio ?? "",
    joinedAt: user.seller.joinedAt?.toISOString() ?? null,
  };
}

// ---- Seller dashboard --------------------------------------------------------

/** Sales, earnings and balance numbers for the seller overview. All money in cents. */
export async function getSellerOverview(sellerId) {
  sellerId = new mongoose.Types.ObjectId(String(sellerId)); // aggregate() does not cast strings
  const [byStatus, productCounts, topProducts, recent] = await Promise.all([
    Earning.aggregate([
      { $match: { seller: sellerId } },
      {
        $group: {
          _id: "$status",
          sales: { $sum: 1 },
          gross: { $sum: "$gross" },
          commission: { $sum: "$commission" },
          net: { $sum: "$net" },
        },
      },
    ]),
    Product.aggregate([{ $match: { seller: sellerId } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    Earning.aggregate([
      { $match: { seller: sellerId } },
      { $group: { _id: "$product", title: { $last: "$productTitle" }, sales: { $sum: 1 }, net: { $sum: "$net" } } },
      { $sort: { net: -1 } },
      { $limit: 5 },
    ]),
    Earning.find({ seller: sellerId }).sort({ earnedAt: -1 }).limit(5).lean(),
  ]);

  const totals = { sales: 0, gross: 0, commission: 0, net: 0 };
  const balances = { unpaid: 0, paid: 0 };
  for (const row of byStatus) {
    totals.sales += row.sales;
    totals.gross += row.gross;
    totals.commission += row.commission;
    totals.net += row.net;
    balances[row._id] = row.net;
  }

  return {
    totals,
    balances,
    products: Object.fromEntries(productCounts.map((row) => [row._id, row.count])),
    topProducts: topProducts.map((row) => ({ productId: String(row._id), title: row.title, sales: row.sales, net: row.net })),
    recentEarnings: recent.map(toEarningDTO),
  };
}

export async function listSellerEarnings(sellerId, { status = "", page = 1, limit = 25 } = {}) {
  const filter = { seller: sellerId, ...(status && { status }) };
  const [earnings, total] = await Promise.all([
    Earning.find(filter).sort({ earnedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Earning.countDocuments(filter),
  ]);
  return { earnings: earnings.map(toEarningDTO), total, page, pageCount: Math.max(1, Math.ceil(total / limit)) };
}

export async function listSellerPayouts(sellerId) {
  const payouts = await Payout.find({ seller: sellerId }).sort({ paidAt: -1 }).limit(100).lean();
  return payouts.map(toPayoutDTO);
}
