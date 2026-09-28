import User, { EMAIL_PATTERN, PASSWORD_MIN_LENGTH } from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import ApiError from "../utils/ApiError.js";
import { json, readJson } from "../utils/apiHandler.js";

/*
 * Controllers receive a Web Request and return a Response. They throw ApiError
 * for expected failures; apiHandler (src/utils/apiHandler.js) turns those into
 * `{ success: false, message }` responses.
 */

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

function tokenResponse(user, status) {
  return json({ success: true, token: user.getSignedJwtToken(), user: user.toJSON() }, status);
}

/**
 * @route  POST /api/auth/signup
 * @access Public
 */
export async function registerUser(request) {
  const { name, email, password } = await readJson(request);

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || typeof password !== "string" || !password) {
    throw new ApiError(400, "Please provide your name, email and password.");
  }
  if (!EMAIL_PATTERN.test(email.trim())) {
    throw new ApiError(400, "Please provide a valid email address.");
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new ApiError(400, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) {
    throw new ApiError(400, "An account with this email already exists. Try logging in instead.");
  }

  // Only whitelisted fields are used, so clients cannot set their own role.
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password });
  return tokenResponse(user, 201);
}

/**
 * @route  POST /api/auth/login
 * @access Public
 */
export async function loginUser(request) {
  const { email, password } = await readJson(request);

  if (!isNonEmptyString(email) || typeof password !== "string" || !password) {
    throw new ApiError(400, "Please provide your email and password.");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

  // Same message for unknown email and wrong password, so accounts can't be enumerated.
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  return tokenResponse(user, 200);
}

/**
 * @route  GET /api/auth/me
 * @access Private (Bearer token)
 */
export async function getMe(request) {
  const user = await protect(request);
  return json({ success: true, user: user.toJSON() });
}
