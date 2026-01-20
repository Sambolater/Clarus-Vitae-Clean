/**
 * useSearchParams Hook
 *
 * Manages URL search parameters for the search results page.
 * Syncs filters and search state with the URL for shareability.
 */

'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export type SearchType = 'all' | 'properties' | 'treatments' | 'articles';

export interface SearchUrlParams {
  q: string;
  type: SearchType;
  page: number;
  // Property filters
  tier?: string[];
  country?: string;
  approach?: string[];
  focusAreas?: string[];
  priceMin?: number;
  priceMax?: number;
  minScore?: number;
  verified?: boolean;
  editorChoice?: boolean;
  // Treatment filters
  category?: string[];
  evidenceLevel?: string[];
  // Sort
  sort?: string;
}

export function useSearchUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current params from URL
  const currentParams = useMemo((): SearchUrlParams => {
    const tierParam = searchParams.get('tier');
    const approachParam = searchParams.get('approach');
    const focusParam = searchParams.get('focusAreas');
    const categoryParam = searchParams.get('category');
    const evidenceParam = searchParams.get('evidenceLevel');

    return {
      q: searchParams.get('q') || '',
      type: (searchParams.get('type') as SearchType) || 'all',
      page: parseInt(searchParams.get('page') || '1', 10),
      tier: tierParam ? tierParam.split(',') : undefined,
      country: searchParams.get('country') || undefined,
      approach: approachParam ? approachParam.split(',') : undefined,
      focusAreas: focusParam ? focusParam.split(',') : undefined,
      priceMin: searchParams.get('priceMin')
        ? parseInt(searchParams.get('priceMin')!, 10)
        : undefined,
      priceMax: searchParams.get('priceMax')
        ? parseInt(searchParams.get('priceMax')!, 10)
        : undefined,
      minScore: searchParams.get('minScore')
        ? parseInt(searchParams.get('minScore')!, 10)
        : undefined,
      verified: searchParams.get('verified') === 'true',
      editorChoice: searchParams.get('editorChoice') === 'true',
      category: categoryParam ? categoryParam.split(',') : undefined,
      evidenceLevel: evidenceParam ? evidenceParam.split(',') : undefined,
      sort: searchParams.get('sort') || undefined,
    };
  }, [searchParams]);

  // Update URL with new params
  const updateParams = useCallback(
    (updates: Partial<SearchUrlParams>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Reset page when filters change (except when page is explicitly set)
      if (!('page' in updates)) {
        params.delete('page');
      }

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === false) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            params.delete(key);
          } else {
            params.set(key, value.join(','));
          }
        } else if (typeof value === 'boolean') {
          if (value) {
            params.set(key, 'true');
          } else {
            params.delete(key);
          }
        } else if (typeof value === 'number') {
          params.set(key, value.toString());
        } else {
          params.set(key, value);
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // Set search query
  const setQuery = useCallback(
    (q: string) => {
      updateParams({ q, page: 1 });
    },
    [updateParams]
  );

  // Set search type (all, properties, treatments, articles)
  const setType = useCallback(
    (type: SearchType) => {
      updateParams({ type, page: 1 });
    },
    [updateParams]
  );

  // Set page
  const setPage = useCallback(
    (page: number) => {
      updateParams({ page });
    },
    [updateParams]
  );

  // Clear all filters (but keep query)
  const clearFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (currentParams.q) {
      params.set('q', currentParams.q);
    }
    if (currentParams.type !== 'all') {
      params.set('type', currentParams.type);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, currentParams.q, currentParams.type]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (currentParams.tier && currentParams.tier.length > 0) count++;
    if (currentParams.country) count++;
    if (currentParams.approach && currentParams.approach.length > 0) count++;
    if (currentParams.focusAreas && currentParams.focusAreas.length > 0) count++;
    if (currentParams.priceMin !== undefined || currentParams.priceMax !== undefined) count++;
    if (currentParams.minScore !== undefined) count++;
    if (currentParams.verified) count++;
    if (currentParams.editorChoice) count++;
    if (currentParams.category && currentParams.category.length > 0) count++;
    if (currentParams.evidenceLevel && currentParams.evidenceLevel.length > 0) count++;
    return count;
  }, [currentParams]);

  return {
    params: currentParams,
    updateParams,
    setQuery,
    setType,
    setPage,
    clearFilters,
    activeFilterCount,
  };
}
