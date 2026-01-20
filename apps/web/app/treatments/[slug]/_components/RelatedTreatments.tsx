'use client';

import { type TreatmentCategory, type EvidenceLevel } from '@clarus-vitae/database';
import { TreatmentCard } from '@clarus-vitae/ui';
import Link from 'next/link';

import { treatmentCategoryLabels } from '@/lib/treatments';

interface RelatedTreatment {
  id: string;
  slug: string;
  name: string;
  category: TreatmentCategory;
  evidenceLevel: EvidenceLevel;
  description: string;
  propertiesCount: number;
}

interface RelatedTreatmentsProps {
  treatments: RelatedTreatment[];
  currentTreatmentName: string;
}

export function RelatedTreatments({ treatments, currentTreatmentName }: RelatedTreatmentsProps) {
  if (treatments.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-stone bg-warm-gray py-12">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-display text-2xl font-medium text-clarus-navy">Related Treatments</h2>
        <p className="mt-2 text-slate">
          If you&apos;re interested in {currentTreatmentName}, you might also consider:
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {treatments.map((treatment) => (
            <Link key={treatment.id} href={`/treatments/${treatment.slug}`}>
              <TreatmentCard
                name={treatment.name}
                category={treatmentCategoryLabels[treatment.category]}
                evidenceLevel={treatment.evidenceLevel}
                description={treatment.description}
                propertiesCount={treatment.propertiesCount}
                href={`/treatments/${treatment.slug}`}
              />
            </Link>
          ))}
        </div>

        {/* Link to category */}
        {treatments.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href={`/treatments?category=${treatments[0].category}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-clarus-navy hover:underline"
            >
              View all {treatmentCategoryLabels[treatments[0].category]} treatments
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
