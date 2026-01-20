import { cn } from '@clarus-vitae/utils';
import { type InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/**
 * Input component with label and error state support.
 *
 * Follows Clarus Vitae design system with:
 * - 48px height
 * - Stone border with Navy focus state
 * - Error state with red border and message
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-clarus-navy"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-12 w-full rounded-md border bg-white px-4 text-base text-clarus-navy placeholder:text-slate/50',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
            error
              ? 'border-error-red focus:border-error-red focus:ring-error-red'
              : 'border-stone focus:border-clarus-navy focus:ring-clarus-navy',
            'disabled:cursor-not-allowed disabled:bg-warm-gray disabled:opacity-50',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-error-red" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-slate">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
