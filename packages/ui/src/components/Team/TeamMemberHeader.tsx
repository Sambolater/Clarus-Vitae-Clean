'use client';

import type { TeamMember } from '@clarus-vitae/types';
import { getTeamRoleLabel } from '@clarus-vitae/types';
import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface TeamMemberHeaderProps extends HTMLAttributes<HTMLElement> {
  member: TeamMember;
  showContactButton?: boolean;
  onContactClick?: () => void;
}

/**
 * TeamMemberHeader component for individual profile page headers.
 *
 * Features:
 * - Large photo display
 * - Name, title, and role badge
 * - Key metrics (properties visited, years experience)
 * - Optional contact button
 * - LinkedIn link
 */
export const TeamMemberHeader = forwardRef<HTMLElement, TeamMemberHeaderProps>(
  ({ member, showContactButton = true, onContactClick, className, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn('bg-gradient-to-b from-stone to-clarus-white py-12 md:py-16', className)}
        {...props}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
            {/* Photo */}
            <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-2xl bg-clarus-navy shadow-lg md:h-64 md:w-64">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.photoAlt || member.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-display text-6xl text-clarus-gold">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <span className="rounded-full bg-clarus-navy px-3 py-1 text-xs font-medium text-clarus-white">
                  {getTeamRoleLabel(member.role)}
                </span>
                {member.credentials.slice(0, 3).map((cred) => (
                  <span
                    key={cred}
                    className="rounded-full bg-stone px-3 py-1 text-xs text-slate"
                  >
                    {cred}
                  </span>
                ))}
              </div>

              <h1 className="mt-4 font-display text-4xl font-medium text-clarus-navy md:text-5xl">
                {member.name}
              </h1>

              <p className="mt-2 text-xl text-clarus-gold">{member.title}</p>

              <p className="mt-4 text-slate">{member.shortBio}</p>

              {/* Metrics */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm md:justify-start">
                <div className="flex items-center gap-2">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>
                    <span className="font-semibold text-clarus-navy">
                      {member.propertiesVisited}
                    </span>{' '}
                    properties visited
                  </span>
                </div>
                <div className="flex items-center gap-2">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span>
                    <span className="font-semibold text-clarus-navy">
                      {member.programsEvaluated}
                    </span>{' '}
                    programs evaluated
                  </span>
                </div>
                <div className="flex items-center gap-2">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    <span className="font-semibold text-clarus-navy">
                      {member.yearsExperience}
                    </span>{' '}
                    years experience
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                {showContactButton && member.isContactAvailable && (
                  <button
                    type="button"
                    onClick={onContactClick}
                    className="rounded-lg bg-clarus-navy px-6 py-3 font-medium text-clarus-white transition-colors hover:bg-clarus-navy/90"
                  >
                    Request Consultation
                  </button>
                )}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-stone px-4 py-3 text-sm text-clarus-navy transition-colors hover:bg-stone"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
);

TeamMemberHeader.displayName = 'TeamMemberHeader';
