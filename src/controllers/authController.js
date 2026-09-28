import User, { EMAIL_PATTERN, PASSWORD_MIN_LENGTH } from "../models/User.js";
import ApiError from "../utils/ApiError.js";

/*
 * Express 5 forwards rejected promises from async handlers to the error
 * middleware automatically, so these controllers throw ApiError instead of
 * wrapping every body in try/catch.
 */

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

function sendTokenResponse(res, user, statusCode) {
  res.status(statusCode).json({
    success: true,
    token: user.getSignedJwtToken(),
    user: user.toJSON(),
  });
}

/**
 * @route  POST /api/auth/signup
 * @access Public
 */
export async function registerUser(req, res) {
  const { name, email, password } = req.body ?? {};

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
  sendTokenResponse(res, user, 201);
}

/**
 * @route  POST /api/auth/login
 * @access Public
 */
export async function loginUser(req, res) {
  const { email, password } = req.body ?? {};

  if (!isNonEmptyString(email) || typeof password !== "string" || !password) {
    throw new ApiError(400, "Please provide your email and password.");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

  // Same message for unknown email and wrong password, so accounts can't be enumerated.
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  sendTokenResponse(res, user, 200);
}

/**
 * @route  GET /api/auth/me
 * @access Private
 */
export async function getMe(req, res) {
  res.status(200).json({ success: true, user: req.user.toJSON() });
}
