'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface ContactAdvisorCTAProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  buttonText?: string;
  href?: string;
  onClick?: () => void;
}

/**
 * ContactAdvisorCTA component for team page call-to-action.
 *
 * Features:
 * - Prominent CTA section
 * - Customizable copy
 * - Link or button action
 */
export const ContactAdvisorCTA = forwardRef<HTMLElement, ContactAdvisorCTAProps>(
  (
    {
      title = 'Not Sure Where to Start?',
      description = 'Our advisory team can help match you with the right wellness destination based on your goals, preferences, and circumstances.',
      buttonText = 'Schedule a Consultation',
      href = '/inquire',
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn('bg-clarus-navy py-16', className)}
        {...props}
      >
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl text-clarus-white">{title}</h2>
            <p className="mt-4 text-clarus-white/80">{description}</p>

            <div className="mt-8">
              {onClick ? (
                <button
                  type="button"
                  onClick={onClick}
                  className="inline-flex items-center gap-2 rounded-lg bg-clarus-gold px-6 py-3 font-medium text-clarus-navy transition-colors hover:bg-clarus-gold/90"
                >
                  {buttonText}
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              ) : (
                <a
                  href={href}
                  className="inline-flex items-center gap-2 rounded-lg bg-clarus-gold px-6 py-3 font-medium text-clarus-navy transition-colors hover:bg-clarus-gold/90"
                >
                  {buttonText}
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              )}
            </div>

            <p className="mt-4 text-sm text-clarus-white/60">
              Free initial consultation. No commitment required.
            </p>
          </div>
        </div>
      </section>
    );
  }
);

ContactAdvisorCTA.displayName = 'ContactAdvisorCTA';
