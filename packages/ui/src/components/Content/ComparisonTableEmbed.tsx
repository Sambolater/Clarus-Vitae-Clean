'use client';

import React from 'react';

interface ComparisonTableEmbedProps {
  slugs: string[];
  title?: string;
}

/**
 * Placeholder component for embedding property comparison tables in Portable Text content
 *
 * In production, this component should:
 * 1. Fetch property data for all slugs from PostgreSQL
 * 2. Render a ComparisonTable with the fetched data
 *
 * @example
 * <ComparisonTableEmbed
 *   slugs={['clinique-la-prairie', 'sha-wellness', 'lanserhof']}
 *   title="Top European Longevity Clinics"
 * />
 */
export function ComparisonTableEmbed({ slugs, title }: ComparisonTableEmbedProps) {
  // TODO: In production, fetch property data for all slugs
  // const properties = await Promise.all(slugs.map(slug => getPropertyBySlug(slug)));

  return (
    <div className="my-8">
      {title && (
        <h4 className="mb-4 font-serif text-xl font-medium text-clarus-navy">
          {title}
        </h4>
      )}
      <div className="rounded-lg border border-stone bg-gray-50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate">Property Comparison</p>
            <p className="text-xs text-gray-400">
              Comparing {slugs.length} properties
            </p>
          </div>
          <a
            href={`/compare?properties=${slugs.join(',')}`}
            className="rounded bg-clarus-navy px-3 py-1.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Open Full Comparison
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {slugs.map((slug) => (
            <span
              key={slug}
              className="rounded bg-white px-3 py-1 text-sm text-clarus-navy border border-stone"
            >
              {slug}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
