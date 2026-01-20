/**
 * Research Mode Implementation
 *
 * Research Mode is the default browsing state that provides:
 * - No cookies set (except essential session if logged in)
 * - No analytics tracking
 * - No local storage persistence
 * - No browser fingerprinting
 * - Clean URL parameters (strip tracking params)
 *
 * Users can browse the entire site privately by default.
 */

/**
 * Privacy state configuration
 */
export interface PrivacyState {
  researchMode: boolean;
  analyticsConsent: boolean;
  functionalCookiesConsent: boolean;
  lastUpdated: Date;
}

/**
 * Default privacy state - Research Mode ON by default
 */
export const RESEARCH_MODE_DEFAULTS: PrivacyState = {
  researchMode: true,
  analyticsConsent: false,
  functionalCookiesConsent: false,
  lastUpdated: new Date(),
};

/**
 * Tracking parameters that will be stripped from URLs
 * Covers major advertising and marketing platforms
 */
export const TRACKING_PARAMS_TO_STRIP = [
  // UTM parameters
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  // Meta/Facebook
  'fbclid',
  'fb_action_ids',
  'fb_action_types',
  'fb_source',
  // Google
  'gclid',
  'gclsrc',
  'dclid',
  // Microsoft/Bing
  'msclkid',
  // Mailchimp
  'mc_cid',
  'mc_eid',
  // Twitter
  'twclid',
  // General tracking
  'ref',
  'source',
  'affiliate',
  'partner',
  '_ga',
  '_gl',
  // HubSpot
  'hsa_acc',
  'hsa_cam',
  'hsa_grp',
  'hsa_ad',
  'hsa_src',
  'hsa_tgt',
  'hsa_kw',
  'hsa_mt',
  'hsa_net',
  'hsa_ver',
] as const;

/**
 * Cookie name for privacy preferences
 */
export const PRIVACY_COOKIE_NAME = 'clarus_privacy_mode';

/**
 * Local storage key for research mode (only used when opted out)
 */
export const RESEARCH_MODE_STORAGE_KEY = 'clarus_research_mode';

/**
 * Clean URL by removing tracking parameters
 * @param url - URL to clean
 * @returns Cleaned URL without tracking parameters
 */
export function cleanUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    let hasTrackingParams = false;

    TRACKING_PARAMS_TO_STRIP.forEach((param) => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.delete(param);
        hasTrackingParams = true;
      }
    });

    return hasTrackingParams ? urlObj.toString() : url;
  } catch {
    // Return original URL if parsing fails
    return url;
  }
}

/**
 * Check if URL contains tracking parameters
 * @param url - URL to check
 * @returns True if URL contains tracking parameters
 */
export function hasTrackingParams(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return TRACKING_PARAMS_TO_STRIP.some((param) =>
      urlObj.searchParams.has(param)
    );
  } catch {
    return false;
  }
}

/**
 * Check if Research Mode is active
 * Returns true by default (privacy-first approach)
 * Only returns false if user has explicitly opted out
 *
 * @returns True if Research Mode is active
 */
export function isResearchMode(): boolean {
  // Server-side: always assume research mode
  if (typeof window === 'undefined') {
    return true;
  }

  // Check for explicit opt-out in cookie
  const cookies = document.cookie;
  if (cookies.includes(`${PRIVACY_COOKIE_NAME}=full`)) {
    return false;
  }

  // Default to research mode (privacy-first)
  return true;
}

/**
 * Get current privacy state from storage
 * @returns Current privacy state or defaults
 */
export function getPrivacyState(): PrivacyState {
  // Server-side: return defaults
  if (typeof window === 'undefined') {
    return { ...RESEARCH_MODE_DEFAULTS };
  }

  // Check for stored preferences
  try {
    const stored = localStorage.getItem(RESEARCH_MODE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...RESEARCH_MODE_DEFAULTS,
        ...parsed,
        lastUpdated: new Date(parsed.lastUpdated),
      };
    }
  } catch {
    // Fall through to defaults
  }

  return { ...RESEARCH_MODE_DEFAULTS };
}

/**
 * Enable Research Mode (default privacy state)
 * Clears any stored preferences and non-essential cookies
 */
export function enableResearchMode(): void {
  if (typeof window === 'undefined') return;

  // Remove opt-out cookie
  document.cookie = `${PRIVACY_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;

  // Clear stored preferences
  try {
    localStorage.removeItem(RESEARCH_MODE_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }

  // Clear analytics cookies if any
  clearAnalyticsCookies();
}

/**
 * Disable Research Mode (opt into tracking)
 * Only call this when user explicitly consents
 *
 * @param consent - Consent options
 */
export function disableResearchMode(consent: Partial<PrivacyState>): void {
  if (typeof window === 'undefined') return;

  const state: PrivacyState = {
    researchMode: false,
    analyticsConsent: consent.analyticsConsent ?? false,
    functionalCookiesConsent: consent.functionalCookiesConsent ?? false,
    lastUpdated: new Date(),
  };

  // Set preference cookie (1 year expiry)
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  document.cookie = `${PRIVACY_COOKIE_NAME}=full; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`;

  // Store detailed preferences
  try {
    localStorage.setItem(RESEARCH_MODE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clear analytics-related cookies
 * Called when enabling Research Mode
 */
function clearAnalyticsCookies(): void {
  if (typeof document === 'undefined') return;

  const cookiesToClear = [
    '_ga',
    '_gid',
    '_gat',
    '_gac_',
    '__utma',
    '__utmb',
    '__utmc',
    '__utmz',
    '_fbp',
    '_fbc',
  ];

  cookiesToClear.forEach((name) => {
    // Clear with various domain configurations
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
  });
}

/**
 * Check if analytics consent has been given
 * @returns True if user has consented to analytics
 */
export function hasAnalyticsConsent(): boolean {
  const state = getPrivacyState();
  return !state.researchMode && state.analyticsConsent;
}

/**
 * Check if functional cookies consent has been given
 * @returns True if user has consented to functional cookies
 */
export function hasFunctionalCookiesConsent(): boolean {
  const state = getPrivacyState();
  return !state.researchMode && state.functionalCookiesConsent;
}

/**
 * Get a privacy-safe session ID for the current browsing session
 * This ID is regenerated each session and not persisted
 * Used for rate limiting and spam prevention, not tracking
 *
 * @returns Session ID (regenerated each page load in Research Mode)
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return generateRandomId();
  }

  // In Research Mode, generate a new ID each time (no persistence)
  if (isResearchMode()) {
    return generateRandomId();
  }

  // With consent, use session storage for continuity
  try {
    let sessionId = sessionStorage.getItem('clarus_session');
    if (!sessionId) {
      sessionId = generateRandomId();
      sessionStorage.setItem('clarus_session', sessionId);
    }
    return sessionId;
  } catch {
    return generateRandomId();
  }
}

/**
 * Generate a random ID for session tracking
 */
function generateRandomId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}
