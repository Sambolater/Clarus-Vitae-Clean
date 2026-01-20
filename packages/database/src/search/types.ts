/**
 * Search Document Types
 *
 * Defines the document structures indexed in Meilisearch.
 * These types represent the searchable representation of database entities.
 */

// Local type definitions to avoid Prisma client generation dependency
// These must match the enums defined in prisma/schema.prisma
type PropertyTier = 'TIER_1' | 'TIER_2' | 'TIER_3';
type WellnessApproach = 'CLINICAL' | 'INTEGRATIVE' | 'HOLISTIC' | 'LIFESTYLE';
type FocusArea =
  | 'LONGEVITY'
  | 'DETOX'
  | 'WEIGHT_METABOLIC'
  | 'STRESS_BURNOUT'
  | 'FITNESS_PERFORMANCE'
  | 'BEAUTY_AESTHETIC'
  | 'HOLISTIC_SPIRITUAL'
  | 'MEDICAL_ASSESSMENT'
  | 'POST_ILLNESS'
  | 'ADDICTION_BEHAVIORAL'
  | 'COGNITIVE_BRAIN'
  | 'SLEEP'
  | 'WOMENS_HEALTH'
  | 'MENS_HEALTH'
  | 'GENERAL_REJUVENATION';
type TreatmentCategory =
  | 'DIAGNOSTICS'
  | 'REGENERATIVE'
  | 'CELLULAR'
  | 'DETOXIFICATION'
  | 'HYPERBARIC'
  | 'CRYOTHERAPY'
  | 'IV_THERAPIES'
  | 'HORMONE'
  | 'AESTHETIC'
  | 'BODY_MANUAL'
  | 'MIND_NEURO'
  | 'TRADITIONAL';
type EvidenceLevel = 'STRONG' | 'MODERATE' | 'EMERGING' | 'EXPERIMENTAL' | 'TRADITIONAL';
type ArticleCategory =
  | 'DESTINATION_GUIDE'
  | 'BUYERS_GUIDE'
  | 'TREATMENT_EXPLAINER'
  | 'INDUSTRY_NEWS'
  | 'PRACTITIONER_INTERVIEW'
  | 'EXPERIENCE_ARTICLE';

/**
 * Property document for Meilisearch indexing
 */
export interface PropertySearchDocument {
  id: string;
  slug: string;
  name: string;
  description: string;

  // Location
  city: string;
  country: string;
  region: string | null;

  // Classification
  tier: PropertyTier;
  approach: WellnessApproach | null;
  focusAreas: FocusArea[];

  // Pricing
  priceMin: number;
  priceMax: number;
  currency: string;

  // Scores
  overallScore: number | null;

  // Badges & Status
  published: boolean;
  verifiedExcellence: boolean;
  editorChoice: string | null;
  risingStar: boolean;

  // Image
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;

  // Counts
  reviewCount: number;

  // Timestamps
  createdAt: number; // Unix timestamp for sorting
}

/**
 * Treatment document for Meilisearch indexing
 */
export interface TreatmentSearchDocument {
  id: string;
  slug: string;
  name: string;
  aliases: string[];
  category: TreatmentCategory;

  description: string;
  howItWorks: string | null;
  whatItAddresses: string[];

  evidenceLevel: EvidenceLevel;

  // Pricing
  priceRangeMin: number | null;
  priceRangeMax: number | null;

  published: boolean;

  // Computed fields
  propertyCount: number;
}

/**
 * Article document for Meilisearch indexing
 */
export interface ArticleSearchDocument {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;

  category: ArticleCategory;
  tags: string[];

  authorId: string | null;
  authorName: string | null;

  featuredImage: string | null;

  published: boolean;
  publishedAt: number | null; // Unix timestamp
}

/**
 * Unified search result type that can represent any indexed entity
 */
export interface SearchHit {
  id: string;
  type: 'property' | 'treatment' | 'article';
  slug: string;
  title: string; // name for properties/treatments, title for articles
  description: string;
  url: string;
  imageUrl: string | null;
  meta: Record<string, unknown>;
}

/**
 * Multi-index search results
 */
export interface MultiSearchResults {
  properties: {
    hits: PropertySearchDocument[];
    totalHits: number;
    processingTimeMs: number;
  };
  treatments: {
    hits: TreatmentSearchDocument[];
    totalHits: number;
    processingTimeMs: number;
  };
  articles: {
    hits: ArticleSearchDocument[];
    totalHits: number;
    processingTimeMs: number;
  };
  query: string;
  totalProcessingTimeMs: number;
}

/**
 * Search suggestion result for type-ahead
 */
export interface SearchSuggestion {
  id: string;
  type: 'property' | 'treatment' | 'article';
  title: string;
  subtitle: string;
  url: string;
  imageUrl: string | null;
}
