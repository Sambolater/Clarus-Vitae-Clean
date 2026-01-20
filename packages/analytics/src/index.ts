/**
 * Clarus Vitae - Privacy-First Analytics
 *
 * This package provides privacy-preserving analytics using Plausible.
 * No cookies, no personal data collection, GDPR compliant by design.
 *
 * Analytics is OFF by default (Research Mode).
 * Only enabled when user explicitly opts out of Research Mode
 * AND gives explicit analytics consent.
 */

export { trackEvent, trackPageview, getAnalyticsStatus } from './plausible';
export type { AnalyticsEvent, PageviewData } from './types';
