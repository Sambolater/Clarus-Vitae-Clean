/**
 * Review Types
 *
 * Types related to outcome-focused reviews
 */

export type ReviewType = 'VERIFIED_GUEST' | 'EXPERT_ASSESSMENT';

export interface OutcomeMetrics {
  goalAchievement?: number; // 1-5 scale
  measurableImprovement?: string;
  protocolQuality?: number; // 1-5 scale
  followUpQuality?: number; // 1-5 scale
  sustainabilityDays?: number;
  wouldRecommend: boolean;
}

export interface Review {
  id: string;
  propertyId: string;
  type: ReviewType;
  authorName?: string;
  authorCredentials?: string;
  visitDate: Date;
  programType: string;
  stayDuration: number;
  outcomes: OutcomeMetrics;
  narrative: string;
  strengths: string[];
  considerations: string[];
  bestFor: string[];
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewSummary {
  id: string;
  propertyId: string;
  type: ReviewType;
  authorName?: string;
  visitDate: Date;
  outcomeRating: number;
  excerpt: string;
}
