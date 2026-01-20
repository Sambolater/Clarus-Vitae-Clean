# 05 - TREATMENT DATABASE & DISCOVERY
## Clarus Vitae Platform - Treatment-First Discovery

> **Estimated Time**: 5-6 hours
> **Dependencies**: Task 01, Task 02, Task 03
> **Blocks**: None (can run parallel with Task 04)

---

## Objective

Build the treatment/modality database pages that enable "treatment-first discovery" - allowing sophisticated users to search by treatment ("Where can I get EBOO therapy?") rather than only by property.

---

## Context

Many Clarus Vitae users start their research with a specific treatment in mind:
- "Which clinics offer Prenuvo full-body MRI?"
- "Where can I get stem cell therapy in Europe?"
- "Who has the best NAD+ protocols?"

This inverts the typical property-first model and positions Clarus Vitae as a true research authority.

---

## Routes

```
/treatments                           # Treatment listing
/treatments/[slug]                    # Treatment profile
/treatments/category/[category]       # Category filtered
/diagnostics                          # Diagnostic listing
/diagnostics/[slug]                   # Diagnostic profile
/equipment/[slug]                     # Equipment profile
```

---

## Treatment Categories

```typescript
enum TreatmentCategory {
  DIAGNOSTICS        // Imaging, testing, assessment
  REGENERATIVE       // Stem cells, PRP, exosomes, peptides
  CELLULAR           // NAD+, mitochondrial, senolytics
  DETOXIFICATION     // Plasma exchange, EBOO, chelation, fasting
  HYPERBARIC         // HBOT variations
  CRYOTHERAPY        // Whole body, localized
  IV_THERAPIES       // Nutrient IVs, ozone, Myers
  HORMONE            // Optimization, replacement, peptides
  AESTHETIC          // Non-surgical rejuvenation
  BODY_MANUAL        // Physiotherapy, osteopathy, massage
  MIND_NEURO         // Neurofeedback, psychotherapy, stress protocols
  TRADITIONAL        // Ayurveda, TCM, naturopathy
}
```

---

## Page Requirements

### 1. Treatment Listing Page (`/treatments`)

**Layout**:
- Hero with search bar ("Search treatments, therapies, diagnostics...")
- Category navigation (horizontal scroll on mobile)
- Treatment grid
- Sidebar filters (desktop)

**Filters**:
- Category (checkboxes)
- Evidence level (checkboxes)
- Price range (slider)
- Property tier availability (which tiers offer it)

**Sorting**:
- Alphabetical
- Most available (property count)
- Evidence level (strong first)

**Treatment Card Display**:
```
┌─────────────────────────────────┐
│ [Icon/Image]                     │
├─────────────────────────────────┤
│ Treatment Name                   │
│ [Category Badge]                 │
│                                  │
│ [Evidence Level Indicator]       │
│                                  │
│ "Brief description..."           │
│                                  │
│ Available at XX properties       │
│ $X,XXX - $XX,XXX                 │
│                                  │
│ [View Treatment]                 │
└─────────────────────────────────┘
```

### 2. Treatment Profile Page (`/treatments/[slug]`)

**URL Example**: `/treatments/nad-iv-therapy`

**Page Sections**:

#### Hero Section
- Treatment name with category badge
- Evidence level indicator (prominent)
- Brief description (1-2 sentences)
- Key stats: Properties offering, typical price range

#### What Is It?
- Plain language explanation
- Accessible to non-medical readers
- Include common names/aliases

#### How It Works
- Mechanism of action (simplified)
- What happens during treatment
- Typical protocol (frequency, duration)

#### What It Addresses
- Conditions/goals this treatment targets
- Use visual chips/tags

#### Evidence & Research
- Evidence level explanation
- Summary of research (1-2 paragraphs)
- Link to studies (optional)
- Clear disclaimer about not being medical advice

#### Potential Considerations
- Possible side effects
- Contraindications
- Who should consult before
- Medical disclaimer prominent

#### Equipment Variations (if applicable)
- Different machines/brands
- How they differ
- Link to equipment profiles

#### Where To Get It
- Grid of properties offering this treatment
- Filter by: Location, Tier, Price
- Quick compare functionality
- Link to full property profiles

#### Related Treatments
- Similar/complementary treatments
- "If you're interested in X, also consider Y"

#### Expert Perspective (optional)
- Quote from medical professional
- Team member commentary

---

### 3. Diagnostic Profile Page (`/diagnostics/[slug]`)

Similar structure to treatment, but focused on:
- What it measures
- What results mean
- How often to do it
- Properties offering this diagnostic

### 4. Equipment Profile Page (`/equipment/[slug]`)

- Equipment name and brand
- What it does
- How it differs from alternatives
- Properties that have this equipment
- Related treatments using this equipment

---

## Evidence Level Display

Critical visual component showing research backing:

```typescript
enum EvidenceLevel {
  STRONG         // Multiple RCTs, meta-analyses
  MODERATE       // Some RCTs, consistent results
  EMERGING       // Limited studies, promising
  EXPERIMENTAL   // Early research, theoretical
  TRADITIONAL    // Historical use, limited modern research
}
```

**Visual Treatment**:
- STRONG: Green badge, filled
- MODERATE: Teal badge, filled
- EMERGING: Gold badge, partial fill
- EXPERIMENTAL: Gray badge, outline
- TRADITIONAL: Warm brown badge, pattern

Each should have tooltip explaining what the level means.

---

## Medical Disclaimer

**CRITICAL**: Every treatment page must include a medical disclaimer.

**Placement**:
- Below hero section (subtle but visible)
- Above "Where To Get It" section
- Sticky footer on mobile (optional)

**Language** (from legal docs):
> The information provided is for educational purposes only and is not intended as medical advice. Individual results vary. Always consult with qualified healthcare providers before pursuing any treatment. Clarus Vitae does not endorse specific treatments or make claims about efficacy.

---

## Data Requirements

### Treatment Data Points
- Name, slug, aliases
- Category
- Description (plain language)
- How it works (mechanism)
- What it addresses (goals/conditions)
- Evidence level
- Evidence summary
- Typical protocol
- Price range (global average)
- Potential risks
- Contraindications
- Properties offering (relation)
- Equipment used (relation)

### Diagnostic Data Points
- Name, slug
- Category
- Description
- What it measures
- Results interpretation
- Recommended frequency
- Properties offering (relation)

### Equipment Data Points
- Name, slug
- Brand, model
- Category
- Description
- Capabilities
- Treatments using it (relation)
- Properties with it (relation)

---

## API Routes

```
GET /api/treatments
  ?category=REGENERATIVE
  &evidenceLevel=STRONG,MODERATE
  &sort=alphabetical
  &page=1

GET /api/treatments/[slug]
  - Full treatment data
  - Properties offering

GET /api/treatments/[slug]/properties
  ?country=Switzerland
  &tier=TIER_1
  &page=1

GET /api/diagnostics
  ?category=IMAGING
  &page=1

GET /api/diagnostics/[slug]

GET /api/equipment/[slug]
```

---

## SEO Requirements

### Treatment Page
```html
<title>[Treatment Name]: What It Is, Evidence & Where To Get It | Clarus Vitae</title>
<meta name="description" content="Learn about [Treatment Name]: how it works, research evidence ([Evidence Level]), and find [X] premium properties offering this treatment worldwide.">
```

### Structured Data
- MedicalTherapy schema (where applicable)
- FAQPage schema for treatment Q&A

---

## Component Usage

From `packages/ui`:
- `TreatmentCard` - Listing display
- `EvidenceLevel` - Evidence indicator
- `PropertyCard` - Mini version for "Where To Get It"
- `CategoryNav` - Category navigation
- `FilterSidebar` - Filters
- `MedicalDisclaimer` - Standard disclaimer

---

## Deliverables

1. **Treatment Listing Page**
   - Category navigation
   - Filters functional
   - Grid display
   - Search working

2. **Treatment Profile Page**
   - All sections implemented
   - Evidence display
   - Properties grid
   - Medical disclaimer

3. **Diagnostic Pages**
   - Listing and profile pages

4. **Equipment Pages**
   - Profile pages

5. **API Routes**
   - All endpoints functional

6. **Seed Data**
   - At least 30 treatments across categories
   - At least 15 diagnostics
   - At least 10 equipment items

---

## Verification Checklist

- [ ] Treatment listing loads correctly
- [ ] All categories filter properly
- [ ] Evidence level displays consistently
- [ ] "Where To Get It" shows correct properties
- [ ] Medical disclaimer appears on all pages
- [ ] Search finds treatments by name and aliases
- [ ] Mobile responsive throughout
- [ ] SEO meta tags correct
- [ ] Links to property profiles work

---

## Treatment Content Guidelines

When writing treatment descriptions:

1. **Plain Language**: Avoid jargon, explain terms
2. **No Claims**: Don't claim efficacy, use "may help with" or "designed to"
3. **Balanced**: Include both potential benefits and considerations
4. **Sourced**: Reference evidence where available
5. **Disclaimer**: Always include medical disclaimer
6. **Non-promotional**: Educational, not marketing

---

## Next Tasks

After completion:
- Task 06: Search & Filter (integrates treatment search)
- Task 09: Comparison Tool (can compare properties by treatment)
