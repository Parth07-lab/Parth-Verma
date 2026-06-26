# VibeNest — Enterprise-Grade Premium E-Commerce Platform

VibeNest is a high-performance, premium, and modern fashion & lifestyle e-commerce platform built with a Next.js App Router storefront and a TypeScript Express.js REST API. 

## Features

- **Storefront**: Fully-functional premium landing page, category listing with synchronized URL filter state, rich product details page with variant switching, custom reviews, responsive navigation, and a global sliding cart drawer powered by Zustand.
- **Checkout Funnel**: Multi-step checkout flow (Contact, Shipping, Payment, and Success tracking) supporting dummy payment methods (Cards, UPI, COD).
- **Admin Dashboard**: Analytics summary, live sales metrics chart using Recharts, inventory CRUD table, orders management, coupon code management, and customer/admin tables.
- **Multi-Factor Authentication (MFA)**: TOTP 2FA for administrative logins.
- **Local Dev Fallbacks**: Built-in support for SQLite database (via Prisma) and an in-memory task queue so that the repository can boot locally without Docker/Redis dependencies out-of-the-box. Easily switches to PostgreSQL and BullMQ/Redis for production deployment.

---

## Monorepo Architecture

This project is configured as an npm workspaces monorepo:

```
vibenest/
├── package.json               # Monorepo root workspaces config
├── apps/
│   ├── api/                   # Express.js API backend (Port 5000)
│   └── web/                   # Next.js Storefront & Admin Portal (Port 3000)
├── packages/
│   └── shared-types/          # Shared TypeScript type definitions
└── .gitignore                 # GitHub-ready Git ignore configurations
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+ or v20+
- [npm](https://www.npmjs.com/) v9+

---

## Quick Start (Local Setup)

### 1. Environment Files Setup
Copy the environment variables template in the root directory:
```bash
cp .env.example .env
```
And copy the same to the backend API directory if needed (or let the root `.env` lead since the processes share context):
```bash
cp .env.example apps/api/.env
```

### 2. Install Monorepo Dependencies
From the root workspace directory, run:
```bash
npm install
```

### 3. Initialize the Database
Initialize and seed the local SQLite database. This creates a local SQLite database (`dev.db` inside `apps/api/prisma`) and seeds it with 25 premium product listings, addressing categories, active test user credentials, and admin setup.

Generate the Prisma Client:
```bash
npm run prisma:generate
```

Push database schema to SQLite:
```bash
npm run prisma:migrate
```

Seed database catalog and test accounts:
```bash
npm run prisma:seed
```

### 4. Run Development Servers

In separate terminals, run the following root scripts to boot both servers concurrently:

To start the Express API backend:
```bash
npm run dev:api
```
*(Runs on [http://localhost:5000](http://localhost:5000))*

To start the Next.js Storefront/Admin:
```bash
npm run dev:web
```
*(Runs on [http://localhost:3000](http://localhost:3000))*

---

## Test Credentials & MFA

- **Customer Login**:
  - Email: `customer@vibenest.com`
  - Password: `vibenest123`
- **Admin Dashboard**:
  - URL: [http://localhost:3000/admin](http://localhost:3000/admin)
  - Email: `admin@vibenest.com`
  - Password: `vibenest123`
  - **MFA Check**: Enter the TOTP code `123456` to bypass/authenticate (pre-configured for rapid testing).

---

## Production Readiness / Switching to PostgreSQL & Redis
The application utilizes standard, scalable abstraction layers:
- **Database**: To move from SQLite to PostgreSQL, update the `provider` in `apps/api/prisma/schema.prisma` to `"postgresql"`, and modify `DATABASE_URL` in `.env` to point to your Postgres instance. Run migrations again.
- **Queue**: Define `REDIS_URL` in the environment configuration to automatically scale the email and transactional task processor from local in-memory to **BullMQ** (powered by Redis).
