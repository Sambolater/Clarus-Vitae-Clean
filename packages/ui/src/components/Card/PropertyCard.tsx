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
}

const tierLabels: Record<PropertyTier, string> = {
  TIER_1: 'Medical Longevity',
  TIER_2: 'Integrated Wellness',
  TIER_3: 'Luxury Destination',
};

const tierColors: Record<PropertyTier, string> = {
  TIER_1: 'bg-tier-1',
  TIER_2: 'bg-tier-2',
  TIER_3: 'bg-tier-3',
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
      priceRange,
      focusAreas = [],
      href,
      onCompare,
      onSave,
      isSaved = false,
      className,
      ...props
    },
    ref
  ) => {
    const scoreTier = getScoreTier(score);
    const CardWrapper = href ? 'a' : 'div';

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

          {/* Tier Badge */}
          <span
            className={cn(
              'absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wide text-white',
              tierColors[tier]
            )}
          >
            {tierLabels[tier]}
          </span>

          {/* Score Badge */}
          <div className="absolute bottom-3 right-3 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-clarus-navy">
            <span className={cn('font-display text-xl', scoreTier.color)}>{score}</span>
            <span className="text-[8px] uppercase tracking-wide text-white/70">Index</span>
          </div>

          {/* Action Buttons */}
          <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
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
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate transition-colors hover:bg-white hover:text-clarus-navy"
                aria-label="Add to comparison"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <CardWrapper
          {...(href ? { href } : {})}
          className="block p-4"
        >
          <h3 className="font-display text-xl text-clarus-navy">{name}</h3>
          <p className="mt-1 text-sm text-slate">
            {location}, {country}
          </p>

          {priceRange && (
            <p className="mt-2 text-sm font-medium text-clarus-navy">{priceRange}</p>
          )}

          {focusAreas.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {focusAreas.slice(0, 3).map((area) => (
                <span
                  key={area}
                  className="rounded-md bg-stone px-2 py-0.5 text-xs text-slate"
                >
                  {area}
                </span>
              ))}
              {focusAreas.length > 3 && (
                <span className="rounded-md bg-stone px-2 py-0.5 text-xs text-slate">
                  +{focusAreas.length - 3} more
                </span>
              )}
            </div>
          )}
        </CardWrapper>
      </div>
    );
  }
);

PropertyCard.displayName = 'PropertyCard';
