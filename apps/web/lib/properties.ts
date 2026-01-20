/**
 * Property-related utility functions and types
 */

import { type PropertyTier, type FocusArea, type WellnessApproach } from '@clarus-vitae/database';

// Tier labels for display
export const tierLabels: Record<PropertyTier, string> = {
  TIER_1: 'Medical Longevity',
  TIER_2: 'Integrated Wellness',
  TIER_3: 'Luxury Destination',
};

export const tierDescriptions: Record<PropertyTier, string> = {
  TIER_1: 'Full medical oversight with advanced diagnostics and longevity protocols. $20K-$150K+',
  TIER_2: 'Medical consultations with integrated clinical and holistic approaches. $5K-$30K',
  TIER_3: 'Exceptional spa and wellness facilities for relaxation and rejuvenation. $3K-$15K',
};

// Focus area labels for display
export const focusAreaLabels: Record<FocusArea, string> = {
  LONGEVITY: 'Longevity & Anti-aging',
  DETOX: 'Detox & Reset',
  WEIGHT_METABOLIC: 'Weight & Metabolic Health',
  STRESS_BURNOUT: 'Stress & Burnout Recovery',
  FITNESS_PERFORMANCE: 'Fitness & Performance',
  BEAUTY_AESTHETIC: 'Beauty & Aesthetic',
  HOLISTIC_SPIRITUAL: 'Holistic & Spiritual',
  MEDICAL_ASSESSMENT: 'Medical Assessment',
  POST_ILLNESS: 'Post-illness Recovery',
  ADDICTION_BEHAVIORAL: 'Addiction & Behavioral',
  COGNITIVE_BRAIN: 'Cognitive & Brain Health',
  SLEEP: 'Sleep Optimization',
  WOMENS_HEALTH: "Women's Health",
  MENS_HEALTH: "Men's Health",
  GENERAL_REJUVENATION: 'General Rejuvenation',
};

// Approach labels for display
export const approachLabels: Record<WellnessApproach, string> = {
  CLINICAL: 'Clinical',
  INTEGRATIVE: 'Integrative',
  HOLISTIC: 'Holistic',
  LIFESTYLE: 'Lifestyle',
};

// Format price range for display
export function formatPriceRange(min: number, max: number, currency = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (min === max) {
    return `From ${formatter.format(min)}`;
  }

  return `${formatter.format(min)} - ${formatter.format(max)}`;
}

// Get score tier label
export function getScoreTier(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Exceptional', color: 'text-clarus-gold' };
  if (score >= 80) return { label: 'Distinguished', color: 'text-white' };
  if (score >= 70) return { label: 'Notable', color: 'text-white' };
  return { label: 'Curated', color: 'text-clarus-navy' };
}

// Sort options
export const sortOptions = [
  { value: 'score_desc', label: 'Highest Rated' },
  { value: 'score_asc', label: 'Lowest Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'reviews', label: 'Most Reviewed' },
] as const;

// Get list of unique countries (would typically come from API)
export const popularCountries = [
  'Switzerland',
  'Germany',
  'Austria',
  'Thailand',
  'Spain',
  'Italy',
  'France',
  'United Kingdom',
  'United States',
  'India',
  'Greece',
  'Portugal',
  'Mexico',
  'Japan',
  'Indonesia',
];

// Property listing type from API
export interface PropertyListItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  location: {
    city: string;
    country: string;
    region: string | null;
  };
  tier: PropertyTier;
  approach: WellnessApproach | null;
  focusAreas: FocusArea[];
  pricing: {
    min: number;
    max: number;
    currency: string;
  };
  score: number | null;
  badges: {
    verifiedExcellence: boolean;
    editorChoice: string | null;
    risingStar: boolean;
  };
  featuredImage: {
    url: string;
    alt: string;
    width: number;
    height: number;
  } | null;
  reviewCount: number;
}

export interface PropertiesResponse {
  properties: PropertyListItem[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
