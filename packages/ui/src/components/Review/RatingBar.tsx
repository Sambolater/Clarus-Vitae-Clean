import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface RatingBarProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
  maxValue?: number;
  showValue?: boolean;
  size?: 'sm' | 'md';
}

function getBarColor(value: number, maxValue: number): string {
  const percentage = (value / maxValue) * 100;
  if (percentage >= 80) return 'bg-verification-green';
  if (percentage >= 60) return 'bg-clarus-navy';
  if (percentage >= 40) return 'bg-clarus-gold';
  return 'bg-slate';
}

/**
 * RatingBar component for horizontal rating visualization.
 *
 * Used for:
 * - Individual dimension scores
 * - Breakdown visualizations
 * - Survey results
 */
export const RatingBar = forwardRef<HTMLDivElement, RatingBarProps>(
  ({ label, value, maxValue = 100, showValue = true, size = 'md', className, ...props }, ref) => {
    const percentage = Math.min(100, (value / maxValue) * 100);
    const barColor = getBarColor(value, maxValue);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className="flex items-center justify-between mb-1">
          <span className={cn('text-clarus-navy', size === 'sm' ? 'text-xs' : 'text-sm')}>
            {label}
          </span>
          {showValue && (
            <span className={cn('font-medium text-clarus-navy', size === 'sm' ? 'text-xs' : 'text-sm')}>
              {value}
              {maxValue !== 100 && `/${maxValue}`}
            </span>
          )}
        </div>
        <div className={cn('w-full rounded-full bg-stone overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2')}>
          <div
            className={cn('h-full rounded-full transition-all duration-500', barColor)}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={maxValue}
            aria-label={`${label}: ${value} out of ${maxValue}`}
          />
        </div>
      </div>
    );
  }
);

RatingBar.displayName = 'RatingBar';
