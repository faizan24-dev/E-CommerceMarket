# Architecture

## Folder structure

```
scripts/
  seed.js, demo-catalog.js     Database seeding (runs under plain Node)
src/
  proxy.js                     Redirects signed-out visitors away from /account, /sell, /admin
  app/                         Routes only: pages, layouts, error boundaries and API route handlers
    api/                       REST endpoints (thin controllers, see "Request flow")
    account/  sell/  admin/    Buyer area, seller dashboard, admin panel
    products/ sellers/ blog/   Public storefront
  components/                  UI only. No database access, no business rules.
    ui/                        Generic building blocks: Button, Field, Alert, Badge, DataTable...
    layout/                    Header, Footer, menus, error view, app bootstrap
    home/ product/ cart/ blog/ auth/
    dashboard/                 Sidebar shell, filter tabs, download link
    account/ seller/ admin/    Client forms and action buttons for each area
  config/                      Business configuration (client-safe): commission, categories, statuses, site nav
  content/                     Static marketing copy and blog posts
  hooks/                       Client hooks (useAsyncAction, useLogout, useOverlay, useDebouncedValue)
  lib/                         Client-safe helpers: apiClient, format, routes, shared validation rules
  store/                       Zustand stores: authStore, cartStore, uiStore
  server/                      Everything server-only
    config/env.js              The only place environment variables are read (validated with zod)
    db.js                      Cached MongoDB connection
    errors.js                  AppError + helpers (badRequest, notFound, ...)
    dto.js                     Converts documents into safe, serializable objects
    page.js                    preparePageData() for database-backed pages
    models/                    Mongoose schemas
    services/                  Business logic (one file per domain)
    validators/                zod input schemas + parse helpers
    http/                      apiRoute wrapper, request parsing, JSON responses
    auth/                      Sessions, guards for pages, authorization policies
    security/                  Rate limiting, same-origin (CSRF) check
    storage/                   GridFS file storage and upload validation
    utils/                     crypto (tokens, AES-GCM), text (slugs, regex escaping)
```

## Layers

```
Browser ──> app/api/**/route.js ──> server/services ──> server/models (MongoDB)
              (apiRoute wrapper)        ^
Server Component page ──────────────────┘   (pages call services directly, no HTTP hop)
```

- **Route handlers** parse the request, call one service function and return `ok({...})`.
  They contain no business logic.
- **Services** hold all rules (who can do what, prices, commission, state transitions). They
  throw `AppError` for expected failures and return DTOs, never raw documents.
- **Pages** are Server Components. They call `requireUser/requireSeller/requireAdmin`, read data
  from services and pass plain props to components.
- **Components** render props. Client components mutate through `lib/apiClient` and then call
  `router.refresh()` (via `useAsyncAction`) so server data re-renders.

## Request flow for an API call

`apiRoute(options, handler)` in `src/server/http/apiRoute.js` runs, in order:

1. Same-origin check on POST/PUT/PATCH/DELETE (CSRF)
2. Database connection
3. Rate limit (named limit, or the general `write` limit for state changes)
4. Authentication and role (`auth: "user" | "seller" | "admin" | "optional"`)
5. The handler, with `{ request, params, user, ip }`

Any thrown error becomes `{ success: false, message, fieldErrors?, details? }` with the right
status code. Unexpected errors are logged and reported to the client as a generic 500.

## State management

| State                       | Where                         | Why                                            |
| --------------------------- | ----------------------------- | ---------------------------------------------- |
| Products, orders, stats     | Server Components             | Always fresh, never trusted from the browser   |
| Signed-in user (view)       | `store/authStore` (Zustand)   | Mirrors `/api/auth/me`; synced across tabs     |
| Cart                        | `store/cartStore` (persisted) | Survives reloads; checkout re-prices on server |
| Cart drawer open/closed     | `store/uiStore`               | Shared by distant components                   |
| Form fields                 | Local `useState`              | Local by nature                                |

The cart store uses `skipHydration` and is rehydrated by `AppBootstrap`, so the server render and
first client render always match.

## Data model

| Collection  | Purpose                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------- |
| `users`     | Accounts. `role` user/admin, `status`, optional `seller` profile with encrypted payout method |
| `sessions`  | Login sessions (hashed token, device, IP). TTL index deletes expired ones                   |
| `products`  | Listing, cover image, private file reference, `status` pending/published/rejected/archived  |
| `orders`    | Price snapshot per item, including `commission` and `sellerEarning`                         |
| `earnings`  | One row per sold item per seller. `unpaid` until included in a payout                        |
| `payouts`   | A manual transfer an admin recorded, with reference and masked destination                  |
| `ratelimits`| Counters for rate limiting. TTL index                                                       |
| `uploads.*` | GridFS files: cover images (public) and product files (private)                             |

Money is stored as integer **cents** everywhere. Commission is computed once at checkout and
stored on the order item, so changing `COMMISSION_RATE` never rewrites past sales.

### Order and payout lifecycle

```
pending_payment ──(buyer submits reference)──> awaiting_confirmation ──(admin confirms)──> paid
       └──────────────────(buyer or admin cancels)──────────────────────> cancelled

paid ──> one Earning per seller item (status: unpaid) ──(admin records payout)──> paid
```

Confirmation uses an atomic status-filtered update, and earnings have a unique
`(order, product)` index, so an order can never be fulfilled or credited twice. Recording a
payout first claims the unpaid earnings, then sums exactly what it claimed.

## Conventions

- Components and pages: `PascalCase.jsx`, one default export per component file.
- Hooks: `useSomething.js`. Services: `somethingService.js`. Models: `PascalCase.js`.
- Server modules import each other by relative path with `.js` extensions (so `scripts/seed.js`
  can load them under plain Node). App code uses the `@/` alias.
- Every server module that must never reach the browser starts with `import "server-only"`.
- Icons come from `lucide-react` (decorative ones get `aria-hidden="true"`). No emojis.
- Solid colors only (no gradients). Design tokens live in `src/app/globals.css`.
- Links to the same place are built with helpers in `src/lib/routes.js`.

## Adding a feature (example: product reviews)

1. Model in `src/server/models/Review.js`, export it from `models/index.js`.
2. zod schema in `validators/schemas.js`, DTO mapper in `dto.js`.
3. Business rules in `services/reviewService.js` (e.g. only buyers who own the product).
4. Endpoint `src/app/api/products/[productId]/reviews/route.js` using `apiRoute`.
5. Read it in the product page via the service; post from a client form with `apiClient`.
