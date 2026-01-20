/**
 * Clarus Index Types
 *
 * Types related to the proprietary Clarus Index scoring methodology
 */

export type IndexTier = 'EXCEPTIONAL' | 'DISTINGUISHED' | 'NOTABLE' | 'CURATED';

export interface ClarusIndexDimension {
  name: string;
  score: number;
  weight: number;
  description: string;
}

/**
 * Clarus Index dimensions for Tier 1 (Medical/Longevity) properties
 */
export interface Tier1IndexDimensions {
  clinicalRigor: ClarusIndexDimension;
  outcomeEvidence: ClarusIndexDimension;
  programDepth: ClarusIndexDimension;
  experienceQuality: ClarusIndexDimension;
  valueAlignment: ClarusIndexDimension;
}

/**
 * Clarus Index dimensions for Tier 2 (Integrated Wellness) properties
 */
export interface Tier2IndexDimensions {
  programEffectiveness: ClarusIndexDimension;
  holisticIntegration: ClarusIndexDimension;
  practitionerQuality: ClarusIndexDimension;
  experienceQuality: ClarusIndexDimension;
  valueAlignment: ClarusIndexDimension;
}

/**
 * Clarus Index dimensions for Tier 3 (Luxury Destination) properties
 */
export interface Tier3IndexDimensions {
  experienceQuality: ClarusIndexDimension;
  wellnessOfferingDepth: ClarusIndexDimension;
  transformativePotential: ClarusIndexDimension;
  settingEnvironment: ClarusIndexDimension;
  valueAlignment: ClarusIndexDimension;
}

export type ClarusIndexDimensions =
  | Tier1IndexDimensions
  | Tier2IndexDimensions
  | Tier3IndexDimensions;

export interface ClarusIndexScore {
  overallScore: number;
  tier: IndexTier;
  dimensions: ClarusIndexDimensions;
  assessmentDate: Date;
  assessedBy: string;
  methodology: string;
}

/**
 * Get the tier label based on score
 */
export function getIndexTier(score: number): IndexTier {
  if (score >= 90) return 'EXCEPTIONAL';
  if (score >= 80) return 'DISTINGUISHED';
  if (score >= 70) return 'NOTABLE';
  return 'CURATED';
}

/**
 * Get tier display properties
 */
export function getTierDisplay(tier: IndexTier): {
  label: string;
  bgColor: string;
  textColor: string;
} {
  switch (tier) {
    case 'EXCEPTIONAL':
      return {
        label: 'Exceptional',
        bgColor: '#1A2B4A',
        textColor: '#C9A962',
      };
    case 'DISTINGUISHED':
      return {
        label: 'Distinguished',
        bgColor: '#1A2B4A',
        textColor: '#FAFBFC',
      };
    case 'NOTABLE':
      return {
        label: 'Notable',
        bgColor: '#64748B',
        textColor: '#FAFBFC',
      };
    case 'CURATED':
      return {
        label: 'Curated',
        bgColor: '#E8E6E3',
        textColor: '#1A2B4A',
      };
  }
}
