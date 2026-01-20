'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

import type { TeamMember } from '@clarus-vitae/types';

export interface TeamMemberCredentialsProps extends HTMLAttributes<HTMLElement> {
  member: TeamMember;
}

/**
 * TeamMemberCredentials component displaying education, certifications, and experience.
 *
 * Features:
 * - Education history
 * - Professional certifications
 * - Previous roles and experience
 */
export const TeamMemberCredentials = forwardRef<HTMLElement, TeamMemberCredentialsProps>(
  ({ member, className, ...props }, ref) => {
    const hasEducation = member.education && member.education.length > 0;
    const hasCertifications = member.certifications && member.certifications.length > 0;
    const hasPreviousRoles = member.previousRoles && member.previousRoles.length > 0;

    if (!hasEducation && !hasCertifications && !hasPreviousRoles) {
      return null;
    }

    return (
      <section
        ref={ref}
        className={cn('border-t border-stone bg-warm-gray py-12', className)}
        {...props}
      >
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl text-clarus-navy">
              Credentials & Background
            </h2>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {/* Education */}
              {hasEducation && (
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-clarus-navy">
                    <svg
                      className="h-5 w-5 text-slate"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      />
                    </svg>
                    Education
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {member.education.map((edu, i) => (
                      <li key={i}>
                        <p className="font-medium text-clarus-navy">
                          {edu.degree} in {edu.field}
                        </p>
                        <p className="text-sm text-slate">
                          {edu.institution}
                          {edu.year && `, ${edu.year}`}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Certifications */}
              {hasCertifications && (
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-clarus-navy">
                    <svg
                      className="h-5 w-5 text-slate"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                    Certifications
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {member.certifications.map((cert, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate">
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-verification-green"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Previous Roles */}
            {hasPreviousRoles && (
              <div className="mt-8">
                <h3 className="flex items-center gap-2 font-semibold text-clarus-navy">
                  <svg
                    className="h-5 w-5 text-slate"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Previous Experience
                </h3>
                <ul className="mt-4 space-y-4">
                  {member.previousRoles.map((role, i) => (
                    <li key={i} className="border-l-2 border-stone pl-4">
                      <p className="font-medium text-clarus-navy">{role.title}</p>
                      <p className="text-sm text-slate">
                        {role.organization} | {role.years}
                      </p>
                      {role.description && (
                        <p className="mt-1 text-sm text-slate">{role.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
);

TeamMemberCredentials.displayName = 'TeamMemberCredentials';
