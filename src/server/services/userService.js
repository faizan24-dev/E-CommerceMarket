import "server-only";
import { toUserDTO } from "../dto.js";
import { badRequest, notFound } from "../errors.js";
import { User } from "../models/index.js";
import { adminUserUpdateSchema, profileSchema } from "../validators/schemas.js";
import { parseInput } from "../validators/parse.js";
import { escapeRegex } from "../utils/text.js";
import { revokeAllSessions } from "./sessionService.js";

export async function updateProfile(userId, input) {
  const { name } = parseInput(profileSchema, input);
  const user = await User.findByIdAndUpdate(userId, { name }, { returnDocument: "after" }).lean();
  if (!user) throw notFound("Account not found.");
  return toUserDTO(user);
}

// ---- Admin -------------------------------------------------------------------

const USER_FILTERS = {
  all: {},
  admins: { role: "admin" },
  sellers: { "seller.status": { $exists: true } },
  suspended: { status: "suspended" },
};

export async function listUsers({ q = "", filter = "all", page = 1, limit = 25 } = {}) {
  const query = { ...(USER_FILTERS[filter] ?? {}) };
  const needle = q.trim().slice(0, 80);
  if (needle) {
    const pattern = new RegExp(escapeRegex(needle), "i");
    query.$or = [{ name: pattern }, { email: pattern }, { "seller.storeName": pattern }];
  }

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    User.countDocuments(query),
  ]);
  return { users: users.map(toUserDTO), total, page, pageCount: Math.max(1, Math.ceil(total / limit)) };
}

/** Changes a user's role or account/seller status. Admins can't lock themselves out. */
export async function updateUserAsAdmin(admin, userId, input) {
  const { role, status, sellerStatus } = parseInput(adminUserUpdateSchema, input);

  if (String(admin._id) === String(userId) && (role === "user" || status === "suspended")) {
    throw badRequest("You can't remove your own admin access or suspend your own account.");
  }

  const user = await User.findById(userId);
  if (!user) throw notFound("User not found.");

  if (role) user.role = role;
  if (status) user.status = status;
  if (sellerStatus) {
    if (!user.seller) throw badRequest("This user hasn't opened a seller shop.");
    user.seller.status = sellerStatus;
  }
  await user.save();

  // A suspended account is signed out everywhere immediately.
  if (status === "suspended") await revokeAllSessions(user._id);
  return toUserDTO(user.toObject());
}
