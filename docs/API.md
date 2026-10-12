# API reference

All endpoints live under `/api`, accept and return JSON (uploads use `multipart/form-data`), and
authenticate with the httpOnly session cookie set by `POST /api/auth/login`.

**Success:** `{ "success": true, ...data }`
**Error:** `{ "success": false, "message": "...", "fieldErrors"?: { field: message }, "details"?: {...} }`

| Status | Meaning                                                              |
| ------ | -------------------------------------------------------------------- |
| 400    | Invalid input (see `fieldErrors`)                                    |
| 401    | Not logged in, or wrong credentials                                  |
| 403    | Logged in but not allowed, or a cross-site request was blocked       |
| 404    | Not found (also used for resources you aren't allowed to see)        |
| 409    | Conflict with current state (already owned, not awaiting payment...) |
| 413    | Body or upload too large                                             |
| 429    | Rate limited; the message says when to retry                         |
| 5xx    | Server or configuration problem                                      |

Money is always in **cents**. Access: **Public**, **User** (any logged-in account), **Seller**
(active seller or admin), **Admin**.

## Auth & account

| Method | Endpoint                          | Access | Body / query                         | Returns                    |
| ------ | --------------------------------- | ------ | ------------------------------------ | -------------------------- |
| POST   | `/auth/signup`                    | Public | `{ name, email, password }`          | `201 { user }`             |
| POST   | `/auth/login`                     | Public | `{ email, password }`                | `{ user }` + cookie        |
| POST   | `/auth/logout`                    | Public | none                                 | `{}`, cookie cleared       |
| GET    | `/auth/me`                        | Public | none                                 | `{ user, ownedProductIds }` |
| PATCH  | `/account/profile`                | User   | `{ name }`                           | `{ user }`                 |
| PUT    | `/account/password`               | User   | `{ currentPassword, newPassword }`   | signs out other devices    |
| GET    | `/account/sessions`               | User   | none                                 | `{ sessions }`             |
| DELETE | `/account/sessions`               | User   | none                                 | signs out other devices    |
| DELETE | `/account/sessions/:sessionId`    | User   | none                                 | signs out one device       |

Passwords: 8-128 characters with at least one letter and one number.

## Products & files

| Method | Endpoint                    | Access | Notes                                                                 |
| ------ | --------------------------- | ------ | --------------------------------------------------------------------- |
| GET    | `/products`                 | Public | `?q=&category=&sort=newest\|popular\|price_asc\|price_desc&page=&limit=` (limit at most 24) |
| POST   | `/products`                 | Seller | multipart: `title, description, price ("19.99"), category, includes[] (repeat), tag?, cover, file` |
| GET    | `/products/:productId`      | Seller | own product (admins: any), including private file info                |
| PATCH  | `/products/:productId`      | Seller | same fields; `cover` and `file` optional. Seller edits go back to review |
| DELETE | `/products/:productId`      | Seller | archives (buyers keep their downloads)                                |
| GET    | `/files/:fileId`            | Public | public cover images only                                              |
| GET    | `/downloads/:productId`     | User   | the product file, for paying buyers, its seller and admins            |

Uploads: cover JPG/PNG/WebP up to 4 MB, product file PDF/ZIP up to 20 MB. Types are checked by
file content, not extension.

## Orders

| Method | Endpoint                     | Access | Body                                  | Notes                                       |
| ------ | ---------------------------- | ------ | ------------------------------------- | ------------------------------------------- |
| GET    | `/orders`                    | User   | `?page=`                              | your orders                                 |
| POST   | `/orders`                    | User   | `{ productIds: [] }`                  | `201 { order }`. 409 with `details.unavailableProductIds` if items can't be bought |
| GET    | `/orders/:orderId`           | User   | none                                  | buyer or admin                              |
| POST   | `/orders/:orderId/payment`   | User   | `{ reference }`                       | buyer's bank transfer reference             |
| PATCH  | `/orders/:orderId`           | User   | `{ action: "confirm"\|"cancel", reason? }` | confirm: admin only. cancel: admin, or buyer while unpaid |

Free orders and `PAYMENT_MODE=simulated` orders are paid immediately.

## Seller

| Method | Endpoint                 | Access | Body                                                         |
| ------ | ------------------------ | ------ | ------------------------------------------------------------ |
| POST   | `/seller/store`          | User   | `{ storeName, bio? }` opens a shop                           |
| PATCH  | `/seller/store`          | Seller | `{ storeName, bio? }`                                        |
| GET    | `/seller/payout-method`  | Seller | masked method                                                |
| PUT    | `/seller/payout-method`  | Seller | `{ type: bank_transfer\|mobile_wallet\|paypal, accountHolder, provider, accountNumber, notes? }` |

## Admin

| Method | Endpoint                       | Body                                                                   |
| ------ | ------------------------------ | ---------------------------------------------------------------------- |
| PATCH  | `/admin/products/:productId`   | `{ action: approve\|reject\|unpublish\|feature\|unfeature, note? }` (note required to reject) |
| GET    | `/admin/payouts`               | sellers owed money, with decrypted payout details                      |
| POST   | `/admin/payouts`               | `{ sellerId, reference, note? }` after sending the transfer            |
| GET    | `/admin/users`                 | `?q=&filter=all\|admins\|sellers\|suspended&page=`                     |
| PATCH  | `/admin/users/:userId`         | `{ role?, status?, sellerStatus? }`. Suspending signs the user out everywhere |

## Health

`GET /api/health` returns `{ success: true, database: "connected" }` or an error naming the
missing configuration.
