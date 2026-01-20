'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, useEffect } from 'react';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ToastVariant;
  title: string;
  description?: string;
  onClose: () => void;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const variantStyles: Record<ToastVariant, string> = {
  info: 'bg-white border-clarus-navy/20',
  success: 'bg-white border-success-green/20',
  warning: 'bg-white border-alert-amber/20',
  error: 'bg-white border-error-red/20',
};

const iconStyles: Record<ToastVariant, { color: string; bg: string }> = {
  info: { color: 'text-clarus-navy', bg: 'bg-clarus-navy/10' },
  success: { color: 'text-success-green', bg: 'bg-success-green/10' },
  warning: { color: 'text-alert-amber', bg: 'bg-alert-amber/10' },
  error: { color: 'text-error-red', bg: 'bg-error-red/10' },
};

/**
 * Toast component for temporary notifications.
 *
 * Auto-dismisses after duration (default 5000ms).
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ variant = 'info', title, description, onClose, duration = 5000, action, className, ...props }, ref) => {
    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    const iconStyle = iconStyles[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border bg-white p-4 shadow-card-hover',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', iconStyle.bg)}>
          {variant === 'success' && (
            <svg className={cn('h-4 w-4', iconStyle.color)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {variant === 'error' && (
            <svg className={cn('h-4 w-4', iconStyle.color)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {variant === 'warning' && (
            <svg className={cn('h-4 w-4', iconStyle.color)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
            </svg>
          )}
          {variant === 'info' && (
            <svg className={cn('h-4 w-4', iconStyle.color)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-clarus-navy">{title}</p>
          {description && <p className="mt-1 text-sm text-slate">{description}</p>}
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="mt-2 text-sm font-medium text-clarus-navy hover:underline"
            >
              {action.label}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-md p-1 text-slate hover:text-clarus-navy transition-colors"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }
);

Toast.displayName = 'Toast';
