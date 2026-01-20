/**
 * Analytics Initialization
 *
 * Privacy-respecting analytics using self-hosted Plausible.
 * - No cookies
 * - No personal data
 * - No cross-site tracking
 * - Only aggregated metrics
 * - User can opt-out easily
 *
 * Analytics is OFF by default (Research Mode).
 */

// Re-export from the analytics package
export { trackEvent, trackPageview, getAnalyticsStatus } from '@clarus-vitae/analytics';

// Cookie names (matching utils/privacy)
const PRIVACY_COOKIE_NAME = 'clarus_privacy_mode';
const CONSENT_COOKIE_NAME = 'clarus_consent';

/**
 * Check if user is in Research Mode (default - no tracking)
 */
export function isResearchMode(): boolean {
  if (typeof document === 'undefined') return true;
  return !document.cookie.includes(`${PRIVACY_COOKIE_NAME}=full`);
}

/**
 * Check if user has given analytics consent
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof document === 'undefined') return false;

  // Must not be in Research Mode
  if (isResearchMode()) return false;

  // Check consent cookie
  try {
    const cookies = document.cookie.split(';');
    const consentCookie = cookies
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${CONSENT_COOKIE_NAME}=`));

    if (!consentCookie) return false;

    const value = consentCookie.split('=')[1];
    const consent = JSON.parse(decodeURIComponent(value));
    return consent.analytics === true;
  } catch {
    return false;
  }
}

/**
 * Initialize analytics if consent has been given
 * This function should be called once when the app loads
 *
 * Note: Plausible doesn't require initialization since we're using
 * the API directly. This function is for potential future use if
 * we switch to self-hosted Plausible with script tag.
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;

  // Only init if user has opted in AND not in research mode
  if (isResearchMode()) {
    console.log('[Analytics] Research Mode active - analytics disabled');
    return;
  }

  if (!hasAnalyticsConsent()) {
    console.log('[Analytics] No consent - analytics disabled');
    return;
  }

  // Check for Plausible configuration
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleHost = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST;

  if (!plausibleDomain) {
    console.log('[Analytics] No domain configured');
    return;
  }

  // If using self-hosted Plausible with script tag (optional)
  if (plausibleHost) {
    // Check if script already loaded
    const existingScript = document.querySelector(
      `script[data-domain="${plausibleDomain}"]`
    );
    if (existingScript) return;

    // Load Plausible script
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = plausibleDomain;
    script.src = `${plausibleHost}/js/script.js`;
    document.head.appendChild(script);
  }

  console.log('[Analytics] Initialized with consent');
}

/**
 * Remove analytics (cleanup when consent is withdrawn)
 */
export function removeAnalytics(): void {
  if (typeof window === 'undefined') return;

  // Remove Plausible script if loaded
  const scripts = document.querySelectorAll('script[data-domain]');
  scripts.forEach((script) => script.remove());

  console.log('[Analytics] Removed - consent withdrawn');
}
