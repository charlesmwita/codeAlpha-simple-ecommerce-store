<<<<<<< HEAD
# ShopEase E-commerce

A basic e-commerce app built with Next.js, React, TypeScript, and PostgreSQL using Drizzle ORM.

## Included features

- Product listings, search, categories, and product detail pages
- Browser-persisted shopping cart
- User registration, login, and logout
- Checkout with stock validation and saved orders
- Order history

## Run locally

1. Install Node.js 20.9 or newer and PostgreSQL.
2. Extract the archive and open a terminal in the project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL connection string. Set `AUTH_SECRET` to a long, random value.
5. Create/apply the database tables:

   ```bash
   npx drizzle-kit push
   ```

6. Start the app:

   ```bash
   npm run dev
   ```

Open http://localhost:3000. The product catalog seeds sample products the first time it loads.
=======
# codeAlpha-simple-ecommerce-store
>>>>>>> c1f9c6c0f8498d4904220cd1a65ccd707d964bd3
