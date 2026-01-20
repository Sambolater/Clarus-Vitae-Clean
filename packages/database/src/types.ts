/**
 * Database Type Definitions
 *
 * These types match the Prisma schema enums and are exported independently
 * so they're available even when Prisma client hasn't been generated.
 * This ensures type-checking works in CI before db:generate runs.
 */

// Property-related enums
export type PropertyTier = 'TIER_1' | 'TIER_2' | 'TIER_3';

export type WellnessApproach = 'CLINICAL' | 'INTEGRATIVE' | 'HOLISTIC' | 'LIFESTYLE';

export type FocusArea =
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

// Treatment-related enums
export type TreatmentCategory =
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

export type DiagnosticCategory =
  | 'IMAGING'
  | 'GENETIC'
  | 'BIOMARKERS'
  | 'MICROBIOME'
  | 'CARDIOVASCULAR'
  | 'COGNITIVE'
  | 'METABOLIC';

export type EquipmentCategory =
  | 'MRI'
  | 'CT'
  | 'ULTRASOUND'
  | 'HYPERBARIC'
  | 'CRYOTHERAPY'
  | 'IV_INFUSION'
  | 'LASER'
  | 'OTHER';

export type EvidenceLevel =
  | 'STRONG'
  | 'MODERATE'
  | 'EMERGING'
  | 'EXPERIMENTAL'
  | 'TRADITIONAL';

// Article-related enums
export type ArticleCategory =
  | 'DESTINATION_GUIDE'
  | 'BUYERS_GUIDE'
  | 'TREATMENT_EXPLAINER'
  | 'INDUSTRY_NEWS'
  | 'PRACTITIONER_INTERVIEW'
  | 'EXPERIENCE_ARTICLE';

// Partnership and property detail enums
export type PartnershipStatus =
  | 'NONE'
  | 'CONTACTED'
  | 'IN_DISCUSSION'
  | 'LEAD_GEN'
  | 'AFFILIATE'
  | 'PREMIUM';

export type DiscretionLevel = 'ULTRA_HIGH' | 'HIGH' | 'STANDARD';

export type GenderSeparation = 'FULL' | 'PARTIAL' | 'NONE' | 'ON_REQUEST';

export type SoloFriendliness = 'OPTIMIZED' | 'GOOD' | 'COUPLES_FOCUSED';

export type LGBTQWelcoming = 'EXPLICITLY_WELCOMING' | 'WELCOMING' | 'CULTURALLY_CONSERVATIVE';

// Review-related enums
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';

export type GoalAchievement = 'FULLY' | 'PARTIALLY' | 'NOT_ACHIEVED';

export type PhysicianEndorsement = 'YES' | 'PROBABLY' | 'UNSURE' | 'NO';

// Inquiry-related enums
export type ContactMethod = 'EMAIL' | 'PHONE' | 'SECURE_EMAIL' | 'SIGNAL';

export type BudgetRange =
  | 'UNDER_5K'
  | 'FIVE_TO_10K'
  | 'TEN_TO_25K'
  | 'TWENTYFIVE_TO_50K'
  | 'FIFTY_TO_100K'
  | 'OVER_100K';

export type InquiryStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'SENT_TO_PROPERTY'
  | 'CONVERTED'
  | 'CLOSED';

// Index tier for scoring
export type IndexTier = 'EXCEPTIONAL' | 'DISTINGUISHED' | 'NOTABLE' | 'CURATED';
