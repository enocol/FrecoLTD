# Freco Limited — Online Store

A responsive React storefront for selling **car engines, engine parts, alloy wheels
and other car parts**. Customers browse the catalogue, add one or more products to a
basket, and check out by entering credit/debit card details.

There is **no backend or database** — the product catalogue lives in a single JSON
file ([`src/data/products.json`](src/data/products.json)) and the basket is kept in
the browser. Payment is **simulated** on the client (see the note below).

## Features

- Browse all products with **category filters, search and sorting**
- **Product detail** pages with specs, quantity selection and related items
- **Basket** supporting multiple products, quantity changes and live totals
  (subtotal, delivery, VAT) — persisted across page refreshes via `localStorage`
- **Delivery _or_ collection** — customers choose home delivery (free over £1,000)
  or free click-&-collect from the depot; the fee, required fields and receipt
  adapt to the choice
- **Card checkout** with address + card form, inline validation and a Luhn
  card-number check; card brand (Visa / Mastercard / Amex) is auto-detected
- **Order confirmation** with a printable-style receipt and order reference
- **Fully responsive**, mobile-first layout (phones → tablets → desktop)

## Tech stack

- [React 18](https://react.dev) + [Vite](https://vite.dev)
- [React Router](https://reactrouter.com) for navigation
- Plain CSS (no UI framework), custom properties + mobile-first media queries

## Getting started

```bash
npm install     # install dependencies
npm run dev     # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build   # production build to /dist
npm run preview # preview the production build locally
```

## Deploying to Netlify

A [`netlify.toml`](netlify.toml) and [`public/_redirects`](public/_redirects) are
included, so deploys work out of the box.

**Option A — connect the Git repo (recommended):**

1. Push this project to GitHub/GitLab/Bitbucket.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Netlify reads `netlify.toml`, so the settings are pre-filled:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy. Every push then triggers an automatic build.

**Option B — Netlify CLI (manual deploy):**

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod   # publishes the dist/ folder
```

The `netlify.toml` redirect rule (and `_redirects`) serve `index.html` for every
route, so React Router deep links and page refreshes won't 404.

## Project structure

```
src/
  data/products.json      # the product catalogue (edit this to change stock)
  context/CartContext.jsx # basket state (add / remove / quantity / totals)
  components/             # Navbar, Footer, ProductCard, Thumbnail, StarRating
  pages/                  # Home, Shop, ProductDetail, Cart, Checkout, Confirmation
  utils/format.js         # currency, delivery and VAT helpers
```

## Adding or editing products

Edit [`src/data/products.json`](src/data/products.json). Each product looks like:

```json
{
  "id": "eng-001",
  "name": "2.0L TDI Diesel Engine (Complete)",
  "category": "Engines",
  "brand": "Volkswagen",
  "price": 2499.99,
  "oldPrice": 2899.99,
  "stock": 6,
  "rating": 4.8,
  "sku": "FRC-ENG-2TDI",
  "featured": true,
  "shortDescription": "…",
  "description": "…",
  "specs": { "Fuel": "Diesel", "Cylinders": "4 inline" }
}
```

Valid `category` values: `Engines`, `Engine Parts`, `Alloy Wheels`, `Car Parts`.

**Images** are optional. Add `"image": "/images/eng-001.jpg"` for a single photo, or
`"images": ["/images/whl-001-1.jpg", "/images/whl-001-2.jpg"]` for a gallery (first
is the main image). Put the files in [`public/images/`](public/images/) — see its
[README](public/images/README.md). Products without an image show a generated
placeholder.

## ⚠️ About payments (important)

This is a **demo / coursework build with no backend**, so **no real payment is taken**
and **no card data is sent anywhere** — the form only validates input locally and then
shows a confirmation. A test card number (`4242 4242 4242 4242`) is provided.

**Never collect real card numbers in a front-end-only app.** For a live store you must
process payments through a PCI-compliant gateway (e.g. **Stripe**, **PayPal**, or
**Worldpay**), which handles the card data on their servers and returns a token to your
backend. The next step for this project would be to add a small backend that creates a
payment intent with such a provider.
