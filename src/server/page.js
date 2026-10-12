import "server-only";
import { connection } from "next/server";
import { connectDB } from "./db.js";

/**
 * Call at the top of any page that reads the database. It renders the page per
 * request (never at build time, so stock and prices are always current) and
 * opens the shared MongoDB connection.
 */
export async function preparePageData() {
  await connection();
  await connectDB();
}
