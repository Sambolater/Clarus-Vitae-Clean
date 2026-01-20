import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeStyles = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
};

/**
 * LoadingSpinner component for loading states.
 */
export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size = 'md', label = 'Loading', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn('flex flex-col items-center justify-center gap-2', className)}
        {...props}
      >
        <div
          className={cn(
            'animate-spin rounded-full border-clarus-navy border-t-transparent',
            sizeStyles[size]
          )}
        />
        {label && size !== 'sm' && (
          <span className="text-sm text-slate">{label}</span>
        )}
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';
