/**
 * SearchInput Component
 *
 * Search input field with icon and clear button.
 * Part of the GlobalSearch component.
 */

'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@clarus-vitae/utils';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
  isLoading?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, isLoading, value, ...props }, ref) => {
    const hasValue = value && String(value).length > 0;

    return (
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="pointer-events-none absolute left-3 flex items-center">
          {isLoading ? (
            <svg
              className="h-5 w-5 animate-spin text-slate"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-slate"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          )}
        </div>

        {/* Input */}
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            'h-10 w-full rounded-md border border-stone bg-white pl-10 pr-9 text-sm text-clarus-navy placeholder:text-slate/60',
            'focus:border-clarus-navy focus:outline-none focus:ring-1 focus:ring-clarus-navy',
            'transition-colors duration-150',
            className
          )}
          {...props}
        />

        {/* Clear Button */}
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-full text-slate hover:bg-stone hover:text-clarus-navy"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
