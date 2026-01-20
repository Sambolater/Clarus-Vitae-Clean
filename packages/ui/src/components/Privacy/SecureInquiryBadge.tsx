import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface SecureInquiryBadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'inline' | 'card';
}

/**
 * SecureInquiryBadge component indicating encrypted inquiry handling.
 */
export const SecureInquiryBadge = forwardRef<HTMLDivElement, SecureInquiryBadgeProps>(
  ({ variant = 'inline', className, ...props }, ref) => {
    if (variant === 'card') {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-lg border border-verification-green/20 bg-verification-green/5 p-4',
            className
          )}
          {...props}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-verification-green/10">
              <svg className="h-5 w-5 text-verification-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-verification-green">Secure Inquiry</h4>
              <p className="mt-1 text-sm text-slate">
                Your inquiry will be encrypted in transit and at rest. Only the selected property
                will receive your information.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full bg-verification-green/10 px-3 py-1 text-sm font-medium text-verification-green',
          className
        )}
        {...props}
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Secure Inquiry
      </span>
    );
  }
);

SecureInquiryBadge.displayName = 'SecureInquiryBadge';
