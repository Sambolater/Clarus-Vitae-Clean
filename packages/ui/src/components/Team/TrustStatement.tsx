'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface TrustStatementProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'compact';
}

/**
 * TrustStatement component explaining the team's commitment to editorial independence.
 *
 * Features:
 * - Editorial independence declaration
 * - Privacy commitment
 * - Verification methodology transparency
 */
export const TrustStatement = forwardRef<HTMLElement, TrustStatementProps>(
  ({ variant = 'default', className, ...props }, ref) => {
    if (variant === 'compact') {
      return (
        <section
          ref={ref}
          className={cn('border-y border-stone bg-warm-gray py-8', className)}
          {...props}
        >
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate md:gap-10">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-verification-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>Independent assessments</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-verification-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>Personal visits</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-verification-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Privacy protected</span>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section
        ref={ref}
        className={cn('border-y border-stone bg-warm-gray py-12', className)}
        {...props}
      >
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center font-display text-2xl text-clarus-navy">
              Our Commitment to You
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-verification-green/10">
                  <svg
                    className="h-6 w-6 text-verification-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-clarus-navy">
                  Editorial Independence
                </h3>
                <p className="mt-2 text-sm text-slate">
                  Properties cannot pay for inclusion, ranking, or favorable
                  coverage. Our assessments are based solely on merit.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-verification-green/10">
                  <svg
                    className="h-6 w-6 text-verification-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-clarus-navy">
                  First-Hand Experience
                </h3>
                <p className="mt-2 text-sm text-slate">
                  Every property in our index has been personally visited and
                  evaluated by at least one team member.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-verification-green/10">
                  <svg
                    className="h-6 w-6 text-verification-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-clarus-navy">
                  Privacy Protected
                </h3>
                <p className="mt-2 text-sm text-slate">
                  Your research is private. We never track, share, or sell user
                  data. Browse with complete confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

TrustStatement.displayName = 'TrustStatement';
