/**
 * Clarus Index Scoring Service
 *
 * Service for calculating and managing Clarus Index scores.
 * The Clarus Index is the proprietary scoring methodology that establishes
 * Clarus Vitae as an authority rather than a directory.
 */

import type {
  ScoringPropertyTier,
  Tier1Scores,
  Tier2Scores,
  Tier3Scores,
  TierScores,
  ScoreTier,
} from '@clarus-vitae/types';

// ============================================
// TIER WEIGHTS CONFIGURATION
// ============================================

type DimensionWeights = Record<string, number>;

/**
 * Weights for each dimension by property tier.
 * These weights determine the relative importance of each scoring dimension.
 */
export const TIER_WEIGHTS: Record<ScoringPropertyTier, DimensionWeights> = {
  medical_longevity: {
    clinicalRigor: 0.30,
    outcomeEvidence: 0.25,
    programDepth: 0.20,
    experienceQuality: 0.15,
    valueAlignment: 0.10,
  },
  integrated_wellness: {
    programEffectiveness: 0.25,
    holisticIntegration: 0.25,
    practitionerQuality: 0.20,
    experienceQuality: 0.20,
    valueAlignment: 0.10,
  },
  luxury_destination: {
    experienceQuality: 0.35,
    wellnessDepth: 0.25,
    transformativePotential: 0.20,
    settingEnvironment: 0.10,
    valueAlignment: 0.10,
  },
};

// ============================================
// SCORE CALCULATION
// ============================================

/**
 * Calculate the weighted Clarus Index score for a property.
 *
 * @param tier - The property tier (determines which weights to use)
 * @param scores - The individual dimension scores
 * @returns The weighted overall score (0-100)
 */
export function calculateClarusIndex(
  tier: ScoringPropertyTier,
  scores: TierScores
): number {
  const weights = TIER_WEIGHTS[tier];
  let total = 0;

  for (const [dimension, weight] of Object.entries(weights)) {
    const score = (scores as unknown as Record<string, number>)[dimension] || 0;
    total += score * weight;
  }

  return Math.round(total);
}

/**
 * Calculate Tier 1 (Medical Longevity) index score
 */
export function calculateTier1Index(scores: Tier1Scores): number {
  return calculateClarusIndex('medical_longevity', scores);
}

/**
 * Calculate Tier 2 (Integrated Wellness) index score
 */
export function calculateTier2Index(scores: Tier2Scores): number {
  return calculateClarusIndex('integrated_wellness', scores);
}

/**
 * Calculate Tier 3 (Luxury Destination) index score
 */
export function calculateTier3Index(scores: Tier3Scores): number {
  return calculateClarusIndex('luxury_destination', scores);
}

// ============================================
// SCORE INTERPRETATION
// ============================================

export interface ScoreInterpretation {
  tier: ScoreTier;
  label: string;
  description: string;
  color: string;
  bgClass: string;
  textClass: string;
}

/**
 * Get the interpretation of a score including tier, label, and styling information.
 *
 * @param score - The overall Clarus Index score (0-100)
 * @returns Score interpretation with display properties
 */
export function getScoreInterpretation(score: number): ScoreInterpretation {
  if (score >= 90) {
    return {
      tier: 'EXCEPTIONAL',
      label: 'Exceptional',
      description: 'Among the finest wellness destinations globally',
      color: 'gold',
      bgClass: 'bg-clarus-navy',
      textClass: 'text-clarus-gold',
    };
  }
  if (score >= 80) {
    return {
      tier: 'DISTINGUISHED',
      label: 'Distinguished',
      description: 'Excellent across all dimensions',
      color: 'white',
      bgClass: 'bg-clarus-navy',
      textClass: 'text-white',
    };
  }
  if (score >= 70) {
    return {
      tier: 'NOTABLE',
      label: 'Notable',
      description: 'Strong performance with notable strengths',
      color: 'white',
      bgClass: 'bg-slate',
      textClass: 'text-white',
    };
  }
  if (score >= 60) {
    return {
      tier: 'CURATED',
      label: 'Curated',
      description: 'Selected for specific areas of excellence',
      color: 'navy',
      bgClass: 'bg-stone',
      textClass: 'text-clarus-navy',
    };
  }
  return {
    tier: 'CURATED',
    label: 'Developing',
    description: 'Shows promise in specific areas',
    color: 'slate',
    bgClass: 'bg-warm-gray',
    textClass: 'text-slate',
  };
}

// ============================================
// DIMENSION SCORE INTERPRETATION
// ============================================

export interface DimensionInterpretation {
  level: 'excellent' | 'strong' | 'good' | 'developing' | 'needs_improvement';
  label: string;
  colorClass: string;
}

/**
 * Get the interpretation for an individual dimension score.
 *
 * @param score - The dimension score (0-100)
 * @returns Interpretation with level, label, and color class
 */
export function getDimensionInterpretation(score: number): DimensionInterpretation {
  if (score >= 90) {
    return {
      level: 'excellent',
      label: 'Excellent',
      colorClass: 'text-verification-green',
    };
  }
  if (score >= 75) {
    return {
      level: 'strong',
      label: 'Strong',
      colorClass: 'text-clarus-navy',
    };
  }
  if (score >= 60) {
    return {
      level: 'good',
      label: 'Good',
      colorClass: 'text-slate',
    };
  }
  if (score >= 45) {
    return {
      level: 'developing',
      label: 'Developing',
      colorClass: 'text-alert-amber',
    };
  }
  return {
    level: 'needs_improvement',
    label: 'Needs Improvement',
    colorClass: 'text-error-red',
  };
}

// ============================================
// SCORE VALIDATION
// ============================================

/**
 * Validate that all dimension scores are within valid range (0-100)
 */
export function validateScores(scores: TierScores): boolean {
  for (const score of Object.values(scores)) {
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return false;
    }
  }
  return true;
}

/**
 * Validate a single score is within range
 */
export function validateScore(score: number): boolean {
  return typeof score === 'number' && score >= 0 && score <= 100;
}

// ============================================
// SCORE COMPARISON UTILITIES
// ============================================

/**
 * Compare two scores and return the difference
 */
export function compareScores(scoreA: number, scoreB: number): {
  difference: number;
  percentChange: number;
  direction: 'up' | 'down' | 'unchanged';
} {
  const difference = scoreA - scoreB;
  const percentChange = scoreB !== 0 ? (difference / scoreB) * 100 : 0;

  let direction: 'up' | 'down' | 'unchanged';
  if (difference > 0) {
    direction = 'up';
  } else if (difference < 0) {
    direction = 'down';
  } else {
    direction = 'unchanged';
  }

  return {
    difference,
    percentChange: Math.round(percentChange * 10) / 10,
    direction,
  };
}

/**
 * Calculate the contribution of each dimension to the overall score
 */
export function calculateDimensionContributions(
  tier: ScoringPropertyTier,
  scores: TierScores
): Array<{
  dimension: string;
  score: number;
  weight: number;
  contribution: number;
}> {
  const weights = TIER_WEIGHTS[tier];
  const contributions: Array<{
    dimension: string;
    score: number;
    weight: number;
    contribution: number;
  }> = [];

  for (const [dimension, weight] of Object.entries(weights)) {
    const score = (scores as unknown as Record<string, number>)[dimension] || 0;
    contributions.push({
      dimension,
      score,
      weight,
      contribution: Math.round(score * weight * 10) / 10,
    });
  }

  // Sort by contribution (highest first)
  return contributions.sort((a, b) => b.contribution - a.contribution);
}

// ============================================
// TIER AVERAGES (for comparison)
// ============================================

/**
 * Default tier averages for comparison purposes.
 * These would be calculated from actual data in production.
 */
export const DEFAULT_TIER_AVERAGES: Record<ScoringPropertyTier, number> = {
  medical_longevity: 82,
  integrated_wellness: 78,
  luxury_destination: 75,
};

/**
 * Get the default tier average for comparison
 */
export function getTierAverage(tier: ScoringPropertyTier): number {
  return DEFAULT_TIER_AVERAGES[tier];
}

// ============================================
// SCORE FORMATTING
// ============================================

/**
 * Format a score for display
 */
export function formatScore(score: number): string {
  return Math.round(score).toString();
}

/**
 * Format a score with tier label
 */
export function formatScoreWithTier(score: number): string {
  const interpretation = getScoreInterpretation(score);
  return `${formatScore(score)} - ${interpretation.label}`;
}
