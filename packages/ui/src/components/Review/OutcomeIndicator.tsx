import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export type OutcomeLevel = 'exceeded' | 'achieved' | 'partial' | 'not_achieved';

export interface OutcomeIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  level: OutcomeLevel;
  label?: string;
  percentage?: number;
  size?: 'sm' | 'md' | 'lg';
}

const outcomeConfig: Record<OutcomeLevel, { label: string; color: string; bgColor: string; icon: string }> = {
  exceeded: {
    label: 'Exceeded Goals',
    color: 'text-verification-green',
    bgColor: 'bg-verification-green/10',
    icon: '↑',
  },
  achieved: {
    label: 'Goals Achieved',
    color: 'text-success-green',
    bgColor: 'bg-success-green/10',
    icon: '✓',
  },
  partial: {
    label: 'Partially Achieved',
    color: 'text-clarus-gold',
    bgColor: 'bg-clarus-gold/10',
    icon: '◐',
  },
  not_achieved: {
    label: 'Not Achieved',
    color: 'text-slate',
    bgColor: 'bg-slate/10',
    icon: '○',
  },
};

const sizeStyles = {
  sm: 'text-xs px-2 py-1 gap-1',
  md: 'text-sm px-3 py-1.5 gap-1.5',
  lg: 'text-base px-4 py-2 gap-2',
};

/**
 * OutcomeIndicator component for displaying goal achievement status.
 *
 * Used in outcome-focused reviews to show whether health goals were met.
 */
export const OutcomeIndicator = forwardRef<HTMLDivElement, OutcomeIndicatorProps>(
  ({ level, label, percentage, size = 'md', className, ...props }, ref) => {
    const config = outcomeConfig[level];

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-md font-medium',
          config.bgColor,
          config.color,
          sizeStyles[size],
          className
        )}
        {...props}
      >
        <span className="font-mono">{config.icon}</span>
        <span>{label || config.label}</span>
        {percentage !== undefined && (
          <span className="opacity-80">({percentage}%)</span>
        )}
      </div>
    );
  }
);

OutcomeIndicator.displayName = 'OutcomeIndicator';
