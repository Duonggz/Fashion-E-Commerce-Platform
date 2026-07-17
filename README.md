# TMDT — Full-Stack Fashion E-Commerce Platform

A monorepo e-commerce platform built with a **Fastify + MongoDB** backend and two separate **React + TypeScript** frontends: a customer storefront and an admin dashboard. It supports product catalog management with image uploads, size/stock tracking, a shopping cart, and real-time bank transfer payments via **VietQR** and a **SePay** webhook that automatically confirms orders and deducts stock.

> Built as a capstone/coursework project to explore a production-style architecture: separate deployable apps for the storefront, admin panel, and API, tied together by a real payment integration rather than a mocked one.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Architecture](#architecture)
- [Order & Payment Lifecycle](#order--payment-lifecycle)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone & Install](#1-clone--install)
  - [2. Configure Environment Variables](#2-configure-environment-variables)
  - [3. Seed an Admin Account](#3-seed-an-admin-account)
  - [4. Run in Development](#4-run-in-development)
- [API Reference](#api-reference)
- [Known Limitations & Roadmap](#known-limitations--roadmap)
- [License](#license)

## Overview

The project is split into three independent apps that share one API:

| App | Description | Stack |
|---|---|---|
| **`client/`** | Customer-facing storefront: browse by category, search, product detail, cart, checkout with QR payment, profile & order history | React 19, TypeScript, Vite, React Router, GSAP |
| **`admin/`** | Internal dashboard for staff: add/edit/hide/delete products, manage order statuses | React 19, TypeScript, Vite, React Router |
| **`server/`** | REST API: auth, product catalog, orders, image uploads, payment webhook | Fastify 5, MongoDB (Mongoose), JWT, Cloudinary |

Each app has its own `package.json` and is deployed independently (the CORS allow-list in `server/src/index.ts` is already configured for Cloudflare Pages deployments of the client and admin apps).

## Features

**Storefront**
- Full-screen animated landing page (GSAP-driven panel transitions, scroll/swipe navigation)
- Category browsing (Nam / Nữ / Unisex) backed by product tags
- Live product search with a suggestion overlay
- Product detail page with per-size stock validation before adding to cart
- Per-user cart persisted in `localStorage`
- Checkout flow that generates a **VietQR** payment code and polls order status until payment is confirmed or the 5-minute window expires
- User registration/login and a profile page with order history

**Admin Dashboard**
- JWT-protected login, separate from customer auth
- Create products with multi-field form + image upload (streamed to Cloudinary)
- Edit, hide/show, and delete products
- Per-size stock quantities
- Order management: confirm payment, mark as shipping, mark success, cancel, or process returns — with automatic stock restoration on cancel/return

**Backend / Payments**
- Fastify REST API with Mongoose models for Users, Admins, Products, and Orders
- Product images uploaded via `@fastify/multipart` and stored on **Cloudinary**
- Order creation generates a unique order ID and a **VietQR** deep-link QR code for bank transfer
- **SePay webhook** (`/api/payment-webhook`) parses the bank transfer memo, matches it to an order, validates the transferred amount, deducts inventory per item/size, and marks the order paid
- Orders auto-expire (`expireAt`) if left unpaid for 5 minutes
- Admin routes protected by JWT middleware

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, React Router 7, Axios, GSAP
- **Backend:** Fastify 5, Mongoose 9 (MongoDB), JWT (`jsonwebtoken`), `bcryptjs`
- **Storage:** Cloudinary (product images)
- **Payments:** VietQR (QR code generation) + SePay (bank transfer webhook)
- **Tooling:** Vite, ESLint, TypeScript, `tsx` (server dev runtime)

## Monorepo Structure

```
tmdt-main/
├── client/                 # Customer storefront (Vite + React)
│   ├── src/
│   │   ├── pages/          # Home, Nam, Nu, Unisex, Auth, Cart, Checkout,
│   │   │                   # ProductDetail, Profile, SearchPage
│   │   ├── components/     # SearchBar, SearchOverlay, SearchResultItem
│   │   ├── services/       # productService.ts (API calls)
│   │   └── config/api.ts   # API base URL (VITE_API_URL)
│   └── public/assets/      # Icons, banners
│
├── admin/                  # Internal admin dashboard (Vite + React)
│   └── src/
│       ├── pages/          # Login, Dashboard, Products, ManageProducts,
│       │                   # EditProduct, orders
│       ├── components/     # ProtectedRoute (JWT guard)
│       └── config/api.ts   # API base URL (VITE_API_URL)
│
└── server/                 # Fastify REST API
    └── src/
        ├── models/         # User, Admin, Product, Order (Mongoose schemas)
        ├── routes/         # user, admin, product, order, sepay routes
        ├── services/       # vietqr.service.ts (QR code generation)
        ├── middleware/     # auth.ts (JWT verification)
        ├── plugins/        # db.ts (MongoDB connection)
        └── index.ts        # App entry point
```

## Architecture

```
┌──────────────┐        ┌──────────────┐
│   client/    │        │   admin/     │
│ (storefront) │        │ (dashboard)  │
└──────┬───────┘        └──────┬───────┘
       │        REST + JWT     │
       └───────────┬───────────┘
                    ▼
            ┌───────────────┐
            │   server/     │
            │  Fastify API  │
            └───┬───────┬───┘
                │        │
        ┌───────▼───┐ ┌──▼─────────────┐
        │ MongoDB   │ │ Cloudinary     │
        │ (Mongoose)│ │ (image hosting)│
        └───────────┘ └────────────────┘
                │
        ┌───────▼─────────────┐
        │ VietQR + SePay      │
        │ (QR gen + webhook)  │
        └─────────────────────┘
```

## Order & Payment Lifecycle

1. Customer checks out → `POST /api/checkout` creates an `Order` (`status: pending`) with a 5-minute `expireAt`, and returns a VietQR image URL encoding the amount and order ID.
2. The client polls `GET /api/order-status/:orderId` every 3 seconds while the QR is displayed.
3. Customer pays via bank transfer using the QR code (order ID is embedded in the transfer memo).
4. SePay's platform sends `POST /api/payment-webhook` with the transfer memo and amount.
5. The server matches the order ID in the memo, validates the transferred amount, deducts stock per item/size, and sets `status: paid`.
6. The client detects the status change, clears the cart, and shows a success state.
7. From the admin dashboard, staff move the order through `paid → shipping → success`, or `cancel`/`return` it (both of which restore inventory automatically).

```
pending → paid → shipping → success
   │                 │
   └─ expired         └─ returned
                 │
                 └─ cancelled (from paid)
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Cloudinary](https://cloudinary.com/) account (for product image uploads)
- A VietQR-compatible bank account and, optionally, a [SePay](https://sepay.vn/) account for automated payment confirmation

### 1. Clone & Install

Each app has its own dependencies and must be installed separately:

```bash
git clone <your-repo-url>
cd tmdt-main

cd server && npm install
cd ../client && npm install
cd ../admin && npm install
```

### 2. Configure Environment Variables

Create a `.env` file in **`server/`**:

```env
PORT=3000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file in **`client/`** and **`admin/`**:

```env
VITE_API_URL=http://localhost:3000
```

> Update the bank account details in `server/src/services/vietqr.service.ts` (`bank`, `account`, `name`) to your own receiving account before generating real QR codes.

### 3. Seed an Admin Account

The admin dashboard has no public signup — create the first admin from the CLI:

```bash
cd server
npx tsx src/createAdmin.ts
# creates username: admin / password: admin123 (change it after first login)
```

### 4. Run in Development

In three separate terminals:

```bash
# API — http://localhost:3000
cd server && npm run dev

# Storefront — http://localhost:5173
cd client && npm run dev

# Admin dashboard — http://localhost:5174 (or next available Vite port)
cd admin && npm run dev
```

## API Reference

All endpoints are prefixed as registered in `server/src/index.ts`.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/users/register` | Register a customer | — |
| `POST` | `/api/users/login` | Customer login | — |
| `PUT` | `/api/users/update/:id` | Update customer profile | — |
| `POST` | `/api/admin/login` | Admin login (returns JWT) | — |
| `GET` | `/api/admin/products` | List all products (admin view) | JWT |
| `GET` | `/api/products` | List all products | — |
| `GET` | `/api/products/tag/:tag` | List active products by tag (Nam/Nu/Unisex) | — |
| `GET` | `/api/products/search?keyword=` | Search products by name | — |
| `GET` | `/api/products/:id` | Get product detail | — |
| `POST` | `/api/products` | Create product (multipart: image + fields) | — |
| `PUT` | `/api/products/:id` | Edit product | — |
| `PUT` | `/api/products/toggle/:id` | Show/hide product | — |
| `DELETE` | `/api/products/:id` | Delete product | — |
| `POST` | `/api/checkout` | Create order + generate VietQR | — |
| `GET` | `/api/order-status/:orderId` | Poll order status | — |
| `GET` | `/api/orders/user/:userId` | Get a user's order history | — |
| `GET` | `/api/admin/orders` | List all orders | — |
| `PUT` | `/api/admin/orders/:id/pay` | Mark order as paid | — |
| `PUT` | `/api/admin/orders/:id/ship` | Mark order as shipping | — |
| `PUT` | `/api/admin/orders/:id/success` | Mark order as delivered | — |
| `PUT` | `/api/admin/orders/:id/cancel` | Cancel order + restock | — |
| `PUT` | `/api/admin/orders/:id/return` | Process return + restock | — |
| `POST` | `/api/payment-webhook` | SePay payment confirmation webhook | Webhook |

## Known Limitations & Roadmap

This is an actively evolving project. A few items worth noting for anyone building on top of it:

- **Customer auth** currently compares plaintext passwords (`server/src/routes/user.route.ts`); admin auth already uses `bcryptjs` hashing (`server/src/routes/admin.route.ts`) — the same pattern should be applied to customer accounts.
- Most **product and order routes are not yet JWT-protected** (only `/api/admin/login` and `/api/admin/products` currently use `verifyAdmin`) — the write endpoints (create/edit/delete product, order status updates) should be locked down before a public deployment.
- **Cart state lives in `localStorage`** rather than being synced server-side, so it doesn't persist across devices.
- No automated tests yet — a good next step given the payment/stock logic.

## License

No license file is currently included. Add a `LICENSE` file (e.g. MIT) if you intend to open-source this project.
