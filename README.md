# Ecommerce Market

A digital-products marketplace (templates, e-books, software, vector packs) with a Faire-inspired
editorial UI and a MongoDB-backed auth API, all in **one project** served by **one server**.

- **Website:** Next.js 16 (App Router, JavaScript), Tailwind CSS v4, `lucide-react`, `framer-motion`
- **API:** Express 5, Mongoose 9, JWT (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`

`server.js` starts a single server: requests to `/api/*` go to Express, everything else goes to Next.js.

## Getting started

```bash
npm install
cp .env.example .env         # then fill in MONGO_URI and JWT_SECRET
npm run dev
```

Open http://localhost:3000. The API is at http://localhost:3000/api (try `/api/health`).

| Script          | Purpose                                                          |
| --------------- | ---------------------------------------------------------------- |
| `npm run dev`   | Website + API with hot reload (nodemon restarts on API changes)  |
| `npm run build` | Production build of the website                                  |
| `npm start`     | Serve website + API in production mode (after `npm run build`)   |
| `npm run lint`  | Run ESLint                                                       |

### Environment variables (`.env`)

| Variable     | Purpose                                                            |
| ------------ | ------------------------------------------------------------------ |
| `PORT`       | Port for the combined server (default `3000`)                      |
| `CLIENT_URL` | Extra origins allowed to call `/api` from another domain (CORS)    |
| `MONGO_URI`  | MongoDB connection string                                          |
| `DB_NAME`    | Database name (`ecommercemarket`)                                  |
| `JWT_SECRET` | Long random string used to sign tokens                             |
| `JWT_EXPIRE` | Token lifetime, e.g. `7d`                                          |

## Structure

```
.
├── server.js                  # One server: Express API on /api + Next.js for everything else
├── .env / .env.example
└── src/
    ├── app/                   # Next.js pages
    │   ├── layout.js, globals.css
    │   ├── page.jsx           # Home: product slider, categories, featured, value props
    │   ├── products/page.jsx  # Shop + search results (?q=&category=)
    │   ├── products/[id]/     # Product detail
    │   ├── login/, signup/
    ├── components/            # Header, SearchPanel, AccountMenu, CartDrawer, ProductCard, Footer…
    │   ├── home/              # Hero, HeroSlider, CategoryGrid, FeaturedProducts, ValueProps, SellerBanner
    │   └── auth/              # AuthLayout, LoginForm, SignupForm, FormField
    ├── context/               # AuthContext (calls the API), CartContext
    ├── data/mockData.js       # Products, categories, hero slides
    ├── hooks/, lib/           # useOverlay, api.js (fetch wrapper), catalog, validation
    │
    ├── config/db.js           # API: Mongoose connection
    ├── models/User.js         # API: schema, bcrypt pre-save hook, matchPassword, getSignedJwtToken
    ├── controllers/authController.js
    ├── middleware/            # API: authMiddleware (protect, authorize), errorMiddleware
    ├── routes/authRoutes.js
    └── utils/ApiError.js
```

## API

All responses are JSON. Errors always look like `{ "success": false, "message": "..." }`.

| Method | Endpoint           | Access    | Body                          | Success                          |
| ------ | ------------------ | --------- | ----------------------------- | -------------------------------- |
| POST   | `/api/auth/signup` | Public    | `{ name, email, password }`   | `201 { success, token, user }`   |
| POST   | `/api/auth/login`  | Public    | `{ email, password }`         | `200 { success, token, user }`   |
| GET    | `/api/auth/me`     | Bearer JWT| —                             | `200 { success, user }`          |
| GET    | `/api/health`      | Public    | —                             | `200 { success, message }`       |

- `400` for missing or invalid fields, or an email that is already registered.
- `401` for wrong credentials (same message for unknown email and wrong password), or a missing, invalid
  or expired token.

`user` looks like `{ id, name, email, role, createdAt, updatedAt }`. The password is never returned.

### How the frontend calls it

`src/context/AuthContext.js` uses `src/lib/api.js`, a small `fetch` wrapper. Because the API runs on
the same server, paths are relative (`/api/...`) and no CORS setup is needed:

```js
import { apiRequest } from "@/lib/api";

const { token, user } = await apiRequest("/auth/signup", {
  method: "POST",
  body: { name, email, password },
});

const { token, user } = await apiRequest("/auth/login", {
  method: "POST",
  body: { email, password },
});

const { user } = await apiRequest("/auth/me", { token });
```

The JWT and user are stored in localStorage (`em_auth`) and re-validated with `/api/auth/me` on page
load; a rejected token signs the user out automatically.

With `axios` instead:

```js
import axios from "axios";

const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("em_auth") ?? "null")?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const { data } = await api.post("/auth/login", { email, password }); // data.token, data.user
```

## Notes

- Passwords are hashed with bcrypt (12 rounds). Clients can't set `role` at signup, and inputs are
  type-checked to block NoSQL operator injection. JSON bodies are capped at 10 KB.
- Checkout is simulated. Carts of 3+ items get a 10% bundle discount (`CartContext.js`).
- Product images come from Unsplash (`images.unsplash.com` is allowed in `next.config.mjs`).
- Before going live, consider rate limiting `/api/auth/*` (e.g. `express-rate-limit`) and `helmet`.
