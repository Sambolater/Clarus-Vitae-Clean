# 03 - UI COMPONENT LIBRARY FOUNDATION
## Clarus Vitae Platform - Design System

> **Estimated Time**: 4-6 hours
> **Dependencies**: Task 01 (Repository Setup)
> **Blocks**: All frontend feature tasks

---

## Objective

Build the foundational UI component library in `packages/ui` that establishes the visual language for Clarus Vitae. Components must convey trust, sophistication, and privacy while working across the wellness spectrum (clinical to luxury spa).

---

## Context

**Brand**: Clarus Vitae
**Audience**: UHNWI (Ultra-High-Net-Worth Individuals)
**Positioning**: Independent research authority, not a booking site

**Design Philosophy**:
- Institutional trust (like private banking) meets wellness warmth
- Privacy-conscious without feeling secretive
- Works for someone researching $150K longevity programs AND $5K spa retreats
- Never generic "wellness green" or clinical "medical blue"
- Timeless, not trendy

---

## Color Palette

### Primary Colors
```css
--color-navy-deep: #1A1A2E;      /* Primary text, headers */
--color-teal-trust: #16425B;      /* Primary actions, links */
--color-cream-warm: #F5F3EE;      /* Backgrounds */
--color-white: #FFFFFF;           /* Cards, containers */
```

### Secondary Colors
```css
--color-gold-accent: #C9A962;     /* Premium highlights, awards */
--color-sage-wellness: #7C9082;   /* Wellness indicators */
--color-slate-text: #4A5568;      /* Body text */
--color-slate-muted: #718096;     /* Secondary text */
```

### Functional Colors
```css
--color-success: #2E7D32;         /* Positive, available */
--color-warning: #B8860B;         /* Caution, premium */
--color-error: #C62828;           /* Errors, unavailable */
--color-info: #1565C0;            /* Information */
```

### Tier Colors (Subtle, for badges/indicators)
```css
--color-tier-1: #1A365D;          /* Medical Longevity - deep authority */
--color-tier-2: #234E52;          /* Integrated Wellness - balanced */
--color-tier-3: #5B4B3A;          /* Luxury Destination - warm luxury */
```

---

## Typography

### Font Stack
```css
--font-heading: 'Cormorant Garamond', Georgia, serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Type Scale
```css
--text-xs: 0.75rem;    /* 12px - Labels, fine print */
--text-sm: 0.875rem;   /* 14px - Secondary text */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Lead paragraphs */
--text-xl: 1.25rem;    /* 20px - Section headers */
--text-2xl: 1.5rem;    /* 24px - Card titles */
--text-3xl: 1.875rem;  /* 30px - Page section titles */
--text-4xl: 2.25rem;   /* 36px - Page titles */
--text-5xl: 3rem;      /* 48px - Hero headlines */
```

---

## Component Requirements

### 1. Buttons

**Variants**:
- `primary` - Teal background, white text
- `secondary` - Outlined, teal border
- `ghost` - No background, subtle hover
- `premium` - Gold accent for special CTAs
- `danger` - Error color for destructive actions

**Sizes**: `sm`, `md`, `lg`

**States**: Default, hover, active, disabled, loading

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'premium' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}
```

### 2. Cards

**Variants**:
- `PropertyCard` - For property listings
- `TreatmentCard` - For treatment listings
- `ReviewCard` - For review display
- `TeamMemberCard` - For advisory team
- `StatCard` - For metrics/scores

**PropertyCard Features**:
- Image with tier badge
- Clarus Index score display
- Location, price range
- Focus area pills
- Quick action buttons

### 3. Clarus Index Score Display

The signature visual element. Must be instantly recognizable.

**Variants**:
- `ScoreBadge` - Compact, for cards (shows overall only)
- `ScoreBreakdown` - Full, shows all dimensions
- `ScoreComparison` - Side-by-side for comparison tool

**Visual Requirements**:
- Circular or semi-circular gauge option
- Color gradient based on score (muted, not traffic-light)
- Clear numerical display
- Dimension labels

### 4. Tier Badges

Visual indicators for property tiers.

```tsx
<TierBadge tier="TIER_1" /> // "Medical Longevity"
<TierBadge tier="TIER_2" /> // "Integrated Wellness"
<TierBadge tier="TIER_3" /> // "Luxury Destination"
```

### 5. Evidence Level Indicator

For treatment pages showing research backing.

```tsx
<EvidenceLevel level="STRONG" />      // Green, solid
<EvidenceLevel level="MODERATE" />    // Teal, medium
<EvidenceLevel level="EMERGING" />    // Gold, developing
<EvidenceLevel level="EXPERIMENTAL" /> // Slate, early
<EvidenceLevel level="TRADITIONAL" /> // Warm, historical
```

### 6. Form Components

- `Input` - Text input with label, error state
- `Textarea` - Multi-line input
- `Select` - Dropdown selection
- `Checkbox` - With label
- `RadioGroup` - Grouped radio buttons
- `DatePicker` - Date selection (minimal)
- `RangeSlider` - For price/duration filters

**Special Form Components**:
- `PrivacyConsentCheckbox` - Styled consent with info tooltip
- `SecureContactToggle` - Toggle for encrypted contact preference
- `BudgetRangeSelector` - Visual budget range picker

### 7. Navigation

- `Header` - Main navigation with logo, links, CTA
- `MobileNav` - Slide-out mobile navigation
- `Breadcrumbs` - Page hierarchy
- `TabNav` - Tab navigation for property profiles
- `FilterSidebar` - Collapsible filter panel

### 8. Data Display

- `Table` - Sortable data table
- `ComparisonTable` - Side-by-side property comparison
- `StatGrid` - Grid of statistics
- `Timeline` - For program schedules
- `PriceRange` - Visual price display with currency

### 9. Feedback & Status

- `Alert` - Informational messages
- `Toast` - Temporary notifications
- `LoadingSpinner` - Loading state
- `Skeleton` - Content placeholders
- `EmptyState` - No results display
- `ErrorState` - Error display with retry

### 10. Modal & Overlay

- `Modal` - Standard modal dialog
- `Drawer` - Side panel (mobile filters)
- `Tooltip` - Hover information
- `Popover` - Click-triggered info panel

### 11. Privacy-Specific Components

- `ResearchModeBanner` - Indicates research mode active
- `PrivacyBadge` - Shows data handling policy
- `SecureInquiryBadge` - Indicates encrypted handling
- `DataDeletionButton` - One-click deletion request

### 12. Review Components

- `StarRating` - Star display (1-5)
- `RatingBar` - Horizontal rating visualization
- `OutcomeIndicator` - Goal achievement display
- `VerifiedBadge` - Verified visit indicator
- `ReviewFilters` - Filter reviews by type

---

## Tailwind Configuration

Extend the default Tailwind config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        navy: {
          deep: '#1A1A2E',
        },
        teal: {
          trust: '#16425B',
        },
        cream: {
          warm: '#F5F3EE',
        },
        gold: {
          accent: '#C9A962',
        },
        sage: {
          wellness: '#7C9082',
        },
        tier: {
          1: '#1A365D',
          2: '#234E52',
          3: '#5B4B3A',
        },
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(26, 26, 46, 0.08)',
        'card-hover': '0 8px 24px rgba(26, 26, 46, 0.12)',
        'elevated': '0 12px 40px rgba(26, 26, 46, 0.15)',
      },
    },
  },
};
```

---

## Component Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── Card/
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── TreatmentCard.tsx
│   │   │   ├── ReviewCard.tsx
│   │   │   └── index.ts
│   │   ├── Score/
│   │   │   ├── ScoreBadge.tsx
│   │   │   ├── ScoreBreakdown.tsx
│   │   │   └── index.ts
│   │   ├── Form/
│   │   ├── Navigation/
│   │   ├── Feedback/
│   │   ├── Privacy/
│   │   └── index.ts
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   │   └── globals.css
│   └── index.ts
├── package.json
└── tsconfig.json
```

---

## Deliverables

1. **Complete Component Library**
   - All components listed above implemented
   - TypeScript types for all props
   - Proper accessibility (ARIA labels, keyboard nav)

2. **Storybook Documentation**
   - Stories for all components
   - All variants documented
   - Interactive controls

3. **Tailwind Configuration**
   - Custom colors, fonts, shadows
   - Shared across all apps

4. **Design Tokens**
   - CSS custom properties
   - Exportable for design tools

5. **Accessibility**
   - WCAG AA compliance
   - Screen reader tested
   - Keyboard navigation

---

## Verification Checklist

- [ ] All components render correctly
- [ ] TypeScript types are complete
- [ ] Storybook builds without errors
- [ ] All components are accessible
- [ ] Components work on mobile
- [ ] Dark mode consideration (future-proofing)
- [ ] Components export correctly from package

---

## Design Principles to Follow

1. **Restraint over flash** - Subtle animations, muted colors, no gratuitous effects
2. **Information density done right** - Show data clearly without overwhelming
3. **Privacy visual language** - Subtle indicators for privacy features
4. **Tier differentiation** - Clear but not garish distinction between property types
5. **Trust through consistency** - Same patterns, predictable interactions
6. **Mobile-first** - Every component works on mobile first

---

## Next Tasks

Once complete:
- Task 04: Property Profiles (uses PropertyCard, ScoreBadge)
- Task 05: Treatment Database (uses TreatmentCard, EvidenceLevel)
- Task 06: Search & Filter (uses Form components, FilterSidebar)
