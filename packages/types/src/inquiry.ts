/**
 * Clarus Vitae - Inquiry Type Definitions
 *
 * Types for the inquiry/lead capture system.
 * Supports standard, secure, and batch inquiries with privacy-first design.
 */

// ============================================================================
// Enums (mirroring Prisma schema)
// ============================================================================

export type InquiryType = 'standard' | 'secure' | 'consultation';

export type InquiryStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'SENT_TO_PROPERTY'
  | 'CONVERTED'
  | 'CLOSED';

export type ContactMethod = 'EMAIL' | 'PHONE' | 'SECURE_EMAIL' | 'SIGNAL';

export type BudgetRange =
  | 'UNDER_5K'
  | 'FIVE_TO_10K'
  | 'TEN_TO_25K'
  | 'TWENTYFIVE_TO_50K'
  | 'FIFTY_TO_100K'
  | 'OVER_100K';

// ============================================================================
// Inquiry Input Types (Form Submission)
// ============================================================================

/**
 * Standard inquiry form input
 */
export interface InquiryInput {
  // Required
  propertyId: string;
  name: string;
  email: string;
  consentContactProperty: boolean;
  privacyPolicyAccepted: boolean;

  // Optional
  phone?: string;
  programId?: string;
  message?: string;
  preferredDates?: string;
  datesFlexible?: boolean;
  durationInterest?: string;
  budgetRange?: BudgetRange;
  primaryGoals?: string[];
  preferredContact?: ContactMethod;

  // Privacy
  consentFollowup?: boolean;
}

/**
 * Secure inquiry form input (enhanced privacy)
 */
export interface SecureInquiryInput {
  // Required
  propertyId: string;
  name: string; // Can be pseudonym
  contactMethod: ContactMethod;
  consentContactProperty: boolean;
  privacyPolicyAccepted: boolean;

  // Contact value based on method
  contactValue: string; // Email, phone, or Signal username

  // Optional
  message?: string;
  primaryGoals?: string[];

  // Enhanced privacy options
  autoDelete?: boolean; // Auto-delete after 7 days
  noFollowup?: boolean; // Do not contact for follow-up
}

/**
 * Batch inquiry input (from comparison tool)
 */
export interface BatchInquiryInput {
  // Required
  propertyIds: string[];
  name: string;
  email: string;
  consentContactProperty: boolean;
  privacyPolicyAccepted: boolean;

  // Optional
  phone?: string;
  message?: string;
  preferredDates?: string;
  datesFlexible?: boolean;
  budgetRange?: BudgetRange;
  primaryGoals?: string[];

  // Privacy
  consentFollowup?: boolean;

  // Per-property consent (property ID -> consent boolean)
  propertyConsents?: Record<string, boolean>;
}

// ============================================================================
// Inquiry Response Types
// ============================================================================

/**
 * Inquiry database record (with encrypted fields)
 */
export interface Inquiry {
  id: string;
  propertyId: string | null;
  inquiryType: InquiryType;

  // Contact Info (encrypted)
  name: string | null;
  email: string;
  phone: string | null;
  preferredContact: ContactMethod;

  // Inquiry Details
  interestedProperties: string[];
  dates: string | null;
  datesFlexible: boolean;
  durationInterest: string | null;
  primaryGoals: string[];
  budgetRange: BudgetRange | null;
  additionalNotes: string | null;

  // Privacy Preferences
  anonymousInquiry: boolean;
  secureChannelRequest: boolean;

  // Attribution
  sourcePage: string | null;
  sourceUrl: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;

  // Processing
  status: InquiryStatus;
  assignedTo: string | null;
  propertyNotified: boolean;
  propertyNotifiedAt: Date | null;

  // Consent
  contactConsent: boolean;
  privacyPolicyAccepted: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // For secure inquiries
  scheduledDeletionAt?: Date | null;
}

/**
 * Status change record
 */
export interface InquiryStatusChange {
  id: string;
  inquiryId: string;
  fromStatus: InquiryStatus;
  toStatus: InquiryStatus;
  changedBy: string | null;
  notes: string | null;
  timestamp: Date;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Success response for inquiry submission
 */
export interface InquirySubmissionResponse {
  success: true;
  inquiryId: string;
  message: string;
}

/**
 * Error response for inquiry submission
 */
export interface InquiryErrorResponse {
  success: false;
  error: string;
  details?: Record<string, string>;
}

/**
 * Union type for inquiry API response
 */
export type InquiryResponse = InquirySubmissionResponse | InquiryErrorResponse;

// ============================================================================
// Form State Types
// ============================================================================

/**
 * Form validation errors
 */
export interface InquiryFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  preferredDates?: string;
  budgetRange?: string;
  primaryGoals?: string;
  consentContactProperty?: string;
  privacyPolicyAccepted?: string;
  contactValue?: string;
  contactMethod?: string;
  general?: string;
}

/**
 * Form state for controlled components
 */
export interface InquiryFormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: InquiryFormErrors;
}

// ============================================================================
// Property Notification Types
// ============================================================================

/**
 * Data sent to property (decrypted)
 */
export interface PropertyNotificationData {
  inquiryId: string;
  propertyId: string;
  propertyName: string;

  // Contact info (decrypted for property)
  name: string;
  email: string;
  phone: string | null;
  preferredContact: ContactMethod;

  // Inquiry details
  message: string | null;
  preferredDates: string | null;
  datesFlexible: boolean;
  durationInterest: string | null;
  budgetRange: BudgetRange | null;
  primaryGoals: string[];

  // Metadata
  submittedAt: Date;
  sourcePage: string | null;
}

/**
 * Property notification method configuration
 */
export interface PropertyNotificationConfig {
  propertyId: string;
  method: 'email' | 'api' | 'webhook';
  endpoint: string; // Email address, API URL, or webhook URL
  apiKey?: string; // For API/webhook methods
}

// ============================================================================
// Admin Dashboard Types
// ============================================================================

/**
 * Inquiry summary for admin dashboard
 */
export interface InquirySummary {
  id: string;
  propertyId: string | null;
  propertyName: string | null;
  status: InquiryStatus;
  createdAt: Date;
  budgetRange: BudgetRange | null;
  primaryGoals: string[];
  // Note: PII fields not included in summary for security
}

/**
 * Inquiry dashboard statistics
 */
export interface InquiryDashboardStats {
  totalInquiries: number;
  byStatus: Record<InquiryStatus, number>;
  byProperty: Array<{ propertyId: string; propertyName: string; count: number }>;
  byBudgetRange: Record<BudgetRange, number>;
  conversionRate: number;
  averageResponseTime: number | null; // In hours
  recentInquiries: InquirySummary[];
}

// ============================================================================
// Focus Area Options (for form)
// ============================================================================

export const FOCUS_AREA_OPTIONS = [
  { value: 'LONGEVITY', label: 'Longevity & Anti-aging' },
  { value: 'DETOX', label: 'Detox & Reset' },
  { value: 'WEIGHT_METABOLIC', label: 'Weight & Metabolic Health' },
  { value: 'STRESS_BURNOUT', label: 'Stress & Burnout Recovery' },
  { value: 'FITNESS_PERFORMANCE', label: 'Fitness & Performance' },
  { value: 'BEAUTY_AESTHETIC', label: 'Beauty & Aesthetic' },
  { value: 'HOLISTIC_SPIRITUAL', label: 'Holistic & Spiritual' },
  { value: 'MEDICAL_ASSESSMENT', label: 'Medical Assessment' },
  { value: 'POST_ILLNESS', label: 'Post-illness Recovery' },
  { value: 'ADDICTION_BEHAVIORAL', label: 'Addiction & Behavioral' },
  { value: 'COGNITIVE_BRAIN', label: 'Cognitive & Brain Health' },
  { value: 'SLEEP', label: 'Sleep Optimization' },
  { value: 'WOMENS_HEALTH', label: "Women's Health" },
  { value: 'MENS_HEALTH', label: "Men's Health" },
  { value: 'GENERAL_REJUVENATION', label: 'General Rejuvenation' },
] as const;

export const BUDGET_RANGE_OPTIONS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'UNDER_5K', label: 'Under $5,000' },
  { value: 'FIVE_TO_10K', label: '$5,000 - $10,000' },
  { value: 'TEN_TO_25K', label: '$10,000 - $25,000' },
  { value: 'TWENTYFIVE_TO_50K', label: '$25,000 - $50,000' },
  { value: 'FIFTY_TO_100K', label: '$50,000 - $100,000' },
  { value: 'OVER_100K', label: '$100,000+' },
] as const;

export const CONTACT_METHOD_OPTIONS = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'PHONE', label: 'Phone' },
  { value: 'SECURE_EMAIL', label: 'Encrypted Email' },
  { value: 'SIGNAL', label: 'Signal (Most Secure)' },
] as const;
