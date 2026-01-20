import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, type ReactNode } from 'react';

export interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: ReactNode;
}

/**
 * ErrorState component for error display with retry option.
 */
export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    { title = 'Something went wrong', message, onRetry, retryLabel = 'Try again', icon, className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn('flex flex-col items-center justify-center px-4 py-12 text-center', className)}
        {...props}
      >
        {icon ? (
          <div className="mb-4 text-error-red">{icon}</div>
        ) : (
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error-red/10">
            <svg
              className="h-8 w-8 text-error-red"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        )}
        <h3 className="font-display text-xl text-clarus-navy">{title}</h3>
        <p className="mt-2 max-w-sm text-sm text-slate">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-clarus-navy px-4 py-2 text-sm font-medium text-white hover:bg-clarus-navy/90 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {retryLabel}
          </button>
        )}
      </div>
    );
  }
);

ErrorState.displayName = 'ErrorState';
