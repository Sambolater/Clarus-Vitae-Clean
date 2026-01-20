/**
 * Comparison State Management
 *
 * Provides sessionStorage-based state management for property comparison.
 * Compatible with Research Mode (no account required).
 * Syncs across tabs using storage events.
 */

export interface ComparisonItem {
  propertyId: string;
  propertySlug: string;
  propertyName: string;
  addedAt: string;
}

export interface ComparisonState {
  items: ComparisonItem[];
  maxItems: number;
}

const STORAGE_KEY = 'clarus-comparison';
const MAX_COMPARISON_ITEMS = 4;

/**
 * Get the current comparison state from sessionStorage
 */
export function getComparisonState(): ComparisonState {
  if (typeof window === 'undefined') {
    return { items: [], maxItems: MAX_COMPARISON_ITEMS };
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        items: parsed.items || [],
        maxItems: MAX_COMPARISON_ITEMS,
      };
    }
  } catch (error) {
    console.error('Error reading comparison state:', error);
  }

  return { items: [], maxItems: MAX_COMPARISON_ITEMS };
}

/**
 * Save comparison state to sessionStorage
 */
function saveComparisonState(items: ComparisonItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
    // Dispatch a custom event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify({ items }),
    }));
  } catch (error) {
    console.error('Error saving comparison state:', error);
  }
}

/**
 * Add a property to the comparison list
 */
export function addToComparison(
  propertyId: string,
  propertySlug: string,
  propertyName: string
): ComparisonState {
  const state = getComparisonState();

  // Check if already in comparison
  if (state.items.some(item => item.propertyId === propertyId)) {
    return state;
  }

  // Check if at max capacity
  if (state.items.length >= MAX_COMPARISON_ITEMS) {
    return state;
  }

  const newItem: ComparisonItem = {
    propertyId,
    propertySlug,
    propertyName,
    addedAt: new Date().toISOString(),
  };

  const newItems = [...state.items, newItem];
  saveComparisonState(newItems);

  return { items: newItems, maxItems: MAX_COMPARISON_ITEMS };
}

/**
 * Remove a property from the comparison list
 */
export function removeFromComparison(propertyId: string): ComparisonState {
  const state = getComparisonState();
  const newItems = state.items.filter(item => item.propertyId !== propertyId);
  saveComparisonState(newItems);
  return { items: newItems, maxItems: MAX_COMPARISON_ITEMS };
}

/**
 * Clear all items from comparison
 */
export function clearComparison(): ComparisonState {
  saveComparisonState([]);
  return { items: [], maxItems: MAX_COMPARISON_ITEMS };
}

/**
 * Check if a property is in the comparison list
 */
export function isInComparison(propertyId: string): boolean {
  const state = getComparisonState();
  return state.items.some(item => item.propertyId === propertyId);
}

/**
 * Get the comparison count
 */
export function getComparisonCount(): number {
  return getComparisonState().items.length;
}

/**
 * Check if comparison is at max capacity
 */
export function isComparisonFull(): boolean {
  return getComparisonState().items.length >= MAX_COMPARISON_ITEMS;
}

/**
 * Generate a shareable comparison URL
 */
export function generateComparisonUrl(items: ComparisonItem[]): string {
  const slugs = items.map(item => item.propertySlug).join(',');
  return `/compare?properties=${encodeURIComponent(slugs)}`;
}

/**
 * Parse property slugs from URL
 */
export function parseComparisonUrl(searchParams: string): string[] {
  const params = new URLSearchParams(searchParams);
  const properties = params.get('properties');
  if (!properties) return [];
  return properties.split(',').filter(Boolean);
}

export const MAX_ITEMS = MAX_COMPARISON_ITEMS;
