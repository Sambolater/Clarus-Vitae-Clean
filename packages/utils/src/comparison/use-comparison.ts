/**
 * React hook for comparison state management
 *
 * Provides a reactive interface for the comparison store.
 * Automatically syncs across components and tabs.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  type ComparisonState,
  type ComparisonItem,
  getComparisonState,
  addToComparison as addToComparisonStore,
  removeFromComparison as removeFromComparisonStore,
  clearComparison as clearComparisonStore,
  isInComparison as isInComparisonStore,
  generateComparisonUrl,
  MAX_ITEMS,
} from './comparison-store';

const STORAGE_KEY = 'clarus-comparison';

export interface UseComparisonReturn {
  // State
  items: ComparisonItem[];
  count: number;
  isFull: boolean;
  maxItems: number;

  // Actions
  addToComparison: (propertyId: string, propertySlug: string, propertyName: string) => boolean;
  removeFromComparison: (propertyId: string) => void;
  clearComparison: () => void;
  isInComparison: (propertyId: string) => boolean;

  // URL helpers
  getComparisonUrl: () => string;
}

/**
 * Hook for managing property comparison state
 */
export function useComparison(): UseComparisonReturn {
  const [state, setState] = useState<ComparisonState>({
    items: [],
    maxItems: MAX_ITEMS,
  });

  // Initialize state from storage
  useEffect(() => {
    setState(getComparisonState());
  }, []);

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setState(getComparisonState());
      }
    };

    // Also listen for custom events from same-tab updates
    const handleCustomStorage = () => {
      setState(getComparisonState());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('comparison-updated', handleCustomStorage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('comparison-updated', handleCustomStorage);
    };
  }, []);

  const addToComparison = useCallback(
    (propertyId: string, propertySlug: string, propertyName: string): boolean => {
      // Check if already in comparison or full
      if (isInComparisonStore(propertyId)) {
        return false;
      }
      if (state.items.length >= MAX_ITEMS) {
        return false;
      }

      const newState = addToComparisonStore(propertyId, propertySlug, propertyName);
      setState(newState);
      window.dispatchEvent(new CustomEvent('comparison-updated'));
      return true;
    },
    [state.items.length]
  );

  const removeFromComparison = useCallback((propertyId: string): void => {
    const newState = removeFromComparisonStore(propertyId);
    setState(newState);
    window.dispatchEvent(new CustomEvent('comparison-updated'));
  }, []);

  const clearComparison = useCallback((): void => {
    const newState = clearComparisonStore();
    setState(newState);
    window.dispatchEvent(new CustomEvent('comparison-updated'));
  }, []);

  const isInComparison = useCallback((propertyId: string): boolean => {
    return state.items.some((item: ComparisonItem) => item.propertyId === propertyId);
  }, [state.items]);

  const getComparisonUrl = useCallback((): string => {
    return generateComparisonUrl(state.items);
  }, [state.items]);

  return {
    items: state.items,
    count: state.items.length,
    isFull: state.items.length >= MAX_ITEMS,
    maxItems: MAX_ITEMS,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    getComparisonUrl,
  };
}

export type { ComparisonItem, ComparisonState };
