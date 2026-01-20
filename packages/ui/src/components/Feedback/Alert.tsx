import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef, type ReactNode } from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  icon?: ReactNode;
  onDismiss?: () => void;
}

const variantStyles: Record<AlertVariant, { container: string; icon: string }> = {
  info: {
    container: 'bg-clarus-navy/5 border-clarus-navy/20 text-clarus-navy',
    icon: 'text-clarus-navy',
  },
  success: {
    container: 'bg-success-green/10 border-success-green/20 text-success-green',
    icon: 'text-success-green',
  },
  warning: {
    container: 'bg-alert-amber/10 border-alert-amber/20 text-alert-amber',
    icon: 'text-alert-amber',
  },
  error: {
    container: 'bg-error-red/10 border-error-red/20 text-error-red',
    icon: 'text-error-red',
  },
};

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

/**
 * Alert component for informational messages.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', title, icon, onDismiss, children, className, ...props }, ref) => {
    const styles = variantStyles[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'flex gap-3 rounded-lg border p-4',
          styles.container,
          className
        )}
        {...props}
      >
        <div className={cn('shrink-0', styles.icon)}>
          {icon || defaultIcons[variant]}
        </div>
        <div className="flex-1 min-w-0">
          {title && <h3 className="font-medium">{title}</h3>}
          <div className={cn(title && 'mt-1', 'text-sm opacity-90')}>{children}</div>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';
