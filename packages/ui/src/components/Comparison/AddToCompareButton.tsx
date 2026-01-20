'use client';

import { cn } from '@clarus-vitae/utils';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

export type AddToCompareVariant = 'icon' | 'button' | 'card-overlay';
export type AddToCompareSize = 'sm' | 'md' | 'lg';

export interface AddToCompareButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Property ID */
  propertyId: string;
  /** Property name for accessibility */
  propertyName: string;
  /** Whether the property is currently in comparison */
  isInComparison?: boolean;
  /** Whether the comparison list is full */
  isComparisonFull?: boolean;
  /** Callback when clicked */
  onToggleCompare: () => void;
  /** Visual variant */
  variant?: AddToCompareVariant;
  /** Button size */
  size?: AddToCompareSize;
}

const sizeClasses: Record<AddToCompareSize, string> = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

const iconSizes: Record<AddToCompareSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

/**
 * Button/icon to add or remove a property from the comparison list.
 *
 * States:
 * - Default: "Add to Compare"
 * - In comparison: "Remove from Compare" with checkmark
 * - Comparison full: "Compare list full" (disabled)
 */
export const AddToCompareButton = forwardRef<HTMLButtonElement, AddToCompareButtonProps>(
  (
    {
      propertyId: _propertyId,
      propertyName,
      isInComparison = false,
      isComparisonFull = false,
      onToggleCompare,
      variant = 'button',
      size = 'md',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || (isComparisonFull && !isInComparison);

    const getAriaLabel = () => {
      if (isInComparison) {
        return `Remove ${propertyName} from comparison`;
      }
      if (isComparisonFull) {
        return 'Comparison list is full (max 4 properties)';
      }
      return `Add ${propertyName} to comparison`;
    };

    // Icon variant - just the icon in a circle
    if (variant === 'icon') {
      return (
        <button
          ref={ref}
          type="button"
          onClick={onToggleCompare}
          disabled={isDisabled}
          aria-label={getAriaLabel()}
          aria-pressed={isInComparison}
          className={cn(
            'flex items-center justify-center rounded-full transition-all',
            sizeClasses[size],
            isInComparison
              ? 'bg-clarus-navy text-white'
              : 'bg-stone text-slate hover:bg-clarus-navy hover:text-white',
            isDisabled && !isInComparison && 'cursor-not-allowed opacity-50',
            className
          )}
          {...props}
        >
          {isInComparison ? (
            <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          )}
        </button>
      );
    }

    // Card overlay variant - positioned absolutely on card hover
    if (variant === 'card-overlay') {
      return (
        <button
          ref={ref}
          type="button"
          onClick={onToggleCompare}
          disabled={isDisabled}
          aria-label={getAriaLabel()}
          aria-pressed={isInComparison}
          className={cn(
            'flex items-center justify-center rounded-full transition-colors',
            sizeClasses[size],
            isInComparison
              ? 'bg-clarus-navy text-white'
              : 'bg-white/90 text-slate hover:bg-white hover:text-clarus-navy',
            isDisabled && !isInComparison && 'cursor-not-allowed opacity-50',
            className
          )}
          {...props}
        >
          {isInComparison ? (
            <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          )}
        </button>
      );
    }

    // Button variant - full button with text
    return (
      <button
        ref={ref}
        type="button"
        onClick={onToggleCompare}
        disabled={isDisabled}
        aria-label={getAriaLabel()}
        aria-pressed={isInComparison}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
          isInComparison
            ? 'border-clarus-navy bg-clarus-navy text-white hover:bg-clarus-navy/90'
            : 'border-clarus-navy bg-white text-clarus-navy hover:bg-clarus-navy hover:text-white',
          isDisabled && !isInComparison && 'cursor-not-allowed opacity-50 hover:bg-white hover:text-clarus-navy',
          className
        )}
        {...props}
      >
        {isInComparison ? (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>In Comparison</span>
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>{isComparisonFull ? 'Compare Full' : 'Add to Compare'}</span>
          </>
        )}
      </button>
    );
  }
);

AddToCompareButton.displayName = 'AddToCompareButton';
