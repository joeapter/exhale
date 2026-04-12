# EXHALE — Desert Escape for Women

A production-ready full-stack website for EXHALE, a women-only luxury desert retreat brand in Israel.

**Domain:** exhale.co.il

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Database | PostgreSQL via Prisma ORM |
| Admin Auth | Custom JWT (bcrypt + jose) |
| Payments | Stripe Checkout |
| Email | Resend (scaffolded — wire up as needed) |
| Uploads | UploadThing (scaffolded) |
| Deployment | Vercel (recommended) |

---

## Project Structure

```
src/
├── app/
│   ├── (public)/           Public-facing pages
│   │   ├── page.tsx         Homepage
│   │   ├── about/           About
│   │   ├── retreats/        Listing + [slug] detail
│   │   ├── faq/             FAQ
│   │   └── contact/         Contact
│   ├── (admin)/            Admin panel
│   │   └── admin/
│   │       ├── page.tsx      Dashboard
│   │       ├── login/        Login
│   │       ├── retreats/     Manage retreats
│   │       ├── registrations/
│   │       ├── content/      CMS
│   │       ├── faqs/
│   │       └── testimonials/
│   ├── register/
│   │   ├── [retreatSlug]/   3-step registration flow
│   │   └── confirmation/    Post-payment page
│   └── api/
│       ├── auth/login|logout
│       ├── contact/
│       ├── registrations/   Creates Stripe session
│       └── stripe/webhook/  Handles payment confirmation
├── components/
│   ├── layout/              Nav, Footer
│   ├── sections/            Homepage sections (Hero, Intro, etc.)
│   ├── forms/               RegistrationForm, ContactForm
│   ├── ui/                  Button, SectionLabel
│   └── admin/               AdminNav
├── lib/
│   ├── prisma.ts            Prisma singleton
│   ├── auth.ts              JWT helpers
│   ├── utils.ts             Formatting utilities
│   └── retreats.ts          DB query helpers
└── middleware.ts             Admin route protection
prisma/
├── schema.prisma            Full schema
└── seed.ts                  Sample data + default admin
```

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/joeapter/exhale.git
cd exhale
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_JWT_SECRET` | `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | From `stripe listen` or dashboard |
| `NEXT_PUBLIC_URL` | `http://localhost:3000` in dev |
| `RESEND_API_KEY` | For email confirmations |

### 3. Database

```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to DB (no migration files)
# OR: npm run db:migrate  # Create migration files (recommended for production)
npm run db:seed        # Seed sample data + admin user
```

### 4. Dev server

```bash
npm run dev
# http://localhost:3000
```

---

## Admin Panel

URL: `/admin`

Default credentials (from seed):
- Email: `admin@exhale.co.il`
- Password: `exhale-admin-2026`

**Change the password after first login.**

---

## Stripe

### Local development

```bash
# Install Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Add the webhook signing secret to `.env.local` as `STRIPE_WEBHOOK_SECRET`.

### Production

In Stripe Dashboard → Developers → Webhooks, add:
- Endpoint: `https://exhale.co.il/api/stripe/webhook`
- Event: `checkout.session.completed`

---

## Connecting Live DB Data

The retreat pages use inline sample data by default. To switch to the database:

**src/app/(public)/retreats/page.tsx:**
```tsx
import { getPublishedRetreats } from "@/lib/retreats";
const retreats = await getPublishedRetreats();
```

**src/app/(public)/retreats/[slug]/page.tsx:**
```tsx
import { getRetreatBySlug } from "@/lib/retreats";
const retreat = await getRetreatBySlug(slug);
if (!retreat || retreat.status === "DRAFT") notFound();
```

---

## Email Confirmations

Uncomment the `sendConfirmationEmail` call in `src/app/api/stripe/webhook/route.ts` and implement `src/lib/email.ts` using the Resend SDK.

---

## Deployment (Vercel)

```bash
npm i -g vercel
vercel
# Add env vars in Vercel dashboard
```

Recommended PostgreSQL providers: [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app)

---

## Design System

### Colors
| Token | Hex | Use |
|-------|-----|-----|
| `--color-linen` | `#FAF7F2` | Page background |
| `--color-sand` | `#F5EFE7` | Section background |
| `--color-dune` | `#E4D8C9` | Section background (deeper) |
| `--color-stone` | `#C9BAA8` | Borders, dividers |
| `--color-clay` | `#B89080` | Labels, accents |
| `--color-espresso` | `#3D2E22` | Headings, primary text |
| `--color-taupe` | `#7A6A5A` | Body text |
| `--color-candle` | `#D4956A` | Warnings, urgency |

### Typography
- Headings: **Cormorant Garamond** 300 weight
- Body/UI: **Jost** 300 weight
- Labels: Jost 400, `letter-spacing: 0.18em`, uppercase

### Notes
- Prices are stored as **agorot** (₪ × 100). Divide by 100 for display.
- Stripe currency is set to `ils`. Verify this is enabled on your account.
- Admin routes are protected by a signed JWT HttpOnly cookie via `middleware.ts`.
