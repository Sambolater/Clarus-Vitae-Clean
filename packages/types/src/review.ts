/**
 * Review Types
 *
 * Types related to outcome-focused reviews.
 * These reviews ask "Did it work?" rather than "Was it nice?"
 */

// ============================================================================
// Enums & Constants
// ============================================================================

export type ReviewType = 'VERIFIED_GUEST' | 'EXPERT_ASSESSMENT';

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';

export type GoalAchievementLevel = 'FULLY' | 'PARTIALLY' | 'NOT_ACHIEVED';

export type PhysicianEndorsementLevel = 'YES' | 'PROBABLY' | 'UNSURE' | 'NO';

export type ResultsSustainedLevel = 'fully' | 'mostly' | 'partially' | 'not_sustained';

export type VerificationMethod = 'email' | 'booking_confirmation' | 'property_confirm';

// ============================================================================
// Outcome Ratings (1-5 scale)
// ============================================================================

export interface OutcomeRatings {
  /** Did you achieve your stated health goals? (1-5) */
  goalAchievement: number;
  /** How comprehensive was your personalized protocol? (1-5) */
  protocolQuality: number;
  /** How useful was the take-home/follow-up guidance? (1-5) */
  followupQuality: number;
  /** Would your personal physician endorse this program? (1-5) */
  physicianEndorsement: number;
}

// ============================================================================
// Experience Ratings (1-5 scale)
// ============================================================================

export interface ExperienceRatings {
  facilities: number;
  service: number;
  food: number;
  value: number;
}

// ============================================================================
// Measurable Outcomes (Optional self-reported)
// ============================================================================

export interface BiomarkerChange {
  /** e.g., "HbA1c", "LDL", "Cortisol" */
  name: string;
  before: number;
  after: number;
  unit: string;
}

export interface CustomOutcome {
  description: string;
  change: string;
}

export interface MeasurableOutcomes {
  /** Biomarker changes (before/after comparisons) */
  biomarkers?: BiomarkerChange[];

  /** Biological age change in years (negative = improvement) */
  biologicalAgeChange?: number;

  /** Weight change in kg (negative = loss) */
  weightChange?: number;

  /** Subjective improvements on -5 to +5 scale */
  energyLevelChange?: number;
  sleepQualityChange?: number;
  stressLevelChange?: number;
  painLevelChange?: number;

  /** Other custom outcomes */
  customOutcomes?: CustomOutcome[];
}

// ============================================================================
// Follow-Up Reviews (30/90/180 days)
// ============================================================================

export interface FollowUpEntry {
  date: Date;
  resultsSustained: ResultsSustainedLevel;
  notes: string;
  updatedOutcomes?: Partial<MeasurableOutcomes>;
}

export interface FollowUpReviews {
  thirtyDays?: FollowUpEntry;
  ninetyDays?: FollowUpEntry;
  oneEightyDays?: FollowUpEntry;
}

// ============================================================================
// Main Review Interface
// ============================================================================

export interface Review {
  id: string;
  propertyId: string;
  programId?: string;

  // Reviewer info
  reviewerDisplayName: string;
  userId?: string;

  // Visit details
  visitDate: Date;
  stayDuration: number;
  programType: string;
  statedGoals?: string[];

  // Team review identification
  isTeamReview: boolean;
  teamMemberId?: string;
  visitCircumstances?: string;

  // Standard rating (1-5)
  ratingOverall: number;

  // Outcome ratings (for Tier 1 & 2)
  outcomeRatings?: OutcomeRatings;

  // Experience ratings
  experienceRatings?: ExperienceRatings;

  // Text content
  title?: string;
  reviewText: string;
  pros?: string[];
  cons?: string[];

  // Measurable outcomes (optional)
  outcomes?: MeasurableOutcomes;

  // Follow-ups
  followUps?: FollowUpReviews;

  // Verification
  isVerifiedStay: boolean;
  verificationMethod?: VerificationMethod;

  // Status
  status: ReviewStatus;

  // Property response
  propertyResponse?: string;
  propertyRespondedAt?: Date;

  // Engagement
  helpfulCount?: number;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Review Summary (for listings)
// ============================================================================

export interface ReviewSummary {
  id: string;
  propertyId: string;
  type: ReviewType;
  authorName?: string;
  visitDate: Date;
  outcomeRating: number;
  excerpt: string;
  isVerified: boolean;
  isTeamReview: boolean;
}

// ============================================================================
// Aggregated Review Stats
// ============================================================================

export interface ReviewAggregation {
  totalReviews: number;
  verifiedCount: number;
  teamReviewCount: number;

  // Overall averages
  overallAverage: number;

  // Outcome averages (for Tier 1 & 2)
  goalAchievementAvg?: number;
  protocolQualityAvg?: number;
  followupQualityAvg?: number;
  physicianEndorsementAvg?: number;

  // Experience averages
  facilitiesAvg?: number;
  serviceAvg?: number;
  foodAvg?: number;
  valueAvg?: number;

  // Follow-up sustainability data
  followUpData?: {
    thirtyDayCount: number;
    thirtyDayFullySustained: number;
    ninetyDayCount: number;
    ninetyDayFullySustained: number;
    oneEightyDayCount: number;
    oneEightyDayFullySustained: number;
  };

  // Goal achievement distribution
  goalAchievementDistribution?: {
    fully: number;
    partially: number;
    notAchieved: number;
  };
}

// ============================================================================
// Review Submission Types
// ============================================================================

export interface ReviewSubmissionData {
  propertyId: string;
  programId?: string;

  // Visit details
  visitDate: Date;
  stayDuration: number;
  programType: string;
  statedGoals?: string[];
  isFirstVisit?: boolean;

  // Ratings
  ratingOverall: number;
  outcomeRatings?: OutcomeRatings;
  experienceRatings?: ExperienceRatings;

  // Written content
  title?: string;
  reviewText: string;
  pros?: string[];
  cons?: string[];

  // Measurable outcomes
  outcomes?: MeasurableOutcomes;

  // Reviewer preferences
  displayNamePreference: 'initials' | 'verified_guest' | 'custom';
  customDisplayName?: string;
  email: string;

  // Consent
  publishConsent: boolean;
  followUpConsent: boolean;
  genuineExperienceConfirm: boolean;
}

export interface FollowUpSubmissionData {
  reviewId: string;
  followUpPeriod: '30' | '90' | '180';
  resultsSustained: ResultsSustainedLevel;
  notes: string;
  updatedOutcomes?: Partial<MeasurableOutcomes>;
}

// ============================================================================
// Review Filters
// ============================================================================

export interface ReviewFilters {
  sortBy: 'recent' | 'highest_outcome' | 'lowest_outcome' | 'most_helpful' | 'highest_rating' | 'lowest_rating';
  programType?: string;
  ratingMin?: number;
  timeframe?: '6months' | '1year' | '2years' | 'all';
  hasOutcomes?: boolean;
  verifiedOnly?: boolean;
  teamReviewsOnly?: boolean;
}

// ============================================================================
// Legacy Compatibility
// ============================================================================

/** @deprecated Use OutcomeRatings instead */
export interface OutcomeMetrics {
  goalAchievement?: number;
  measurableImprovement?: string;
  protocolQuality?: number;
  followUpQuality?: number;
  sustainabilityDays?: number;
  wouldRecommend: boolean;
}
