/**
 * Clarus Index Scoring Types
 *
 * Types and utilities for the proprietary Clarus Index scoring methodology.
 * This system establishes Clarus Vitae as an authority rather than a directory.
 */

// ============================================
// PROPERTY TIER TYPES (for scoring)
// ============================================

/**
 * Scoring-specific property tier type (uses snake_case identifiers)
 * Different from database PropertyTier (TIER_1, TIER_2, TIER_3)
 */
export type ScoringPropertyTier = 'medical_longevity' | 'integrated_wellness' | 'luxury_destination';

/**
 * Maps database PropertyTier enum to scoring PropertyTier
 */
export function mapDbTierToScoringTier(dbTier: 'TIER_1' | 'TIER_2' | 'TIER_3'): ScoringPropertyTier {
  const mapping: Record<'TIER_1' | 'TIER_2' | 'TIER_3', ScoringPropertyTier> = {
    TIER_1: 'medical_longevity',
    TIER_2: 'integrated_wellness',
    TIER_3: 'luxury_destination',
  };
  return mapping[dbTier];
}

// ============================================
// TIER-SPECIFIC SCORE INTERFACES
// ============================================

/**
 * Tier 1: Medical Longevity & Clinical Wellness
 * Properties with full medical oversight and advanced diagnostics
 */
export interface Tier1Scores {
  clinicalRigor: number;      // 0-100: Medical credentials, diagnostic depth, evidence-based protocols
  outcomeEvidence: number;    // 0-100: Published results, guest-reported outcomes, follow-up protocols
  programDepth: number;       // 0-100: Comprehensiveness, customization, duration options
  experienceQuality: number;  // 0-100: Facilities, service, accommodation, dining
  valueAlignment: number;     // 0-100: Price relative to what's delivered
}

/**
 * Tier 2: Integrated Wellness Retreats
 * Properties combining clinical and holistic approaches
 */
export interface Tier2Scores {
  programEffectiveness: number;  // 0-100: Guest-reported outcomes, expert assessment
  holisticIntegration: number;   // 0-100: How well clinical and wellness elements combine
  practitionerQuality: number;   // 0-100: Credentials, experience, guest feedback
  experienceQuality: number;     // 0-100: Facilities, service, accommodation, dining
  valueAlignment: number;        // 0-100: Price relative to what's delivered
}

/**
 * Tier 3: Luxury Destination Wellness
 * Exceptional spa and wellness facilities worthy of destination travel
 */
export interface Tier3Scores {
  experienceQuality: number;       // 0-100: Facilities, service, ambiance, accommodation
  wellnessDepth: number;           // 0-100: Range and quality of treatments, practitioner skill
  transformativePotential: number; // 0-100: Can this stay create lasting change?
  settingEnvironment: number;      // 0-100: Location, natural surroundings, sense of escape
  valueAlignment: number;          // 0-100: Price relative to what's delivered
}

export type TierScores = Tier1Scores | Tier2Scores | Tier3Scores;

// ============================================
// CLARUS INDEX SCORE INTERFACE (for scoring)
// ============================================

/**
 * Score result from the Clarus Index calculation
 */
export interface ScoringIndexResult {
  overall: number;               // 0-100 weighted composite
  tier: ScoringPropertyTier;
  dimensions: TierScores;
  lastUpdated: Date;
  verifiedBy?: string;           // Team member who verified
  methodology?: string;          // Version identifier (e.g., "v1.0")
}

// ============================================
// PROPERTY RECOGNITION BADGES
// ============================================

/**
 * Recognition badges awarded to exceptional properties
 */
export interface PropertyRecognition {
  /** Properties that excel in specific areas */
  isEditorsChoice: boolean;
  /** Category of excellence, e.g., "Best for Longevity", "Best for Executive Burnout" */
  editorsChoiceCategory?: string;
  /** Properties where our team has completed full programs */
  isVerifiedExcellence: boolean;
  /** Newer properties showing exceptional promise */
  isRisingStar: boolean;
}

// ============================================
// SCORE TIER CLASSIFICATION
// ============================================

export type ScoreTier = 'EXCEPTIONAL' | 'DISTINGUISHED' | 'NOTABLE' | 'CURATED';

export interface ScoreTierInfo {
  tier: ScoreTier;
  label: string;
  description: string;
  minScore: number;
  maxScore: number;
}

/**
 * Score tier definitions with ranges and descriptions
 */
export const SCORE_TIERS = {
  EXCEPTIONAL: {
    tier: 'EXCEPTIONAL' as ScoreTier,
    label: 'Exceptional',
    description: 'Among the finest wellness destinations globally',
    minScore: 90,
    maxScore: 100,
  },
  DISTINGUISHED: {
    tier: 'DISTINGUISHED' as ScoreTier,
    label: 'Distinguished',
    description: 'Excellent across all dimensions',
    minScore: 80,
    maxScore: 89,
  },
  NOTABLE: {
    tier: 'NOTABLE' as ScoreTier,
    label: 'Notable',
    description: 'Strong performance with notable strengths',
    minScore: 70,
    maxScore: 79,
  },
  CURATED: {
    tier: 'CURATED' as ScoreTier,
    label: 'Curated',
    description: 'Selected for specific areas of excellence',
    minScore: 0,
    maxScore: 69,
  },
} as const;

/**
 * Get the score tier info for a given score
 */
export function getScoreTierInfo(score: number): ScoreTierInfo {
  if (score >= 90) return SCORE_TIERS.EXCEPTIONAL;
  if (score >= 80) return SCORE_TIERS.DISTINGUISHED;
  if (score >= 70) return SCORE_TIERS.NOTABLE;
  return SCORE_TIERS.CURATED;
}

// ============================================
// DIMENSION METADATA
// ============================================

export interface DimensionMeta {
  key: string;
  label: string;
  description: string;
  weight: number;
}

export const TIER1_DIMENSIONS: DimensionMeta[] = [
  {
    key: 'clinicalRigor',
    label: 'Clinical Rigor',
    description: 'Medical credentials, diagnostic depth, evidence-based protocols, physician ratios',
    weight: 0.30,
  },
  {
    key: 'outcomeEvidence',
    label: 'Outcome Evidence',
    description: 'Published results, guest-reported outcomes, follow-up protocols',
    weight: 0.25,
  },
  {
    key: 'programDepth',
    label: 'Program Depth',
    description: 'Comprehensiveness, customization, duration options',
    weight: 0.20,
  },
  {
    key: 'experienceQuality',
    label: 'Experience Quality',
    description: 'Facilities, service, accommodation, dining',
    weight: 0.15,
  },
  {
    key: 'valueAlignment',
    label: 'Value Alignment',
    description: 'Price relative to what is delivered',
    weight: 0.10,
  },
];

export const TIER2_DIMENSIONS: DimensionMeta[] = [
  {
    key: 'programEffectiveness',
    label: 'Program Effectiveness',
    description: 'Guest-reported outcomes, expert assessment',
    weight: 0.25,
  },
  {
    key: 'holisticIntegration',
    label: 'Holistic Integration',
    description: 'How well clinical and wellness elements combine',
    weight: 0.25,
  },
  {
    key: 'practitionerQuality',
    label: 'Practitioner Quality',
    description: 'Credentials, experience, guest feedback on individuals',
    weight: 0.20,
  },
  {
    key: 'experienceQuality',
    label: 'Experience Quality',
    description: 'Facilities, service, accommodation, dining',
    weight: 0.20,
  },
  {
    key: 'valueAlignment',
    label: 'Value Alignment',
    description: 'Price relative to what is delivered',
    weight: 0.10,
  },
];

export const TIER3_DIMENSIONS: DimensionMeta[] = [
  {
    key: 'experienceQuality',
    label: 'Experience Quality',
    description: 'Facilities, service, ambiance, accommodation',
    weight: 0.35,
  },
  {
    key: 'wellnessDepth',
    label: 'Wellness Offering Depth',
    description: 'Range and quality of treatments, practitioner skill',
    weight: 0.25,
  },
  {
    key: 'transformativePotential',
    label: 'Transformative Potential',
    description: 'Can this stay create lasting change?',
    weight: 0.20,
  },
  {
    key: 'settingEnvironment',
    label: 'Setting & Environment',
    description: 'Location, natural surroundings, sense of escape',
    weight: 0.10,
  },
  {
    key: 'valueAlignment',
    label: 'Value Alignment',
    description: 'Price relative to what is delivered',
    weight: 0.10,
  },
];

/**
 * Get the dimension metadata for a specific tier
 */
export function getDimensionsForTier(tier: ScoringPropertyTier): DimensionMeta[] {
  switch (tier) {
    case 'medical_longevity':
      return TIER1_DIMENSIONS;
    case 'integrated_wellness':
      return TIER2_DIMENSIONS;
    case 'luxury_destination':
      return TIER3_DIMENSIONS;
  }
}

/**
 * Type guard to check if scores are Tier1Scores
 */
export function isTier1Scores(scores: TierScores): scores is Tier1Scores {
  return 'clinicalRigor' in scores;
}

/**
 * Type guard to check if scores are Tier2Scores
 */
export function isTier2Scores(scores: TierScores): scores is Tier2Scores {
  return 'holisticIntegration' in scores;
}

/**
 * Type guard to check if scores are Tier3Scores
 */
export function isTier3Scores(scores: TierScores): scores is Tier3Scores {
  return 'transformativePotential' in scores;
}
