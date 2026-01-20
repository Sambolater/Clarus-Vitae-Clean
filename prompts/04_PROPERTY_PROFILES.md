# 04 - PROPERTY PROFILES & LISTING PAGES
## Clarus Vitae Platform - Core Content Display

> **Estimated Time**: 6-8 hours
> **Dependencies**: Task 01, Task 02, Task 03
> **Blocks**: Task 09 (Comparison Tool)

---

## Objective

Build the property listing pages and individual property profile pages. This is the core content of the platform - where users discover, research, and evaluate wellness destinations.

---

## Context

Properties are categorized into three tiers:
- **Tier 1**: Medical Longevity ($20K-$150K)
- **Tier 2**: Integrated Wellness ($5K-$30K)
- **Tier 3**: Luxury Destination ($3K-$15K)

Each property displays:
- Clarus Index score (proprietary scoring)
- Dark data (info not publicly available)
- Cultural fit indicators
- Programs and pricing
- Treatments/diagnostics (Tier 1 & 2)
- Reviews with outcome tracking

---

## Routes

```
/properties                           # Main listing page
/properties/[slug]                    # Individual property profile
/properties/tier/medical-longevity    # Tier 1 filtered
/properties/tier/integrated-wellness  # Tier 2 filtered
/properties/tier/luxury-destination   # Tier 3 filtered
/properties/destination/[country]     # Country filtered
/properties/focus/[focus-area]        # Focus area filtered
```

---

## Page Requirements

### 1. Property Listing Page (`/properties`)

**Layout**:
- Hero section with search bar
- Filter sidebar (collapsible on mobile)
- Property grid (responsive: 1/2/3 columns)
- Pagination or infinite scroll

**Filters**:
- Tier (checkboxes)
- Location (country dropdown, region)
- Price range (slider)
- Focus areas (multi-select)
- Approach (clinical/integrative/holistic/lifestyle)
- Duration (program length)
- Clarus Index minimum score
- Verified Excellence only toggle
- Editor's Choice only toggle

**Sorting**:
- Clarus Index (high to low)
- Price (low to high / high to low)
- Newest
- Most reviewed

**Property Card Display**:
```
┌─────────────────────────────────┐
│ [Image]                    [Tier] │
│                           Badge  │
├─────────────────────────────────┤
│ Property Name                    │
│ Location, Country                │
│                                  │
│ [Score Badge: 87]  $XX,XXX+      │
│                                  │
│ [Focus] [Focus] [Focus]          │
│                                  │
│ "Brief description excerpt..."   │
│                                  │
│ [View Profile] [Quick Compare]   │
└─────────────────────────────────┘
```

### 2. Property Profile Page (`/properties/[slug]`)

**URL Structure**: `/properties/clinique-la-prairie`

**Page Sections**:

#### Hero Section
- Full-width image gallery (swipeable)
- Property name and tagline
- Tier badge
- Location with map link
- Clarus Index score (prominent)
- Quick facts sidebar:
  - Price range
  - Typical stay duration
  - Founded year
  - Capacity
- Primary CTA: "Request Information"
- Secondary CTA: "Add to Comparison"

#### What Makes This Property Notable (Editorial)
- 2-3 paragraphs of editorial assessment
- Written by named team member (link to profile)
- Last verified date

#### Clarus Index Breakdown
- Overall score with gauge visualization
- Individual dimension scores:
  - Clinical Rigor (Tier 1 only)
  - Outcome Evidence
  - Program Depth
  - Experience Quality
  - Value Alignment
- Explanation of what each score means
- Comparison to tier average

#### Programs Section
- Expandable program cards
- Each program shows:
  - Name and description
  - Duration
  - Price
  - Focus areas
  - Inclusions
  - Typical schedule

#### Treatments & Diagnostics (Tier 1 & 2)
- Grid of available treatments
- Link to treatment profile pages
- Equipment available
- Diagnostic capabilities

#### Dark Data / Insider Intel
- Clearly labeled proprietary section
- Verification badges for each data point
- Data points:
  - Physician-to-patient ratio
  - Average booking lead time
  - Return guest percentage
  - Actual vs. advertised customization
  - Post-visit follow-up reality
  - Celebrity/discretion protocols

#### Cultural Fit
- Relevant indicators only (don't show all)
- Gender-separated facilities
- Dietary accommodations
- Languages (medical staff)
- Privacy architecture
- Solo traveler friendliness

#### Practical Information
- Location details with map
- Getting there (nearest airport, transfer)
- Best time to visit
- Booking process
- What to pack
- Cancellation policy summary

#### Reviews Section
- Aggregate ratings
- Outcome data summary (if sufficient reviews)
- Filter by: Rating, Verified, Team Reviews
- Review cards with:
  - Ratings breakdown
  - Outcome achievement (Tier 1 & 2)
  - Review text
  - Reviewer context
  - Helpful count
- "Write a Review" CTA

#### Similar Properties
- 3-4 related properties
- Based on tier, focus area, location
- "Compare These" quick action

#### Sticky CTA Bar (Mobile)
- Fixed bottom bar
- "Request Info" and "Compare" buttons
- Price range display

---

## Data Fetching

### Listing Page
- Server-side rendered for SEO
- Filters applied via URL params
- Pagination with `page` param
- Cache with ISR (revalidate: 3600)

### Profile Page
- Server-side rendered for SEO
- Full property data fetched
- Reviews paginated client-side
- Static generation with fallback for new properties

---

## SEO Requirements

### Listing Page
```html
<title>Best Wellness Retreats & Longevity Clinics | Clarus Vitae</title>
<meta name="description" content="Discover the world's finest wellness destinations. Independent research on 200+ premium retreats and medical longevity clinics, rated by the Clarus Index.">
```

### Profile Page
```html
<title>[Property Name] Review & Analysis | Clarus Vitae</title>
<meta name="description" content="[Property Name] in [Location]: Clarus Index score [XX]/100. [Tier] wellness destination. Programs from $XX,XXX. Independent analysis and verified reviews.">
```

### Structured Data
- Organization schema
- LocalBusiness schema for properties
- Review schema for aggregate ratings
- BreadcrumbList schema

---

## Component Usage

From `packages/ui`:
- `PropertyCard` - Listing display
- `ScoreBadge` - Index score
- `ScoreBreakdown` - Full score display
- `TierBadge` - Tier indicator
- `ReviewCard` - Review display
- `FilterSidebar` - Filter controls
- `ImageGallery` - Property images
- `TabNav` - Profile sections
- `Button` - CTAs
- `Modal` - Quick compare, inquiry

---

## API Routes

```
GET /api/properties
  ?tier=TIER_1,TIER_2
  &country=Switzerland
  &priceMin=10000
  &priceMax=50000
  &focusAreas=LONGEVITY,DETOX
  &minScore=70
  &sort=score_desc
  &page=1
  &limit=12

GET /api/properties/[slug]
  - Full property data
  - Includes programs, treatments
  - Includes aggregated review stats

GET /api/properties/[slug]/reviews
  ?page=1
  &limit=10
  &sort=newest
  &verified=true
```

---

## Deliverables

1. **Listing Page**
   - Responsive grid layout
   - All filters functional
   - Sorting working
   - Pagination/infinite scroll
   - SEO optimized

2. **Profile Page**
   - All sections implemented
   - Image gallery
   - Clarus Index display
   - Programs section
   - Reviews integration
   - CTAs functional

3. **API Routes**
   - Listing endpoint with filters
   - Profile endpoint
   - Reviews endpoint

4. **Category Pages**
   - Tier filtered pages
   - Destination pages
   - Focus area pages

---

## Verification Checklist

- [ ] Listing page loads under 2 seconds
- [ ] Filters work correctly and persist in URL
- [ ] Profile pages are SEO-indexed correctly
- [ ] All property data displays correctly
- [ ] Score visualization is accurate
- [ ] Reviews section paginated
- [ ] Mobile responsive throughout
- [ ] CTAs link to correct actions
- [ ] Structured data validates

---

## Notes

- Always show data verification badges
- Never make medical claims - use "according to the property"
- Link treatments to treatment profile pages
- Handle missing data gracefully (don't show empty sections)
- Consider loading states for each section

---

## Next Tasks

- Task 09: Comparison Tool (uses property data)
- Task 10: Inquiry System (CTAs link here)
