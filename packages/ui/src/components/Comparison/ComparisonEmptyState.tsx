'use client';

import { cn } from '@clarus-vitae/utils';
import { forwardRef, type HTMLAttributes } from 'react';
import Link from 'next/link';

export interface PopularComparison {
  title: string;
  properties: string[]; // Property slugs
  url: string;
}

export interface ComparisonEmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Popular comparisons to suggest */
  popularComparisons?: PopularComparison[];
  /** Browse properties URL */
  browseUrl?: string;
}

/**
 * Empty state for comparison page when no properties are selected.
 * Shows instructions and suggestions.
 */
export const ComparisonEmptyState = forwardRef<HTMLDivElement, ComparisonEmptyStateProps>(
  (
    {
      popularComparisons = [],
      browseUrl = '/properties',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('mx-auto max-w-2xl px-4 py-16 text-center', className)}
        {...props}
      >
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone">
          <svg className="h-8 w-8 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="mt-6 font-display text-2xl font-medium text-clarus-navy">
          Compare Properties Side-by-Side
        </h2>

        {/* Description */}
        <p className="mt-3 text-slate">
          Add properties to your comparison list to evaluate them across Clarus Index scores,
          pricing, treatments, and more.
        </p>

        {/* Instructions */}
        <div className="mt-8 rounded-lg border border-stone bg-warm-gray/30 p-6 text-left">
          <h3 className="font-medium text-clarus-navy">How to compare</h3>
          <ol className="mt-3 space-y-2 text-sm text-slate">
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-clarus-navy text-xs text-white">1</span>
              <span>Browse properties and click the compare icon on property cards</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-clarus-navy text-xs text-white">2</span>
              <span>Add up to 4 properties to your comparison</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-clarus-navy text-xs text-white">3</span>
              <span>Click "Compare Now" in the comparison bar at the bottom</span>
            </li>
          </ol>
        </div>

        {/* CTA */}
        <Link
          href={browseUrl}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-clarus-navy px-6 py-3 font-medium text-white transition-colors hover:bg-clarus-navy/90"
        >
          <span>Browse Properties</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Popular comparisons */}
        {popularComparisons.length > 0 && (
          <div className="mt-12">
            <h3 className="text-sm font-medium text-clarus-navy">Popular comparisons</h3>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {popularComparisons.map((comparison, index) => (
                <Link
                  key={index}
                  href={comparison.url}
                  className="rounded-lg border border-stone bg-white px-4 py-2 text-sm text-slate transition-colors hover:border-clarus-navy hover:text-clarus-navy"
                >
                  {comparison.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Privacy note */}
        <p className="mt-12 text-xs text-slate">
          Your comparison list is stored locally in your browser session. We don't track or store
          which properties you compare.
        </p>
      </div>
    );
  }
);

ComparisonEmptyState.displayName = 'ComparisonEmptyState';
