'use client';

import { TreatmentCard, EmptyState, SkeletonCard } from '@clarus-vitae/ui';
import Link from 'next/link';

import {
  type TreatmentListItem,
  formatTreatmentPriceRange,
  treatmentCategoryLabels,
} from '@/lib/treatments';

interface TreatmentGridProps {
  treatments: TreatmentListItem[];
  isLoading?: boolean;
}

export function TreatmentGrid({ treatments, isLoading = false }: TreatmentGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (treatments.length === 0) {
    return (
      <EmptyState
        title="No treatments found"
        description="Try adjusting your filters to see more results."
        icon={
          <svg
            className="h-12 w-12 text-slate"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {treatments.map((treatment) => (
        <Link key={treatment.id} href={`/treatments/${treatment.slug}`}>
          <TreatmentCard
            name={treatment.name}
            category={treatmentCategoryLabels[treatment.category] ?? 'Treatment'}
            evidenceLevel={treatment.evidenceLevel}
            description={treatment.description}
            propertiesCount={treatment.propertiesCount}
            priceRange={formatTreatmentPriceRange(
              treatment.priceRangeMin,
              treatment.priceRangeMax
            )}
            imageUrl={treatment.imageUrl ?? undefined}
            href={`/treatments/${treatment.slug}`}
          />
        </Link>
      ))}
    </div>
  );
}
