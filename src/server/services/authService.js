import "server-only";
import bcrypt from "bcryptjs";
import { conflict, forbidden, unauthorized } from "../errors.js";
import { User } from "../models/index.js";
import { changePasswordSchema, loginSchema, signupSchema } from "../validators/schemas.js";
import { parseInput } from "../validators/parse.js";
import { revokeOtherSessions } from "./sessionService.js";

const SALT_ROUNDS = 12;

export function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Compared against when an email isn't registered, so a login attempt takes the
// same time whether or not the account exists (prevents account enumeration by timing).
let dummyHashPromise;
const getDummyHash = () => (dummyHashPromise ??= bcrypt.hash("timing-equalizer", SALT_ROUNDS));

/** Creates a buyer account. New accounts are never admins, whatever the request contains. */
export async function registerUser(input) {
  const { name, email, password } = parseInput(signupSchema, input);

  if (await User.exists({ email })) {
    throw conflict("An account with this email already exists. Try logging in instead.");
  }
  return User.create({ name, email, password: await hashPassword(password) });
}

/** Verifies credentials and returns the user. The same error is used for unknown email and wrong password. */
export async function authenticate(input) {
  const { email, password } = parseInput(loginSchema, input);

  const user = await User.findOne({ email }).select("+password").lean();
  const isValid = await bcrypt.compare(password, user?.password ?? (await getDummyHash()));
  if (!user || !isValid) throw unauthorized("Invalid email or password.");
  if (user.status !== "active") {
    throw forbidden("This account has been suspended. Please contact support.");
  }

  await User.updateOne({ _id: user._id }, { lastLoginAt: new Date() });
  delete user.password;
  return user;
}

/** Changes the password and signs out every other session (e.g. a stolen one). */
export async function changePassword(userId, input, currentSessionId) {
  const { currentPassword, newPassword } = parseInput(changePasswordSchema, input);

  const user = await User.findById(userId).select("+password");
  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    throw unauthorized("Your current password is incorrect.");
  }
  if (await bcrypt.compare(newPassword, user.password)) {
    throw conflict("Choose a password you haven't used for this account.");
  }

  user.password = await hashPassword(newPassword);
  user.passwordChangedAt = new Date();
  await user.save();
  await revokeOtherSessions(userId, currentSessionId);
}
