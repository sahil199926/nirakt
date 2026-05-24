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
- Components using `useSearchParams()` must be wrapped in `<Suspense>` at the page level

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
| **gst** | Number | enum: 0 \| 5 \| 8 \| 18 — default 0 (None) |
| duration | String | e.g. "7 Days / 6 Nights" |
| durationDays | Number | optional numeric |
| images | String[] | gallery |
| coverImage | String | required, card thumbnail (ratio 16:9, max 5MB) |
| **isInternational** | Boolean | default false — toggles India states vs free-text destination |
| destinations | String[] | India state names OR international destination names |
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

### Location (new)
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| slug | String | unique, indexed |
| image | String | optional, ratio 3:4, max 5MB |
| imagePublicId | String | storage provider public ID |
| isInternational | Boolean | default false |
| **isTrending** | Boolean | indexed — shown on `/destinations` page |
| isActive | Boolean | default true |
| metaTitle | String | SEO |
| metaDescription | String | SEO |

### Payment (new)
| Field | Type | Notes |
|---|---|---|
| leadId | ObjectId | ref: Lead (optional) |
| leadName | String | denormalized for quick display |
| leadPhone | String | |
| packageId | ObjectId | ref: Package (optional) |
| packageTitle | String | |
| amount | Number | required, in INR |
| currency | String | default "INR" |
| method | enum | `razorpay`, `upi`, `cash`, `bank_transfer`, `other` |
| status | enum | `pending`, `completed`, `failed`, `refunded` |
| transactionId | String | |
| notes | String | |
| paidAt | Date | default now |
| addedManually | Boolean | true if created via admin portal |

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
| `/packages` | `src/app/packages/page.tsx` | 3600s | All packages, search+filter+destination+URL params |
| `/packages/[slug]` | `src/app/packages/[slug]/page.tsx` | 3600s | Detail + enquiry modal + GST breakdown + related |
| `/services/[slug]` | `src/app/services/[slug]/page.tsx` | 3600s | 5 hardcoded slugs only, category+destination sidebar |
| `/destinations` | `src/app/destinations/page.tsx` | 3600s | Location cards from DB, click → `/packages?destination=X` |
| `/contact` | `src/app/contact/page.tsx` | Static | Contact info + lead form |
| `/about` | `src/app/about/page.tsx` | Static | |
| `/privacy` | `src/app/privacy/page.tsx` | Static | |
| `/terms` | `src/app/terms/page.tsx` | Static | |
| `/cancellation` | `src/app/cancellation/page.tsx` | Static | |
| `/trust` | `src/app/trust/page.tsx` | Static | |

### Admin Pages (protected — `/admin/*`)
| Route | Purpose |
|---|---|
| `/admin/login` | Login form |
| `/admin/dashboard` | Stats + recent leads |
| `/admin/packages` | Packages table |
| `/admin/packages/new` | Create package (PackageForm) |
| `/admin/packages/[id]` | Edit package |
| `/admin/services` | Services table |
| `/admin/services/new` | Create service |
| `/admin/services/[id]` | Edit service |
| `/admin/location-master` | Locations table (CRUD) |
| `/admin/location-master/new` | Create location |
| `/admin/location-master/[id]` | Edit location |
| `/admin/leads` | Leads table + "Add Lead" button |
| `/admin/leads/[id]` | Lead detail + CRM actions |
| `/admin/payments` | Payments table + "Add Payment" modal |
| `/admin/settings` | Admin account management |

### API Routes
| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/leads` | POST | Public | Create lead (sources: contact_form, cta_banner, hero_form, package_enquiry) |
| `/api/locations` | GET | Public | List active locations (ISR 3600s) |
| `/api/razorpay/create-order` | POST | Public | Create Razorpay order using `packageSlug` |
| `/api/razorpay/verify` | POST | Public | Verify HMAC signature, create lock_in lead |
| `/api/revalidate` | GET | Secret param | On-demand ISR |
| `/api/auth/[...nextauth]` | GET/POST | — | NextAuth handler |
| `/api/admin/packages` | GET/POST | JWT | List/create packages |
| `/api/admin/packages/[id]` | GET/PATCH/DELETE | JWT | Package CRUD |
| `/api/admin/services` | GET/POST | JWT | List/create services |
| `/api/admin/services/[id]` | GET/PATCH/DELETE | JWT | Service CRUD |
| `/api/admin/services/categories` | GET | JWT | List all category slugs |
| `/api/admin/leads` | GET/POST | JWT | Paginated leads with filters + manual create |
| `/api/admin/leads/[id]` | GET/PATCH | JWT | Lead detail + status/notes update |
| `/api/admin/leads/export` | GET | JWT | CSV export |
| `/api/admin/locations` | GET/POST | JWT | List/create locations |
| `/api/admin/locations/[id]` | GET/PATCH/DELETE | JWT | Location CRUD |
| `/api/admin/payments` | GET/POST | JWT | List/create payments |
| `/api/admin/payments/[id]` | PATCH/DELETE | JWT | Update/delete payment |
| `/api/admin/upload` | POST | JWT | Image upload to storage provider |
| `/api/admin/settings/admins` | GET/POST | JWT | List/create admins |
| `/api/admin/settings/admins/[id]` | PATCH | JWT | Toggle admin active status |

---

## Key Architectural Decisions

### Package to Service Linking
Packages belong to services via `categorySlugs[]`. The Service model stores a **tree** of categories. On `/services/[slug]`, the page flattens all category slugs (parent + children) and queries `Package.find({ categorySlugs: { $in: allSlugs } })`.

On `/packages`, client-side filtering uses `slugPrefixes` (defined in `PackagesFilterClient.tsx`) to match `categorySlugs` by prefix.

### Package Filter URL Persistence
`PackagesFilterClient` syncs state with URL query params: `?q=`, `?service=`, `?destination=`, `?sort=`. This enables shareable URLs and page-refresh resilience. Component must be wrapped in `<Suspense>` because it uses `useSearchParams()`.

### Destination System
`Location` model stores admin-managed destinations. Public `/destinations` page shows cards by type (domestic/international). Clicking a card navigates to `/packages?destination=<name>` which pre-filters the package list. `ImageUploader` enforces 3:4 aspect ratio for location images.

### Package Domestic/International Toggle
`isInternational: boolean` on Package determines the destination input UI in `PackageForm`: false → India states dropdown (from `INDIA_STATES` constant), true → free-text TagInput.

### GST Display on Package Detail
`gst: 0 | 5 | 8 | 18` on Package. When non-zero, the price card in `/packages/[slug]` shows a GST breakdown: base + GST amount + total. Sticky bar also shows `+X% GST applicable`.

### Package Enquiry Modal (CTAs)
`PackageEnquiryCTA` and `PackageEnquiryCTABar` are client components that wrap the sidebar/sticky-bar CTAs with a "Book a Call" button that opens `EnquiryModal`. The modal pre-fills the package name and POSTs to `/api/leads` with `source: "package_enquiry"`.

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

### Image Validation in ImageUploader
`ImageUploader` accepts optional `maxSizeMB` and `aspectConstraint` props. When `aspectConstraint` is set, the component checks the image ratio client-side before uploading and shows a user-friendly error with links to squoosh.app and canva.com.

---

## Component Map

### Public Components (`src/app/components/`)
- `Navbar` — Home-only nav. "Destinations" → `/destinations`, "Contact" → `/contact`
- `StaticHeader` — Logo + nav for non-home pages. Same link updates as Navbar
- `FloatingCTA` — Fixed WhatsApp + call button, shown on home page only
- `LeadCaptureForm` — Used in HeroSection, CTABannerSection, ContactSection; POSTs to `/api/leads`
- `AnimatedCounter` — Used in StatsSection
- `ScrollReveal` — Framer Motion reveal wrapper

### Public Components (`src/components/`)
- `packages/PackageCard` — Card used on both `/packages` and `/services/[slug]`; links to `/packages/[slug]`
- `packages/PackagesFilterClient` — Client search + destination + service filter + sort + URL params sync
- `packages/ItineraryAccordion` — Day-by-day accordion on package detail page
- `packages/LockInButton` — Razorpay payment widget on package detail
- `packages/EnquiryModal` — Modal with "Book a Call" form, pre-filled with package info
- `packages/PackageEnquiryCTA` — Sidebar booking buttons with modal trigger
- `packages/PackageEnquiryCTABar` — Sticky bar booking buttons with modal trigger
- `services/PackageListClient` — Client category + destination filter sidebar + grid for `/services/[slug]`
- `services/CategorySidebar` — Tree-category filter sidebar (desktop + mobile overlay)

### Home Sections (`src/app/sections/`)
Active: HeroSection, TrendingDestinations, SpecialsSection, ServicesSection, FeaturedTripsSection, WhyChooseSection, StatsSection, TestimonialsSection, CTABannerSection, ContactSection, FooterSection

HeroSection search now navigates to `/packages?q=<destination>&date=<date>` instead of scrolling to #contact.

Commented out in `page.tsx`: `<ProcessSection />`, `<NewsletterSection />`

### Admin Components (`src/app/admin/`)
- `_components/AdminSidebar` — Nav: Dashboard, Packages, Services, Locations, Leads, Payments, Settings
- `_components/AdminTopbar` — User info + sign out
- `_components/PackageForm` — Full package editor. Includes GST radio, isInternational toggle, India states dropdown
- `_components/ItineraryEditor` — Drag-and-drop day ordering (`@hello-pangea/dnd`)
- `_components/RichTextEditor` — Tiptap with image + link extensions
- `_components/ImageUploader` — react-dropzone + size/ratio validation + upload to `/api/admin/upload`
- `_components/TagInput` — Comma-separated tag input
- `_components/PackageCategorySelect` — Fetches categories from `/api/admin/services/categories`
- `(portal)/leads/_components/LeadsTable` — Table with filters
- `(portal)/leads/_components/AddLeadButton` — Modal to manually create leads
- `(portal)/leads/[id]/_components/LeadActions` — Status + notes update
- `(portal)/location-master/_components/LocationForm` — Form for creating/editing locations
- `(portal)/location-master/_components/LocationsTableClient` — Table with delete action
- `(portal)/payments/_components/PaymentsClient` — Payments table + "Add Payment" modal

---

## Brand Constants (`src/app/lib/constants.ts`)

```ts
BRAND.phone    = "011 7106 9431"
BRAND.mobile   = "+91 9319053504"   // used for WhatsApp links
BRAND.email    = "info@nirakt.com"

INDIA_STATES   = [...]  // 36 states/UTs for package domestic destination dropdown
```

All WhatsApp links use: `https://wa.me/${BRAND.mobile.replace(/\D/g, "")}?text=...`

All call links use: `tel:${BRAND.mobile.replace(/\s/g, "")}`

---

## Navigation & Link Structure

```
/ (home)
  ├── #home, #services, #about  (anchor nav on home only)
  ├── /destinations  (nav link — Location cards page)
  ├── /packages      (nav link)
  ├── /contact       (nav link — replaces #contact anchor)
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

/destinations  (location cards, click → /packages?destination=<name>)

/contact  (contact info + lead form)

/packages  (?q=, ?service=, ?destination=, ?sort= URL params preserved)
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
      ├── /admin/location-master
      │   ├── /admin/location-master/new
      │   └── /admin/location-master/[id]
      ├── /admin/leads
      │   └── /admin/leads/[id]
      ├── /admin/payments
      └── /admin/settings
```

---

## Known Issues / Watch-outs

1. **Razorpay verify bug**: `amountPaid: 0` is hardcoded in `/api/razorpay/verify/route.ts` instead of using the actual payment amount from Razorpay.
2. **Email not wired**: `EMAILJS_CONFIG` in constants has placeholder values. Lead forms POST to `/api/leads` only — no email notification is sent.
3. **Footer tag links**: `FOOTER_TAGS` in FooterSection all link to `#contact`, not to filtered package search.
4. **`images.unoptimized: true`**: All `<Image>` components serve unoptimized images — no automatic WebP/resizing.
5. **React Compiler**: Do not manually add `useMemo`/`useCallback` — the compiler handles memoization.
6. **`useSearchParams` needs Suspense**: Any component using `useSearchParams()` must be wrapped in `<Suspense>` at the page boundary. `PackagesFilterClient` is already wrapped on the packages page.
7. **Admin PUT vs PATCH**: The packages API uses PUT for updates (not PATCH). The `PackageForm` sends `method: "PUT"` to `/api/admin/packages/[id]`.

---

## Seed Script

```bash
npm run seed:services
# runs: npx tsx scripts/add-service-to-db.ts
```

Seeds the 5 service documents into MongoDB. Run once on a new DB.
