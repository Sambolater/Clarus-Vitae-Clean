import { cn } from '@clarus-vitae/utils';
import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  description?: string;
  error?: string;
}

/**
 * Checkbox component with label support.
 *
 * Features:
 * - 20px checkbox with Navy fill when checked
 * - Label with optional description
 * - Error state
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className, id, ...props }, ref) => {
    const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : `checkbox-${Math.random().toString(36).slice(2, 9)}`);

    return (
      <div className={cn('flex items-start', className)}>
        <div className="flex h-5 items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              'h-5 w-5 rounded border-stone text-clarus-navy',
              'focus:ring-2 focus:ring-clarus-navy focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-error-red'
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${checkboxId}-error` : description ? `${checkboxId}-description` : undefined}
            {...props}
          />
        </div>
        <div className="ml-3">
          <label htmlFor={checkboxId} className="text-sm font-medium text-clarus-navy cursor-pointer">
            {label}
          </label>
          {description && (
            <p id={`${checkboxId}-description`} className="text-sm text-slate">
              {description}
            </p>
          )}
          {error && (
            <p id={`${checkboxId}-error`} className="mt-1 text-sm text-error-red" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
