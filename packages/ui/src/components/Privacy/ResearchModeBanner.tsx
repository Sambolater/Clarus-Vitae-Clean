import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface ResearchModeBannerProps extends HTMLAttributes<HTMLDivElement> {
  onLearnMore?: () => void;
  variant?: 'inline' | 'floating';
}

/**
 * ResearchModeBanner component indicating research mode is active.
 *
 * Research Mode means:
 * - No tracking or cookies
 * - No data capture
 * - Full browsing capability
 */
export const ResearchModeBanner = forwardRef<HTMLDivElement, ResearchModeBannerProps>(
  ({ onLearnMore, variant = 'inline', className, ...props }, ref) => {
    if (variant === 'floating') {
      return (
        <div
          ref={ref}
          className={cn(
            'fixed bottom-4 left-4 z-40 flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-card-hover border border-stone',
            className
          )}
          {...props}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-verification-green/10">
            <svg className="h-4 w-4 text-verification-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-clarus-navy">Research Mode Active</p>
            <p className="text-xs text-slate">No tracking • No cookies</p>
          </div>
          {onLearnMore && (
            <button
              type="button"
              onClick={onLearnMore}
              className="ml-2 text-xs font-medium text-clarus-navy hover:underline"
            >
              Learn more
            </button>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-2 bg-verification-green/10 px-4 py-2 text-sm',
          className
        )}
        {...props}
      >
        <svg className="h-4 w-4 text-verification-green" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span className="font-medium text-verification-green">Research Mode</span>
        <span className="text-verification-green/80">— No tracking, no cookies, no footprint</span>
        {onLearnMore && (
          <button
            type="button"
            onClick={onLearnMore}
            className="ml-2 font-medium text-verification-green hover:underline"
          >
            Learn more
          </button>
        )}
      </div>
    );
  }
);

ResearchModeBanner.displayName = 'ResearchModeBanner';
