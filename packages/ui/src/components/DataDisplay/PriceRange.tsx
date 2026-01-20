import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface PriceRangeProps extends HTMLAttributes<HTMLDivElement> {
  min: number;
  max?: number;
  currency?: string;
  period?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * PriceRange component for displaying price information.
 *
 * Variants:
 * - default: Shows "From $X" or "$X - $Y"
 * - compact: Smaller, inline display
 * - detailed: Includes period information
 */
export const PriceRange = forwardRef<HTMLDivElement, PriceRangeProps>(
  ({ min, max, currency = 'USD', period, variant = 'default', className, ...props }, ref) => {
    const minFormatted = formatPrice(min, currency);
    const maxFormatted = max ? formatPrice(max, currency) : null;

    if (variant === 'compact') {
      return (
        <span ref={ref} className={cn('text-sm font-medium text-clarus-navy', className)} {...props}>
          {maxFormatted ? `${minFormatted}–${maxFormatted}` : `From ${minFormatted}`}
          {period && <span className="font-normal text-slate">/{period}</span>}
        </span>
      );
    }

    if (variant === 'detailed') {
      return (
        <div ref={ref} className={cn('', className)} {...props}>
          <p className="text-xs font-medium uppercase tracking-wide text-slate">Price Range</p>
          <p className="mt-1 font-display text-xl text-clarus-navy">
            {maxFormatted ? `${minFormatted} – ${maxFormatted}` : `From ${minFormatted}`}
          </p>
          {period && <p className="text-sm text-slate">per {period}</p>}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('', className)} {...props}>
        <span className="font-medium text-clarus-navy">
          {maxFormatted ? (
            <>
              {minFormatted}
              <span className="mx-1 text-slate">–</span>
              {maxFormatted}
            </>
          ) : (
            <>
              <span className="text-sm font-normal text-slate">From </span>
              {minFormatted}
            </>
          )}
        </span>
        {period && <span className="text-sm text-slate"> / {period}</span>}
      </div>
    );
  }
);

PriceRange.displayName = 'PriceRange';
