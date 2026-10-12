import "server-only";
import { toOrderDTO } from "../dto.js";
import { Earning, Order, Payout, Product, User } from "../models/index.js";

/** Marketplace-wide numbers for the admin overview. Money in cents. */
export async function getAdminOverview() {
  const [sales, earnings, paidOut, orderCounts, pendingProducts, userCount, sellerCount, recentOrders] =
    await Promise.all([
      Order.aggregate([
        { $match: { status: "paid" } },
        { $unwind: "$items" },
        {
          $group: {
            _id: null,
            orders: { $addToSet: "$_id" },
            itemsSold: { $sum: 1 },
            gmv: { $sum: "$items.price" },
            platformRevenue: { $sum: "$items.commission" },
            sellerEarnings: { $sum: "$items.sellerEarning" },
          },
        },
        { $project: { _id: 0, orders: { $size: "$orders" }, itemsSold: 1, gmv: 1, platformRevenue: 1, sellerEarnings: 1 } },
      ]),
      Earning.aggregate([{ $match: { status: "unpaid" } }, { $group: { _id: null, amount: { $sum: "$net" }, sellers: { $addToSet: "$seller" } } }]),
      Payout.aggregate([{ $group: { _id: null, amount: { $sum: "$amount" }, count: { $sum: 1 } } }]),
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Product.countDocuments({ status: "pending" }),
      User.countDocuments(),
      User.countDocuments({ "seller.status": { $exists: true } }),
      Order.find().sort({ createdAt: -1 }).limit(6).populate("buyer", "name email").lean(),
    ]);

  const ordersByStatus = Object.fromEntries(orderCounts.map((row) => [row._id, row.count]));
  return {
    sales: sales[0] ?? { orders: 0, itemsSold: 0, gmv: 0, platformRevenue: 0, sellerEarnings: 0 },
    owedToSellers: earnings[0]?.amount ?? 0,
    sellersAwaitingPayout: earnings[0]?.sellers.length ?? 0,
    paidOut: paidOut[0]?.amount ?? 0,
    payoutCount: paidOut[0]?.count ?? 0,
    ordersByStatus,
    paymentsToConfirm: (ordersByStatus.awaiting_confirmation ?? 0) + (ordersByStatus.pending_payment ?? 0),
    pendingProducts,
    userCount,
    sellerCount,
    recentOrders: recentOrders.map(toOrderDTO),
  };
}
