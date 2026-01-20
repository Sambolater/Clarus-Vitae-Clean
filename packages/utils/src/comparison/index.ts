/**
 * Comparison utilities
 *
 * State management and helpers for the property comparison feature.
 */

export {
  type ComparisonItem,
  type ComparisonState,
  getComparisonState,
  addToComparison,
  removeFromComparison,
  clearComparison,
  isInComparison,
  getComparisonCount,
  isComparisonFull,
  generateComparisonUrl,
  parseComparisonUrl,
  MAX_ITEMS as MAX_COMPARISON_ITEMS,
} from './comparison-store';

export {
  useComparison,
  type UseComparisonReturn,
} from './use-comparison';
