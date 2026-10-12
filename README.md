# Ecommerce Market

A multi-vendor marketplace for digital products (mostly PDFs). The platform owner runs an admin
panel; any user can open a seller shop, upload products, and get paid manually for their sales,
minus a 10% platform commission.

- **Stack:** Next.js 16 (App Router, JavaScript), React 19, Tailwind CSS v4, MongoDB + Mongoose 9
- **State:** Zustand (cart, auth view, UI), server data rendered by Server Components
- **Validation:** zod schemas shared by every API endpoint
- **Files:** MongoDB GridFS (no extra storage service needed)

## How the marketplace works

```
Seller uploads product (cover image + PDF)  ->  Admin approves  ->  Product is live
Buyer checks out  ->  Order "Awaiting payment"  ->  Buyer pays by bank transfer, enters reference
Admin confirms payment  ->  Buyer can download  ->  Seller earning recorded (price - 10%)
Admin opens Payouts, sees amount + seller bank details, sends money, clicks "Mark as paid"
```

| Who    | Where             | What they can do                                                         |
| ------ | ----------------- | ------------------------------------------------------------------------ |
| Buyer  | `/account`        | Library of purchased files, orders, payment references, settings, devices |
| Seller | `/sell`           | Upload/edit products, sales ledger, earnings, payout method, payout history |
| Admin  | `/admin`          | Revenue overview, product review, payment confirmation, payouts, users    |
| Public | `/sellers/[slug]` | Each seller's storefront                                                 |

Admins can also sell: their products publish without review and count as platform revenue.

## Getting started

```bash
npm install
cp .env.example .env      # fill in MONGO_URI, ENCRYPTION_KEY, ADMIN_* and PAYMENT_INSTRUCTIONS
npm run seed:admin        # creates your admin account
npm run seed:demo         # optional: demo products, demo sellers and sample PDFs
npm run dev
```

Open http://localhost:3000 and log in with your `ADMIN_EMAIL`. Check the API and database at
http://localhost:3000/api/health.

| Script               | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `npm run dev`        | Website + API with hot reload                              |
| `npm run build`      | Production build                                           |
| `npm start`          | Serve the production build                                 |
| `npm run lint`       | ESLint                                                     |
| `npm run seed:admin` | Create or promote the admin from `ADMIN_*` env vars        |
| `npm run seed:demo`  | Admin + demo catalog (development databases only)          |

### Environment variables

All environment-specific values are read and validated in `src/server/config/env.js`. A missing
or invalid variable produces a clear error naming it. Business rules (commission rate,
categories, upload limits) live in `src/config/` instead.

| Variable                   | Purpose                                                                   |
| -------------------------- | ------------------------------------------------------------------------- |
| `MONGO_URI`, `DB_NAME`     | MongoDB connection                                                        |
| `ENCRYPTION_KEY`           | 64 hex chars. Encrypts seller bank details. **Never change it after launch.** |
| `SESSION_TTL_DAYS`         | How long an idle login lasts (default 14)                                 |
| `PAYMENT_MODE`             | `manual` (production) or `simulated` (instant "paid", dev only)           |
| `PAYMENT_INSTRUCTIONS`     | Your bank details, shown to buyers on unpaid orders                       |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Used only by `npm run seed:admin`                  |

`JWT_SECRET` and `JWT_EXPIRE` from the previous version are no longer used and can be removed.

## Deploying to Vercel

1. Add every variable from `.env.example` under Project -> Settings -> Environment Variables.
2. In MongoDB Atlas -> Network Access, allow Vercel (e.g. `0.0.0.0/0` or the Atlas integration).
3. Redeploy, then open `https://<your-app>.vercel.app/api/health`.
4. Run `npm run seed:admin` once from your machine with `.env` pointing at the production database.

**Upload size on Vercel:** serverless requests are capped at about 4.5 MB, which limits
cover + PDF uploads. For larger files, move storage to S3 or Vercel Blob: only
`src/server/storage/fileStorage.js` needs to change.

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): folder structure, layers, conventions, data model
- [docs/API.md](docs/API.md): every endpoint, access rules and error format
- [docs/SECURITY.md](docs/SECURITY.md): sessions, CSRF, rate limits, uploads, encryption
