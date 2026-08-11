# GlobalElectronics — Frontend

A modern e-commerce storefront for electronics — TVs, laptops, mobiles, tablets, monitors and accessories — built with Next.js. Includes a full shopping experience (browsing, cart, wishlist, checkout, order tracking) alongside an admin dashboard for managing products, orders, reviews, and homepage content.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Auth & Data:** Supabase
- **Icons:** Lucide React

## Features

- Product browsing with category, brand, and price filters
- Product detail pages with image gallery, variant/size selection, and customer reviews
- Cart and wishlist with persisted state
- Checkout flow with order confirmation and order tracking
- Customer login (Supabase Auth)
- Admin dashboard: product CRUD, order management, homepage section manager, hot deals/countdown manager, notifications
- Responsive layout across mobile, tablet, and desktop
- Live search overlay and toast notification system

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm
- A running instance of the [backend API](https://github.com/usmanbukhari90/GlobalElectronics-backend)
- A Supabase project

### Installation

```bash
git clone https://github.com/usmanbukhari90/GlobalElectronics-frontend.git
cd GlobalElectronics-frontend
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

### Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/ # Routes (App Router)
│ ├── admin/ # Admin dashboard pages
│ ├── api/ # Route handlers (orders, reviews)
│ ├── cart/
│ ├── checkout/
│ ├── contact/
│ ├── login/
│ ├── order/
│ ├── product/[slug]/
│ ├── shop/
│ └── wishlist/
├── components/
│ ├── admin/
│ ├── home/
│ ├── layout/
│ └── products/
├── lib/ # API client, stores, constants, auth helpers
└── types/ # Shared TypeScript types
```

## Deployment

This app is deployed on Vercel. Push to `main` to trigger a production deployment, provided environment variables are configured in the Vercel project settings.

## Related Repositories

- [Backend API](https://github.com/usmanbukhari90/GlobalElectronics-backend)

## License

This project is proprietary and not licensed for public use or distribution.