import { createServer } from "node:http";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import next from "next";
import connectDB from "./src/config/db.js";
import { errorHandler, notFound } from "./src/middleware/errorMiddleware.js";
import authRoutes from "./src/routes/authRoutes.js";

/*
 * One server for the whole project:
 *   /api/*       → Express (auth API backed by MongoDB)
 *   everything else → Next.js (pages, assets, hot reload)
 *
 * npm run dev   → development (hot reload, restarts on API changes via nodemon)
 * npm start     → production (run `npm run build` first)
 */

// Same convention as Next.js: values in .env.local win over .env. Either file may be used.
dotenv.config({ path: [".env.local", ".env"], quiet: true });

const dev = !process.argv.includes("--production");
process.env.NODE_ENV = dev ? "development" : "production";

const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(
    `[server] Missing required environment variables: ${missing.join(", ")}. ` +
      "Add them to .env or .env.local in the project root (see .env.example).",
  );
  process.exit(1);
}

const port = Number(process.env.PORT) || 3000;
const allowedOrigins = (process.env.CLIENT_URL ?? `http://localhost:${port}`)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();
const httpServer = createServer(app);
// Passing httpServer lets Next.js attach its hot-reload WebSocket in development.
const nextApp = next({ dev, hostname: "localhost", port, httpServer });
const handleNextRequest = nextApp.getRequestHandler();

app.disable("x-powered-by");

// ---- API -------------------------------------------------------------------
const api = express.Router();

api.use(
  cors({
    origin(origin, callback) {
      // Same-origin and non-browser requests have no Origin header; other sites must be whitelisted.
      callback(null, !origin || allowedOrigins.includes(origin));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
// Body parsing is scoped to /api so it never consumes requests meant for Next.js.
api.use(express.json({ limit: "10kb" }));
api.use(express.urlencoded({ extended: false, limit: "10kb" }));

api.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Ecommerce Market API is running." });
});
api.use("/auth", authRoutes);

api.use(notFound);
api.use(errorHandler);

app.use("/api", api);

// ---- Website ---------------------------------------------------------------
app.use((req, res) => handleNextRequest(req, res));

// ---- Start -----------------------------------------------------------------
await connectDB();
await nextApp.prepare();

httpServer.listen(port, () => {
  console.log(`[server] Ecommerce Market running at http://localhost:${port} (${process.env.NODE_ENV})`);
  console.log(`[server] API available at http://localhost:${port}/api`);
});

process.on("unhandledRejection", (error) => {
  console.error("[server] Unhandled rejection:", error);
  httpServer.close(() => process.exit(1));
});
