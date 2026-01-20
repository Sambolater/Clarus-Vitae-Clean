'use client';

import type { CollectiveStats } from '@clarus-vitae/types';
import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

export interface TeamHeroProps extends HTMLAttributes<HTMLElement> {
  stats: CollectiveStats;
  title?: string;
  subtitle?: string;
}

interface StatDisplayProps {
  value: number;
  label: string;
  suffix?: string;
}

function StatDisplay({ value, label, suffix = '' }: StatDisplayProps) {
  return (
    <div className="text-center">
      <p className="font-display text-4xl text-clarus-navy md:text-5xl">
        {value.toLocaleString()}
        {suffix && <span className="text-clarus-gold">{suffix}</span>}
      </p>
      <p className="mt-1 text-sm text-slate">{label}</p>
    </div>
  );
}

/**
 * TeamHero component for the advisory team page header.
 *
 * Features:
 * - Page title and subtitle
 * - Collective team statistics
 * - Trust-building metrics
 * - Responsive grid layout
 */
export const TeamHero = forwardRef<HTMLElement, TeamHeroProps>(
  (
    {
      stats,
      title = 'Our Advisory Team',
      subtitle = 'Real expertise. Real visits. Real recommendations you can trust.',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          'bg-gradient-to-b from-stone to-clarus-white py-16 md:py-24',
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-medium text-clarus-navy md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-lg text-slate md:text-xl">{subtitle}</p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 md:mt-16 md:grid-cols-5 md:gap-8">
            <StatDisplay
              value={stats.totalPropertiesVisited}
              label="Properties Visited"
              suffix="+"
            />
            <StatDisplay
              value={stats.totalProgramsEvaluated}
              label="Programs Evaluated"
              suffix="+"
            />
            <StatDisplay
              value={stats.totalYearsExperience}
              label="Combined Years Experience"
              suffix="+"
            />
            <StatDisplay
              value={stats.countriesCovered}
              label="Countries Covered"
            />
            <StatDisplay
              value={stats.totalMembers}
              label="Expert Advisors"
            />
          </div>
        </div>
      </section>
    );
  }
);

TeamHero.displayName = 'TeamHero';
