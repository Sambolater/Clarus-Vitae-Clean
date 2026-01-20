import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
}

/**
 * Skeleton component for content placeholders.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'rectangular', width, height, animation = 'pulse', className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-stone',
          variant === 'text' && 'rounded',
          variant === 'circular' && 'rounded-full',
          variant === 'rectangular' && 'rounded-md',
          animation === 'pulse' && 'animate-pulse',
          animation === 'shimmer' &&
            'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
          className
        )}
        style={{
          width: width,
          height: height || (variant === 'text' ? '1em' : undefined),
          ...style,
        }}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Preset skeleton components for common use cases
export const SkeletonCard = () => (
  <div className="rounded-lg bg-white p-4 shadow-card">
    <Skeleton variant="rectangular" height={160} className="mb-4" />
    <Skeleton variant="text" width="60%" height={20} className="mb-2" />
    <Skeleton variant="text" width="40%" height={16} className="mb-4" />
    <Skeleton variant="text" width="80%" height={14} />
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '70%' : '100%'}
        height={16}
      />
    ))}
  </div>
);
