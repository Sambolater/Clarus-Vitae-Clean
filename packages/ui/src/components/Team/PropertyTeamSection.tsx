'use client';

import type { PropertyTeamVisit } from '@clarus-vitae/types';
import { getVisitTypeLabel } from '@clarus-vitae/types';
import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface PropertyTeamSectionProps extends HTMLAttributes<HTMLElement> {
  teamVisits: PropertyTeamVisit[];
  propertyName?: string;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * PropertyTeamSection component for property pages showing team verification.
 *
 * Features:
 * - List of team members who visited
 * - Visit type and date
 * - Links to team profiles and reviews
 * - Trust signal for users
 */
export const PropertyTeamSection = forwardRef<HTMLElement, PropertyTeamSectionProps>(
  ({ teamVisits, propertyName, className, ...props }, ref) => {
    if (teamVisits.length === 0) {
      return null;
    }

    return (
      <section
        ref={ref}
        className={cn('border-t border-stone pt-8 mt-8', className)}
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-verification-green/10">
            <svg
              className="h-5 w-5 text-verification-green"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-clarus-navy">
              Verified by Our Team
            </h2>
            <p className="mt-1 text-slate">
              {teamVisits.length} team member{teamVisits.length > 1 ? 's have' : ' has'}{' '}
              personally visited{propertyName ? ` ${propertyName}` : ' this property'}.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {teamVisits.map((visit, i) => (
            <div
              key={`${visit.teamMember.id}-${i}`}
              className="flex items-start gap-4 rounded-lg bg-warm-gray p-4"
            >
              {/* Photo */}
              <a
                href={`/team/${visit.teamMember.slug}`}
                className="shrink-0"
              >
                {visit.teamMember.photoUrl ? (
                  <img
                    src={visit.teamMember.photoUrl}
                    alt={visit.teamMember.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-clarus-navy text-lg font-medium text-clarus-gold">
                    {visit.teamMember.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </a>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`/team/${visit.teamMember.slug}`}
                    className="font-medium text-clarus-navy hover:text-clarus-gold"
                  >
                    {visit.teamMember.name}
                  </a>
                  <span className="rounded-full bg-stone px-2 py-0.5 text-xs text-slate">
                    {getVisitTypeLabel(visit.visitType)}
                  </span>
                </div>

                <p className="mt-0.5 text-sm text-slate">
                  {visit.teamMember.title}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate">
                  <span>Visited {formatDate(visit.visitDate)}</span>
                  {visit.visitCircumstances && (
                    <>
                      <span className="text-slate/50">|</span>
                      <span>{visit.visitCircumstances}</span>
                    </>
                  )}
                </div>

                {visit.hasReview && visit.reviewId && (
                  <a
                    href={`/reviews/${visit.reviewId}`}
                    className="mt-2 inline-flex items-center gap-1 text-sm text-clarus-gold hover:underline"
                  >
                    <svg
                      className="h-4 w-4"
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
                    Read their review
                  </a>
                )}
              </div>

              {/* Credentials */}
              {visit.teamMember.credentials && visit.teamMember.credentials.length > 0 && (
                <div className="hidden md:flex md:flex-wrap md:gap-1">
                  {visit.teamMember.credentials.slice(0, 2).map((cred) => (
                    <span
                      key={cred}
                      className="rounded-full bg-white px-2 py-0.5 text-xs text-slate"
                    >
                      {cred}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }
);

PropertyTeamSection.displayName = 'PropertyTeamSection';
