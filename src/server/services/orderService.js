import "server-only";
import { randomBytes } from "node:crypto";
import { COMMISSION_RATE, calculateCommission } from "../../config/marketplace.js";
import { isAdmin, ownsProduct } from "../auth/policies.js";
import { getEnv } from "../config/env.js";
import { toOrderDTO } from "../dto.js";
import { conflict, forbidden, notFound } from "../errors.js";
import { Earning, Order, Product } from "../models/index.js";
import { assertObjectId, parseInput } from "../validators/parse.js";
import { checkoutSchema, orderActionSchema, paymentReferenceSchema } from "../validators/schemas.js";

const UNPAID_STATUSES = ["pending_payment", "awaiting_confirmation"];
const ORDER_NUMBER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I lookalikes

function generateOrderNumber() {
  const bytes = randomBytes(8);
  return "EM-" + Array.from(bytes, (byte) => ORDER_NUMBER_ALPHABET[byte % ORDER_NUMBER_ALPHABET.length]).join("");
}

/** Products the buyer already has in a paid order, or in one still waiting for payment. */
async function findExistingPurchases(buyerId, productIds) {
  const orders = await Order.find({
    buyer: buyerId,
    status: { $in: ["paid", ...UNPAID_STATUSES] },
    "items.product": { $in: productIds },
  })
    .select("status items.product")
    .lean();

  const owned = new Set();
  const pending = new Set();
  for (const order of orders) {
    for (const item of order.items) {
      (order.status === "paid" ? owned : pending).add(String(item.product));
    }
  }
  return { owned, pending };
}

/**
 * Turns the cart into an order. Prices always come from the database, never
 * from the client. Each item records how the price is split: the platform keeps
 * COMMISSION_RATE of a seller's sale and all of a platform-owned (admin) product.
 */
export async function checkout(buyer, input) {
  const { productIds } = parseInput(checkoutSchema, input);

  const products = await Product.find({ _id: { $in: productIds }, status: "published" })
    .populate("seller", "role")
    .lean();

  const found = new Set(products.map((p) => String(p._id)));
  const unavailable = productIds.filter((id) => !found.has(id));
  const withoutFile = products.filter((p) => !p.file?.fileId).map((p) => String(p._id));
  if (unavailable.length || withoutFile.length) {
    throw conflict("Some items in your cart are no longer available, so we removed them. Please review your cart.", {
      details: { unavailableProductIds: [...unavailable, ...withoutFile] },
    });
  }

  const ownProduct = products.find((p) => ownsProduct(buyer, p));
  if (ownProduct) throw conflict(`"${ownProduct.title}" is your own product, so you can't buy it.`);

  const { owned, pending } = await findExistingPurchases(buyer._id, productIds);
  const alreadyOwned = products.find((p) => owned.has(String(p._id)));
  if (alreadyOwned) {
    throw conflict(`You already own "${alreadyOwned.title}". Find it in your library.`, {
      details: { unavailableProductIds: [String(alreadyOwned._id)] },
    });
  }
  const alreadyPending = products.find((p) => pending.has(String(p._id)));
  if (alreadyPending) {
    throw conflict(`"${alreadyPending.title}" is already in an order waiting for payment. Check your orders.`);
  }

  const items = products.map((product) => {
    const rate = product.seller?.role === "admin" ? 1 : COMMISSION_RATE;
    const { commission, sellerEarning } = calculateCommission(product.price, rate);
    return {
      product: product._id,
      seller: product.seller._id,
      title: product.title,
      slug: product.slug,
      coverUrl: product.coverImage?.url,
      fileType: product.fileType,
      price: product.price,
      commissionRate: rate,
      commission,
      sellerEarning,
    };
  });
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const method = total === 0 ? "free" : getEnv().PAYMENT_MODE;
  const isPaidNow = method !== "manual";
  const now = new Date();

  let order;
  for (let attempt = 0; !order; attempt += 1) {
    try {
      order = await Order.create({
        number: generateOrderNumber(),
        buyer: buyer._id,
        items,
        total,
        status: isPaidNow ? "paid" : "pending_payment",
        payment: { method, ...(isPaidNow && { confirmedAt: now }) },
        paidAt: isPaidNow ? now : undefined,
      });
    } catch (error) {
      // Order numbers are random; retry on the (very unlikely) collision.
      if (error.code !== 11000 || attempt >= 3) throw error;
    }
  }

  if (isPaidNow) await fulfillOrder(order);
  return toOrderDTO(order.toObject());
}

/**
 * Runs once an order is paid: credits each seller's earning and counts the sale.
 * The unique index on (order, product) makes this safe to run twice.
 */
async function fulfillOrder(order) {
  const earnedAt = order.paidAt ?? new Date();
  const earnings = order.items
    .filter((item) => item.sellerEarning > 0)
    .map((item) => ({
      seller: item.seller,
      order: order._id,
      orderNumber: order.number,
      product: item.product,
      productTitle: item.title,
      gross: item.price,
      commission: item.commission,
      net: item.sellerEarning,
      earnedAt,
    }));

  if (earnings.length) {
    try {
      await Earning.insertMany(earnings, { ordered: false });
    } catch (error) {
      if (error.code !== 11000 && !error.writeErrors?.every((e) => e.code === 11000)) throw error;
    }
  }

  await Product.bulkWrite(
    order.items.map((item) => ({ updateOne: { filter: { _id: item.product }, update: { $inc: { salesCount: 1 } } } })),
  );
}

// ---- Buyer -------------------------------------------------------------------

export async function listBuyerOrders(buyerId, { page = 1, limit = 20 } = {}) {
  const [orders, total] = await Promise.all([
    Order.find({ buyer: buyerId }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Order.countDocuments({ buyer: buyerId }),
  ]);
  return { orders: orders.map(toOrderDTO), total, page, pageCount: Math.max(1, Math.ceil(total / limit)) };
}

/** An order visible to its buyer or an admin. */
export async function getOrderForViewer(viewer, orderId) {
  assertObjectId(orderId, "order");
  const order = await Order.findById(orderId).populate("buyer", "name email").lean();
  if (!order) throw notFound("Order not found.");
  if (String(order.buyer._id) !== String(viewer._id) && !isAdmin(viewer)) throw notFound("Order not found.");
  return toOrderDTO(order);
}

/** The buyer adds the bank transfer reference so an admin can match the payment. */
export async function submitPaymentReference(buyer, orderId, input) {
  assertObjectId(orderId, "order");
  const { reference } = parseInput(paymentReferenceSchema, input);
  const order = await Order.findOneAndUpdate(
    { _id: orderId, buyer: buyer._id, status: { $in: UNPAID_STATUSES } },
    { status: "awaiting_confirmation", "payment.reference": reference, "payment.submittedAt": new Date() },
    { returnDocument: "after" },
  ).lean();
  if (!order) throw conflict("This order is not waiting for a payment.");
  return toOrderDTO(order);
}

/** Every product the buyer has paid for, newest first, one entry per product. */
export async function getLibrary(buyerId) {
  const orders = await Order.find({ buyer: buyerId, status: "paid" }).sort({ paidAt: -1 }).lean();
  const seen = new Set();
  const entries = [];
  for (const order of orders) {
    for (const item of order.items) {
      const productId = String(item.product);
      if (seen.has(productId)) continue;
      seen.add(productId);
      entries.push({
        productId,
        title: item.title,
        slug: item.slug,
        coverUrl: item.coverUrl ?? null,
        fileType: item.fileType ?? null,
        orderId: String(order._id),
        orderNumber: order.number,
        purchasedAt: (order.paidAt ?? order.createdAt).toISOString(),
      });
    }
  }
  return entries;
}

/** Product ids the user owns. Used to show "In your library" instead of "Add to cart". */
export async function getOwnedProductIds(buyerId) {
  const ids = await Order.distinct("items.product", { buyer: buyerId, status: "paid" });
  return ids.map(String);
}

export async function hasPurchased(buyerId, productId) {
  return Boolean(await Order.exists({ buyer: buyerId, status: "paid", "items.product": productId }));
}

// ---- Admin -------------------------------------------------------------------

export async function listOrdersForAdmin({ status = "", page = 1, limit = 25 } = {}) {
  const filter = status ? { status } : {};
  const [orders, total] = await Promise.all([
    Order.find(filter)
      // Orders needing action are oldest-first so none are forgotten.
      .sort(UNPAID_STATUSES.includes(status) ? { createdAt: 1 } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("buyer", "name email")
      .lean(),
    Order.countDocuments(filter),
  ]);
  return { orders: orders.map(toOrderDTO), total, page, pageCount: Math.max(1, Math.ceil(total / limit)) };
}

/**
 * Admin confirms a manual payment (which unlocks downloads and credits sellers)
 * or cancels an unpaid order. Buyers may cancel their own unpaid orders.
 */
export async function updateOrderStatus(actor, orderId, input) {
  assertObjectId(orderId, "order");
  const { action, reason } = parseInput(orderActionSchema, input);
  const admin = isAdmin(actor);

  if (action === "confirm") {
    if (!admin) throw forbidden("Only an admin can confirm payments.");
    const now = new Date();
    // The status filter makes this atomic: two admins clicking at once can't both fulfil the order.
    const order = await Order.findOneAndUpdate(
      { _id: orderId, status: { $in: UNPAID_STATUSES } },
      { status: "paid", paidAt: now, "payment.confirmedBy": actor._id, "payment.confirmedAt": now },
      { returnDocument: "after" },
    );
    if (!order) throw conflict("This order is not waiting for a payment.");
    await fulfillOrder(order);
    return toOrderDTO(order.toObject());
  }

  const filter = { _id: orderId, status: { $in: UNPAID_STATUSES } };
  if (!admin) filter.buyer = actor._id;
  const order = await Order.findOneAndUpdate(
    filter,
    { status: "cancelled", cancelledAt: new Date(), cancelReason: reason },
    { returnDocument: "after" },
  ).lean();
  if (!order) throw conflict("Only unpaid orders can be cancelled.");
  return toOrderDTO(order);
}
