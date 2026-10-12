import { z } from "zod";
import { CATEGORY_SLUGS } from "../../config/categories.js";
import { PAYOUT_METHOD_TYPES, PRICE_MAX_CENTS } from "../../config/marketplace.js";
import {
  EMAIL_PATTERN,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_RULE_MESSAGE,
  isStrongEnoughPassword,
} from "../../lib/validation.js";
import { objectId } from "./parse.js";

/*
 * Input schemas for every API endpoint. Strings are typed explicitly, so
 * objects like { "$gt": "" } can never reach a database query (NoSQL injection).
 */

const text = (label, { min = 0, max }) => {
  let schema = z.string({ error: `${label} is required.` }).trim();
  if (min > 0) schema = schema.min(min, min === 1 ? `${label} is required.` : `${label} must be at least ${min} characters.`);
  return schema.max(max, `${label} must be ${max} characters or fewer.`);
};

const email = z
  .string({ error: "Email is required." })
  .trim()
  .toLowerCase()
  .max(254, "Email is too long.")
  .regex(EMAIL_PATTERN, "Please provide a valid email address.");

const newPassword = z
  .string({ error: "Password is required." })
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
  .max(PASSWORD_MAX_LENGTH, `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer.`)
  .refine(isStrongEnoughPassword, PASSWORD_RULE_MESSAGE);

const name = text("Name", { min: NAME_MIN_LENGTH, max: NAME_MAX_LENGTH });

// ---- Auth & account ----------------------------------------------------------

export const signupSchema = z.object({ name, email, password: newPassword });

export const loginSchema = z.object({
  email,
  password: z.string({ error: "Password is required." }).min(1, "Password is required.").max(PASSWORD_MAX_LENGTH),
});

export const profileSchema = z.object({ name });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password.").max(PASSWORD_MAX_LENGTH),
  newPassword,
});

// ---- Seller ------------------------------------------------------------------

export const storeSchema = z.object({
  storeName: text("Store name", { min: 2, max: 60 }),
  bio: text("Bio", { max: 600 }).default(""),
});

export const payoutMethodSchema = z.object({
  type: z.enum(Object.keys(PAYOUT_METHOD_TYPES), { error: "Choose a payout method." }),
  accountHolder: text("Account holder name", { min: 2, max: 100 }),
  provider: text("Bank or provider name", { min: 2, max: 100 }),
  accountNumber: text("Account number", { min: 4, max: 64 }),
  notes: text("Notes", { max: 300 }).default(""),
});

// ---- Products ----------------------------------------------------------------

const price = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Enter a price like 19 or 19.99.")
  .transform((value) => Math.round(Number(value) * 100))
  .refine((cents) => cents <= PRICE_MAX_CENTS, "That price is too high.");

/** Fields of the multipart product form (files are validated separately). */
export const productFieldsSchema = z.object({
  title: text("Title", { min: 3, max: 120 }),
  description: text("Description", { min: 20, max: 5000 }),
  price,
  category: z.enum(CATEGORY_SLUGS, { error: "Choose a category." }),
  includes: z.array(text("Each included item", { min: 1, max: 100 })).max(10, "List at most 10 included items."),
  tag: text("Tag", { max: 30 }).optional(),
});

export const moderationSchema = z.object({
  action: z.enum(["approve", "reject", "unpublish", "feature", "unfeature"]),
  note: text("Note", { max: 500 }).optional(),
});

// ---- Orders & payouts --------------------------------------------------------

export const checkoutSchema = z.object({
  productIds: z
    .array(objectId("product"))
    .min(1, "Your cart is empty.")
    .max(50, "That's too many items for one order.")
    .transform((ids) => [...new Set(ids)]),
});

export const paymentReferenceSchema = z.object({
  reference: text("Transaction reference", { min: 4, max: 120 }),
});

export const orderActionSchema = z.object({
  action: z.enum(["confirm", "cancel"]),
  reason: text("Reason", { max: 300 }).optional(),
});

export const payoutSchema = z.object({
  sellerId: objectId("seller"),
  reference: text("Transfer reference", { min: 3, max: 120 }),
  note: text("Note", { max: 500 }).optional(),
});

// ---- Admin users -------------------------------------------------------------

export const adminUserUpdateSchema = z
  .object({
    role: z.enum(["user", "admin"]).optional(),
    status: z.enum(["active", "suspended"]).optional(),
    sellerStatus: z.enum(["active", "suspended"]).optional(),
  })
  .refine((value) => Object.values(value).some((v) => v !== undefined), "Nothing to update.");
