@AGENTS.md

# Nirakt Travels — Complete Codebase Context

## Stack

- **Framework**: Next.js 16.2.6 (App Router) — read `node_modules/next/dist/docs/` before writing code
- **React**: 19.2.4 with React Compiler (`reactCompiler: true`)
- **Database**: MongoDB Atlas via Mongoose 9
- **Auth**: NextAuth v5 beta (`next-auth@^5.0.0-beta.31`), JWT strategy, 8h sessions
- **Payments**: Razorpay (lock-in deposits)
- **Storage**: Pluggable — Cloudinary (default) or S3, set via `STORAGE_BACKEND` env var
- **Styling**: Tailwind CSS v4, Poppins font, shadcn/ui components
- **Animation**: Framer Motion, GSAP, Lenis smooth scroll
- **Forms**: react-hook-form + zod validation
- **Rich text**: Tiptap editor (admin only)

## Next.js 16 Breaking Changes (Critical)

- `params` in page components is `Promise<{slug: string}>` — always `await params`
- ISR is set via `export const revalidate = 3600` at the top of page files
- `output: "export"` was intentionally removed to enable ISR — do not add it back
- `trailingSlash: true` is set — URLs end with `/`
- `images.unoptimized: true` — Next.js Image Optimization is disabled
- `connectDB()` must be called **inside functions**, never at module level (throws during build)

## Environment Variables

```
MONGODB_URI              # MongoDB Atlas connection string
AUTH_SECRET              # NextAuth secret
RAZORPAY_KEY_ID          # Razorpay public key
RAZORPAY_KEY_SECRET      # Razorpay private key (also used for HMAC verification)
REVALIDATION_SECRET      # For /api/revalidate endpoint
STORAGE_BACKEND          # "cloudinary" (default) or "s3"
CLOUDINARY_CLOUD_NAME    # if using Cloudinary
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
# AWS_* vars if using s3 backend
```

> `EMAILJS_CONFIG` in `src/app/lib/constants.ts` has placeholder values — email is **not wired up**.

---

## Models (`src/models/`)

### Package
| Field | Type | Notes |
|---|---|---|
| slug | String | unique, indexed |
| title | String | required |
| description | String | required |
| shortDescription | String | optional, shown in card |
| price | Number | required |
| currency | String | default "INR" |
| duration | String | e.g. "7 Days / 6 Nights" |
| durationDays | Number | optional numeric |
| images | String[] | gallery |
| coverImage | String | required, card thumbnail |
| destinations | String[] | e.g. ["Bali", "Ubud"] |
| categories | String[] | display names |
| **categorySlugs** | String[] | **indexed** — links packages to services |
| inclusions | String[] | |
| exclusions | String[] | |
| itinerary | `{day, title, description}[]` | no _id |
| highlights | String[] | |
| badge | String | e.g. "Most Popular" |
| lockInAmount | Number | Razorpay deposit amount in INR |
| rating | Number | default 0 |
| reviewCount | Number | default 0 |
| isActive | Boolean | default true — only active packages shown |
| isFeatured | Boolean | default false — sorted first |
| metaTitle | String | SEO |
| metaDescription | String | SEO |

### Service
| Field | Type | Notes |
|---|---|---|
| slug | String | unique, hardcoded to 5 values |
| title | String | |
| tagline | String | shown as accent pill on hero |
| description | String | |
| image | String | |
| **categories** | `{name, slug, children?}[]` | tree structure, children are `IServiceCategory[]` |
| popularDestinations | String[] | shown in sidebar |
| hiddenGems | String[] | optional, shown in sidebar |
| metaTitle / metaDescription | String | SEO |

### Lead
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| phone | String | required, indexed |
| email | String | optional |
| source | enum | `contact_form`, `cta_banner`, `hero_form`, `package_enquiry`, `lock_in` |
| isLockIn | Boolean | indexed, quick filter flag |
| destinationType | String | |
| preferredDestination | String | |
| travelDate | String | |
| travelers | Number | |
| budget | String | |
| message | String | |
| packageId | ObjectId | ref: Package |
| packageTitle | String | |
| lockIn | `{amountPaid, transactionId, paidAt, verified}` | only when source = "lock_in" |
| status | enum | `new`, `contacted`, `qualified`, `converted`, `lost` |
| notes | String | admin CRM notes |

Compound index: `{ isLockIn: 1, status: 1, createdAt: -1 }`

### Admin
| Field | Type | Notes |
|---|---|---|
| name | String | |
| email | String | unique, lowercase, indexed |
| passwordHash | String | bcryptjs |
| role | enum | `super_admin`, `editor` |
| isActive | Boolean | |
| lastLoginAt | Date | updated on login (fire-and-forget) |

---

## Route Map

### Public Pages
| Route | File | ISR | Notes |
|---|---|---|---|
| `/` | `src/app/page.tsx` | No | Home — uses Navbar (anchor-based nav) |
| `/packages` | `src/app/packages/page.tsx` | 3600s | All packages, search+filter client |
| `/packages/[slug]` | `src/app/packages/[slug]/page.tsx` | 3600s | Detail + Razorpay lock-in + related |
| `/services/[slug]` | `src/app/services/[slug]/page.tsx` | 3600s | 5 hardcoded slugs only, category sidebar |
| `/about` | `src/app/about/page.tsx` | Static | |
| `/privacy` | `src/app/privacy/page.tsx` | Static | |
| `/terms` | `src/app/terms/page.tsx` | Static | |
| `/cancellation` | `src/app/cancellation/page.tsx` | Static | |
| `/trust` | `src/app/trust/page.tsx` | Static | |

### Admin Pages (protected — `/admin/*`)
| Route | Purpose |
|---|---|
| `/admin/login` | Login form (redirects to dashboard if already logged in) |
| `/admin` | Redirect target |
| `/admin/dashboard` | Stats: packages, leads, lock-ins + recent leads list |
| `/admin/packages` | Packages table (PackagesTable component) |
| `/admin/packages/new` | Create package (PackageForm) |
| `/admin/packages/[id]` | Edit package |
| `/admin/services` | Services table |
| `/admin/services/new` | Create service |
| `/admin/services/[id]` | Edit service (ServiceForm with category tree editor) |
| `/admin/leads` | Leads table with status/lock-in filters |
| `/admin/leads/[id]` | Lead detail + CRM actions (status, notes) |
| `/admin/settings` | Admin account management (create admin, toggle active) |

### API Routes
| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/leads` | POST | Public | Create lead (sources: contact_form, cta_banner, hero_form, package_enquiry) |
| `/api/razorpay/create-order` | POST | Public | Create Razorpay order using `packageSlug` |
| `/api/razorpay/verify` | POST | Public | Verify HMAC signature, create lock_in lead |
| `/api/revalidate` | GET | Secret param | On-demand ISR: `?secret=X&path=/packages` |
| `/api/auth/[...nextauth]` | GET/POST | — | NextAuth handler |
| `/api/admin/packages` | GET/POST | JWT | List/create packages |
| `/api/admin/packages/[id]` | GET/PATCH/DELETE | JWT | Package CRUD |
| `/api/admin/services` | GET/POST | JWT | List/create services |
| `/api/admin/services/[id]` | GET/PATCH/DELETE | JWT | Service CRUD |
| `/api/admin/services/categories` | GET | JWT | List all category slugs |
| `/api/admin/leads` | GET | JWT | Paginated leads with filters |
| `/api/admin/leads/[id]` | GET/PATCH | JWT | Lead detail + status/notes update |
| `/api/admin/leads/export` | GET | JWT | CSV export |
| `/api/admin/upload` | POST | JWT | Image upload to storage provider |
| `/api/admin/settings/admins` | GET/POST | JWT | List/create admins |
| `/api/admin/settings/admins/[id]` | PATCH | JWT | Toggle admin active status |

---

## Key Architectural Decisions

### Package to Service Linking
Packages belong to services via `categorySlugs[]`. The Service model stores a **tree** of categories. On `/services/[slug]`, the page flattens all category slugs (parent + children) and queries `Package.find({ categorySlugs: { $in: allSlugs } })`.

On `/packages`, client-side filtering uses `slugPrefixes` (defined in `PackagesFilterClient.tsx`) to match `categorySlugs` by prefix.

### 5 Hardcoded Service Slugs
`src/app/services/[slug]/page.tsx` has a hardcoded `SERVICE_SLUGS` array. Any slug not in this list hits `notFound()`. Static params are generated from this array (not DB). Hero images are also hardcoded via `SERVICE_IMAGES` map (local `/images/services/` path).

### Auth Flow
- Middleware (`middleware.ts`) protects `/admin/*` and `/api/admin/*`
- Admin portal layout (`src/app/admin/(portal)/layout.tsx`) does a secondary `auth()` check and redirects to login
- Login page redirects to `/admin/dashboard` if already logged in

### ISR + On-Demand Revalidation
- Pages use `export const revalidate = 3600`
- After admin CRUD ops, call `GET /api/revalidate?secret=X&path=/packages` and `GET /api/revalidate?secret=X&path=/packages/[slug]`
- `src/lib/revalidate.ts` has helpers for this

### Storage Provider
`src/lib/storage/index.ts` exposes `getStorage()` which returns the active `StorageProvider`. Controlled by `STORAGE_BACKEND` env var. Use `getStorage().upload(...)` — never import Cloudinary or S3 directly in routes.

---

## Component Map

### Public Components (`src/app/components/`)
- `Navbar` — Home-only nav with anchor links (`#home`, `#destinations`, `#services`, `#about`, `#contact`)
- `StaticHeader` — Logo + nav for non-home pages (packages, services, detail)
- `FloatingCTA` — Fixed WhatsApp + call button, shown on home page only
- `LeadCaptureForm` — Used in HeroSection, CTABannerSection, ContactSection; POSTs to `/api/leads`
- `AnimatedCounter` — Used in StatsSection
- `ScrollReveal` — Framer Motion reveal wrapper

### Public Components (`src/components/`)
- `packages/PackageCard` — Card used on both `/packages` and `/services/[slug]`; links to `/packages/[slug]`
- `packages/PackagesFilterClient` — Client search + service filter + sort for `/packages` page
- `packages/ItineraryAccordion` — Day-by-day accordion on package detail page
- `packages/LockInButton` — Razorpay payment widget on package detail
- `services/PackageListClient` — Client category sidebar + grid for `/services/[slug]`
- `services/CategorySidebar` — Tree-category filter sidebar (desktop + mobile overlay)

### Home Sections (`src/app/sections/`)
Active: HeroSection, TrendingDestinations, SpecialsSection, ServicesSection, FeaturedTripsSection, WhyChooseSection, StatsSection, TestimonialsSection, CTABannerSection, ContactSection, FooterSection

Commented out in `page.tsx`: `<ProcessSection />`, `<NewsletterSection />`

### Admin Components (`src/app/admin/`)
- `_components/AdminSidebar` — Shows new lead badge count
- `_components/AdminTopbar` — User info + sign out
- `_components/PackageForm` — Full package editor with Tiptap, ItineraryEditor, ImageUploader
- `_components/ItineraryEditor` — Drag-and-drop day ordering (`@hello-pangea/dnd`)
- `_components/RichTextEditor` — Tiptap with image + link extensions
- `_components/ImageUploader` — react-dropzone then `/api/admin/upload`
- `_components/TagInput` — Comma-separated tag input for inclusions/exclusions/highlights
- `_components/PackageCategorySelect` — Fetches categories from `/api/admin/services/categories`
- `(portal)/leads/_components/LeadsTable` — TanStack Table with filters
- `(portal)/leads/[id]/_components/LeadActions` — Status + notes update

---

## Brand Constants (`src/app/lib/constants.ts`)

```ts
BRAND.phone    = "011 7106 9431"
BRAND.mobile   = "+91 9319053504"   // used for WhatsApp links
BRAND.email    = "info@nirakt.com"
```

All WhatsApp links use: `https://wa.me/${BRAND.mobile.replace(/\D/g, "")}?text=...`

All call links use: `tel:${BRAND.mobile.replace(/\s/g, "")}`

---

## Navigation & Link Structure

```
/ (home)
  ├── #home, #destinations, #services, #about, #contact  (anchor nav)
  ├── /packages  (navbar + FeaturedTrips + Footer)
  ├── /services/couples-celebration
  ├── /services/corporate-group-travel
  ├── /services/proposal-surprise-planning
  ├── /services/leisure-vacation-international
  ├── /services/destination-wedding-events
  ├── /about
  ├── /privacy
  ├── /terms
  ├── /cancellation
  └── /trust

/packages
  └── /packages/[slug]  (breadcrumb: Home -> Packages -> Title)

/services/[slug]
  └── breadcrumb: Home -> Service Title

/admin
  ├── /admin/login
  └── /admin/dashboard
      ├── /admin/packages
      │   ├── /admin/packages/new
      │   └── /admin/packages/[id]
      ├── /admin/services
      │   ├── /admin/services/new
      │   └── /admin/services/[id]
      ├── /admin/leads
      │   └── /admin/leads/[id]
      └── /admin/settings
```

---

## Known Issues / Watch-outs

1. **Razorpay verify bug**: `amountPaid: 0` is hardcoded in `/api/razorpay/verify/route.ts` instead of using the actual payment amount from Razorpay.
2. **Email not wired**: `EMAILJS_CONFIG` in constants has placeholder values. Lead forms POST to `/api/leads` only — no email notification is sent.
3. **Footer tag links**: `FOOTER_TAGS` in FooterSection all link to `#contact`, not to filtered package search.
4. **Navbar anchor links**: `NAV_LINKS` use bare hashes (`#services`, `#contact`). These only work correctly on the home page — from inner pages they do not scroll to the right section.
5. **`images.unoptimized: true`**: All `<Image>` components serve unoptimized images — no automatic WebP/resizing.
6. **React Compiler**: Do not manually add `useMemo`/`useCallback` — the compiler handles memoization.

---

## Seed Script

```bash
npm run seed:services
# runs: npx tsx scripts/add-service-to-db.ts
```

Seeds the 5 service documents into MongoDB. Run once on a new DB.
