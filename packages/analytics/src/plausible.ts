/**
 * Plausible Analytics Integration
 *
 * Privacy-first analytics that respects user privacy:
 * - No cookies
 * - No personal data collection
 * - GDPR compliant by design
 * - Respects Do Not Track
 * - Integrates with Clarus Vitae consent system
 * - Off by default (Research Mode)
 */

import type { AnalyticsEvent, PageviewData } from './types';

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

// Consent cookie name (matches consent.ts in utils)
const CONSENT_COOKIE_NAME = 'clarus_consent';
// Privacy mode cookie name (matches research-mode.ts in utils)
const PRIVACY_COOKIE_NAME = 'clarus_privacy_mode';

/**
 * Check if user has given analytics consent via cookie
 */
function hasAnalyticsConsent(): boolean {
  if (typeof document === 'undefined') return false;

  try {
    const cookies = document.cookie.split(';').reduce(
      (acc, cookie) => {
        const parts = cookie.trim().split('=');
        const key = parts[0];
        const value = parts[1];
        if (key) {
          acc[key] = value ?? '';
        }
        return acc;
      },
      {} as Record<string, string>
    );

    // Check privacy mode cookie first
    // If set to 'full', user has opted out of Research Mode
    const privacyMode = cookies[PRIVACY_COOKIE_NAME];
    if (privacyMode !== 'full') {
      // Research Mode is active (default) - no analytics
      return false;
    }

    // Check consent cookie for explicit analytics consent
    const consentCookie = cookies[CONSENT_COOKIE_NAME];
    if (!consentCookie) return false;

    const consent = JSON.parse(decodeURIComponent(consentCookie));
    return consent.analytics === true;
  } catch {
    return false;
  }
}

/**
 * Check if Research Mode is active
 * Returns true if user is in Research Mode (privacy-first default)
 */
function isResearchModeActive(): boolean {
  if (typeof document === 'undefined') return true;

  // Check for privacy mode cookie
  const cookies = document.cookie;

  // If privacy_mode=full is NOT present, Research Mode is active
  return !cookies.includes(`${PRIVACY_COOKIE_NAME}=full`);
}

/**
 * Check if analytics should be enabled
 * Respects Research Mode, consent, and Do Not Track
 */
function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false;

  // Respect Do Not Track browser setting
  if (navigator.doNotTrack === '1') return false;

  // Check if Research Mode is active (default state - no tracking)
  if (isResearchModeActive()) return false;

  // Check for explicit analytics consent
  if (!hasAnalyticsConsent()) return false;

  // Check if domain is configured
  if (!PLAUSIBLE_DOMAIN) return false;

  return true;
}

/**
 * Track a pageview
 */
export function trackPageview(data?: PageviewData): void {
  if (!isAnalyticsEnabled()) return;

  const payload = {
    n: 'pageview',
    u: data?.url || window.location.href,
    d: PLAUSIBLE_DOMAIN,
    r: data?.referrer || document.referrer || null,
    w: window.innerWidth,
  };

  sendToPlausible(payload);
}

/**
 * Track a custom event
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (!isAnalyticsEnabled()) return;

  const payload = {
    n: event.name,
    u: window.location.href,
    d: PLAUSIBLE_DOMAIN,
    p: event.props ? JSON.stringify(event.props) : undefined,
  };

  sendToPlausible(payload);
}

/**
 * Send data to Plausible
 */
function sendToPlausible(payload: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const plausibleUrl = 'https://plausible.io/api/event';

  // Use sendBeacon for reliability, fallback to fetch
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(plausibleUrl, body);
  } else {
    fetch(plausibleUrl, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
      keepalive: true,
    }).catch(() => {
      // Silently fail - analytics should never break the app
    });
  }
}

/**
 * Get current analytics status for debugging/display
 */
export function getAnalyticsStatus(): {
  enabled: boolean;
  reason: string;
} {
  if (typeof window === 'undefined') {
    return { enabled: false, reason: 'Server-side rendering' };
  }

  if (navigator.doNotTrack === '1') {
    return { enabled: false, reason: 'Do Not Track enabled' };
  }

  if (isResearchModeActive()) {
    return { enabled: false, reason: 'Research Mode active' };
  }

  if (!hasAnalyticsConsent()) {
    return { enabled: false, reason: 'No analytics consent' };
  }

  if (!PLAUSIBLE_DOMAIN) {
    return { enabled: false, reason: 'Analytics not configured' };
  }

  return { enabled: true, reason: 'Analytics enabled with consent' };
}
