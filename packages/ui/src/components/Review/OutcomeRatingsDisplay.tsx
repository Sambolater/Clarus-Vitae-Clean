'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface OutcomeRatings {
  goalAchievement: number;
  protocolQuality: number;
  followupQuality: number;
  physicianEndorsement: number;
}

export interface OutcomeRatingsDisplayProps extends HTMLAttributes<HTMLDivElement> {
  ratings: OutcomeRatings;
  layout?: 'horizontal' | 'vertical' | 'compact';
  showLabels?: boolean;
  maxRating?: number;
}

const dimensionConfig = [
  {
    key: 'goalAchievement' as const,
    label: 'Goals Achieved',
    shortLabel: 'Goals',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'protocolQuality' as const,
    label: 'Protocol Quality',
    shortLabel: 'Protocol',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    key: 'followupQuality' as const,
    label: 'Follow-up Support',
    shortLabel: 'Follow-up',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    key: 'physicianEndorsement' as const,
    label: 'Medical Credibility',
    shortLabel: 'Medical',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

function getRatingColor(rating: number, maxRating: number): string {
  const percentage = (rating / maxRating) * 100;
  if (percentage >= 80) return 'bg-verification-green';
  if (percentage >= 60) return 'bg-clarus-navy';
  if (percentage >= 40) return 'bg-clarus-gold';
  return 'bg-slate';
}

function getRatingTextColor(rating: number, maxRating: number): string {
  const percentage = (rating / maxRating) * 100;
  if (percentage >= 80) return 'text-verification-green';
  if (percentage >= 60) return 'text-clarus-navy';
  if (percentage >= 40) return 'text-clarus-gold';
  return 'text-slate';
}

/**
 * OutcomeRatingsDisplay component for showing outcome-focused ratings.
 *
 * Displays goal achievement, protocol quality, follow-up support, and
 * medical credibility in various layouts.
 */
export const OutcomeRatingsDisplay = forwardRef<HTMLDivElement, OutcomeRatingsDisplayProps>(
  ({ ratings, layout = 'horizontal', showLabels = true, maxRating = 5, className, ...props }, ref) => {
    if (layout === 'compact') {
      return (
        <div
          ref={ref}
          className={cn('flex flex-wrap gap-2', className)}
          {...props}
        >
          {dimensionConfig.map((dim) => {
            const value = ratings[dim.key];
            return (
              <div
                key={dim.key}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                  'bg-stone/50',
                  getRatingTextColor(value, maxRating)
                )}
                title={dim.label}
              >
                {dim.icon}
                <span>{value}/{maxRating}</span>
              </div>
            );
          })}
        </div>
      );
    }

    if (layout === 'vertical') {
      return (
        <div ref={ref} className={cn('space-y-3', className)} {...props}>
          {dimensionConfig.map((dim) => {
            const value = ratings[dim.key];
            const percentage = (value / maxRating) * 100;
            return (
              <div key={dim.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate">{dim.icon}</span>
                    {showLabels && (
                      <span className="text-sm font-medium text-clarus-navy">
                        {dim.label}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-clarus-navy">
                    {value}/{maxRating}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone">
                  <div
                    className={cn('h-full rounded-full transition-all', getRatingColor(value, maxRating))}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Horizontal layout (default)
    return (
      <div
        ref={ref}
        className={cn('grid grid-cols-2 gap-4 md:grid-cols-4', className)}
        {...props}
      >
        {dimensionConfig.map((dim) => {
          const value = ratings[dim.key];
          return (
            <div
              key={dim.key}
              className="rounded-lg bg-stone/30 p-3 text-center"
            >
              <div className="flex items-center justify-center text-slate mb-1">
                {dim.icon}
              </div>
              <div className={cn('text-2xl font-semibold', getRatingTextColor(value, maxRating))}>
                {value}
              </div>
              <div className="text-xs text-slate">{showLabels ? dim.shortLabel : `/ ${maxRating}`}</div>
            </div>
          );
        })}
      </div>
    );
  }
);

OutcomeRatingsDisplay.displayName = 'OutcomeRatingsDisplay';
