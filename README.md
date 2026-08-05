# Kanz Electronics — Dubai E-Commerce Shop

A modern electronics e-commerce website inspired by Kanz Electronics, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Homepage** — Hero banners, category navigation, featured products
- **Product Catalog** — Smart TVs, Laptops, Accessories with search & filters
- **Cart Management** — Add/remove items, quantity control, persistent cart (localStorage)
- **Wishlist** — Save favorite products
- **Reviews** — Customer reviews with star ratings on product pages
- **Order Handling** — Full checkout flow with UAE delivery details, order confirmation
- **AED Currency** — Prices displayed in UAE Dirhams (د.إ)

## Getting Started

```bash
cd electronics-shop
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                  # Pages & API routes
│   ├── api/orders/       # Order creation & listing
│   ├── api/reviews/      # Review submission & listing
│   ├── cart/             # Shopping cart page
│   ├── checkout/         # Checkout form
│   ├── contact/          # Contact page
│   ├── product/[slug]/   # Product detail + reviews
│   └── shop/             # Product listing
├── components/           # Reusable UI components
├── data/products.ts      # Product catalog (edit here!)
├── lib/
│   ├── constants.ts      # Shop info, AED formatting
│   ├── db.ts             # JSON file storage for orders/reviews
│   └── store.ts          # Zustand cart & wishlist state
└── types/                # TypeScript interfaces
data/
├── orders.json           # Stored orders
└── reviews.json          # Stored reviews
```

## Customization

- **Shop name & contact info** → `src/lib/constants.ts`
- **Products** → `src/data/products.ts`
- **Colors & theme** → `src/app/globals.css`
- **Hero banner images** → `src/components/home/HeroBanners.tsx`

## Tech Stack

- [Next.js 16](https://nextjs.org/) — React framework
- [Tailwind CSS 4](https://tailwindcss.com/) — Styling
- [Zustand](https://zustand-demo.pmnd.rs/) — Cart & wishlist state
- [Lucide React](https://lucide.dev/) — Icons
