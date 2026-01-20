'use client';

import React from 'react';

interface TreatmentCardEmbedProps {
  slug: string;
  /** Optional: Pass treatment data directly to avoid fetch */
  treatment?: {
    name: string;
    category: string;
    evidenceLevel: string;
    description?: string;
  };
}

/**
 * Placeholder component for embedding treatment cards in Portable Text content
 *
 * In production, this component should:
 * 1. Fetch treatment data from PostgreSQL using the slug
 * 2. Render a TreatmentCard with the fetched data
 *
 * @example
 * <TreatmentCardEmbed slug="nad-iv-therapy" />
 */
export function TreatmentCardEmbed({ slug, treatment }: TreatmentCardEmbedProps) {
  // TODO: In production, fetch treatment data using the slug
  // const treatment = await getTreatmentBySlug(slug);

  if (treatment) {
    // Render actual treatment card when data is available
    return (
      <div className="my-6 rounded-lg border border-stone bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate">
              {treatment.category}
            </p>
            <h4 className="font-serif text-lg font-medium text-clarus-navy">
              {treatment.name}
            </h4>
            {treatment.description && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {treatment.description}
              </p>
            )}
          </div>
          <span className="shrink-0 rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
            {treatment.evidenceLevel}
          </span>
        </div>
      </div>
    );
  }

  // Placeholder when treatment data is not available
  return (
    <div className="my-6 rounded-lg border border-dashed border-slate bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate">Treatment Card</p>
          <p className="text-xs text-gray-400">Slug: {slug}</p>
        </div>
        <a
          href={`/treatments/${slug}`}
          className="text-sm font-medium text-clarus-navy hover:underline"
        >
          View Treatment →
        </a>
      </div>
    </div>
  );
}
