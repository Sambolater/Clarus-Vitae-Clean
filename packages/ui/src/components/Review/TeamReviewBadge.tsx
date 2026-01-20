'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface TeamMemberInfo {
  name: string;
  title?: string;
  slug?: string;
  photoUrl?: string;
}

export interface TeamReviewBadgeProps extends HTMLAttributes<HTMLDivElement> {
  teamMember: TeamMemberInfo;
  visitCircumstances?: string;
  showPhoto?: boolean;
  variant?: 'inline' | 'card';
}

/**
 * TeamReviewBadge component for identifying team member reviews.
 *
 * Features:
 * - Clear visual distinction from regular reviews
 * - Shows team member name and title
 * - Discloses visit circumstances (paid, invited, etc.)
 * - Optional link to team member profile
 */
export const TeamReviewBadge = forwardRef<HTMLDivElement, TeamReviewBadgeProps>(
  (
    {
      teamMember,
      visitCircumstances,
      showPhoto = true,
      variant = 'inline',
      className,
      ...props
    },
    ref
  ) => {
    if (variant === 'card') {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-lg border-2 border-clarus-gold/20 bg-clarus-gold/5 p-4',
            className
          )}
          {...props}
        >
          <div className="flex items-start gap-3">
            {/* Photo */}
            {showPhoto && (
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-clarus-navy">
                {teamMember.photoUrl ? (
                  <img
                    src={teamMember.photoUrl}
                    alt={teamMember.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-medium text-clarus-gold">
                    {teamMember.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-full bg-clarus-gold/20 px-2.5 py-0.5 text-xs font-semibold text-clarus-gold">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Clarus Team
                </span>
              </div>
              <div className="mt-1">
                <span className="font-medium text-clarus-navy">{teamMember.name}</span>
                {teamMember.title && (
                  <span className="text-sm text-slate">, {teamMember.title}</span>
                )}
              </div>
              {visitCircumstances && (
                <p className="mt-1 text-xs text-slate">
                  Visit: {visitCircumstances}
                </p>
              )}
              {teamMember.slug && (
                <a
                  href={`/team/${teamMember.slug}`}
                  className="mt-2 inline-block text-xs text-clarus-navy hover:text-clarus-gold transition-colors"
                >
                  View profile →
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Inline variant (default)
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2 flex-wrap', className)}
        {...props}
      >
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-clarus-gold/15 px-2.5 py-1 text-xs font-semibold text-clarus-gold">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          Clarus Team Review
        </span>

        {/* Team member name */}
        <span className="text-sm text-clarus-navy">
          by <span className="font-medium">{teamMember.name}</span>
          {teamMember.title && (
            <span className="text-slate">, {teamMember.title}</span>
          )}
        </span>

        {/* Visit circumstances */}
        {visitCircumstances && (
          <span className="text-xs text-slate">
            ({visitCircumstances})
          </span>
        )}
      </div>
    );
  }
);

TeamReviewBadge.displayName = 'TeamReviewBadge';
