# 09 - COMPARISON TOOL
## Side-by-Side Property Comparison Feature

> **Reference**: See `00_MASTER_PROJECT_BRIEF.md` for target audience needs and comparison requirements.

---

## Task Objective

Build a powerful comparison tool that allows users to evaluate multiple properties side-by-side across all relevant dimensions. This is a key research feature for users making significant wellness investment decisions.

---

## Feature Requirements

### Core Functionality
- Compare 2-4 properties simultaneously
- Persistent comparison list while browsing (session-based for anonymous users)
- Shareable comparison URLs
- Export comparison as PDF
- Works without account (Research Mode compatible)

### Comparison Dimensions
- Clarus Index scores (overall and breakdown)
- Pricing and stay duration
- Treatments offered
- Focus areas and specializations
- Dark data points
- Cultural fit data
- Location and accessibility
- Reviews summary

---

## Deliverables

### 1. Comparison State Management

```typescript
// packages/utils/src/comparison/comparison-store.ts

export interface ComparisonItem {
  propertyId: string;
  addedAt: Date;
}

export interface ComparisonState {
  items: ComparisonItem[];
  maxItems: number;
}

const MAX_COMPARISON_ITEMS = 4;

/**
 * Comparison state management
 * - Uses sessionStorage for anonymous users (Research Mode compatible)
 * - Uses database for logged-in users
 * - Syncs between tabs
 */

export function useComparisonStore() {
  // Add property to comparison
  const addToComparison = (propertyId: string) => {};
  
  // Remove property from comparison
  const removeFromComparison = (propertyId: string) => {};
  
  // Clear all
  const clearComparison = () => {};
  
  // Check if property is in comparison
  const isInComparison = (propertyId: string) => {};
  
  // Get count
  const comparisonCount = 0;
  
  // Get all items
  const comparisonItems: ComparisonItem[] = [];
  
  return {
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    comparisonCount,
    comparisonItems
  };
}
```

### 2. Add to Compare Button

```typescript
// packages/ui/src/components/comparison/AddToCompareButton.tsx

interface AddToCompareButtonProps {
  propertyId: string;
  propertyName: string;
  variant?: 'icon' | 'button' | 'card-overlay';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Button/icon to add property to comparison list
 * Shows different states:
 * - Not in comparison: "Add to Compare"
 * - In comparison: "Remove from Compare" with checkmark
 * - Comparison full: "Compare list full" (disabled)
 */
export function AddToCompareButton({
  propertyId,
  propertyName,
  variant = 'button',
  size = 'md'
}: AddToCompareButtonProps) {
  const { addToComparison, removeFromComparison, isInComparison, comparisonCount } = useComparisonStore();
  
  const inComparison = isInComparison(propertyId);
  const isFull = comparisonCount >= MAX_COMPARISON_ITEMS;
  
  // Render based on variant and state
}
```

### 3. Comparison Floating Bar

```typescript
// packages/ui/src/components/comparison/ComparisonBar.tsx

/**
 * Floating bar that appears when items are in comparison
 * Shows at bottom of screen on all pages
 * - Thumbnails of properties in comparison
 * - Quick remove buttons
 * - "Compare Now" CTA
 * - Item count indicator
 */
export function ComparisonBar() {
  const { comparisonItems, removeFromComparison, clearComparison } = useComparisonStore();
  
  if (comparisonItems.length === 0) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      {/* Property thumbnails with remove buttons */}
      {/* Empty slots showing "Add property" */}
      {/* Compare Now button (enabled when 2+ items) */}
      {/* Clear all link */}
    </div>
  );
}
```

### 4. Comparison Page

```typescript
// apps/web/app/compare/page.tsx

/**
 * Main comparison page
 * URL structure: /compare?properties=slug1,slug2,slug3
 */

interface ComparisonPageProps {
  searchParams: {
    properties?: string;  // Comma-separated slugs
  };
}

export default async function ComparePage({ searchParams }: ComparisonPageProps) {
  const propertySlugs = searchParams.properties?.split(',') || [];
  
  // Fetch full property data for comparison
  const properties = await fetchPropertiesForComparison(propertySlugs);
  
  return (
    <div>
      <ComparisonHeader properties={properties} />
      <ComparisonTable properties={properties} />
      <ComparisonActions properties={properties} />
    </div>
  );
}
```

### 5. Comparison Table Component

```typescript
// packages/ui/src/components/comparison/ComparisonTable.tsx

interface ComparisonTableProps {
  properties: PropertyForComparison[];
  sections?: ComparisonSection[];
}

type ComparisonSection = 
  | 'overview'
  | 'scores'
  | 'pricing'
  | 'treatments'
  | 'focus_areas'
  | 'dark_data'
  | 'cultural'
  | 'reviews';

/**
 * Full comparison table with all dimensions
 * Responsive design:
 * - Desktop: Side-by-side columns
 * - Mobile: Swipeable cards or stacked sections
 */
export function ComparisonTable({ properties, sections }: ComparisonTableProps) {
  return (
    <div>
      {/* Section: Overview */}
      <ComparisonSection title="Overview">
        <ComparisonRow label="Location" values={properties.map(p => `${p.city}, ${p.country}`)} />
        <ComparisonRow label="Property Tier" values={properties.map(p => formatTier(p.tier))} />
        <ComparisonRow label="Year Established" values={properties.map(p => p.yearEstablished)} />
        <ComparisonRow label="Typical Stay" values={properties.map(p => `${p.typicalStayMin}-${p.typicalStayMax} days`)} />
      </ComparisonSection>
      
      {/* Section: Clarus Index */}
      <ComparisonSection title="Clarus Index Scores">
        <ComparisonRow 
          label="Overall Score" 
          values={properties.map(p => p.clarusIndex.overall)}
          highlight="highest"
          renderValue={(v) => <ClarusScore score={v} size="md" />}
        />
        {/* Dimension breakdown - tier appropriate */}
      </ComparisonSection>
      
      {/* Section: Pricing */}
      <ComparisonSection title="Pricing">
        <ComparisonRow 
          label="Price Range" 
          values={properties.map(p => `$${p.priceMin.toLocaleString()} - $${p.priceMax.toLocaleString()}`)}
        />
        <ComparisonRow label="Price Includes" values={properties.map(p => p.priceIncludes)} />
      </ComparisonSection>
      
      {/* Section: Treatments */}
      <ComparisonSection title="Key Treatments">
        {/* Treatment availability matrix */}
        <TreatmentComparisonMatrix properties={properties} />
      </ComparisonSection>
      
      {/* Section: Dark Data */}
      <ComparisonSection title="Insider Intelligence">
        <ComparisonRow label="Physician Ratio" values={properties.map(p => p.darkData?.physicianRatio)} />
        <ComparisonRow label="Booking Lead Time" values={properties.map(p => `${p.darkData?.bookingLeadTime} weeks`)} />
        <ComparisonRow label="Return Guest Rate" values={properties.map(p => `${p.darkData?.returnGuestRate}%`)} />
        {/* ... more dark data */}
      </ComparisonSection>
      
      {/* Section: Cultural Fit */}
      <ComparisonSection title="Cultural Fit">
        <ComparisonRow label="Languages (Medical)" values={properties.map(p => p.cultural?.languagesMedical?.join(', '))} />
        <ComparisonRow label="Dietary Options" values={properties.map(p => formatDietary(p.cultural?.dietary))} />
        <ComparisonRow label="Privacy Level" values={properties.map(p => p.cultural?.privacyLevel)} />
      </ComparisonSection>
      
      {/* Section: Reviews Summary */}
      <ComparisonSection title="Guest Reviews">
        <ComparisonRow label="Average Rating" values={properties.map(p => p.reviews?.averageRating)} />
        <ComparisonRow label="Goal Achievement" values={properties.map(p => p.reviews?.avgGoalAchievement)} />
        <ComparisonRow label="Review Count" values={properties.map(p => p.reviews?.count)} />
      </ComparisonSection>
    </div>
  );
}
```

### 6. Comparison Row Component

```typescript
// packages/ui/src/components/comparison/ComparisonRow.tsx

interface ComparisonRowProps<T> {
  label: string;
  values: T[];
  highlight?: 'highest' | 'lowest' | 'none';
  renderValue?: (value: T, index: number) => React.ReactNode;
  tooltip?: string;
  emptyText?: string;
}

/**
 * Single row in comparison table
 * Handles highlighting best/worst values
 * Handles missing data gracefully
 */
export function ComparisonRow<T>({
  label,
  values,
  highlight = 'none',
  renderValue,
  tooltip,
  emptyText = '—'
}: ComparisonRowProps<T>) {
  // Determine which value(s) to highlight
  // Render each value in its column
  // Show tooltip on label hover
}
```

### 7. Treatment Comparison Matrix

```typescript
// packages/ui/src/components/comparison/TreatmentComparisonMatrix.tsx

interface TreatmentComparisonMatrixProps {
  properties: PropertyForComparison[];
  limit?: number;  // Show top N treatments
  showAll?: boolean;
}

/**
 * Shows which treatments are available at which properties
 * ✓ = Available
 * ✓✓ = Signature treatment
 * — = Not available
 */
export function TreatmentComparisonMatrix({
  properties,
  limit = 15,
  showAll = false
}: TreatmentComparisonMatrixProps) {
  // Get union of all treatments across properties
  // Sort by: signature treatments first, then alphabetically
  // Show availability matrix
}
```

### 8. Comparison Actions

```typescript
// packages/ui/src/components/comparison/ComparisonActions.tsx

interface ComparisonActionsProps {
  properties: PropertyForComparison[];
}

/**
 * Action buttons for comparison page
 * - Share comparison (copy link)
 * - Export as PDF
 * - Inquire about all (batch inquiry)
 * - Save comparison (if logged in)
 */
export function ComparisonActions({ properties }: ComparisonActionsProps) {
  return (
    <div className="flex gap-4">
      <ShareComparisonButton properties={properties} />
      <ExportComparisonPDF properties={properties} />
      <BatchInquiryButton properties={properties} />
      <SaveComparisonButton properties={properties} />
    </div>
  );
}
```

### 9. Export to PDF

```typescript
// apps/web/app/api/compare/export/route.ts

/**
 * Generate PDF export of comparison
 * Uses puppeteer or similar for PDF generation
 * Includes all comparison data formatted for print
 */

export async function POST(request: Request) {
  const { propertyIds } = await request.json();
  
  // Fetch property data
  // Generate comparison HTML
  // Convert to PDF
  // Return PDF file
}
```

### 10. Mobile Comparison View

```typescript
// packages/ui/src/components/comparison/MobileComparisonView.tsx

/**
 * Mobile-optimized comparison view
 * Options:
 * 1. Swipeable cards (one property at a time)
 * 2. Accordion sections
 * 3. Tab-based (switch between properties)
 */
export function MobileComparisonView({ properties }: { properties: PropertyForComparison[] }) {
  // Swipeable property cards
  // Fixed header with property names as tabs
  // Collapsible sections for each comparison dimension
}
```

---

## URL Structure

```
/compare                           # Empty state, prompts to add properties
/compare?properties=sha-wellness,clinique-la-prairie
/compare?properties=sha-wellness,clinique-la-prairie,lanserhof-tegernsee
```

**Shareable URLs**: Include property slugs, not IDs, for human-readable sharing.

---

## Data Structure

```typescript
// Types for comparison data

interface PropertyForComparison {
  id: string;
  slug: string;
  name: string;
  tier: PropertyTier;
  
  // Basic info
  city: string;
  country: string;
  yearEstablished: number;
  
  // Pricing
  priceMin: number;
  priceMax: number;
  typicalStayMin: number;
  typicalStayMax: number;
  priceIncludes: string;
  
  // Scores
  clarusIndex: ClarusIndexScore;
  recognition: PropertyRecognition;
  
  // Treatments
  treatments: Array<{
    id: string;
    name: string;
    isSignature: boolean;
  }>;
  
  // Focus areas
  focusAreas: Array<{
    id: string;
    name: string;
    isPrimary: boolean;
  }>;
  
  // Dark data
  darkData?: {
    physicianRatio: string;
    bookingLeadTime: number;
    returnGuestRate: number;
    customizationLevel: string;
    followupQuality: string;
  };
  
  // Cultural
  cultural?: {
    languagesMedical: string[];
    dietary: string[];
    privacyLevel: string;
    genderSeparated: string;
  };
  
  // Reviews summary
  reviews?: {
    count: number;
    averageRating: number;
    avgGoalAchievement: number;
  };
  
  // Media
  heroImage: string;
}
```

---

## UI/UX Requirements

### Desktop Layout
- Sticky header row with property names/images
- Horizontal scrolling if needed for 4 properties
- Clear visual separation between sections
- Highlight cells with best values (subtle green)
- "View Property" links in each column header

### Mobile Layout
- Swipeable cards as primary navigation
- Property tabs at top
- Collapsible sections to reduce scroll
- Floating "Compare" button to switch views

### Empty State
- When no properties selected: "Add properties to compare"
- Quick links to popular comparisons
- Suggestions based on recent browsing (if cookies allowed)

### Visual Highlights
- Best value in each row: subtle background highlight
- Missing data: gray dash, not "N/A"
- Signature treatments: special indicator (star or similar)
- Score differences: small delta indicators

---

## Acceptance Criteria

- [ ] Add/remove properties from comparison works
- [ ] Comparison persists across page navigation (session)
- [ ] Comparison bar appears with 1+ items
- [ ] Compare page shows all sections
- [ ] Side-by-side layout works for 2-4 properties
- [ ] Mobile view is usable and complete
- [ ] Share URL works (copy and visit)
- [ ] PDF export generates clean document
- [ ] Best values highlighted appropriately
- [ ] Missing data handled gracefully
- [ ] Works in Research Mode (no account required)
- [ ] Performance: page loads in <2 seconds with 4 properties

---

## Notes

- Consider lazy loading sections for performance
- Treatment matrix could get long - implement "show more"
- Dark data might be incomplete for some properties - handle gracefully
- Future: Allow custom comparison dimension selection
- Future: Saved comparisons for logged-in users

---

*The comparison tool is a key research feature. Focus on information density and clarity.*
