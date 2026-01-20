'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

import type { PropertyVisit } from '@clarus-vitae/types';
import { getVisitTypeLabel } from '@clarus-vitae/types';

export interface TeamMemberVisitsProps extends HTMLAttributes<HTMLElement> {
  visits: PropertyVisit[];
  showAll?: boolean;
  maxDisplay?: number;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * TeamMemberVisits component displaying properties visited by a team member.
 *
 * Features:
 * - List of visited properties
 * - Visit type badges (Full Program, Site Visit, etc.)
 * - Visit dates
 * - Links to property profiles
 */
export const TeamMemberVisits = forwardRef<HTMLElement, TeamMemberVisitsProps>(
  ({ visits, showAll = false, maxDisplay = 6, className, ...props }, ref) => {
    if (visits.length === 0) {
      return null;
    }

    const displayedVisits = showAll ? visits : visits.slice(0, maxDisplay);
    const hasMore = !showAll && visits.length > maxDisplay;

    // Sort by visit date, most recent first
    const sortedVisits = [...displayedVisits].sort(
      (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
    );

    return (
      <section ref={ref} className={cn('py-12', className)} {...props}>
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-clarus-navy">
                Properties Visited
              </h2>
              <span className="text-sm text-slate">{visits.length} total</span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {sortedVisits.map((visit, i) => (
                <div
                  key={`${visit.propertyId}-${i}`}
                  className="rounded-lg border border-stone bg-white p-4 transition-shadow hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {visit.propertySlug ? (
                        <a
                          href={`/properties/${visit.propertySlug}`}
                          className="font-medium text-clarus-navy hover:text-clarus-gold"
                        >
                          {visit.propertyName || 'Property'}
                        </a>
                      ) : (
                        <span className="font-medium text-clarus-navy">
                          {visit.propertyName || 'Property'}
                        </span>
                      )}
                      <p className="mt-1 text-sm text-slate">{formatDate(visit.visitDate)}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-stone px-2 py-0.5 text-xs text-slate">
                      {getVisitTypeLabel(visit.visitType)}
                    </span>
                  </div>
                  {visit.reviewId && (
                    <a
                      href={`/reviews/${visit.reviewId}`}
                      className="mt-3 inline-flex items-center gap-1 text-xs text-clarus-gold hover:underline"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Read review
                    </a>
                  )}
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  className="text-sm text-clarus-navy hover:text-clarus-gold"
                >
                  View all {visits.length} properties
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
);

TeamMemberVisits.displayName = 'TeamMemberVisits';
