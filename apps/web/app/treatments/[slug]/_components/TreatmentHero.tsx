'use client';

import { cn } from '@clarus-vitae/utils';
import { EvidenceLevel, TreatmentCategory } from '@clarus-vitae/database';
import {
  evidenceLevelConfig,
  evidenceLevelDescriptions,
  treatmentCategoryLabels,
  formatTreatmentPriceRange,
} from '@/lib/treatments';

interface TreatmentHeroProps {
  name: string;
  category: TreatmentCategory;
  evidenceLevel: EvidenceLevel;
  description: string;
  propertiesCount: number;
  priceRangeMin: number | null;
  priceRangeMax: number | null;
  aliases?: string[];
}

export function TreatmentHero({
  name,
  category,
  evidenceLevel,
  description,
  propertiesCount,
  priceRangeMin,
  priceRangeMax,
  aliases,
}: TreatmentHeroProps) {
  const evidence = evidenceLevelConfig[evidenceLevel];

  return (
    <section className="border-b border-stone bg-white py-12">
      <div className="mx-auto max-w-4xl px-6">
        {/* Category Badge */}
        <span className="inline-flex items-center rounded-full bg-stone px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate">
          {treatmentCategoryLabels[category]}
        </span>

        {/* Treatment Name */}
        <h1 className="mt-4 font-display text-4xl font-medium text-clarus-navy md:text-5xl">
          {name}
        </h1>

        {/* Aliases */}
        {aliases && aliases.length > 0 && (
          <p className="mt-2 text-sm text-slate">
            Also known as: {aliases.join(', ')}
          </p>
        )}

        {/* Description */}
        <p className="mt-6 text-lg text-slate leading-relaxed">{description}</p>

        {/* Key Stats */}
        <div className="mt-8 flex flex-wrap items-center gap-6">
          {/* Evidence Level Badge */}
          <div className="group relative">
            <span
              className={cn(
                'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium',
                evidence.bgColor,
                evidence.color,
                evidence.badgeClass
              )}
            >
              <EvidenceIcon level={evidenceLevel} />
              {evidence.label}
            </span>
            {/* Tooltip */}
            <div className="invisible absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg bg-clarus-navy px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              <p className="max-w-xs whitespace-normal">
                {evidenceLevelDescriptions[evidenceLevel]}
              </p>
              <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-clarus-navy" />
            </div>
          </div>

          {/* Properties Count */}
          <div className="flex items-center gap-2 text-slate">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span>
              Available at <strong className="text-clarus-navy">{propertiesCount}</strong>{' '}
              {propertiesCount === 1 ? 'property' : 'properties'}
            </span>
          </div>

          {/* Price Range */}
          {(priceRangeMin || priceRangeMax) && (
            <div className="flex items-center gap-2 text-slate">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Typical cost:{' '}
                <strong className="text-clarus-navy">
                  {formatTreatmentPriceRange(priceRangeMin, priceRangeMax)}
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function EvidenceIcon({ level }: { level: EvidenceLevel }) {
  // Different icons for different evidence levels
  switch (level) {
    case 'STRONG':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'MODERATE':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'EMERGING':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    case 'EXPERIMENTAL':
      return (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      );
    case 'TRADITIONAL':
      return (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      );
    default:
      return null;
  }
}
