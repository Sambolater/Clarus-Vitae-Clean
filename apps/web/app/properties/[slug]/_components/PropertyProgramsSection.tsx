'use client';

import { type FocusArea } from '@clarus-vitae/database';
import { Button, TierBadge } from '@clarus-vitae/ui';
import { useState } from 'react';

import { focusAreaLabels } from '@/lib/properties';

interface Program {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  price: number;
  currency: string;
  focusAreas: FocusArea[];
  inclusions: string[];
  exclusions: string[];
  typicalSchedule: string | null;
}

interface PropertyProgramsSectionProps {
  programs: Program[];
  propertySlug: string;
}

function ProgramCard({ program, propertySlug }: { program: Program; propertySlug: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDuration = (days: number) => {
    if (days === 1) return '1 day';
    if (days === 7) return '1 week';
    if (days === 14) return '2 weeks';
    if (days === 21) return '3 weeks';
    return `${days} days`;
  };

  return (
    <div className="overflow-hidden rounded-lg border border-stone bg-white">
      {/* Program Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-display text-xl font-medium text-clarus-navy">
              {program.name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDuration(program.durationDays)}
              </span>
              <span className="text-clarus-navy font-medium">
                {formatPrice(program.price, program.currency)}
              </span>
            </div>
          </div>

          <Button
            variant="text"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0"
          >
            {isExpanded ? 'Show Less' : 'Learn More'}
            <svg
              className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </div>

        {/* Focus Areas */}
        {program.focusAreas.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {program.focusAreas.map((area) => (
              <span
                key={area}
                className="rounded-md bg-stone px-2 py-0.5 text-xs text-slate"
              >
                {focusAreaLabels[area]}
              </span>
            ))}
          </div>
        )}

        {/* Description Preview */}
        <p className="mt-4 text-sm text-slate line-clamp-2">{program.description}</p>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-stone bg-warm-gray p-6">
          {/* Full Description */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-clarus-navy">About This Program</h4>
            <p className="mt-2 text-sm text-slate">{program.description}</p>
          </div>

          {/* Inclusions */}
          {program.inclusions.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-clarus-navy">Inclusions</h4>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {program.inclusions.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-verification-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exclusions */}
          {program.exclusions.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-clarus-navy">Not Included</h4>
              <ul className="mt-2 space-y-1">
                {program.exclusions.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate">
                    <span className="text-slate">-</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Typical Schedule */}
          {program.typicalSchedule && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-clarus-navy">Typical Schedule</h4>
              <p className="mt-2 whitespace-pre-line text-sm text-slate">
                {program.typicalSchedule}
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="sm"
              href={`/inquire?property=${propertySlug}&program=${program.id}`}
            >
              Inquire About This Program
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PropertyProgramsSection({ programs, propertySlug }: PropertyProgramsSectionProps) {
  if (programs.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-2xl font-medium text-clarus-navy">
          Programs
        </h2>
        <p className="mt-2 text-slate">
          {programs.length} {programs.length === 1 ? 'program' : 'programs'} available
        </p>

        <div className="mt-8 space-y-4">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} propertySlug={propertySlug} />
          ))}
        </div>
      </div>
    </section>
  );
}
