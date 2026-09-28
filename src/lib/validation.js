const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateName(value) {
  const name = value.trim();
  if (!name) return "Please enter your full name.";
  if (name.length < 2) return "Name must be at least 2 characters.";
  if (name.length > 60) return "Name must be 60 characters or fewer.";
  return "";
}

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return "Please enter your email address.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email, like you@example.com.";
  return "";
}

export function validateLoginPassword(value) {
  if (!value) return "Please enter your password.";
  return "";
}

export function validateNewPassword(value) {
  if (!value) return "Please create a password.";
  if (value.length < 8) return "Use at least 8 characters.";
  if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) return "Include at least one letter and one number.";
  return "";
}

/** Returns a 0–4 score with a label, used for the sign-up strength meter. */
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

/** Only allow same-origin relative redirects such as "/products". */
export function getSafeRedirect(value, fallback = "/") {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) return value;
  return fallback;
}
