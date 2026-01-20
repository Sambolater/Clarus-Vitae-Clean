'use client';

import { cn } from '@clarus-vitae/utils';
import { forwardRef, type HTMLAttributes } from 'react';
import Link from 'next/link';

export interface ComparisonHeaderProperty {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  score: number | null;
  imageUrl?: string;
}

export interface ComparisonHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Properties being compared */
  properties: ComparisonHeaderProperty[];
  /** Maximum number of items allowed */
  maxItems?: number;
  /** Callback when removing a property */
  onRemoveProperty?: (propertyId: string) => void;
  /** Callback when adding a property */
  onAddProperty?: () => void;
}

const tierLabels: Record<string, string> = {
  TIER_1: 'Medical Longevity',
  TIER_2: 'Integrated Wellness',
  TIER_3: 'Luxury Destination',
};

const tierColors: Record<string, string> = {
  TIER_1: 'bg-tier-1',
  TIER_2: 'bg-tier-2',
  TIER_3: 'bg-tier-3',
};

function getScoreTierColor(score: number | null): string {
  if (!score) return 'text-slate';
  if (score >= 90) return 'text-clarus-gold';
  return 'text-white';
}

/**
 * Header row for comparison page showing property cards.
 * Displays sticky headers with property images, names, and scores.
 */
export const ComparisonHeader = forwardRef<HTMLDivElement, ComparisonHeaderProps>(
  (
    {
      properties,
      maxItems = 4,
      onRemoveProperty,
      onAddProperty,
      className,
      ...props
    },
    ref
  ) => {
    const emptySlots = maxItems - properties.length;

    return (
      <div
        ref={ref}
        className={cn('sticky top-0 z-20 border-b border-stone bg-white', className)}
        {...props}
      >
        <div className="flex">
          {/* Label column spacer */}
          <div className="w-48 shrink-0" />

          {/* Property columns */}
          <div className="flex flex-1 divide-x divide-stone">
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex flex-1 flex-col items-center px-4 py-4"
              >
                {/* Remove button */}
                {onRemoveProperty && (
                  <button
                    type="button"
                    onClick={() => onRemoveProperty(property.id)}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-stone text-slate opacity-0 transition-opacity hover:bg-clarus-navy hover:text-white group-hover:opacity-100"
                    aria-label={`Remove ${property.name} from comparison`}
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* Image */}
                <div className="relative h-20 w-full overflow-hidden rounded-lg bg-stone">
                  {property.imageUrl ? (
                    <img
                      src={property.imageUrl}
                      alt={property.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate">
                      No image
                    </div>
                  )}
                  {/* Tier badge */}
                  <span
                    className={cn(
                      'absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white',
                      tierColors[property.tier]
                    )}
                  >
                    {tierLabels[property.tier]}
                  </span>
                  {/* Score badge */}
                  {property.score && (
                    <div className="absolute bottom-2 right-2 flex h-10 w-10 flex-col items-center justify-center rounded-full bg-clarus-navy">
                      <span className={cn('font-display text-sm', getScoreTierColor(property.score))}>
                        {property.score}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name and location */}
                <Link
                  href={`/properties/${property.slug}`}
                  className="mt-3 text-center font-display text-base font-medium text-clarus-navy hover:underline"
                >
                  {property.name}
                </Link>
                <p className="mt-0.5 text-xs text-slate">
                  {property.city}, {property.country}
                </p>

                {/* View property link */}
                <Link
                  href={`/properties/${property.slug}`}
                  className="mt-2 text-xs text-clarus-navy underline hover:no-underline"
                >
                  View full profile
                </Link>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: emptySlots }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex flex-1 flex-col items-center justify-center px-4 py-4"
              >
                {onAddProperty ? (
                  <button
                    type="button"
                    onClick={onAddProperty}
                    className="flex h-20 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone text-slate transition-colors hover:border-clarus-navy hover:text-clarus-navy"
                  >
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="mt-1 text-xs">Add property</span>
                  </button>
                ) : (
                  <div className="flex h-20 w-full items-center justify-center rounded-lg bg-stone/30">
                    <span className="text-xs text-slate/50">Empty slot</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

ComparisonHeader.displayName = 'ComparisonHeader';
