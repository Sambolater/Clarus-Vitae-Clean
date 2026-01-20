import { cn } from '@clarus-vitae/utils';
import { type ButtonHTMLAttributes, forwardRef, useState } from 'react';

export interface DataDeletionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onRequestDeletion: () => Promise<void>;
  confirmMessage?: string;
}

/**
 * DataDeletionButton component for one-click data deletion request.
 *
 * Includes confirmation step to prevent accidental deletion.
 */
export const DataDeletionButton = forwardRef<HTMLButtonElement, DataDeletionButtonProps>(
  (
    {
      onRequestDeletion,
      confirmMessage = 'This will permanently delete all your data. This action cannot be undone.',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
      if (!isConfirming) {
        setIsConfirming(true);
        return;
      }

      setIsLoading(true);
      try {
        await onRequestDeletion();
      } finally {
        setIsLoading(false);
        setIsConfirming(false);
      }
    };

    const handleCancel = () => {
      setIsConfirming(false);
    };

    if (isConfirming) {
      return (
        <div className={cn('flex flex-col gap-3 rounded-lg border border-error-red/20 bg-error-red/5 p-4', className)}>
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 shrink-0 text-error-red" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-error-red">{confirmMessage}</p>
          </div>
          <div className="flex gap-2">
            <button
              ref={ref}
              type="button"
              onClick={handleClick}
              disabled={isLoading}
              className="flex-1 rounded-md bg-error-red px-4 py-2 text-sm font-medium text-white hover:bg-error-red/90 disabled:opacity-50"
              {...props}
            >
              {isLoading ? 'Deleting...' : 'Confirm Deletion'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 rounded-md border border-stone px-4 py-2 text-sm font-medium text-clarus-navy hover:bg-stone"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={cn(
          'inline-flex items-center gap-2 rounded-md border border-error-red/30 px-4 py-2 text-sm font-medium text-error-red hover:bg-error-red/5 transition-colors',
          className
        )}
        {...props}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        {children || 'Delete My Data'}
      </button>
    );
  }
);

DataDeletionButton.displayName = 'DataDeletionButton';
