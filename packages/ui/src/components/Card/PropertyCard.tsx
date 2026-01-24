import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

import { type PropertyTier } from '../Badge/TierBadge';

export interface PropertyCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  location: string;
  country: string;
  tier: PropertyTier;
  score: number;
  imageUrl?: string;
  priceRange?: string;
  focusAreas?: string[];
  href?: string;
  onCompare?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  isInComparison?: boolean;
  verified?: boolean;
}

const tierLabels: Record<PropertyTier, string> = {
  TIER_1: 'Medical Longevity',
  TIER_2: 'Integrated Wellness',
  TIER_3: 'Luxury Destination',
};

function getScoreTier(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Exceptional', color: 'text-clarus-gold' };
  if (score >= 80) return { label: 'Distinguished', color: 'text-white' };
  if (score >= 70) return { label: 'Notable', color: 'text-white' };
  return { label: 'Curated', color: 'text-clarus-navy' };
}

/**
 * PropertyCard component for displaying property listings.
 *
 * Features:
 * - Hero image with tier badge overlay
 * - Clarus Index score display
 * - Location and price range
 * - Focus area pills
 * - Quick action buttons (compare, save)
 */
export const PropertyCard = forwardRef<HTMLDivElement, PropertyCardProps>(
  (
    {
      name,
      location,
      country,
      tier,
      score,
      imageUrl,
      _priceRange,
      _focusAreas = [],
      href,
      onCompare,
      onSave,
      isSaved = false,
      isInComparison = false,
      verified = false,
      className,
      ...props
    },
    ref
  ) => {
    const scoreTier = getScoreTier(score);

    return (
      <div
        ref={ref}
        className={cn(
          'group relative overflow-hidden rounded-lg bg-white shadow-card transition-shadow hover:shadow-card-hover',
          className
        )}
        {...props}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/2] overflow-hidden bg-stone">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-stone">
              <span className="text-sm text-slate">No image available</span>
            </div>
          )}

          {/* Verified Badge */}
          {verified && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded bg-white/95 px-2 py-1 text-xs font-medium text-verification-green">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}

          {/* Action Buttons - Bottom right, show on hover */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            {onSave && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onSave();
                }}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition-colors hover:bg-white',
                  isSaved ? 'text-clarus-gold' : 'text-slate'
                )}
                aria-label={isSaved ? 'Remove from saved' : 'Save property'}
              >
                <svg className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
            {onCompare && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onCompare();
                }}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                  isInComparison
                    ? 'bg-clarus-navy text-white'
                    : 'bg-white/90 text-slate hover:bg-white hover:text-clarus-navy'
                )}
                aria-label={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
              >
                {isInComparison ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-clarus-gold">
            {tierLabels[tier]}
          </span>
          <h3 className="mt-1 font-display text-xl text-clarus-navy">{name}</h3>
          <p className="mt-1 text-sm text-slate">
            {location}, {country}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-stone pt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-xs uppercase tracking-wide text-slate">Index</span>
              <span className={cn('font-display text-2xl', scoreTier.color)}>{score}</span>
            </div>
            {href && (
              <a
                href={href}
                className="text-sm font-medium text-clarus-navy hover:underline"
              >
                View Profile
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }
);

PropertyCard.displayName = 'PropertyCard';
