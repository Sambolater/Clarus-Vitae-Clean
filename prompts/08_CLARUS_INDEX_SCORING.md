# 08 - CLARUS INDEX SCORING SYSTEM
## Proprietary Scoring Methodology & Display

> **Reference**: See `00_MASTER_PROJECT_BRIEF.md` Section "Proprietary Authority: The Clarus Index" for scoring dimensions and weights.

---

## Task Objective

Implement the Clarus Index scoring system - the proprietary methodology that establishes Clarus Vitae as an authority rather than a directory. This includes score calculation, storage, display components, and the methodology explanation page.

---

## Scoring Methodology (From Brief)

### Tier 1: Medical Longevity & Clinical Wellness

| Dimension | Weight | What It Measures |
|-----------|--------|------------------|
| Clinical Rigor | 30% | Medical credentials, diagnostic depth, evidence-based protocols, physician ratios |
| Outcome Evidence | 25% | Published results, guest-reported outcomes, follow-up protocols |
| Program Depth | 20% | Comprehensiveness, customization, duration options |
| Experience Quality | 15% | Facilities, service, accommodation, dining |
| Value Alignment | 10% | Price relative to what's delivered |

### Tier 2: Integrated Wellness Retreats

| Dimension | Weight | What It Measures |
|-----------|--------|------------------|
| Program Effectiveness | 25% | Guest-reported outcomes, expert assessment |
| Holistic Integration | 25% | How well clinical and wellness elements combine |
| Practitioner Quality | 20% | Credentials, experience, guest feedback |
| Experience Quality | 20% | Facilities, service, accommodation, dining |
| Value Alignment | 10% | Price relative to what's delivered |

### Tier 3: Luxury Destination Wellness

| Dimension | Weight | What It Measures |
|-----------|--------|------------------|
| Experience Quality | 35% | Facilities, service, ambiance, accommodation |
| Wellness Offering Depth | 25% | Range and quality of treatments |
| Transformative Potential | 20% | Can this stay create lasting change? |
| Setting & Environment | 10% | Location, natural surroundings |
| Value Alignment | 10% | Price relative to what's delivered |

---

## Deliverables

### 1. Score Types & Interfaces

```typescript
// packages/types/src/scoring.ts

export type PropertyTier = 'medical_longevity' | 'integrated_wellness' | 'luxury_destination';

// Tier 1 Dimensions
export interface Tier1Scores {
  clinicalRigor: number;        // 0-100
  outcomeEvidence: number;      // 0-100
  programDepth: number;         // 0-100
  experienceQuality: number;    // 0-100
  valueAlignment: number;       // 0-100
}

// Tier 2 Dimensions
export interface Tier2Scores {
  programEffectiveness: number; // 0-100
  holisticIntegration: number;  // 0-100
  practitionerQuality: number;  // 0-100
  experienceQuality: number;    // 0-100
  valueAlignment: number;       // 0-100
}

// Tier 3 Dimensions
export interface Tier3Scores {
  experienceQuality: number;    // 0-100
  wellnessDepth: number;        // 0-100
  transformativePotential: number; // 0-100
  settingEnvironment: number;   // 0-100
  valueAlignment: number;       // 0-100
}

export interface ClarusIndexScore {
  overall: number;              // 0-100 weighted composite
  tier: PropertyTier;
  dimensions: Tier1Scores | Tier2Scores | Tier3Scores;
  lastUpdated: Date;
  verifiedBy?: string;          // Team member who verified
}

// Recognition badges
export interface PropertyRecognition {
  isEditorsChoice: boolean;
  editorsChoiceCategory?: string;  // e.g., "Best for Longevity"
  isVerifiedExcellence: boolean;   // Team completed full program
  isRisingStar: boolean;           // New property showing promise
}
```

### 2. Score Calculation Service

```typescript
// packages/database/src/services/scoring-service.ts

const TIER_WEIGHTS = {
  medical_longevity: {
    clinicalRigor: 0.30,
    outcomeEvidence: 0.25,
    programDepth: 0.20,
    experienceQuality: 0.15,
    valueAlignment: 0.10
  },
  integrated_wellness: {
    programEffectiveness: 0.25,
    holisticIntegration: 0.25,
    practitionerQuality: 0.20,
    experienceQuality: 0.20,
    valueAlignment: 0.10
  },
  luxury_destination: {
    experienceQuality: 0.35,
    wellnessDepth: 0.25,
    transformativePotential: 0.20,
    settingEnvironment: 0.10,
    valueAlignment: 0.10
  }
} as const;

export function calculateClarusIndex(
  tier: PropertyTier,
  scores: Tier1Scores | Tier2Scores | Tier3Scores
): number {
  const weights = TIER_WEIGHTS[tier];
  let total = 0;
  
  for (const [dimension, weight] of Object.entries(weights)) {
    const score = scores[dimension as keyof typeof scores] || 0;
    total += score * weight;
  }
  
  return Math.round(total);
}

// Score interpretation
export function getScoreInterpretation(score: number): {
  label: string;
  description: string;
  color: string;
} {
  if (score >= 90) {
    return {
      label: 'Exceptional',
      description: 'Among the finest wellness destinations globally',
      color: 'emerald'
    };
  }
  if (score >= 80) {
    return {
      label: 'Outstanding',
      description: 'Excellent across all dimensions',
      color: 'green'
    };
  }
  if (score >= 70) {
    return {
      label: 'Very Good',
      description: 'Strong performance with notable strengths',
      color: 'teal'
    };
  }
  if (score >= 60) {
    return {
      label: 'Good',
      description: 'Solid offering with room for distinction',
      color: 'blue'
    };
  }
  return {
    label: 'Developing',
    description: 'Shows promise in specific areas',
    color: 'slate'
  };
}
```

### 3. Score Display Components

```typescript
// packages/ui/src/components/scoring/ClarusScore.tsx

interface ClarusScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  animated?: boolean;
}

/**
 * Primary score display component
 * Shows the overall Clarus Index score with visual treatment
 */
export function ClarusScore({ 
  score, 
  size = 'md', 
  showLabel = true,
  animated = false 
}: ClarusScoreProps) {
  // Circular or badge-style score display
  // Color coded by score range
  // Optional animation on page load
}
```

```typescript
// packages/ui/src/components/scoring/ScoreBreakdown.tsx

interface ScoreBreakdownProps {
  tier: PropertyTier;
  scores: Tier1Scores | Tier2Scores | Tier3Scores;
  showWeights?: boolean;
  expandable?: boolean;
}

/**
 * Detailed breakdown of all scoring dimensions
 * Shows each dimension with its score and weight contribution
 */
export function ScoreBreakdown({ 
  tier, 
  scores, 
  showWeights = true,
  expandable = false 
}: ScoreBreakdownProps) {
  // Bar chart or radar chart showing all dimensions
  // Weight percentages shown
  // Expandable details for each dimension
}
```

```typescript
// packages/ui/src/components/scoring/ScoreComparison.tsx

interface ScoreComparisonProps {
  properties: Array<{
    id: string;
    name: string;
    tier: PropertyTier;
    scores: ClarusIndexScore;
  }>;
}

/**
 * Side-by-side score comparison for multiple properties
 * Used in comparison tool
 */
export function ScoreComparison({ properties }: ScoreComparisonProps) {
  // Side-by-side bars for each dimension
  // Highlights where each property excels
  // Overall score comparison
}
```

```typescript
// packages/ui/src/components/scoring/RecognitionBadges.tsx

interface RecognitionBadgesProps {
  recognition: PropertyRecognition;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'inline' | 'stacked';
}

/**
 * Display recognition badges (Editor's Choice, Verified Excellence, Rising Star)
 */
export function RecognitionBadges({ 
  recognition, 
  size = 'md',
  layout = 'inline' 
}: RecognitionBadgesProps) {
  // Visual badges for each recognition type
  // Tooltips explaining what each means
}
```

### 4. Score Card Component (For Listings)

```typescript
// packages/ui/src/components/scoring/ScoreCard.tsx

interface ScoreCardProps {
  property: {
    name: string;
    tier: PropertyTier;
    score: ClarusIndexScore;
    recognition: PropertyRecognition;
  };
  variant?: 'compact' | 'detailed';
  onClick?: () => void;
}

/**
 * Score display for property cards in listings
 * Compact version for grids, detailed for featured
 */
export function ScoreCard({ property, variant = 'compact', onClick }: ScoreCardProps) {
  // Compact: Just the score number with tier indicator
  // Detailed: Score + top 2-3 dimension highlights + badges
}
```

### 5. Methodology Page

```typescript
// apps/web/app/about/methodology/page.tsx

/**
 * Full explanation of the Clarus Index methodology
 * Establishes authority and transparency
 */
```

**Page Structure**:

```markdown
# The Clarus Index

## Our Methodology

The Clarus Index is our proprietary framework for evaluating the world's finest 
wellness destinations. Unlike star ratings or crowd-sourced reviews, our scoring 
is based on expert assessment across dimensions that matter for transformative 
health outcomes.

## Why Different Tiers?

A medical longevity clinic and a luxury destination spa serve different purposes. 
Evaluating them on the same criteria would be meaningless. That's why we use 
tier-specific scoring:

### Tier 1: Medical Longevity & Clinical Wellness
[Explanation + dimension breakdown with what each measures]

### Tier 2: Integrated Wellness Retreats  
[Explanation + dimension breakdown]

### Tier 3: Luxury Destination Wellness
[Explanation + dimension breakdown]

## How We Score

### Data Sources
- On-site evaluations by our advisory team
- Verified guest outcome reports
- Direct property research
- Medical credential verification
- Published clinical outcomes (where available)

### What We DON'T Consider
- Advertising spend
- Partnership status (partners are held to same standards)
- Property age or brand name
- Celebrity endorsements

## Recognition Awards

### Editor's Choice
[Explanation of criteria]

### Verified Excellence
[Explanation - team completed full program]

### Rising Star
[Explanation - newer properties showing exceptional promise]

## Our Commitment to Independence

Properties cannot pay for higher scores. Our editorial and scoring teams operate 
independently from our partnerships team. We regularly re-evaluate scores and 
will lower them if standards slip.

## Meet Our Evaluators
[Link to team page]
```

### 6. Score Tooltip Component

```typescript
// packages/ui/src/components/scoring/ScoreTooltip.tsx

interface ScoreTooltipProps {
  dimension: string;
  score: number;
  weight: number;
  tier: PropertyTier;
}

/**
 * Contextual tooltip explaining what a score dimension means
 * Appears on hover/tap of dimension labels
 */
export function ScoreTooltip({ dimension, score, weight, tier }: ScoreTooltipProps) {
  // Dimension name
  // What it measures (tier-specific)
  // Score out of 100
  // Weight in overall calculation
  // How this compares to average for tier
}
```

### 7. Admin Scoring Interface (Internal)

```typescript
// apps/admin/components/scoring/ScoreEditor.tsx

/**
 * Internal tool for advisory team to input/update scores
 * - Select property and tier
 * - Input each dimension score with notes
 * - Preview calculated overall score
 * - Add verification details
 * - Publish score update
 */
```

---

## Visual Design Guidelines

### Score Display Styles

**Overall Score (Primary)**:
- Large, prominent number (90, 85, etc.)
- Circular badge or clean typography
- Color indicates range:
  - 90+: Emerald/Gold
  - 80-89: Green
  - 70-79: Teal
  - 60-69: Blue
  - <60: Slate

**Dimension Bars**:
- Horizontal bars showing score out of 100
- Consistent width, variable fill
- Weight percentage shown subtly
- Color matches overall score color scheme

**Recognition Badges**:
- Distinct visual identity for each
- Editor's Choice: Shield/laurel motif
- Verified Excellence: Checkmark with star
- Rising Star: Ascending star

---

## Acceptance Criteria

- [ ] Score calculation matches tier-specific weights exactly
- [ ] ClarusScore component renders correctly at all sizes
- [ ] ScoreBreakdown shows all tier-appropriate dimensions
- [ ] ScoreComparison works for 2-4 properties
- [ ] Recognition badges display correctly
- [ ] Methodology page fully explains scoring
- [ ] Tooltips provide clear dimension explanations
- [ ] Scores update correctly when dimensions change
- [ ] Score interpretation labels match ranges
- [ ] Visual design is polished and authoritative

---

## Notes

- Scores are editorial judgments, not automated calculations from reviews
- Properties cannot see their scores before publication
- Score changes are logged for audit trail
- Consider future: historical score tracking, trend display

---

*The Clarus Index is the core differentiator. Design and implementation should convey authority and transparency.*
