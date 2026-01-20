# 06 - SEARCH & FILTER SYSTEM
## Clarus Vitae Platform - Discovery Infrastructure

> **Estimated Time**: 4-5 hours
> **Dependencies**: Task 01, Task 02, Task 04, Task 05
> **Blocks**: None

---

## Objective

Build a comprehensive search and filter system that enables users to find properties and treatments through multiple discovery paths. Must be fast (<100ms), accurate, and support complex filtering.

---

## Context

Users discover content through multiple paths:
1. **Direct Search**: "Lanserhof", "NAD+ therapy", "Switzerland longevity"
2. **Filters**: Tier + Location + Price + Focus Area combinations
3. **Treatment-First**: "Where can I get [treatment]?"
4. **Goal-Based**: "I want [outcome]" → treatments → properties

The search must be:
- Extremely fast (UHNWI have no patience)
- Accurate (find what they're looking for)
- Smart (understand synonyms, misspellings)
- Comprehensive (properties, treatments, diagnostics, articles)

---

## Search Implementation

### Technology: Meilisearch

Self-hosted for privacy, fast full-text search with typo tolerance.

**Why Meilisearch**:
- Privacy-first (self-hosted)
- Sub-50ms response times
- Typo tolerance built-in
- Faceted filtering
- Easy to set up

### Indexes

#### Properties Index
```json
{
  "uid": "properties",
  "primaryKey": "id",
  "searchableAttributes": [
    "name",
    "description",
    "city",
    "country",
    "region"
  ],
  "filterableAttributes": [
    "tier",
    "approach",
    "focusAreas",
    "country",
    "priceMin",
    "priceMax",
    "overallScore",
    "published",
    "verifiedExcellence",
    "editorChoice"
  ],
  "sortableAttributes": [
    "overallScore",
    "priceMin",
    "name",
    "createdAt"
  ],
  "rankingRules": [
    "words",
    "typo",
    "proximity",
    "attribute",
    "sort",
    "exactness",
    "overallScore:desc"
  ]
}
```

#### Treatments Index
```json
{
  "uid": "treatments",
  "primaryKey": "id",
  "searchableAttributes": [
    "name",
    "aliases",
    "description",
    "whatItAddresses"
  ],
  "filterableAttributes": [
    "category",
    "evidenceLevel",
    "published"
  ],
  "sortableAttributes": [
    "name",
    "propertyCount"
  ]
}
```

#### Articles Index
```json
{
  "uid": "articles",
  "primaryKey": "id",
  "searchableAttributes": [
    "title",
    "excerpt",
    "content",
    "tags"
  ],
  "filterableAttributes": [
    "category",
    "published"
  ],
  "sortableAttributes": [
    "publishedAt"
  ]
}
```

---

## Search UI Components

### 1. Global Search Bar

Appears in header, accessible from any page.

**Features**:
- Type-ahead suggestions
- Grouped results (Properties, Treatments, Articles)
- Recent searches (stored locally, never sent to server in research mode)
- Keyboard navigation

**Behavior**:
```
User types: "lanse"
↓
Suggestions:
┌─────────────────────────────────┐
│ PROPERTIES                       │
│ • Lanserhof Tegernsee - Germany │
│ • Lanserhof Lans - Austria      │
│ • Lanserhof Sylt - Germany      │
│                                  │
│ TREATMENTS                       │
│ • (no matches)                   │
│                                  │
│ ARTICLES                         │
│ • "Inside Lanserhof's Approach" │
└─────────────────────────────────┘
```

### 2. Search Results Page (`/search`)

Full search results with filters.

**URL Structure**: `/search?q=stem+cells&type=treatments`

**Layout**:
- Search bar (pre-filled)
- Result type tabs (All, Properties, Treatments, Articles)
- Filter sidebar
- Results grid
- Pagination

### 3. Filter Sidebar

Reusable across listing pages.

**Property Filters**:
- Tier (checkboxes)
- Location (country dropdown, searchable)
- Price Range (dual slider)
- Focus Areas (multi-select chips)
- Approach (checkboxes)
- Duration Range (slider)
- Clarus Index Minimum (slider)
- Verified Excellence (toggle)
- Editor's Choice (toggle)

**Treatment Filters**:
- Category (checkboxes)
- Evidence Level (checkboxes)
- Available at Tier (checkboxes)

**Filter State**:
- Stored in URL params for shareability
- Persisted in session (optional)
- Clear all button
- Active filter count badge

### 4. Smart Suggestions

Suggest related searches based on:
- Popular searches
- Related terms
- Spelling corrections

---

## Filter Logic

### URL Parameter Mapping

```
/properties?tier=TIER_1,TIER_2&country=Switzerland&priceMin=20000&priceMax=100000&focus=LONGEVITY,DETOX&minScore=75&sort=score
```

### Filter Combinations

All filters should work in combination. Use AND logic within categories, OR logic between options in same category.

Example:
- Tier = TIER_1 OR TIER_2
- Country = Switzerland (exact match)
- Price = 20000-100000 (range)
- Focus = LONGEVITY OR DETOX
- Score >= 75

### Price Filter Logic

- Display in user's preferred currency (store preference)
- Filter on USD-equivalent in backend
- Show "Prices shown in USD" with currency toggle

---

## API Routes

```
GET /api/search
  ?q=search+query
  &type=all|properties|treatments|articles
  &limit=10

GET /api/search/suggestions
  ?q=partial+query
  &limit=5

GET /api/properties
  ?tier=TIER_1,TIER_2
  &country=Switzerland
  &priceMin=20000
  &priceMax=100000
  &focusAreas=LONGEVITY,DETOX
  &approach=CLINICAL,INTEGRATIVE
  &minScore=75
  &verifiedOnly=true
  &sort=score_desc
  &page=1
  &limit=12

GET /api/treatments
  ?category=REGENERATIVE,CELLULAR
  &evidenceLevel=STRONG,MODERATE
  &sort=name_asc
  &page=1
  &limit=20
```

---

## Search Indexing

### Sync Strategy

1. **Initial Index**: Bulk index all published content
2. **Real-time Updates**: Webhook on database changes
3. **Scheduled Reindex**: Daily full reindex (safety net)

### Index Management

```typescript
// packages/database/src/search.ts

export async function indexProperty(property: Property) {
  await meiliClient.index('properties').addDocuments([{
    id: property.id,
    name: property.name,
    description: property.description,
    city: property.city,
    country: property.country,
    region: property.region,
    tier: property.tier,
    approach: property.approach,
    focusAreas: property.focusAreas,
    priceMin: property.priceMin,
    priceMax: property.priceMax,
    overallScore: property.overallScore,
    published: property.published,
    verifiedExcellence: property.verifiedExcellence,
    editorChoice: property.editorChoice,
  }]);
}

export async function removePropertyFromIndex(propertyId: string) {
  await meiliClient.index('properties').deleteDocument(propertyId);
}
```

---

## Performance Requirements

- Search suggestions: < 50ms
- Full search: < 100ms
- Filter updates: < 200ms
- Debounce input: 150ms

---

## Research Mode Considerations

When Research Mode is active:
- No search queries logged to server
- Recent searches stored in localStorage only
- Clear recent searches on session end
- No personalization based on search history

---

## Component Structure

```
apps/web/components/search/
├── GlobalSearch/
│   ├── GlobalSearch.tsx        # Header search bar
│   ├── SearchSuggestions.tsx   # Dropdown suggestions
│   └── SearchInput.tsx         # Input with icon
├── SearchResults/
│   ├── SearchResults.tsx       # Results page
│   ├── ResultCard.tsx          # Generic result card
│   └── ResultTabs.tsx          # Type tabs
├── Filters/
│   ├── FilterSidebar.tsx       # Collapsible sidebar
│   ├── TierFilter.tsx
│   ├── LocationFilter.tsx
│   ├── PriceRangeFilter.tsx
│   ├── FocusAreaFilter.tsx
│   ├── EvidenceLevelFilter.tsx
│   └── FilterChips.tsx         # Active filter display
└── hooks/
    ├── useSearch.ts            # Search state management
    ├── useFilters.ts           # Filter state management
    └── useSearchParams.ts      # URL param sync
```

---

## Deliverables

1. **Meilisearch Setup**
   - Docker configuration
   - Index creation scripts
   - Sync utilities

2. **Global Search**
   - Search bar component
   - Suggestions dropdown
   - Results page

3. **Filter System**
   - All filter components
   - URL sync
   - Clear/reset functionality

4. **API Routes**
   - Search endpoint
   - Suggestions endpoint
   - Filtered listing endpoints

5. **Index Management**
   - Initial indexing script
   - Real-time sync hooks
   - Reindex command

---

## Verification Checklist

- [ ] Search returns results in < 100ms
- [ ] Typo tolerance works (e.g., "lanserof" finds Lanserhof)
- [ ] Filters combine correctly
- [ ] URL params persist filter state
- [ ] Filters work on mobile
- [ ] Empty state handled gracefully
- [ ] Research mode doesn't log searches
- [ ] Index stays in sync with database

---

## Notes

- Consider Algolia as fallback if Meilisearch doesn't scale
- Add analytics for popular searches (aggregated, not individual)
- Consider saved searches feature (Phase 2)
- Filter performance critical - test with full dataset

---

## Next Tasks

After completion:
- Task 09: Comparison Tool (uses filtered results)
- Search is used across all content pages
