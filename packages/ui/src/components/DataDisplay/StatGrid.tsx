import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, type ReactNode } from 'react';

export interface StatItem {
  label: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
}

export interface StatGridProps extends HTMLAttributes<HTMLDivElement> {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'compact' | 'card';
}

const columnStyles = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
};

/**
 * StatGrid component for displaying a grid of statistics.
 */
export const StatGrid = forwardRef<HTMLDivElement, StatGridProps>(
  ({ stats, columns = 4, variant = 'default', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('grid gap-4', columnStyles[columns], className)}
        {...props}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              variant === 'card' && 'rounded-lg bg-white p-4 shadow-card',
              variant === 'compact' && 'text-center',
              variant === 'default' && 'border-l-2 border-stone pl-4'
            )}
          >
            <div className="flex items-start gap-3">
              {stat.icon && variant !== 'compact' && (
                <div className="shrink-0 text-slate">{stat.icon}</div>
              )}
              <div className={variant === 'compact' ? 'w-full' : ''}>
                <p className="text-xs font-medium uppercase tracking-wide text-slate">
                  {stat.label}
                </p>
                <p className={cn(
                  'font-display text-clarus-navy',
                  variant === 'compact' ? 'text-2xl mt-1' : 'text-xl'
                )}>
                  {stat.value}
                </p>
                {stat.description && (
                  <p className="mt-1 text-xs text-slate">{stat.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

StatGrid.displayName = 'StatGrid';
