'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

import type { TeamMember } from '@clarus-vitae/types';

export interface TeamMemberBioProps extends HTMLAttributes<HTMLElement> {
  member: TeamMember;
}

/**
 * TeamMemberBio component displaying the full biography of a team member.
 *
 * Features:
 * - Full biography text
 * - Specializations list
 * - Languages spoken
 * - Focus areas
 */
export const TeamMemberBio = forwardRef<HTMLElement, TeamMemberBioProps>(
  ({ member, className, ...props }, ref) => {
    return (
      <section ref={ref} className={cn('py-12', className)} {...props}>
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl text-clarus-navy">About</h2>

            <div className="mt-6 space-y-4 text-slate">
              {member.bio.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Specializations */}
            {member.specializations.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-clarus-navy">Specializations</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {member.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-full bg-clarus-gold/10 px-3 py-1 text-sm text-clarus-navy"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Focus Areas */}
            {member.focusAreas.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-clarus-navy">Focus Areas</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {member.focusAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full border border-stone px-3 py-1 text-sm text-slate"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {member.languages.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-clarus-navy">Languages</h3>
                <p className="mt-2 text-slate">{member.languages.join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
);

TeamMemberBio.displayName = 'TeamMemberBio';
