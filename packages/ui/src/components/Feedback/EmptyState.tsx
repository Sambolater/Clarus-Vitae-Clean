import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, type ReactNode } from 'react';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * EmptyState component for no results display.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center px-4 py-12 text-center', className)}
        {...props}
      >
        {icon ? (
          <div className="mb-4 text-slate">{icon}</div>
        ) : (
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone">
            <svg
              className="h-8 w-8 text-slate"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
        )}
        <h3 className="font-display text-xl text-clarus-navy">{title}</h3>
        {description && (
          <p className="mt-2 max-w-sm text-sm text-slate">{description}</p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
