/*
 * Validation rules shared by client forms and the API, so both enforce the
 * same limits. Client validators return an error message or "".
 */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 60;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128; // bcrypt ignores bytes past 72; this also bounds hashing cost
export const PASSWORD_RULE_MESSAGE = "Include at least one letter and one number.";

export function isStrongEnoughPassword(value) {
  return /[a-zA-Z]/.test(value) && /\d/.test(value);
}

export function validateName(value) {
  const name = value.trim();
  if (!name) return "Please enter your full name.";
  if (name.length < NAME_MIN_LENGTH) return `Name must be at least ${NAME_MIN_LENGTH} characters.`;
  if (name.length > NAME_MAX_LENGTH) return `Name must be ${NAME_MAX_LENGTH} characters or fewer.`;
  return "";
}

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return "Please enter your email address.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email, like you@example.com.";
  return "";
}

export function validateLoginPassword(value) {
  return value ? "" : "Please enter your password.";
}

export function validateNewPassword(value) {
  if (!value) return "Please create a password.";
  if (value.length < PASSWORD_MIN_LENGTH) return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  if (value.length > PASSWORD_MAX_LENGTH) return `Use ${PASSWORD_MAX_LENGTH} characters or fewer.`;
  if (!isStrongEnoughPassword(value)) return PASSWORD_RULE_MESSAGE;
  return "";
}

/** Returns a 0-4 score with a label, used for the sign-up strength meter. */
export function getPasswordStrength(value) {
  if (!value) return { score: 0, label: "" };
  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value) && /[^a-zA-Z0-9]/.test(value)) score += 1;
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] };
}

/** Only allows same-origin relative redirects such as "/products", never "//evil.com". */
export function getSafeRedirect(value, fallback = "/") {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")) {
    return value;
  }
  return fallback;
}
