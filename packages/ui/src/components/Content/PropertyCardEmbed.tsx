'use client';

import React from 'react';

interface PropertyCardEmbedProps {
  slug: string;
  /** Optional: Pass property data directly to avoid fetch */
  property?: {
    name: string;
    location: string;
    tier: number;
    score: number;
    image?: string;
  };
}

/**
 * Placeholder component for embedding property cards in Portable Text content
 *
 * In production, this component should:
 * 1. Fetch property data from PostgreSQL using the slug
 * 2. Render a PropertyCard with the fetched data
 *
 * @example
 * <PropertyCardEmbed slug="clinique-la-prairie" />
 */
export function PropertyCardEmbed({ slug, property }: PropertyCardEmbedProps) {
  // TODO: In production, fetch property data using the slug
  // const property = await getPropertyBySlug(slug);

  if (property) {
    // Render actual property card when data is available
    return (
      <div className="my-6 rounded-lg border border-stone bg-white p-4 shadow-sm">
        <div className="flex items-start gap-4">
          {property.image && (
            <div className="h-24 w-32 shrink-0 overflow-hidden rounded bg-gray-100">
              <img
                src={property.image}
                alt={property.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h4 className="font-serif text-lg font-medium text-clarus-navy">
              {property.name}
            </h4>
            <p className="text-sm text-slate">{property.location}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-medium text-clarus-gold">
                Score: {property.score}
              </span>
              <span className="text-xs text-slate">• Tier {property.tier}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Placeholder when property data is not available
  return (
    <div className="my-6 rounded-lg border border-dashed border-slate bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate">Property Card</p>
          <p className="text-xs text-gray-400">Slug: {slug}</p>
        </div>
        <a
          href={`/properties/${slug}`}
          className="text-sm font-medium text-clarus-navy hover:underline"
        >
          View Property →
        </a>
      </div>
    </div>
  );
}
