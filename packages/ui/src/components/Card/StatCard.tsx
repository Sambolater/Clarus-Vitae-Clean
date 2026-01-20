import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, type ReactNode } from 'react';

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: ReactNode;
  variant?: 'default' | 'highlight' | 'subtle';
}

const variantStyles = {
  default: 'bg-white',
  highlight: 'bg-clarus-navy text-white',
  subtle: 'bg-stone',
};

/**
 * StatCard component for displaying metrics and statistics.
 *
 * Features:
 * - Large value display
 * - Label and optional description
 * - Trend indicator (up/down/neutral)
 * - Optional icon
 * - Multiple variants
 */
export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      label,
      value,
      description,
      trend,
      trendValue,
      icon,
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const isHighlight = variant === 'highlight';

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg p-5 shadow-card',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div>
            <p
              className={cn(
                'text-xs font-medium uppercase tracking-wide',
                isHighlight ? 'text-white/70' : 'text-slate'
              )}
            >
              {label}
            </p>
            <p
              className={cn(
                'mt-1 font-display text-3xl',
                isHighlight ? 'text-clarus-gold' : 'text-clarus-navy'
              )}
            >
              {value}
            </p>
          </div>
          {icon && (
            <div
              className={cn(
                'rounded-lg p-2',
                isHighlight ? 'bg-white/10' : 'bg-stone'
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {(description || trend) && (
          <div className="mt-3 flex items-center gap-2">
            {trend && trendValue && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-xs font-medium',
                  trend === 'up' && 'text-verification-green',
                  trend === 'down' && 'text-error-red',
                  trend === 'neutral' && (isHighlight ? 'text-white/70' : 'text-slate')
                )}
              >
                {trend === 'up' && (
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
                {trend === 'down' && (
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
                {trendValue}
              </span>
            )}
            {description && (
              <span className={cn('text-xs', isHighlight ? 'text-white/70' : 'text-slate')}>
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';
