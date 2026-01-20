'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, useState } from 'react';

export interface ReviewFiltersState {
  sortBy: 'recent' | 'highest_outcome' | 'lowest_outcome' | 'most_helpful' | 'highest_rating' | 'lowest_rating';
  programType?: string;
  ratingMin?: number;
  timeframe?: '6months' | '1year' | '2years' | 'all';
  hasOutcomes?: boolean;
  verifiedOnly?: boolean;
  teamReviewsOnly?: boolean;
}

export interface ReviewFiltersProps extends HTMLAttributes<HTMLDivElement> {
  filters: ReviewFiltersState;
  onFilterChange: (filters: ReviewFiltersState) => void;
  programTypes?: string[];
  showOutcomeFilters?: boolean;
  compact?: boolean;
}

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'highest_rating', label: 'Highest Rated' },
  { value: 'lowest_rating', label: 'Lowest Rated' },
  { value: 'most_helpful', label: 'Most Helpful' },
  { value: 'highest_outcome', label: 'Best Outcomes' },
  { value: 'lowest_outcome', label: 'Lowest Outcomes' },
] as const;

const TIMEFRAME_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: '6months', label: 'Last 6 Months' },
  { value: '1year', label: 'Last Year' },
  { value: '2years', label: 'Last 2 Years' },
] as const;

/**
 * Toggle button component for filter options.
 */
function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-clarus-navy text-white'
          : 'bg-stone/50 text-clarus-navy hover:bg-stone'
      )}
    >
      {children}
    </button>
  );
}

/**
 * ReviewFilters component for filtering and sorting reviews.
 *
 * Features:
 * - Sort by various criteria
 * - Filter by program type
 * - Filter by minimum rating
 * - Filter by timeframe
 * - Toggle verified/team reviews only
 * - Toggle reviews with outcomes only
 */
export const ReviewFilters = forwardRef<HTMLDivElement, ReviewFiltersProps>(
  (
    {
      filters,
      onFilterChange,
      programTypes = [],
      showOutcomeFilters = true,
      compact = false,
      className,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const updateFilter = <K extends keyof ReviewFiltersState>(
      key: K,
      value: ReviewFiltersState[K]
    ) => {
      onFilterChange({ ...filters, [key]: value });
    };

    const hasActiveFilters =
      filters.programType ||
      filters.ratingMin ||
      (filters.timeframe && filters.timeframe !== 'all') ||
      filters.hasOutcomes ||
      filters.verifiedOnly ||
      filters.teamReviewsOnly;

    const clearFilters = () => {
      onFilterChange({
        sortBy: 'recent',
        programType: undefined,
        ratingMin: undefined,
        timeframe: 'all',
        hasOutcomes: undefined,
        verifiedOnly: undefined,
        teamReviewsOnly: undefined,
      });
    };

    if (compact) {
      return (
        <div ref={ref} className={cn('flex flex-wrap items-center gap-3', className)} {...props}>
          {/* Sort dropdown */}
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value as ReviewFiltersState['sortBy'])}
            className="rounded-md border border-stone bg-white px-3 py-1.5 text-sm text-clarus-navy focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Quick toggles */}
          <ToggleButton
            active={filters.verifiedOnly || false}
            onClick={() => updateFilter('verifiedOnly', !filters.verifiedOnly)}
          >
            Verified Only
          </ToggleButton>

          <ToggleButton
            active={filters.teamReviewsOnly || false}
            onClick={() => updateFilter('teamReviewsOnly', !filters.teamReviewsOnly)}
          >
            Team Reviews
          </ToggleButton>

          {showOutcomeFilters && (
            <ToggleButton
              active={filters.hasOutcomes || false}
              onClick={() => updateFilter('hasOutcomes', !filters.hasOutcomes)}
            >
              With Outcomes
            </ToggleButton>
          )}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {/* Main row: Sort and toggle filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <label htmlFor="review-sort" className="text-sm text-slate">
                Sort by:
              </label>
              <select
                id="review-sort"
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as ReviewFiltersState['sortBy'])}
                className="rounded-md border border-stone bg-white px-3 py-2 text-sm text-clarus-navy focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Expand/collapse filters */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-clarus-navy hover:text-clarus-gold transition-colors"
          >
            <svg
              className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {isExpanded ? 'Hide Filters' : 'More Filters'}
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-clarus-gold px-1.5 py-0.5 text-xs text-white">
                {Object.values(filters).filter(Boolean).length - 1}
              </span>
            )}
          </button>
        </div>

        {/* Quick toggles */}
        <div className="flex flex-wrap gap-2">
          <ToggleButton
            active={filters.verifiedOnly || false}
            onClick={() => updateFilter('verifiedOnly', !filters.verifiedOnly)}
          >
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified Stays
            </span>
          </ToggleButton>

          <ToggleButton
            active={filters.teamReviewsOnly || false}
            onClick={() => updateFilter('teamReviewsOnly', !filters.teamReviewsOnly)}
          >
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Team Reviews
            </span>
          </ToggleButton>

          {showOutcomeFilters && (
            <ToggleButton
              active={filters.hasOutcomes || false}
              onClick={() => updateFilter('hasOutcomes', !filters.hasOutcomes)}
            >
              <span className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                With Outcomes
              </span>
            </ToggleButton>
          )}
        </div>

        {/* Expanded filters */}
        {isExpanded && (
          <div className="rounded-lg bg-stone/30 p-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Program Type */}
              {programTypes.length > 0 && (
                <div>
                  <label htmlFor="program-type" className="block text-sm font-medium text-clarus-navy mb-1">
                    Program Type
                  </label>
                  <select
                    id="program-type"
                    value={filters.programType || ''}
                    onChange={(e) => updateFilter('programType', e.target.value || undefined)}
                    className="w-full rounded-md border border-stone bg-white px-3 py-2 text-sm text-clarus-navy focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
                  >
                    <option value="">All Programs</option>
                    {programTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Timeframe */}
              <div>
                <label htmlFor="timeframe" className="block text-sm font-medium text-clarus-navy mb-1">
                  Timeframe
                </label>
                <select
                  id="timeframe"
                  value={filters.timeframe || 'all'}
                  onChange={(e) => updateFilter('timeframe', e.target.value as ReviewFiltersState['timeframe'])}
                  className="w-full rounded-md border border-stone bg-white px-3 py-2 text-sm text-clarus-navy focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
                >
                  {TIMEFRAME_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minimum Rating */}
              <div>
                <label htmlFor="rating-min" className="block text-sm font-medium text-clarus-navy mb-1">
                  Minimum Rating
                </label>
                <select
                  id="rating-min"
                  value={filters.ratingMin || ''}
                  onChange={(e) => updateFilter('ratingMin', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full rounded-md border border-stone bg-white px-3 py-2 text-sm text-clarus-navy focus:border-clarus-navy focus:ring-1 focus:ring-clarus-navy"
                >
                  <option value="">Any Rating</option>
                  <option value="5">5 Stars Only</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-slate hover:text-clarus-navy transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

ReviewFilters.displayName = 'ReviewFilters';
