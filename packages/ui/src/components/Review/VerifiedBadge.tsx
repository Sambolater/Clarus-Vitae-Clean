import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export type VerificationType = 'visit' | 'purchase' | 'expert' | 'program';

export interface VerifiedBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  type: VerificationType;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const verificationConfig: Record<VerificationType, { label: string; shortLabel: string }> = {
  visit: { label: 'Verified Visit', shortLabel: 'Visit' },
  purchase: { label: 'Verified Purchase', shortLabel: 'Purchase' },
  expert: { label: 'Expert Review', shortLabel: 'Expert' },
  program: { label: 'Program Completed', shortLabel: 'Program' },
};

/**
 * VerifiedBadge component for indicating verified review status.
 *
 * Types:
 * - visit: User physically visited the property
 * - purchase: User made a verified booking
 * - expert: Review by named expert
 * - program: User completed a full program
 */
export const VerifiedBadge = forwardRef<HTMLSpanElement, VerifiedBadgeProps>(
  ({ type, showLabel = true, size = 'md', className, ...props }, ref) => {
    const config = verificationConfig[type];

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-full bg-verification-green/10 font-medium text-verification-green',
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
          className
        )}
        {...props}
      >
        <svg
          className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        {showLabel && (size === 'sm' ? config.shortLabel : config.label)}
      </span>
    );
  }
);

VerifiedBadge.displayName = 'VerifiedBadge';
