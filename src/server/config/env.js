import { z } from "zod";
import { AppError } from "../errors.js";

/*
 * Server environment configuration.
 *
 * Every environment-specific value (connection strings, secrets, deployment
 * switches) is read here and nowhere else, then validated once. Business rules
 * that don't change between environments live in src/config instead.
 */

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  DB_NAME: z.string().optional(),

  // 32 random bytes as 64 hex characters. Encrypts seller payout details at rest.
  ENCRYPTION_KEY: z
    .string()
    .regex(/^[0-9a-fA-F]{64}$/, "ENCRYPTION_KEY must be 64 hex characters (32 bytes)"),

  SESSION_TTL_DAYS: z.coerce.number().int().min(1).max(90).default(14),

  // "manual": buyers pay outside the site and an admin confirms the payment.
  // "simulated": orders are marked paid instantly. For local development only.
  PAYMENT_MODE: z.enum(["manual", "simulated"]).default("manual"),
  ALLOW_SIMULATED_PAYMENTS: z.enum(["true", "false"]).default("false"),
  PAYMENT_INSTRUCTIONS: z
    .string()
    .default(
      "Send the order total by bank transfer, then enter the transaction reference below. Your downloads unlock as soon as we confirm the payment.",
    ),
});

let cached;

/** Returns the validated environment. Throws a 500 AppError naming the variables that are wrong. */
export function getEnv() {
  if (cached) return cached;

  const result = schema.safeParse(process.env);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    console.error("[env] invalid configuration:\n  " + problems.join("\n  "));
    throw new AppError(500, `Server is not configured correctly: ${problems.join("; ")}.`);
  }

  const env = result.data;
  if (
    env.NODE_ENV === "production" &&
    env.PAYMENT_MODE === "simulated" &&
    env.ALLOW_SIMULATED_PAYMENTS !== "true"
  ) {
    throw new AppError(
      500,
      "PAYMENT_MODE=simulated gives products away for free and is disabled in production. Use PAYMENT_MODE=manual.",
    );
  }

  cached = Object.freeze({
    ...env,
    isProduction: env.NODE_ENV === "production",
    sessionTtlMs: env.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
  return cached;
}
