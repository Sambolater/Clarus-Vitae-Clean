import { cn } from '@clarus-vitae/utils';
import { forwardRef } from 'react';

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const sizeStyles = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

/**
 * StarRating component for displaying ratings.
 *
 * Can be interactive for user input or display-only.
 */
export const StarRating = forwardRef<HTMLDivElement, StarRatingProps>(
  (
    {
      rating,
      maxRating = 5,
      size = 'md',
      showValue = false,
      interactive = false,
      onChange,
      className,
    },
    ref
  ) => {
    const handleClick = (value: number) => {
      if (interactive && onChange) {
        onChange(value);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent, value: number) => {
      if (interactive && onChange && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onChange(value);
      }
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-0.5', className)}
        role={interactive ? 'radiogroup' : 'img'}
        aria-label={`Rating: ${rating} out of ${maxRating} stars`}
      >
        {Array.from({ length: maxRating }).map((_, i) => {
          const value = i + 1;
          const isFilled = value <= rating;
          const isHalf = value > rating && value - 0.5 <= rating;

          return (
            <span
              key={i}
              onClick={() => handleClick(value)}
              onKeyDown={(e) => handleKeyDown(e, value)}
              tabIndex={interactive ? 0 : undefined}
              role={interactive ? 'radio' : undefined}
              aria-checked={interactive ? isFilled : undefined}
              className={cn(
                interactive && 'cursor-pointer hover:scale-110 transition-transform'
              )}
            >
              <svg
                className={cn(
                  sizeStyles[size],
                  isFilled ? 'text-clarus-gold' : isHalf ? 'text-clarus-gold/50' : 'text-stone'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          );
        })}
        {showValue && (
          <span className={cn('ml-1.5 text-slate', size === 'sm' ? 'text-xs' : 'text-sm')}>
            {rating}/{maxRating}
          </span>
        )}
      </div>
    );
  }
);

StarRating.displayName = 'StarRating';
