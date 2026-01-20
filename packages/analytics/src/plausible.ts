/**
 * Plausible Analytics Integration
 *
 * Privacy-first analytics that respects user privacy:
 * - No cookies
 * - No personal data collection
 * - GDPR compliant by design
 * - Respects Do Not Track
 */

import type { AnalyticsEvent, PageviewData } from './types';

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

/**
 * Check if analytics should be enabled
 * Respects Research Mode and Do Not Track
 */
function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false;

  // Respect Do Not Track
  if (navigator.doNotTrack === '1') return false;

  // Check if Research Mode is active (no tracking)
  const researchMode = window.localStorage?.getItem('clarus_research_mode');
  if (researchMode === 'true') return false;

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
