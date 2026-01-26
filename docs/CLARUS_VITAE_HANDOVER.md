# Clarus Vitae - Complete Project Handover

**Version:** 1.0
**Date:** 2026-01-26
**Status:** MVP Ready for Content & Outreach

---

## 🎯 Executive Summary

Clarus Vitae is a **premium wellness intelligence platform** for ultra-high-net-worth individuals researching $3,000-$150,000 wellness retreats. Think "Michelin Guide for wellness" — independent, data-driven, privacy-first.

**Current State:** Core platform built and deployed. Database seeded with 28 properties and 48 treatments. Gallery images added. Ready for content polish and outreach.

---

## 🔗 Quick Links

| Resource | URL/Location |
|----------|--------------|
| **Live Site** | https://clarus-vitae-clean-vercel.vercel.app |
| **GitHub Repo** | https://github.com/Sambolater/Clarus-Vitae-Clean |
| **Vercel Dashboard** | https://vercel.com/agentics-advisory/clarus-vitae-clean-vercel |
| **Local Project** | `~/Documents/GitHub/Clarus-Vitae-Clean` |
| **Target Domain** | clarusvitae.com (GoDaddy — needs DNS setup) |

---

## 🏗️ Technical Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Framework | Next.js 14 (App Router) | SSR, TypeScript |
| Styling | Tailwind CSS | Brand colors configured |
| Database | PostgreSQL via Supabase | Prisma ORM |
| Monorepo | Turborepo + pnpm | Workspaces |
| Hosting | Vercel | Auto-deploy from main |
| CMS | Sanity (planned) | Not yet connected |

### Monorepo Structure

```
Clarus-Vitae-Clean/
├── apps/
│   ├── web/                 # Main Next.js application
│   └── cms/                 # Sanity Studio (future)
├── packages/
│   ├── database/            # Prisma schema & client
│   ├── ui/                  # Shared UI components
│   └── types/               # TypeScript definitions
├── docs/                    # Documentation
├── prompts/                 # Project briefs & guides
└── assets/                  # Logo, components, mockups
```

---

## 📊 Current Data State

### Properties (28 total)

**Tier 1 - Medical/Longevity (13):**
- Chenot Palace Weggis (Switzerland) — Score: 93
- Clinique La Prairie (Switzerland) — Score: 95
- SHA Wellness Clinic (Spain) — Score: 91
- Lanserhof Tegernsee (Germany) — Score: 90
- Palazzo Fiuggi (Italy) — Score: 89
- And 8 more...

**Tier 2 - Integrated Wellness (15):**
- Six Senses Douro Valley (Portugal) — Score: 83
- COMO Shambhala Estate (Bali) — Score: 86
- Ananda in the Himalayas (India) — Score: 84
- The Ranch Malibu (USA) — Score: 86
- Miraval Arizona (USA) — Score: 83
- And 10 more...

### Treatments (48 total)

Categories:
- Body Manual (Thai massage, Shiatsu, Reflexology, Watsu, Hot stone)
- Traditional (TCM, Ayurveda, Moxibustion)
- Mind/Neuro (EMDR, Sound healing, Meditation)
- Aesthetic (Microneedling, LED, Body contouring)
- Detox (Juice fasting, Liver flush)
- Regenerative (PRP, Stem cell)
- And more...

### Gallery Images (140 total)
- Each property has 6+ curated images
- Sourced from property media kits and Unsplash
- Displayed in swipeable hero gallery

---

## ✅ What's Complete

### Core Features
- [x] Homepage with hero, value props, featured retreats
- [x] Property browse page with grid layout
- [x] Property profile pages with:
  - Hero image gallery (click → fullscreen swipe)
  - Clarus Index score display
  - Overview and key metrics
  - Treatment offerings
  - Gallery section
- [x] Treatment browse page
- [x] Treatment profile pages
- [x] Comparison tool (basic)
- [x] Mobile responsive design
- [x] SiteHeader and SiteFooter components

### Data & Database
- [x] Prisma schema defined
- [x] All Tier 1 properties seeded
- [x] All Tier 2 properties seeded
- [x] 48 treatments seeded with evidence levels
- [x] Property-treatment relationships linked
- [x] Gallery images seeded (140 images)

### Deployment
- [x] Vercel deployment configured
- [x] Auto-deploy from main branch
- [x] Database connected (Supabase)
- [x] Environment variables set

### UI Polish
- [x] "Retreats" terminology (not "Properties")
- [x] Verified badge on property cards
- [x] Tier labels (EXCEPTIONAL/DISTINGUISHED)
- [x] Clean fullscreen gallery (no thumbnails)
- [x] Mobile hamburger menu functional

---

## 🚧 Remaining Work

### HIGH PRIORITY

#### 1. DNS Setup (clarusvitae.com)
**Status:** Domain owned on GoDaddy, not pointed to Vercel

**Steps:**
1. Go to GoDaddy → DNS Management
2. Add CNAME record: `www` → `cname.vercel-dns.com`
3. Add A record: `@` → `76.76.21.21`
4. In Vercel: Add domain `clarusvitae.com` + `www.clarusvitae.com`
5. Wait for SSL certificate (automatic)

#### 2. Content Integrity Fix
**Issue:** Advisory team section looked like "our doctors" but they're not staff

**Completed:** Fake advisory team removed (commit 7322c99)

**TODO:** Decide on replacement approach:
- Option A: "Peer-reviewed by retreat medical staff" — honest framing
- Option B: Add real advisors when available
- Option C: Remove entirely and focus on methodology

#### 3. Search Functionality
**Current:** Search tabs exist but don't filter

**TODO:**
- Wire up retreat search with filters (location, price, focus area)
- Wire up treatment search
- Build search results pages

### MEDIUM PRIORITY

#### 4. Inquiry System
- Add inquiry form to property pages
- Email notifications
- Lead capture to database
- Thank you confirmation page

#### 5. Property Content Polish
- Review each property description
- Ensure consistent tone (per Brand Guide)
- Add "Best For" sections
- Add "Considerations" (limitations)

#### 6. Images
- Some properties may need better hero images
- Ensure all images are optimized
- Add alt text for accessibility

### LOW PRIORITY (Do Last)

#### 7. SEO Optimization
- Meta tags for all pages
- Structured data (JSON-LD)
- Sitemap generation
- OpenGraph images

#### 8. Sanity CMS Connection
- Verify Sanity project credentials
- Connect editorial content
- Allow non-technical content updates

---

## 💻 Development Commands

```bash
# Navigate to project
cd ~/Documents/GitHub/Clarus-Vitae-Clean

# Install dependencies
pnpm install

# Start dev server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Generate Prisma client
pnpm --filter @clarus-vitae/database db:generate

# Open database GUI
pnpm --filter @clarus-vitae/database db:studio

# Push schema changes to database
pnpm --filter @clarus-vitae/database db:push

# Run seed scripts
pnpm --filter @clarus-vitae/database db:seed
```

### Git Workflow

```bash
# Always work on main
git checkout main
git pull origin main

# Make changes, then:
git add .
git commit -m "feat/fix/chore: description"
git push origin main

# Vercel auto-deploys on push to main
```

---

## 🎨 Brand Guidelines (Key Points)

### Voice
- **"Quiet authority"** — confident without being promotional
- Lead with evidence, not adjectives
- Acknowledge limitations explicitly
- Never use wellness clichés

### Forbidden Words
❌ "Transform," "journey," "curated," "world-class," "ultimate," "luxury," "rejuvenation," "pamper," "escape"

### Use Instead
✅ "Evaluated," "measured improvement," "protocol," "program," "evidence," "verified"

### Colors
| Name | HEX | Usage |
|------|-----|-------|
| Clarus Navy | #1A2B4A | Primary, CTAs |
| Clarus White | #FAFBFC | Backgrounds |
| Clarus Gold | #C9A962 | Index scores only (max 5%) |
| Slate | #64748B | Secondary text |
| Stone | #E8E6E3 | Borders |

### Typography
- Display: Cormorant Garamond
- Body: Inter
- Line length: 65-75 characters

### Index Scores
| Tier | Score | Treatment |
|------|-------|-----------|
| EXCEPTIONAL | 90-100 | Navy bg, Gold text |
| DISTINGUISHED | 80-89 | Navy bg, White text |
| NOTABLE | 70-79 | Slate bg |

---

## 🌐 Environment Variables

### Required in Vercel

```env
# Database (Supabase)
POSTGRES_PRISMA_URL=postgresql://...@...pooler.supabase.com:6543/postgres?pgbouncer=true
POSTGRES_URL_NON_POOLING=postgresql://...@...supabase.com:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Sanity (when ready)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
```

---

## 📁 Key Files Reference

### Pages
```
apps/web/app/page.tsx                    # Homepage
apps/web/app/properties/page.tsx         # Browse retreats
apps/web/app/properties/[slug]/page.tsx  # Retreat profile
apps/web/app/treatments/page.tsx         # Browse treatments
apps/web/app/treatments/[slug]/page.tsx  # Treatment profile
apps/web/app/compare/page.tsx            # Comparison tool
```

### Components
```
apps/web/app/_components/SiteHeader.tsx
apps/web/app/_components/SiteFooter.tsx
apps/web/app/_components/HomeSearch.tsx
packages/ui/src/components/Card/PropertyCard.tsx
```

### Database
```
packages/database/prisma/schema.prisma   # Database schema
packages/database/prisma/seed.ts         # Main seed script
packages/database/prisma/seed-tier2-expansion.ts
packages/database/prisma/seed-treatments-expansion.ts
packages/database/prisma/seed-gallery.ts
```

### Documentation
```
prompts/00_MASTER_PROJECT_BRIEF.md       # Full project spec
prompts/CV_Brand_Guide.md                # Brand guidelines
docs/DEPLOYMENT.md                       # Deployment guide
docs/ARCHITECTURE.md                     # Technical architecture
```

---

## 🚀 Outreach Readiness Checklist

Before contacting retreats for partnerships:

- [ ] clarusvitae.com DNS configured and live
- [ ] All links work (no 404s)
- [ ] Content tone consistent with Brand Guide
- [ ] Advisory/trust element resolved (honest framing)
- [ ] Inquiry form functional
- [ ] Mobile experience polished
- [ ] Load time under 2 seconds

---

## 🤖 Agent Prompt Template

When resuming work on this project, use this context:

```
You are working on Clarus Vitae — a premium wellness intelligence platform.

**Project Location:** ~/Documents/GitHub/Clarus-Vitae-Clean
**Live Site:** https://clarus-vitae-clean-vercel.vercel.app
**GitHub:** https://github.com/Sambolater/Clarus-Vitae-Clean
**Stack:** Next.js 14, Tailwind, Prisma, Supabase, Vercel

**Key Context:**
- This is a research platform for UHNW individuals investing $3K-$150K in wellness
- Voice: "quiet authority" — evidence over adjectives, acknowledge limitations
- Index scores: EXCEPTIONAL (90+), DISTINGUISHED (80-89)
- Currently deployed with 28 properties, 48 treatments, 140 gallery images

**Current Priorities:**
1. DNS setup for clarusvitae.com
2. Content integrity (no fake advisory team)
3. Search functionality
4. Inquiry system

**Before making changes:**
- Read prompts/CV_Brand_Guide.md for voice/style
- Check prompts/00_MASTER_PROJECT_BRIEF.md for product requirements
- Always `git pull origin main` before starting
- Test locally with `pnpm dev`
- Build passes with `pnpm build` before pushing

**Never do:**
- Use wellness clichés (transform, journey, luxury, etc.)
- Add features without checking existing implementation first
- Push to main without building first
```

---

## 📞 Contacts & Resources

| Resource | Details |
|----------|---------|
| Owner | Sam (Adelaide, Australia) |
| GitHub | Sambolater |
| Vercel Org | agentics-advisory |
| Domain Registrar | GoDaddy |

---

## 🗓️ Project Timeline

| Date | Milestone |
|------|-----------|
| 2026-01-26 | Platform deployed, data seeded, gallery complete |
| TBD | DNS configured, domain live |
| TBD | Content polish complete |
| TBD | Outreach to Tier 1 & 2 retreats begins |

---

*This handover document contains everything needed to continue development on Clarus Vitae. Reference the linked documents for deeper technical or brand guidance.*
