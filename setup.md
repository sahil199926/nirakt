# Nirakt Travels — Landing Page Build Specification

## 1. Project Context & Brand Identity

**Client:** Nirakt Travels (a brand of Yantu Ventures Pvt. Ltd.)  
**Tagline:** "Your Journey, Our Promise"  
**Location:** Delhi, India — Regional Office: 1/9, Ground Floor, Indira Vikas, Opposite Nirankari School, Dr. Mukherjee Nagar, Delhi-110009  
**Contact:** 011 7106 9431 | +91 9319053504 | info@nirakt.com  
**Social:** /nirakt_travels  
**Current State:** No website exists. This is the first digital presence.

### 1.1 What Nirakt Travels Offers

Nirakt Travels is a full-service travel agency curating handcrafted experiences across India and abroad. They are "dream makers" — not just a travel agency.

**Service Categories:**
1. **Domestic Escapes** — Himachal, Uttarakhand, Rajasthan, Kerala, North East India
2. **International Holidays** — Bali, Thailand, Dubai, Maldives, Singapore & beyond
3. **Couple Journeys** — Honeymoon specials, Pre-wedding trips, Romantic surprises
4. **Spiritual Yatras** — Chardham Yatra, Dham Yatra, Pilgrimage circuits across India
5. **Corporate & Educational Tours** — Team outings, Group travel, Student trips
6. **Customized Packages** — Tailor-made experiences
7. **Religious Yatra & Pilgrimage Tours** — 5/12 Jyotirlinga Darshan, Shankhpeeth Yatra, Temple Circuits, Spiritual Retreats, Festivals, Religious Fair Visits
8. **Pan-India Trekking Destinations** — North, North-East, West, South, Central & East India
9. **Couple's Celebration, Event & Pre-Wedding Shoots** — Honeymoon Tours, Anniversary Getaways, Luxury Couple Tours, Beach & Mountain Escapes
10. **Proposal Setup / Surprise Planning & Romantic Events on Tour** — Private Yacht, Boat Dinner, Rooftop Dining, Poolside Candlelight Dining, Drone Coverage
11. **Leisure / Vacation Trips & International Travel** — Family Holidays, Beach Holidays, Honeymoon Packages, Cultural & Travel Services, Southeast Asia Tours, Europe & UK Packages, Dubai & Middle East
12. **Event Services & Destination Wedding (Mini & Grand)** — Palace Wedding, Beach Wedding, Luxury Resort Wedding, Heritage & Cultural Locations

**Brand Differentiators (Why Choose Nirakt):**
- Personalized Journeys — tailor-made packages that fit budget, style, and dreams
- Hidden Gems & Iconic Destinations — from world-famous landmarks to secret, unexplored spots
- Comfort & Care — Handpicked stays, seamless transfers, packages usually include breakfast & dinner
- Special Touches — Surprise arrangements for honeymoons, anniversaries, pre-wedding trips, couple getaways
- Diverse Expertise — Religious yatras, luxury escapes, corporate tours, group adventures — all under one roof
- Trusted Companion — 24x7 support and experienced team
- Expert Local Guides & Authentic Experiences
- Luxury & Budget Options — something for every traveler

**Vision:** To be India's most trusted travel companion. To make travel accessible, enriching, and extraordinary so every traveler returns home with a heart full of happiness and a story worth sharing.

---

## 2. Design System — Ocean Breeze Theme

### 2.1 Color Palette

| Role | Color Name | Hex | Tailwind Token | Usage |
|------|-----------|-----|----------------|-------|
| **Primary** | Deep Teal | `#006B8F` | `--color-primary` | Headers, primary buttons, key text, nav links |
| **Secondary** | Ocean Blue | `#00A8C6` | `--color-secondary` | Gradients, hover states, sub-headings, links |
| **Accent** | Coral Accent | `#FF6B35` | `--color-accent` | CTAs, highlights, badges, urgent elements |
| **Tertiary** | Turquoise | `#40E0D0` | `--color-tertiary` | Decorative accents, icons, borders, card accents |
| **Background** | Sand | `#F5F5DC` | `--color-background` | Section backgrounds, light fills |
| **Surface** | White | `#FFFFFF` | `--color-surface` | Cards, forms, content bands |
| **Text Primary** | Deep Teal | `#006B8F` | `--color-text-primary` | Body text on light backgrounds |
| **Text Light** | White | `#FFFFFF` | `--color-text-light` | Text on dark/image backgrounds |
| **Text Muted** | Ocean Blue | `#007A99` | `--color-text-muted` | Secondary/muted text |
| **Footer BG** | Deep Teal | `#006B8F` | `--color-footer-bg` | Footer background |

### 2.2 Typography

| Role | Font | Weight | Size (mobile → desktop) | Tracking |
|------|------|--------|------------------------|----------|
| **Display/H1** | Playfair Display (Google Fonts) | 700 | 40px → 72px | -0.02em |
| **H2 Section** | Playfair Display | 600 | 32px → 48px | -0.01em |
| **H3 Card** | Inter (Google Fonts) | 600 | 20px → 24px | 0 |
| **Body** | Inter | 400 | 16px → 18px | 0.01em |
| **Label/Tag** | Inter | 500 | 12px → 14px | 0.08em |
| **CTA Button** | Inter | 600 | 14px → 16px | 0.02em |
| **Nav Link** | Inter | 500 | 14px → 15px | 0.01em |

**Font loading:** Use `next/font/google` for Playfair Display and Inter with `display: 'swap'`.

### 2.3 Spacing Scale

- **Section vertical padding:** 80px mobile → 120px desktop
- **Container max-width:** 1280px centered
- **Container horizontal padding:** 16px mobile → 48px desktop
- **Card gap:** 16px mobile → 32px desktop
- **Element gap (within sections):** 24px mobile → 40px desktop

### 2.4 Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 8px |
| Cards | 16px |
| Images | 12px |
| Badges/Tags | 9999px (full) |
| Inputs | 8px |
| Modal | 20px |

### 2.5 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-card` | `0 4px 20px rgba(0, 107, 143, 0.08)` | Cards resting |
| `shadow-card-hover` | `0 8px 32px rgba(0, 107, 143, 0.15)` | Cards on hover |
| `shadow-button` | `0 4px 16px rgba(255, 107, 53, 0.35)` | Primary CTA buttons |
| `shadow-nav` | `0 2px 12px rgba(0, 107, 143, 0.06)` | Fixed navigation |

---

## 3. Architecture & Dependencies

### 3.1 Libraries to Install

```bash
# Core animation
npm install framer-motion gsap @gsap/react

# Scroll animations
npm install lenis

# Icons
npm install lucide-react

# Form handling (lead capture)
npm install react-hook-form @hookform/resolvers zod

# Email integration (for lead form submission)
npm install @emailjs/browser

# Carousel/slider for testimonials & destinations
npm install embla-carousel-react embla-carousel-autoplay

# Copy to clipboard (for phone numbers)
npm install react-copy-to-clipboard

# Confetti for booking confirmation
npm install canvas-confetti
npm install -D @types/canvas-confetti
```

**Verify all packages are installed correctly before proceeding.**

### 3.2 shadcn/ui Components to Add

```bash
npx shadcn add button card badge input textarea label dialog sheet separator
npx shadcn add carousel form scroll-area
```

### 3.3 File Structure

```
my-app/
├── app/
│   ├── page.tsx                    # Main landing page (composes all sections)
│   ├── layout.tsx                  # Root layout with fonts, metadata, providers
│   ├── globals.css                 # Global styles, Tailwind directives, CSS variables
│   ├── loading.tsx                 # Loading fallback
│   ├── not-found.tsx               # 404 page
│   │
│   ├── sections/                   # Page sections (in scroll order)
│   │   ├── HeroSection.tsx         # Full-bleed hero with video background + lead form
│   │   ├── WhyChooseSection.tsx    # "Why Choose Nirakt" — brand differentiators
│   │   ├── ServicesSection.tsx     # 6 service category cards with icons
│   │   ├── FeaturedTripsSection.tsx # Highlighted trip packages (3 cards)
│   │   ├── ProcessSection.tsx      # "How It Works" — 3-step booking flow
│   │   ├── TestimonialsSection.tsx # Social proof carousel
│   │   ├── StatsSection.tsx        # Trust numbers banner
│   │   ├── CTABannerSection.tsx    # Mid-page lead capture banner
│   │   ├── ContactSection.tsx      # Contact info + full lead form
│   │   └── FooterSection.tsx       # Footer with links & social
│   │
│   ├── components/                 # Reusable components
│   │   ├── Navbar.tsx              # Fixed navigation bar
│   │   ├── LeadCaptureForm.tsx     # Shared lead capture form component
│   │   ├── FloatingCTA.tsx         # Persistent floating CTA button
│   │   ├── SectionHeading.tsx      # Reusable section heading (label + h2)
│   │   ├── DestinationCard.tsx     # Destination/trip card component
│   │   ├── ServiceCard.tsx         # Service category card
│   │   ├── TestimonialCard.tsx     # Testimonial slide card
│   │   ├── ProcessStep.tsx         # How-it-works step component
│   │   ├── AnimatedCounter.tsx     # Animated number counter
│   │   ├── ScrollReveal.tsx        # Scroll-triggered animation wrapper
│   │   ├── GradientText.tsx        # Gradient text effect
│   │   ├── ParticlesBackground.tsx # Decorative particle background
│   │   └── ConfettiButton.tsx      # Button with confetti effect
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useScrollPosition.ts    # Track scroll position for navbar
│   │   ├── useInView.ts            # Intersection observer hook
│   │   ├── useLenis.ts             # Lenis smooth scroll hook
│   │   └── useMediaQuery.ts        # Responsive breakpoint hook
│   │
│   ├── lib/                        # Utility functions
│   │   ├── utils.ts                # shadcn utility (cn function)
│   │   ├── constants.ts            # All constants (colors, services, destinations, testimonials)
│   │   └── validations.ts          # Zod schemas for form validation
│   │
│   └── types/                      # TypeScript types
│       └── index.ts                # All shared TypeScript interfaces
│
├── components/ui/                  # shadcn/ui components (auto-generated)
│
├── public/
│   ├── images/
│   │   ├── hero-bg.mp4             # Hero background video
│   │   ├── hero-bg-fallback.jpg    # Hero poster/fallback image
│   │   ├── destinations/           # Destination photos (compressed WebP)
│   │   ├── services/               # Service category icons
│   │   └── testimonials/           # Customer avatar photos
│   └── fonts/                      # Self-hosted fonts (if needed)
│
├── next.config.js                  # Next.js config (output: export, images)
├── tailwind.config.ts              # Tailwind config with custom tokens
├── tsconfig.json                   # TypeScript config
└── package.json
```

### 3.4 Tailwind Config Customization

Extend `tailwind.config.ts` with:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#006B8F',
      secondary: '#00A8C6',
      accent: '#FF6B35',
      tertiary: '#40E0D0',
      sand: '#F5F5DC',
      surface: '#FFFFFF',
      'text-muted': '#007A99',
      'footer-bg': '#005A7A',
    },
    fontFamily: {
      display: ['var(--font-playfair)', 'serif'],
      body: ['var(--font-inter)', 'sans-serif'],
    },
    boxShadow: {
      'card': '0 4px 20px rgba(0, 107, 143, 0.08)',
      'card-hover': '0 8px 32px rgba(0, 107, 143, 0.15)',
      'button': '0 4px 16px rgba(255, 107, 53, 0.35)',
      'nav': '0 2px 12px rgba(0, 107, 143, 0.06)',
    },
    animation: {
      'fade-in': 'fadeIn 0.6s ease-out forwards',
      'slide-up': 'slideUp 0.6s ease-out forwards',
      'slide-down': 'slideDown 0.4s ease-out forwards',
      'scale-in': 'scaleIn 0.4s ease-out forwards',
      'float': 'float 6s ease-in-out infinite',
      'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      slideUp: {
        '0%': { opacity: '0', transform: 'translateY(30px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      slideDown: {
        '0%': { opacity: '0', transform: 'translateY(-20px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      scaleIn: {
        '0%': { opacity: '0', transform: 'scale(0.95)' },
        '100%': { opacity: '1', transform: 'scale(1)' },
      },
      float: {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-10px)' },
      },
      pulseGlow: {
        '0%, 100%': { boxShadow: '0 4px 16px rgba(255, 107, 53, 0.35)' },
        '50%': { boxShadow: '0 8px 24px rgba(255, 107, 53, 0.55)' },
      },
    },
  },
},
```

---

## 4. Landing Page Sections (Scroll Order)

### SECTION 1: Navigation Bar (Fixed)

**Purpose:** Persistent navigation for quick access to key actions.

**Layout:**
- Fixed top, full-width, z-50
- Height: 72px desktop / 64px mobile
- Background: `transparent` → `rgba(255,255,255,0.95)` + `backdrop-blur-md` on scroll
- Shadow: `shadow-nav` only when scrolled

**Left:** Nirakt Travels logo wordmark (text "NIRAKT" in Playfair Display 700, "Travels" in Inter 400) in primary color.

**Center (desktop only):** Nav links — Home, Destinations, Services, About, Contact. Smooth-scroll to section anchors. Font: Inter 500, 15px, primary color. Hover: secondary color with underline animation.

**Right:**
- "Call Now" button — accent (coral) background, white text, small size, phone icon
- "Plan My Trip" button — primary (teal) background, white text, medium size
- Mobile: hamburger menu → sheet drawer with nav links + CTA buttons

**Behavior:** On scroll > 50px, navbar gains white semi-transparent background + shadow.

---

### SECTION 2: Hero Section

**Purpose:** Immediate emotional hook + primary lead capture. The highest-value real estate on the page.

**Layout:** Full viewport height (100vh). Video background with dark overlay.

**Background:** Full-bleed looping MP4 video (aerial ocean/beach/destination footage, ~10s loop) at `object-cover`. Fallback: static hero image poster. Overlay: `linear-gradient(135deg, rgba(0,107,143,0.75) 0%, rgba(0,168,198,0.6) 100%)`.

**Content (centered, max-width 720px):**
- **Tag line (label):** "INDIA'S MOST TRUSTED TRAVEL COMPANION" — Inter 500, 14px, white, letter-spacing 0.08em, uppercase
- **Headline:** "Your Journey, Our Promise — Unforgettable Travels Await" — Playfair Display 700, 48px mobile → 72px desktop, white, text-shadow for readability
- **Sub-headline:** "From spiritual yatras to romantic getaways, handcrafted journeys across India & beyond — personalized to your dreams and budget." — Inter 400, 18px mobile → 20px desktop, white/90% opacity, max-width 600px
- **CTA Row (flex, gap-4, centered):**
  - Primary: "Plan My Trip — It's Free" — accent (coral) background, white text, large size, rounded-lg, shadow-button, arrow-right icon. Smooth-scrolls to ContactSection.
  - Secondary: "Explore Destinations" — transparent background, white border 2px, white text, large size. Smooth-scrolls to ServicesSection.
- **Trust badges row (flex, gap-6, centered, mt-8):**
  - "24/7 Support" + Phone icon
  - "5000+ Happy Travelers" + Users icon
  - "100+ Destinations" + MapPin icon
  — All: Inter 500, 14px, white/80%, with icon 18px

**Lead Capture Form (hero overlay card):**
Positioned as a floating card (glassmorphism effect) on the right side of the hero on desktop (`absolute right-12 top-1/2 -translate-y-1/2`), stacked below content on mobile.

Card specs:
- Background: `rgba(255,255,255,0.12)` + `backdrop-blur-xl` + `border: 1px solid rgba(255,255,255,0.2)`
- Border-radius: 20px
- Padding: 32px
- Width: 380px
- Shadow: `0 8px 32px rgba(0,0,0,0.2)`

Form fields (inside the card):
- **Card Title:** "Get a Free Trip Quote" — Playfair 600, 24px, white
- **Subtitle:** "Our travel expert will call you within 30 minutes" — Inter 400, 14px, white/70%
- **Name** input (text, required)
- **Phone/WhatsApp** input (tel, required, validate Indian mobile: /^[6-9]\d{9}$/)
- **Destination Interest** select dropdown: "Select Destination Type" with options: Spiritual Yatra, Honeymoon / Couple Trip, Domestic Holiday, International Holiday, Trekking & Adventure, Corporate Tour, Wedding / Event, Other
- **Travel Date** input (date picker, min = today)
- **Submit button:** "Get My Free Quote" — accent background, full width, white text, Inter 600, 16px, rounded-lg, shadow-button
- **Privacy note:** "We respect your privacy. No spam, ever." — Inter 400, 12px, white/50%, Lock icon

**Form validation:** Zod schema — Name (min 2 chars), Phone (valid Indian mobile), Destination (required), Travel Date (required, must be future date).

**On submit:** Show loading state → trigger confetti → show success message ("Thank you! Our travel expert will call you shortly.") → reset form.

**Animation:**
- Video: plays automatically, muted, looped
- Tag line: fadeIn + slideDown, delay 0.2s
- Headline: fadeIn + slideUp, delay 0.4s
- Sub-headline: fadeIn + slideUp, delay 0.6s
- CTA buttons: fadeIn + slideUp, delay 0.8s
- Form card: fadeIn + slideUp, delay 1.0s
- Trust badges: fadeIn, delay 1.2s

---

### SECTION 3: Why Choose Nirakt Section

**Purpose:** Build trust by answering "Why us?" within the first scroll.

**Layout:** White background, centered content. py-24.

**SectionHeading component:**
- Label: "WHY CHOOSE NIRAKT" — uppercase, Inter 500, 14px, secondary color, letter-spacing 0.08em
- H2: "Crafted With Care, Delivered With Love" — Playfair 600, 36px mobile → 48px desktop, primary color
- Subtext: "We're not just travel planners — we're memory makers." — Inter 400, 18px, text-muted

**Grid:** 3 columns desktop, 2 tablet, 1 mobile. Gap 32px. mt-16.

6 feature cards (each using ServiceCard component):

1. **Personalized Journeys** — Compass icon (tertiary bg circle) — "Every traveler is unique. We design tailor-made packages that fit your budget, style, and dreams."
2. **Hidden Gems & Iconic Destinations** — MapPin icon — "From world-famous landmarks to secret, unexplored spots — we bring you experiences that others miss."
3. **Comfort & Care** — HeartHandshake icon — "Handpicked stays, seamless transfers, and packages that usually include meals. Travel stress-free."
4. **24/7 Trusted Support** — Headphones icon — "With round-the-clock support and an experienced team, we don't just plan trips — we walk with you on the journey."
5. **Special Touches** — Sparkles icon — "Surprise arrangements for honeymoons, anniversaries, pre-wedding trips, and couple getaways that make moments unforgettable."
6. **Diverse Expertise** — Globe icon — "Religious yatras, luxury escapes, corporate tours, trekking adventures, destination weddings — all under one roof."

Each card:
- White background, shadow-card, rounded-2xl, p-8
- Icon: 56px circle with tertiary color at 15% opacity, icon 28px in primary color
- Title: Inter 600, 20px, primary
- Description: Inter 400, 16px, text-muted, mt-3
- Hover: shadow-card-hover, translateY(-4px), border: 1px solid tertiary/30, transition 300ms ease

**Animation:** Cards stagger in on scroll (ScrollReveal wrapper). Each card: fadeIn + slideUp, stagger 0.1s.

---

### SECTION 4: Services Section

**Purpose:** Showcase the breadth of services to qualify all visitor types.

**Layout:** Sand (`#F5F5DC`) background. py-24.

**SectionHeading:**
- Label: "OUR SERVICES"
- H2: "Something For Every Kind of Traveler"
- Subtext: "From spiritual pilgrimages to luxury beach escapes — discover your perfect journey."

**Grid:** 4 columns desktop, 2 tablet, 1 mobile. Gap 24px. mt-16.

8 service cards (4 visible initially, 4 on "View All" expand):

1. **Spiritual Yatras** — Lotus icon — "Chardham Yatra, Jyotirlinga circuits, temple tours & sacred pilgrimages across India."
2. **Honeymoon & Couple Trips** — Heart icon — "Romantic getaways to Bali, Maldives, Kerala, Goa & more with surprise arrangements."
3. **Domestic Holidays** — Mountain icon — "Explore Himachal, Rajasthan, Kerala, North East, Goa & 100+ Indian destinations."
4. **International Tours** — Plane icon — "Bali, Thailand, Dubai, Maldives, Singapore, Europe & beyond — visa assistance included."
5. **Trekking & Adventure** — TentTree icon — "Pan-India trekking — Himalayas, Western Ghats, North East & hidden trails."
6. **Corporate & Group Tours** — Building2 icon — "Team outings, MICE events, student trips & group travel with seamless logistics."
7. **Destination Weddings** — Rings icon — "Palace weddings in Rajasthan, beach weddings in Goa, luxury resort celebrations."
8. **Proposal & Surprise Planning** — Gift icon — "Private yacht dinners, rooftop setups, drone coverage, cinematic photography."

Each card:
- Sand-tinted white background (`#FAFAF0`), rounded-2xl, overflow-hidden
- Top: colored image area (gradient from primary to secondary, 160px height, with large outlined icon centered)
- Bottom: p-6, title (Inter 600, 18px, primary), description (Inter 400, 15px, text-muted, mt-2)
- Hover: entire card scales 1.02, image area gradient shifts to secondary-to-tertiary

**"View All Services" button:** Centered below grid. Outline style, primary border, primary text. Toggles remaining 4 cards with smooth height animation.

**Animation:** Cards fadeIn + slideUp on scroll, stagger 0.08s.

---

### SECTION 5: Featured Trips Section

**Purpose:** Concrete package examples to spark desire and show pricing context.

**Layout:** White background. py-24.

**SectionHeading:**
- Label: "FEATURED JOURNEYS"
- H2: "Handpicked Experiences You'll Love"
- Subtext: "Popular packages crafted by our travel experts. Limited slots available!"

**Grid:** 3 columns desktop, 1 mobile. Gap 32px. mt-16.

3 featured trip cards (DestinationCard component):

1. **Kedarnath-Badrinath Yatra** — "12 Days Spiritual Journey" — "Experience divine bliss in the Himalayas. Includes helicopter option, VIP darshan, comfortable stays & guided rituals."
   - Price: "From ₹24,999/person"
   - Badge: "Most Popular"
   - Rating: 4.9 (128 reviews)

2. **Kerala Romance Package** — "7 Days Couple Getaway" — "Backwaters, tea gardens, beach sunsets & candlelight dinners. Perfect for honeymooners & couples."
   - Price: "From ₹18,499/person"
   - Badge: "Best Seller"
   - Rating: 4.8 (96 reviews)

3. **Bali Paradise Escape** — "6 Days International" — "Ubud rice terraces, temple tours, beach clubs & luxury villa stay. Visa assistance included."
   - Price: "From ₹34,999/person"
   - Badge: "Trending"
   - Rating: 4.9 (214 reviews)

Each card:
- White background, shadow-card, rounded-2xl, overflow-hidden
- Image: top, 240px height, object-cover, with subtle zoom on hover
- Badge: absolute top-4 left-4, accent bg, white text, 12px, px-3 py-1, rounded-full
- Content: p-6
  - Duration: Inter 500, 13px, secondary, Clock icon
  - Title: Inter 600, 20px, primary
  - Description: Inter 400, 15px, text-muted, 2 lines max
  - Footer (flex between, mt-4, pt-4, border-t):
    - Price: Playfair 600, 22px, accent
    - Rating: flex, Star icon (gold), "4.9" Inter 600, "(128)" Inter 400, text-muted
- Hover: shadow-card-hover, image scale 1.05

**Animation:** Cards fadeIn + slideUp, stagger 0.15s.

---

### SECTION 6: How It Works (Process) Section

**Purpose:** Reduce friction by showing how easy it is to book.

**Layout:** Gradient background (linear-gradient 135deg, primary to secondary). py-24. White text.

**SectionHeading (light variant):**
- Label: "HOW IT WORKS" — tertiary color
- H2: "Your Dream Trip, 3 Simple Steps" — white
- Subtext: "We handle the details. You enjoy the journey." — white/70%

**3 steps (horizontal on desktop, vertical on mobile):**

1. **Tell Us Your Dream** — MessageCircle icon (56px, tertiary bg) — "Share your destination, dates, budget & preferences. Call us, WhatsApp, or fill the form."
2. **We Craft Your Itinerary** — FileEdit icon — "Our experts design a personalized plan with handpicked stays, transfers & activities within 24 hours."
3. **Pack Your Bags** — Backpack icon — "Review, confirm & pay securely. We handle bookings, permits & all logistics. Just show up & enjoy!"

Each step:
- Centered content, max-width 320px
- Icon: 72px circle with `rgba(64,224,208,0.2)` bg, icon 32px tertiary color
- Connector line: dashed line between steps (desktop only), 2px, white/30%
- Step number: "01" / "02" / "03" — Playfair 700, 48px, white/15%
- Title: Inter 600, 20px, white
- Description: Inter 400, 16px, white/70%

**CTA below steps:** "Start Your Journey" button — accent bg, white text, large, shadow-button. Scrolls to ContactSection.

**Animation:** Steps stagger in. Icons scale-in, content slides up.

---

### SECTION 7: Stats / Trust Banner Section

**Purpose:** Immediate credibility through numbers.

**Layout:** Sand background. py-16. Full-width.

**4 stats in a row (flex, justify-around, max-width 1000px centered):**

1. **5,000+** — "Happy Travelers" — Users icon
2. **100+** — "Destinations Covered" — Map icon
3. **7+** — "Years of Experience" — Calendar icon
4. **24/7** — "Customer Support" — Headphones icon

Each stat:
- Number: Playfair 700, 48px mobile → 64px desktop, primary color. Uses AnimatedCounter component.
- Label: Inter 500, 16px, text-muted
- Icon: 32px, secondary color, above the number

**Animation:** Numbers count up from 0 when scrolled into view. Duration 2s, ease-out.

---

### SECTION 8: Testimonials Section

**Purpose:** Social proof — the #1 trust builder for travel bookings.

**Layout:** White background. py-24.

**SectionHeading:**
- Label: "TRAVELER STORIES"
- H2: "What Our Guests Say"
- Subtext: "Real experiences from real travelers who trusted Nirakt with their journeys."

**Carousel (Embla):** Auto-play, 4s delay, loop.

5 testimonial slides (TestimonialCard):

1. "Our Kedarnath yatra was flawlessly organized. The VIP darshan, comfortable stays, and our guide's knowledge made this spiritual journey truly divine." — **Rahul & Family**, Delhi — 5 stars — Spiritual Yatra
2. "Nirakt planned our honeymoon to Kerala and surprised us with a private candlelight dinner on the backwaters. It was magical!" — **Priya & Arjun**, Mumbai — 5 stars — Honeymoon
3. "The Bali trip exceeded all expectations — from the villa stay to the Instagram-worthy spots they recommended. Hassle-free and memorable!" — **Sneha K.**, Bangalore — 5 stars — International
4. "Our corporate offsite in Manali was perfectly executed. 45 people, zero hiccups. The team bonding activities were a hit!" — **Vikram S.**, HR Head, TechCorp — 5 stars — Corporate
5. "From proposal planning in Udaipur to the palace wedding — Nirakt made every moment picture perfect. Forever grateful!" — **Ananya & Rohan**, Jaipur — 5 stars — Wedding

Each card:
- White background, shadow-card, rounded-2xl, p-8
- Opening quote mark: Playfair 700, 72px, secondary/20%
- Quote text: Inter 400, 18px, primary, italic
- Footer (mt-6, pt-6, border-t, flex items-center, gap-4):
  - Avatar: 48px circle, gradient bg (primary to secondary), initials in white
  - Name: Inter 600, 16px, primary
  - Location + Trip type: Inter 400, 14px, text-muted
  - Stars: 5 filled gold stars

**Carousel controls:** Dot indicators below, clickable. Auto-advance.

**Animation:** Cards slide in from right on scroll. Carousel auto-plays.

---

### SECTION 9: CTA Banner Section

**Purpose:** Mid-page lead capture — catch visitors who scrolled past the hero form.

**Layout:** Full-width gradient (primary → secondary). py-20.

**Content (centered, max-width 700px):**
- H2: "Ready to Start Your Journey?" — Playfair 700, 36px, white
- Subtext: "Speak to a travel expert today. Free consultation, no obligation." — Inter 400, 18px, white/80%
- **Inline form (flex row desktop, stacked mobile, gap-3, mt-8):**
  - Name input (white bg, rounded-lg, flex-1)
  - Phone input (white bg, rounded-lg, flex-1)
  - "Get Free Call Back" button (accent bg, white text, Inter 600, px-8)
- **Trust line:** "We'll call you within 30 min | No spam promise" — Inter 400, 13px, white/60%, Lock icon

**Animation:** FadeIn + slideUp on scroll.

---

### SECTION 10: Contact Section

**Purpose:** Full contact details + comprehensive lead capture form.

**Layout:** White background. py-24.

**Two-column layout (desktop):** Left 40% contact info, Right 60% form.

**Left column:**
- H2: "Let's Plan Your Trip" — Playfair 600, 36px, primary
- Subtext: "Visit us, call us, or drop a message. We're here to make your travel dreams real."
- **Contact cards (stacked, gap-4, mt-8):**
  1. **Phone** — Phone icon — "011 7106 9431" + "+91 9319053504" — clickable, copy-on-click
  2. **Email** — Mail icon — "info@nirakt.com" — mailto link
  3. **Address** — MapPin icon — "1/9, Ground Floor, Indira Vikas, Opposite Nirankari School, Dr. Mukherjee Nagar, Delhi-110009"
  4. **WhatsApp** — MessageCircle icon — "+91 9319053504" — wa.me link
  5. **Social** — Instagram, Facebook, YouTube icons — links to /nirakt_travels

Each contact card: flex row, gap-4, p-4, rounded-xl, sand bg on hover.

**Right column — Full Lead Form:**
Card with shadow-card, rounded-2xl, p-8.

Fields (2-column grid for name/phone on desktop):
1. **Full Name** — text input, required
2. **Phone/WhatsApp** — tel input, required, Indian mobile validation
3. **Email** — email input, optional
4. **Destination Interest** — select: Spiritual Yatra, Honeymoon/Couple, Domestic Holiday, International Holiday, Trekking/Adventure, Corporate Tour, Wedding/Event, Other
5. **Preferred Destination** — text input
6. **Travel Date** — date picker
7. **Number of Travelers** — number input, min 1
8. **Budget Range** — select: Under ₹10,000, ₹10,000-₹25,000, ₹25,000-₹50,000, ₹50,000-₹1,00,000, ₹1,00,000+, Flexible
9. **Message** — textarea, placeholder "Tell us more about your dream trip..."
10. **Submit:** "Send My Enquiry" — accent bg, full width, white text, Inter 600

**Form validation:** Zod schema. Phone, Name, Destination type, and Travel date are required. Email must be valid if provided. Budget and travelers optional.

**On submit:** Loading spinner → Success toast: "Thank you! Our travel expert will contact you within 30 minutes." → Reset form.

**Animation:** Left column slides in from left, right from right. Form fields stagger in.

---

### SECTION 11: Footer Section

**Layout:** Deep teal (`#005A7A`) background. pt-16 pb-8.

**4-column grid (desktop), 2 (tablet), 1 (mobile):**

**Column 1 — Brand:**
- "NIRAKT Travels" wordmark — Playfair 700, 24px, white
- Tagline: "Your Journey, Our Promise" — Inter 400, 14px, white/60%
- Brief: "India's trusted travel companion for spiritual journeys, romantic getaways, and handcrafted adventures." — Inter 400, 14px, white/50%

**Column 2 — Quick Links:**
- Home, Destinations, Services, About Us, Contact, Blog (future)
- Inter 400, 15px, white/70%. Hover: white.

**Column 3 — Services:**
- Spiritual Yatras, Honeymoon Packages, Domestic Tours, International Holidays, Trekking & Adventure, Corporate Tours, Destination Weddings
- Inter 400, 15px, white/70%. Hover: white.

**Column 4 — Contact:**
- Phone: 011 7106 9431
- Mobile: +91 9319053504
- Email: info@nirakt.com
- Address: Delhi, India
- Social icons row: Instagram, Facebook, YouTube, LinkedIn — 24px, white/60%, hover white

**Bottom bar:**
- Separator (white/10%)
- "© 2025 Nirakt Travels by Yantu Ventures Pvt. Ltd. All rights reserved." — Inter 400, 13px, white/40%
- "Privacy Policy | Terms of Service" — links

---

### SECTION 12: Floating CTA (Fixed)

**Purpose:** Persistent conversion opportunity on every scroll position.

**Layout:** Fixed bottom-right, z-40. 16px from edges.

**Elements:**
- **"Plan My Trip" pill button** — accent bg, white text, Inter 600, 14px, shadow-lg, rounded-full, px-6 py-3, Plane icon + text
- **WhatsApp FAB** — circular, #25D366 green bg, white WhatsApp icon, 56px diameter, shadow-lg, 8px below pill button

**Behavior:** Appears after scrolling 400px. Slides up from bottom (translateY 100% → 0). Gentle pulse animation on the pill button.

**On click (pill):** Smooth-scrolls to ContactSection form.
**On click (WhatsApp):** Opens wa.me/+919319053504

---

## 5. Animation & Interaction Specifications

### 5.1 Global Animations

| Animation | Trigger | Details |
|-----------|---------|---------|
| **Page load** | On mount | Navbar fades in (0.3s). Hero elements stagger in (see Section 4). |
| **Smooth scroll** | Global | Lenis smooth scroll with lerp 0.1, duration 1.2. Applied in root layout. |
| **Scroll reveal** | In-view (threshold 0.15) | All section content wraps in ScrollReveal. Elements fade in + translateY(30px → 0), duration 0.6s, ease-out. Stagger children 0.1s. |
| **Section headings** | In-view | Label fades in first (0.3s), then H2 slides up (0.4s, delay 0.1s), then subtext (0.4s, delay 0.2s). |

### 5.2 Hover Effects

| Element | Effect | Duration |
|---------|--------|----------|
| **Cards** | translateY(-4px), shadow-card-hover, border tint | 300ms |
| **Buttons (primary)** | brightness(1.1), translateY(-1px), shadow intensify | 200ms |
| **Nav links** | Color → secondary, underline slides in from left | 200ms |
| **Service card images** | scale(1.05) | 400ms |
| **Destination cards** | Image scale(1.05), card shadow intensify | 300ms |
| **Footer links** | Color → white | 150ms |

### 5.3 Micro-interactions

| Interaction | Details |
|-------------|---------|
| **Form input focus** | Border → secondary, subtle glow shadow |
| **Form submit** | Button scales 0.98 on click, loading spinner |
| **Copy phone** | Click phone → "Copied!" tooltip, 2s |
| **Counter animation** | Numbers count from 0, 2s duration, easeOutExpo |
| **Floating CTA** | Gentle translateY(0 ↔ -4px) loop, 3s |
| **Confetti** | 60 particles, spread 55, origin y 0.7, on form success |

### 5.4 Performance Rules

- Use `will-change: transform, opacity` only on actively animating elements.
- Remove `will-change` after animation completes (GSAP onComplete).
- Use `transform` and `opacity` only for animations — no layout-triggering properties.
- Images: Use Next.js `Image` with `priority` on above-fold images. Lazy-load below-fold.
- Videos: `preload="none"` on non-hero videos. Hero video: compressed MP4, < 5MB.
- Fonts: `next/font/google` with `display: 'swap'`, `subsets: ['latin']`.
- Animations respect `prefers-reduced-motion` — disable all motion, show content immediately.

---

## 6. Lead Generation Strategy

### 6.1 Lead Capture Points (5 total)

1. **Hero Form** (highest priority) — Name, Phone, Destination type, Travel date
2. **CTA Banner Form** — Name, Phone (inline, minimal friction)
3. **Contact Section Full Form** — Complete 9-field enquiry form
4. **Floating CTA** — Scrolls to contact form
5. **Navbar CTA** — "Plan My Trip" + "Call Now" buttons

### 6.2 Form Submission Strategy

**Primary (recommended):** Use EmailJS to send form data directly to info@nirakt.com.
- Service ID, Template ID, and Public Key configured in `lib/constants.ts`.
- Form data mapped to email template variables.

**Fallback:** Store submissions in a Google Sheet via Apps Script webhook (URL in constants).

### 6.3 Conversion Optimization Features

| Feature | Implementation |
|---------|----------------|
| **Urgency** | "Limited slots available" badges on featured trips |
| **Scarcity** | "Our expert will call within 30 min" — fast response promise |
| **Trust** | Stats banner, testimonials, "No spam" privacy notes |
| **Low friction** | Hero form asks only 4 fields; phone-only options |
| **Multiple CTAs** | 5 capture points across the page |
| **Sticky CTA** | Floating button always visible after hero |
| **Social proof** | 5 testimonials with names, locations, trip types |
| **Phone click-to-call** | All phone numbers are tel: links |
| **WhatsApp direct** | Floating WhatsApp FAB + contact card |

---

## 7. SEO & Metadata

### 7.1 Meta Tags (layout.tsx)

```typescript
export const metadata: Metadata = {
  title: 'Nirakt Travels | Your Journey, Our Promise — India\'s Trusted Travel Agency',
  description: 'Plan your dream trip with Nirakt Travels. Spiritual yatras, honeymoon packages, domestic & international tours, trekking, corporate trips & destination weddings. Free consultation!',
  keywords: 'travel agency Delhi, Nirakt Travels, spiritual yatra, Chardham Yatra, honeymoon packages, Kerala tour, Bali package, trekking India, destination wedding, corporate travel',
  openGraph: {
    title: 'Nirakt Travels | Your Journey, Our Promise',
    description: 'India\'s trusted travel companion. Handcrafted spiritual journeys, romantic getaways & adventures across India & beyond.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: 'index, follow',
  alternates: {
    canonical: 'https://www.nirakt.com',
  },
};
```

### 7.2 Structured Data (JSON-LD)

Include LocalBusiness schema with:
- @type: TravelAgency
- Name: Nirakt Travels
- Address: Full Delhi address
- Phone: both numbers
- Email: info@nirakt.com
- URL: https://www.nirakt.com
- PriceRange: ₹₹
- OpeningHours: Mo-Su 00:00-23:59 (24/7)

### 7.3 Performance Targets

- **Lighthouse Performance:** 90+
- **LCP:** < 2.5s
- **FID:** < 100ms
- **CLS:** < 0.1
- **FCP:** < 1.8s

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| **Mobile** | < 640px | Single column, stacked forms, hamburger nav, floating CTA only |
| **Tablet** | 640-1024px | 2-column grids, side-by-side hero content |
| **Desktop** | > 1024px | Full 3-4 column layouts, hero form side-by-side, all nav visible |

---

## 9. Implementation Task Order

### Phase 1: Project Foundation

**Task 1.1:** Install all npm dependencies listed in Section 3.1. Verify with `npm list`.

**Task 1.2:** Add all shadcn/ui components listed in Section 3.2.

**Task 1.3:** Configure `tailwind.config.ts` with all custom tokens from Section 3.4.

**Task 1.4:** Set up `app/layout.tsx`:
- Import Playfair Display and Inter via `next/font/google`
- Set CSS variables for fonts
- Add metadata (Section 7.1)
- Add JSON-LD structured data script tag
- Wrap children with Lenis smooth scroll provider

**Task 1.5:** Set up `app/globals.css`:
- Tailwind directives (@tailwind base/components/utilities)
- CSS custom properties for all colors
- Base styles (smooth scroll, selection color in primary)
- Reduced motion media query

**Task 1.6:** Create `app/types/index.ts` with all TypeScript interfaces:
```typescript
interface ServiceCardProps { icon: LucideIcon; title: string; description: string; }
interface DestinationCardProps { image: string; title: string; duration: string; description: string; price: string; badge: string; rating: number; reviewCount: number; }
interface TestimonialProps { quote: string; name: string; location: string; tripType: string; rating: number; }
interface ProcessStepProps { number: string; icon: LucideIcon; title: string; description: string; }
interface ContactInfoProps { icon: LucideIcon; label: string; value: string; href?: string; }
interface LeadFormData { name: string; phone: string; email?: string; destinationType: string; preferredDestination?: string; travelDate: string; travelers?: number; budget?: string; message?: string; }
```

**Task 1.7:** Create `app/lib/constants.ts` with all data:
- Service cards array (8 items)
- Featured trips array (3 items)
- Testimonials array (5 items)
- Process steps array (3 items)
- Stats array (4 items)
- Contact info object
- Navigation links array
- Form dropdown options (destination types, budget ranges)
- EmailJS config (service ID, template ID, public key)
- Brand info

**Task 1.8:** Create `app/lib/validations.ts` with Zod schemas:
```typescript
const heroFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  destinationType: z.string().min(1, 'Please select a destination type'),
  travelDate: z.string().refine((val) => new Date(val) > new Date(), { message: 'Travel date must be in the future' }),
});

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  destinationType: z.string().min(1, 'Please select a destination type'),
  preferredDestination: z.string().optional(),
  travelDate: z.string().refine((val) => new Date(val) > new Date(), { message: 'Travel date must be in the future' }),
  travelers: z.number().min(1).optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
});
```

### Phase 2: Reusable Components

**Task 2.1:** Create `ScrollReveal` component using Framer Motion's `useInView`:
- Wraps children with motion.div
- Props: `direction?: 'up' | 'down' | 'left' | 'right'`, `delay?: number`, `duration?: number`, `className?: string`
- Default: fadeIn + slideUp, 0.6s, triggered at 15% visibility
- Respects `prefers-reduced-motion`

**Task 2.2:** Create `SectionHeading` component:
- Props: `label: string`, `title: string`, `subtitle?: string`, `light?: boolean` (white text for dark backgrounds)
- Uses ScrollReveal for staggered animation
- Centered alignment by default

**Task 2.3:** Create `AnimatedCounter` component:
- Props: `target: number`, `suffix?: string`, `duration?: number`
- Uses `useInView` to trigger count animation
- Counts from 0 to target over 2s with easeOutExpo easing
- Displays integer values only

**Task 2.4:** Create `LeadCaptureForm` component (shared):
- Props: `variant: 'hero' | 'banner' | 'full'`, `onSuccess?: () => void`
- Hero: 4 fields (name, phone, destinationType, travelDate)
- Banner: 2 fields (name, phone) — compact inline
- Full: all 9 fields in grid layout
- Uses react-hook-form + zodResolver for validation
- Integrates EmailJS for submission
- Shows loading state, then success message
- Triggers confetti on success (hero/full variants)

**Task 2.5:** Create `ConfettiButton` component:
- Wraps a button, triggers canvas-confetti on click
- Configurable particle count, spread, colors (primary, secondary, accent, tertiary)

**Task 2.6:** Create `GradientText` component:
- Applies `bg-gradient-to-r` from secondary to tertiary
- `bg-clip-text text-transparent`

**Task 2.7:** Create `FloatingCTA` component:
- Fixed positioning, bottom-right
- Shows after 400px scroll (useScrollPosition hook)
- "Plan My Trip" pill + WhatsApp FAB
- Slide-up entrance animation

### Phase 3: Section Components (in order)

**Task 3.1:** Build `Navbar` component:
- Fixed positioning, transition on scroll
- Logo (text-based: NIRAKT + Travels)
- Desktop nav links with smooth scroll
- Mobile hamburger → Sheet drawer
- Two CTA buttons (Call Now, Plan My Trip)
- Background transitions from transparent to white/blur on scroll

**Task 3.2:** Build `HeroSection`:
- Full viewport video background with gradient overlay
- Centered text content (tag, headline, sub-headline, CTAs, trust badges)
- Floating glassmorphism form card (right side desktop, below on mobile)
- Uses LeadCaptureForm (hero variant)
- All entrance animations with staggered delays
- Video: autoPlay, muted, loop, playsInline

**Task 3.3:** Build `WhyChooseSection`:
- White background
- SectionHeading component
- 6-card grid using ServiceCard
- Each card: icon circle, title, description
- ScrollReveal stagger animation

**Task 3.4:** Build `ServicesSection`:
- Sand background
- SectionHeading
- 4 visible + 4 expandable service cards
- Each card: gradient image area + content
- "View All Services" toggle button
- Expand/collapse animation with AnimatePresence

**Task 3.5:** Build `FeaturedTripsSection`:
- White background
- SectionHeading
- 3 destination cards with image, badge, content, price, rating
- Card hover effects

**Task 3.6:** Build `ProcessSection`:
- Gradient background (primary → secondary)
- 3 steps with icons, titles, descriptions
- Dashed connector lines between steps (desktop)
- CTA button linking to contact

**Task 3.7:** Build `StatsSection`:
- Sand background
- 4 animated counters in a row
- AnimatedCounter component for number animation

**Task 3.8:** Build `TestimonialsSection`:
- White background
- SectionHeading
- Embla carousel with 5 testimonial cards
- Auto-play, dot indicators
- Quote styling with decorative quote marks

**Task 3.9:** Build `CTABannerSection`:
- Gradient background
- Heading, subtext, inline form (LeadCaptureForm banner variant)
- Trust line below form

**Task 3.10:** Build `ContactSection`:
- Two-column layout
- Left: contact info cards (phone, email, address, WhatsApp, social)
- Right: full lead form (LeadCaptureForm full variant)
- Click-to-copy for phone numbers
- mailto: and wa.me: links

**Task 3.11:** Build `FooterSection`:
- 4-column layout with brand, links, services, contact
- Social icon row
- Bottom bar with copyright

### Phase 4: Page Assembly & Polish

**Task 4.1:** Assemble `app/page.tsx`:
- Import all sections in correct order
- Render sequentially with no wrappers except fragment
- Ensure proper spacing between sections

**Task 4.2:** Create `app/loading.tsx`:
- Simple loading spinner centered on screen
- Primary teal color

**Task 4.3:** Create `app/not-found.tsx`:
- 404 page with friendly message
- "Take Me Home" button linking to /

**Task 4.4:** Configure `next.config.js`:
- `output: 'export'` for static site generation
- Image optimization settings
- TrailingSlash: true

**Task 4.5:** Add smooth scrolling:
- Initialize Lenis in a client component (SmoothScroll provider)
- Wrap in root layout
- Connect to GSAP ScrollTrigger

### Phase 5: TypeScript Cleanup

**Task 5.1:** Run `tsc --noEmit` to identify all TypeScript errors.

**Task 5.2:** Fix all `any` types — replace with proper interfaces.

**Task 5.3:** Ensure all component props have explicit type annotations.

**Task 5.4:** Verify all event handlers have typed parameters (`React.FormEvent`, `React.MouseEvent`, etc.).

**Task 5.5:** Check all `useRef` hooks have proper generic types.

**Task 5.6:** Verify all imported Lucide icons have valid type imports.

**Task 5.7:** Ensure all async functions have proper return type annotations and error handling.

**Task 5.8:** Run `npm run build` to verify the build succeeds with zero TypeScript errors.

**Task 5.9:** Run `tsc --noEmit` one final time to confirm clean TypeScript compilation.

---

## 10. Asset Requirements

### Images to Source

| Asset | Format | Dimensions | Notes |
|-------|--------|------------|-------|
| Hero video | MP4 (H.264) | 1920x1080 | Aerial ocean/beach/destination montage, < 5MB, 10s loop |
| Hero fallback | JPG/WebP | 1920x1080 | Stunning tropical beach aerial view |
| Kedarnath trip | WebP | 800x600 | Himalayan temple landscape |
| Kerala trip | WebP | 800x600 | Backwaters with houseboat |
| Bali trip | WebP | 800x600 | Rice terraces or beach temple |
| 8 service images | SVG | - | Simple line illustrations or gradient backgrounds with icons |
| 5 testimonial avatars | - | 96x96 | Gradient circles with initials (generated) |

### Videos

| Asset | Format | Duration | Notes |
|-------|--------|----------|-------|
| Hero background | MP4 (H.264) | 10s loop | Aerial shots of Indian + international destinations: beaches, mountains, temples, backwaters. Cinematic, slow-motion feel. |

Use Next.js `Image` component with proper `sizes` and `loading="lazy"` for all below-fold images.

---

## 11. Notes for the Agent

- **Next.js 16 App Router** is the framework. All components are Server Components by default. Use `'use client'` only for interactive components (forms, carousels, animations, hooks).
- **Color discipline:** Every color must come from the design system tokens. No arbitrary hex values in components.
- **Font discipline:** Headings always Playfair Display, body always Inter. No system font fallbacks in visible text.
- **Animation discipline:** All scroll-triggered animations use the ScrollReveal wrapper. No inline Framer Motion in section files except for complex cases.
- **Accessibility:** All images have alt text. All form inputs have labels. Color contrast meets WCAG AA. Focus states visible. Keyboard navigable.
- **Mobile-first:** Write styles for mobile, enhance with `sm:`, `md:`, `lg:` breakpoints.
- **No external CSS frameworks** beyond Tailwind + shadcn. No Bootstrap, no Material UI.
- **Form submissions:** Configure EmailJS credentials in constants.ts. Test form submission works end-to-end.
- **Hero video:** Use `video` HTML element with `autoPlay muted loop playsInline`. Provide JPG fallback poster.
