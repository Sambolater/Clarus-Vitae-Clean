/**
 * Team Types
 *
 * Types for Advisory Team members and related entities.
 * Establishes human credibility and expertise behind platform recommendations.
 */

/**
 * Team member role classification
 */
export type TeamRole =
  | 'founder'
  | 'senior_advisor'
  | 'advisor'
  | 'contributor'
  | 'medical_advisor';

/**
 * Education record for team members
 */
export interface Education {
  institution: string;
  degree: string;
  field: string;
  year?: number;
}

/**
 * Previous role/position held by team member
 */
export interface PreviousRole {
  organization: string;
  title: string;
  years: string;
  description?: string;
}

/**
 * Record of a team member's visit to a property
 */
export type PropertyVisitType =
  | 'full_program'
  | 'site_visit'
  | 'evaluation'
  | 'invited';

export interface PropertyVisit {
  teamMemberId: string;
  propertyId: string;
  propertyName?: string;
  propertySlug?: string;
  visitDate: Date;
  visitType: PropertyVisitType;
  notes?: string;
  reviewId?: string;
}

/**
 * Full team member profile
 */
export interface TeamMember {
  id: string;
  slug: string;

  // Basic Info
  name: string;
  title: string;
  role: TeamRole;

  // Bio
  bio: string;
  shortBio: string;

  // Credentials & Background
  credentials: string[];
  certifications: string[];
  education: Education[];
  previousRoles: PreviousRole[];

  // Expertise
  specializations: string[];
  focusAreas: string[];
  languages: string[];

  // Experience Metrics
  propertiesVisited: number;
  programsEvaluated: number;
  yearsExperience: number;

  // Media
  photoUrl: string;
  photoAlt: string;

  // Contact
  isContactAvailable: boolean;
  linkedinUrl?: string;
  email?: string;

  // Display
  displayOrder: number;
  isActive: boolean;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Simplified team member info for bylines and badges
 */
export interface TeamMemberSummary {
  id: string;
  slug: string;
  name: string;
  title: string;
  photoUrl?: string;
  credentials?: string[];
  propertiesVisited?: number;
}

/**
 * Collective statistics for the advisory team
 */
export interface CollectiveStats {
  totalMembers: number;
  totalPropertiesVisited: number;
  totalProgramsEvaluated: number;
  totalYearsExperience: number;
  countriesCovered: number;
}

/**
 * Team member with their property visits
 */
export interface TeamMemberWithVisits extends TeamMember {
  visits: PropertyVisit[];
}

/**
 * Team member with their reviews
 */
export interface TeamMemberReview {
  id: string;
  propertyId: string;
  propertyName: string;
  propertySlug: string;
  visitDate: Date;
  visitCircumstances: string;
  overallRating: number;
  reviewExcerpt: string;
}

export interface TeamMemberWithReviews extends TeamMember {
  reviews: TeamMemberReview[];
}

/**
 * Props for editorial byline display
 */
export interface EditorialBylineData {
  author: TeamMemberSummary;
  publishDate: Date;
  readTime?: number;
  updatedDate?: Date;
}

/**
 * Props for contact advisor functionality
 */
export interface ContactAdvisorRequest {
  teamMemberId?: string;
  context?: string;
  propertyId?: string;
  message?: string;
  contactEmail: string;
  contactName?: string;
}

/**
 * Team visit summary for property pages
 */
export interface PropertyTeamVisit {
  teamMember: TeamMemberSummary;
  visitDate: Date;
  visitType: PropertyVisitType;
  visitCircumstances?: string;
  hasReview: boolean;
  reviewId?: string;
}

/**
 * Helper to get display label for team role
 */
export function getTeamRoleLabel(role: TeamRole): string {
  const labels: Record<TeamRole, string> = {
    founder: 'Founder',
    senior_advisor: 'Senior Advisor',
    advisor: 'Advisor',
    contributor: 'Contributor',
    medical_advisor: 'Medical Advisor',
  };
  return labels[role];
}

/**
 * Helper to get display label for visit type
 */
export function getVisitTypeLabel(type: PropertyVisitType): string {
  const labels: Record<PropertyVisitType, string> = {
    full_program: 'Full Program',
    site_visit: 'Site Visit',
    evaluation: 'Evaluation Visit',
    invited: 'Invited Visit',
  };
  return labels[type];
}
