import "server-only";
import mongoose from "mongoose";
import { toPayoutDTO, toPayoutMethodDTO } from "../dto.js";
import { conflict, notFound } from "../errors.js";
import { Earning, Payout, User } from "../models/index.js";
import { decrypt } from "../utils/crypto.js";
import { parseInput } from "../validators/parse.js";
import { payoutSchema } from "../validators/schemas.js";

const PAYOUT_METHOD_SECRET = "+seller.payoutMethod.accountNumberEncrypted";

/**
 * Every seller who is owed money, with the full payout details an admin needs
 * to send a manual transfer. Admin only: this decrypts bank account numbers.
 */
export async function listSellerBalances() {
  const balances = await Earning.aggregate([
    { $match: { status: "unpaid" } },
    { $group: { _id: "$seller", amount: { $sum: "$net" }, count: { $sum: 1 }, oldest: { $min: "$earnedAt" } } },
    { $sort: { amount: -1 } },
  ]);
  if (!balances.length) return [];

  const sellers = await User.find({ _id: { $in: balances.map((b) => b._id) } })
    // "+field" alone keeps every default field and adds the encrypted one. Listing "seller"
    // as well would collide with the nested path in MongoDB's projection.
    .select(PAYOUT_METHOD_SECRET)
    .lean();
  const byId = new Map(sellers.map((s) => [String(s._id), s]));

  return balances.map((balance) => {
    const seller = byId.get(String(balance._id));
    const method = seller?.seller?.payoutMethod;
    return {
      sellerId: String(balance._id),
      name: seller?.name ?? "Deleted user",
      email: seller?.email ?? "",
      storeName: seller?.seller?.storeName ?? "",
      sellerStatus: seller?.seller?.status ?? null,
      amount: balance.amount,
      earningsCount: balance.count,
      oldestEarningAt: balance.oldest?.toISOString() ?? null,
      payoutMethod: method ? toPayoutMethodDTO(method, { accountNumber: decrypt(method.accountNumberEncrypted) }) : null,
    };
  });
}

/**
 * Records that the admin has sent a seller their money. Every unpaid earning is
 * claimed for this payout first, and the amount is the sum of what was actually
 * claimed, so concurrent sales or double clicks can never pay an earning twice.
 */
export async function recordPayout(admin, input) {
  const { sellerId, reference, note } = parseInput(payoutSchema, input);

  const seller = await User.findById(sellerId).select("name seller").lean();
  if (!seller?.seller) throw notFound("Seller not found.");
  const method = seller.seller.payoutMethod;
  if (!method) throw conflict("This seller hasn't added a payout method yet.");

  const payoutId = new mongoose.Types.ObjectId();
  const sellerObjectId = new mongoose.Types.ObjectId(sellerId);
  const claim = await Earning.updateMany(
    { seller: sellerObjectId, status: "unpaid" },
    { status: "paid", payout: payoutId },
  );
  if (!claim.modifiedCount) throw conflict("This seller has no unpaid earnings.");

  const [claimed] = await Earning.aggregate([
    { $match: { payout: payoutId } },
    { $group: { _id: null, amount: { $sum: "$net" }, count: { $sum: 1 } } },
  ]);

  try {
    const payout = await Payout.create({
      _id: payoutId,
      seller: sellerObjectId,
      amount: claimed.amount,
      earningsCount: claimed.count,
      method: {
        type: method.type,
        provider: method.provider,
        accountHolder: method.accountHolder,
        accountLast4: method.accountLast4,
      },
      reference,
      note,
      paidBy: admin._id,
    });
    return toPayoutDTO(payout.toObject());
  } catch (error) {
    // Release the claimed earnings so the payout can be retried.
    await Earning.updateMany({ payout: payoutId }, { status: "unpaid", $unset: { payout: 1 } });
    throw error;
  }
}

export async function listPayouts({ page = 1, limit = 25 } = {}) {
  const [payouts, total] = await Promise.all([
    Payout.find().sort({ paidAt: -1 }).skip((page - 1) * limit).limit(limit).populate("seller", "name seller.storeName seller.storeSlug").lean(),
    Payout.countDocuments(),
  ]);
  return { payouts: payouts.map(toPayoutDTO), total, page, pageCount: Math.max(1, Math.ceil(total / limit)) };
}
