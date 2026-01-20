/**
 * WebVitals Component
 *
 * Client component that initializes Core Web Vitals monitoring.
 * Renders nothing - only handles performance tracking.
 */

'use client';

import { useEffect } from 'react';

import { initWebVitals } from '@/lib/performance';

export function WebVitals() {
  useEffect(() => {
    // Initialize web vitals monitoring after page load
    initWebVitals();
  }, []);

  // Render nothing - this is a monitoring-only component
  return null;
}
