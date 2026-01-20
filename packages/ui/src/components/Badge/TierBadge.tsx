import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export type PropertyTier = 'TIER_1' | 'TIER_2' | 'TIER_3';

export interface TierBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tier: PropertyTier;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const tierConfig: Record<PropertyTier, { label: string; shortLabel: string; color: string }> = {
  TIER_1: {
    label: 'Medical Longevity',
    shortLabel: 'Medical',
    color: 'bg-tier-1 text-white',
  },
  TIER_2: {
    label: 'Integrated Wellness',
    shortLabel: 'Integrated',
    color: 'bg-tier-2 text-white',
  },
  TIER_3: {
    label: 'Luxury Destination',
    shortLabel: 'Luxury',
    color: 'bg-tier-3 text-white',
  },
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

/**
 * TierBadge component for displaying property classification tier.
 *
 * Tiers:
 * - TIER_1: Medical Longevity - Clinical, medical oversight, advanced diagnostics
 * - TIER_2: Integrated Wellness - Medical consultations, holistic approaches
 * - TIER_3: Luxury Destination - Exceptional spa and wellness facilities
 */
export const TierBadge = forwardRef<HTMLSpanElement, TierBadgeProps>(
  ({ tier, size = 'md', showLabel = true, className, ...props }, ref) => {
    const config = tierConfig[tier];

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-md font-medium uppercase tracking-wide',
          config.color,
          sizeStyles[size],
          className
        )}
        role="status"
        aria-label={`Property tier: ${config.label}`}
        {...props}
      >
        {showLabel ? (size === 'sm' ? config.shortLabel : config.label) : tier.replace('_', ' ')}
      </span>
    );
  }
);

TierBadge.displayName = 'TierBadge';
