/**
 * Core Web Vitals Monitoring
 *
 * Privacy-first performance monitoring using Plausible analytics.
 * Tracks LCP, FID, CLS, FCP, and TTFB to ensure sub-2-second loads.
 */

import type { Metric } from 'web-vitals';

/**
 * Target thresholds for Core Web Vitals
 * Based on Google's "Good" thresholds
 */
export const WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint - measures loading performance
  LCP: 2500, // < 2.5s is "Good"

  // First Input Delay - measures interactivity (deprecated, use INP)
  FID: 100, // < 100ms is "Good"

  // Interaction to Next Paint - measures responsiveness
  INP: 200, // < 200ms is "Good"

  // Cumulative Layout Shift - measures visual stability
  CLS: 0.1, // < 0.1 is "Good"

  // First Contentful Paint - measures initial content render
  FCP: 1800, // < 1.8s is "Good"

  // Time to First Byte - measures server response time
  TTFB: 800, // < 800ms is "Good"
} as const;

/**
 * Metric rating based on thresholds
 */
export type MetricRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Get rating for a metric value
 */
export function getMetricRating(name: string, value: number): MetricRating {
  const threshold = WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS];

  if (!threshold) {
    return 'good';
  }

  // CLS has different scale
  if (name === 'CLS') {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  // Time-based metrics
  if (value <= threshold) return 'good';
  if (value <= threshold * 2) return 'needs-improvement';
  return 'poor';
}

/**
 * Send metric to Plausible analytics (privacy-respecting)
 */
function sendToPlausible(metric: Metric) {
  // Check if Plausible is available and we're not in Research Mode
  if (typeof window === 'undefined') return;

  const plausible = (window as unknown as { plausible?: (event: string, options: { props: Record<string, string | number> }) => void }).plausible;

  if (!plausible) return;

  // Check Research Mode - don't track if enabled
  const researchMode = localStorage.getItem('clarus-research-mode');
  if (researchMode === 'true') return;

  // Get rating for context
  const rating = getMetricRating(metric.name, metric.value);

  // Send to Plausible with custom event
  plausible('Web Vitals', {
    props: {
      metric_name: metric.name,
      metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_rating: rating,
      metric_id: metric.id,
    },
  });
}

/**
 * Send metric to console in development
 */
function logMetric(metric: Metric) {
  if (process.env.NODE_ENV !== 'development') return;

  const rating = getMetricRating(metric.name, metric.value);
  const color = rating === 'good' ? '#2D6A4F' : rating === 'needs-improvement' ? '#B45309' : '#DC2626';

  console.log(
    `%c[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${rating})`,
    `color: ${color}; font-weight: bold;`
  );
}

/**
 * Report Web Vitals metrics
 */
export function reportWebVitals(metric: Metric) {
  // Log in development
  logMetric(metric);

  // Send to Plausible in production
  sendToPlausible(metric);
}

/**
 * Initialize all Web Vitals observers
 */
export async function initWebVitals() {
  if (typeof window === 'undefined') return;

  try {
    // eslint-disable-next-line import/no-unresolved -- Dynamic import with installed package
    const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals');

    // Register all metric observers
    onCLS(reportWebVitals);
    onFCP(reportWebVitals);
    onINP(reportWebVitals);
    onLCP(reportWebVitals);
    onTTFB(reportWebVitals);
  } catch {
    // web-vitals not available - fail silently
    console.warn('[Web Vitals] Failed to initialize monitoring');
  }
}

/**
 * Performance budget checker
 * Returns warnings if metrics exceed thresholds
 */
export function checkPerformanceBudget(metrics: Record<string, number>): string[] {
  const warnings: string[] = [];

  Object.entries(metrics).forEach(([name, value]) => {
    const rating = getMetricRating(name, value);
    if (rating === 'poor') {
      warnings.push(`${name} is ${value}ms (threshold: ${WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS]}ms)`);
    }
  });

  return warnings;
}
