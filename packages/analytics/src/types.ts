/**
 * Analytics Types
 *
 * Type definitions for privacy-preserving analytics events.
 */

export interface PageviewData {
  url: string;
  referrer?: string;
}

export interface AnalyticsEvent {
  name: string;
  props?: Record<string, string | number | boolean>;
}

export type EventName =
  | 'property_view'
  | 'treatment_view'
  | 'comparison_started'
  | 'comparison_completed'
  | 'inquiry_started'
  | 'inquiry_submitted'
  | 'search_performed'
  | 'filter_applied';
