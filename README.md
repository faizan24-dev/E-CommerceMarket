# Ecommerce Market

A digital-products marketplace (templates, e-books, software, vector packs) with a Faire-inspired
editorial UI and a MongoDB-backed auth API, all in **one Next.js project**.

- **Website:** Next.js 16 (App Router, JavaScript), Tailwind CSS v4, `lucide-react`, `framer-motion`
- **API:** Next.js Route Handlers in `src/app/api`, Mongoose 9, JWT (`jsonwebtoken`), `bcryptjs`

The API runs as part of the Next.js app, so it works the same locally and on Vercel (where each
API route becomes a serverless function).

## Getting started

```bash
npm install
cp .env.example .env         # then fill in MONGO_URI and JWT_SECRET
npm run dev
```

Open http://localhost:3000. Check the API and database with http://localhost:3000/api/health.

| Script          | Purpose                                  |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Website + API with hot reload            |
| `npm run build` | Production build                         |
| `npm start`     | Serve the production build               |
| `npm run lint`  | Run ESLint                               |

### Environment variables (`.env`)

| Variable     | Purpose                                   |
| ------------ | ----------------------------------------- |
| `MONGO_URI`  | MongoDB connection string                 |
| `DB_NAME`    | Database name (`ecommercemarket`)         |
| `JWT_SECRET` | Long random string used to sign tokens    |
| `JWT_EXPIRE` | Token lifetime, e.g. `7d`                 |

## Deploying to Vercel

1. **Environment variables:** in Vercel → Project → Settings → Environment Variables, add
   `MONGO_URI`, `DB_NAME`, `JWT_SECRET` and `JWT_EXPIRE` (same values as `.env`) for **Production**
   (and Preview if you use it). The `.env` file itself is not uploaded because it is git-ignored.
2. **MongoDB Atlas access:** Vercel's servers don't have fixed IP addresses. In Atlas →
   Network Access, add `0.0.0.0/0` (allow access from anywhere), or use the MongoDB Atlas
   integration for Vercel. Without this the database connection is refused.
3. **Redeploy** after changing environment variables. They only apply to new deployments.
4. Open `https://<your-app>.vercel.app/api/health`. It should return
   `{ "success": true, ..., "database": "connected" }`. If not, the `message` says what is wrong
   (for example a missing variable or blocked database access).

## Structure

```
src/
├── app/                        # Pages and API routes
│   ├── layout.js, globals.css
│   ├── page.jsx                # Home: product slider, categories, featured, value props
│   ├── products/, login/, signup/
│   └── api/
│       ├── auth/signup/route.js    # POST /api/auth/signup
│       ├── auth/login/route.js     # POST /api/auth/login
│       ├── auth/me/route.js        # GET  /api/auth/me (Bearer token)
│       ├── health/route.js         # GET  /api/health (also checks the database)
│       └── [...slug]/route.js      # JSON 404 for unknown /api paths
├── components/                 # Header, SearchPanel, AccountMenu, CartDrawer, LogoutOverlay…
│   ├── home/                   # Hero, HeroSlider, CategoryGrid, FeaturedProducts, ValueProps, SellerBanner
│   └── auth/                   # AuthLayout, LoginForm, SignupForm, FormField
├── context/                    # AuthContext (calls the API), CartContext
├── data/mockData.js            # Products, categories, hero slides
├── hooks/, lib/                # useOverlay, api.js (fetch wrapper), catalog, validation
│
├── config/db.js                # Cached Mongoose connection (reused across serverless calls)
├── models/User.js              # Schema, bcrypt pre-save hook, matchPassword, getSignedJwtToken
├── controllers/authController.js   # registerUser, loginUser, getMe
├── middleware/                 # authMiddleware (protect, authorize), errorMiddleware
└── utils/                      # ApiError, apiHandler (DB connect + error handling, JSON body parsing)
```

## API

All responses are JSON. Errors always look like `{ "success": false, "message": "..." }`.

| Method | Endpoint           | Access     | Body                        | Success                         |
| ------ | ------------------ | ---------- | --------------------------- | ------------------------------- |
| POST   | `/api/auth/signup` | Public     | `{ name, email, password }` | `201 { success, token, user }`  |
| POST   | `/api/auth/login`  | Public     | `{ email, password }`       | `200 { success, token, user }`  |
| GET    | `/api/auth/me`     | Bearer JWT | —                           | `200 { success, user }`         |
| GET    | `/api/health`      | Public     | —                           | `200 { success, database }`     |

- `400` for missing or invalid fields, or an email that is already registered.
- `401` for wrong credentials (same message for unknown email and wrong password), or a missing, invalid
  or expired token.
- `500` with a clear message if an environment variable is missing or the database can't be reached.

`user` looks like `{ id, name, email, role, createdAt, updatedAt }`. The password is never returned.

### How the frontend calls it

`src/context/AuthContext.js` uses `src/lib/api.js`, a small `fetch` wrapper with relative `/api/...` paths:

```js
import { apiRequest } from "@/lib/api";

await apiRequest("/auth/signup", { method: "POST", body: { name, email, password } });
const { token, user } = await apiRequest("/auth/login", { method: "POST", body: { email, password } });
const { user } = await apiRequest("/auth/me", { token });
```

After sign-up the user is sent to the login page. The JWT and user are stored in localStorage
(`em_auth`) and re-validated with `/api/auth/me` on page load; a rejected token signs the user out.

## Notes

- Passwords are hashed with bcrypt (12 rounds). Clients can't set `role` at signup, and inputs are
  type-checked to block NoSQL operator injection. JSON bodies are capped at 10 KB.
- Checkout is simulated. Carts of 3+ items get a 10% bundle discount (`CartContext.js`).
- Product images come from Unsplash (`images.unsplash.com` is allowed in `next.config.mjs`).
- Before going live, consider rate limiting the auth routes (e.g. with Vercel Firewall rules).
