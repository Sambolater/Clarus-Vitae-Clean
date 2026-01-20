/**
 * Consent Management Utilities
 *
 * Manages user consent for cookies, analytics, and data processing.
 * Implements GDPR-compliant consent tracking with granular controls.
 *
 * Key principles:
 * - Privacy by default (no tracking without explicit consent)
 * - Granular consent options
 * - Easy withdrawal of consent
 * - Auditable consent records
 */

/**
 * Consent category types
 */
export type ConsentCategory =
  | 'essential'       // Required for site function (always true)
  | 'analytics'       // Self-hosted Plausible analytics
  | 'functional'      // Saved comparisons, preferences
  | 'inquiry'         // Contact property consent
  | 'followup';       // Follow-up communication consent

/**
 * Consent options structure
 */
export interface ConsentOptions {
  essential: boolean;      // Always true, required for site function
  analytics: boolean;      // Self-hosted Plausible only
  functional: boolean;     // Saved comparisons, preferences
}

/**
 * Inquiry-specific consent
 */
export interface InquiryConsent {
  contactProperty: boolean;   // Allow sharing info with property
  followup: boolean;          // Allow follow-up communications
  privacyPolicyAccepted: boolean;
  timestamp: Date;
}

/**
 * Complete consent record for audit trail
 */
export interface ConsentRecord {
  id: string;
  categories: ConsentOptions;
  inquiryConsent?: InquiryConsent;
  ipHash?: string;           // Hashed IP for fraud prevention
  userAgent?: string;        // For audit purposes
  timestamp: Date;
  version: string;           // Privacy policy version consented to
}

/**
 * Default consent state - privacy-first
 */
export const DEFAULT_CONSENT: ConsentOptions = {
  essential: true,      // Always required
  analytics: false,     // Off by default
  functional: false,    // Off by default
};

/**
 * Current privacy policy version
 */
export const PRIVACY_POLICY_VERSION = '1.0.0';

/**
 * Storage key for consent preferences
 */
export const CONSENT_STORAGE_KEY = 'clarus_consent';

/**
 * Cookie name for consent banner dismissal
 */
export const CONSENT_BANNER_COOKIE = 'clarus_consent_banner';

/**
 * Get current consent state
 * @returns Current consent options or defaults
 */
export function getConsent(): ConsentOptions {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_CONSENT };
  }

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        essential: true, // Always true
        analytics: parsed.analytics ?? false,
        functional: parsed.functional ?? false,
      };
    }
  } catch {
    // Fall through to defaults
  }

  return { ...DEFAULT_CONSENT };
}

/**
 * Save consent preferences
 * @param consent - Consent options to save
 * @returns ConsentRecord for audit trail
 */
export function saveConsent(consent: Partial<ConsentOptions>): ConsentRecord {
  const fullConsent: ConsentOptions = {
    essential: true, // Always true
    analytics: consent.analytics ?? false,
    functional: consent.functional ?? false,
  };

  const record: ConsentRecord = {
    id: generateConsentId(),
    categories: fullConsent,
    timestamp: new Date(),
    version: PRIVACY_POLICY_VERSION,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(fullConsent));

      // Set cookie to track consent banner has been interacted with
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      document.cookie = `${CONSENT_BANNER_COOKIE}=seen; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`;
    } catch {
      // Ignore storage errors
    }
  }

  return record;
}

/**
 * Check if consent banner should be shown
 * @returns True if banner should be displayed
 */
export function shouldShowConsentBanner(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check if banner has been dismissed
  return !document.cookie.includes(`${CONSENT_BANNER_COOKIE}=seen`);
}

/**
 * Dismiss consent banner without changing settings
 * User continues in Research Mode (privacy-first default)
 */
export function dismissConsentBanner(): void {
  if (typeof window === 'undefined') return;

  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  document.cookie = `${CONSENT_BANNER_COOKIE}=seen; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Withdraw all non-essential consent
 * Returns user to Research Mode
 */
export function withdrawConsent(): void {
  if (typeof window === 'undefined') return;

  // Clear consent storage
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // Ignore
  }

  // Clear any analytics cookies
  clearConsentRelatedCookies();
}

/**
 * Clear cookies related to consent
 */
function clearConsentRelatedCookies(): void {
  if (typeof document === 'undefined') return;

  // Only clear analytics-related cookies, not the banner dismissal
  const cookiesToClear = [
    '_ga',
    '_gid',
    '_gat',
    '_gac_',
  ];

  cookiesToClear.forEach((name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

/**
 * Check if user has given consent for a specific category
 * @param category - Consent category to check
 * @returns True if consent is given
 */
export function hasConsent(category: ConsentCategory): boolean {
  if (category === 'essential') return true;

  const consent = getConsent();
  return consent[category as keyof ConsentOptions] ?? false;
}

/**
 * Generate a unique consent ID for audit trail
 */
function generateConsentId(): string {
  return `consent_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Create inquiry consent record
 * @param consent - Inquiry consent options
 * @returns InquiryConsent record
 */
export function createInquiryConsent(consent: {
  contactProperty: boolean;
  followup: boolean;
}): InquiryConsent {
  return {
    contactProperty: consent.contactProperty,
    followup: consent.followup,
    privacyPolicyAccepted: true,
    timestamp: new Date(),
  };
}

/**
 * Validate that required consent is given for inquiry submission
 * @param consent - Inquiry consent to validate
 * @returns True if consent is valid for submission
 */
export function validateInquiryConsent(consent: InquiryConsent): boolean {
  return consent.contactProperty && consent.privacyPolicyAccepted;
}

/**
 * Get consent summary for display
 * @returns Human-readable consent summary
 */
export function getConsentSummary(): {
  enabled: ConsentCategory[];
  disabled: ConsentCategory[];
} {
  const consent = getConsent();
  const enabled: ConsentCategory[] = ['essential'];
  const disabled: ConsentCategory[] = [];

  if (consent.analytics) {
    enabled.push('analytics');
  } else {
    disabled.push('analytics');
  }

  if (consent.functional) {
    enabled.push('functional');
  } else {
    disabled.push('functional');
  }

  return { enabled, disabled };
}

/**
 * Consent category descriptions for UI
 */
export const CONSENT_DESCRIPTIONS: Record<
  ConsentCategory,
  { title: string; description: string }
> = {
  essential: {
    title: 'Essential',
    description:
      'Required for the website to function. Cannot be disabled.',
  },
  analytics: {
    title: 'Analytics',
    description:
      'Privacy-respecting analytics using self-hosted Plausible. No personal data collected.',
  },
  functional: {
    title: 'Preferences',
    description:
      'Saves your preferences like comparison lists and viewing history.',
  },
  inquiry: {
    title: 'Property Contact',
    description:
      'Allows sharing your contact information with the property you inquire about.',
  },
  followup: {
    title: 'Follow-up',
    description:
      'Allows us to contact you about your inquiry or send relevant information.',
  },
};
