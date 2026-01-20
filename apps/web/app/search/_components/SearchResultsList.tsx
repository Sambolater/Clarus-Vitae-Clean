/**
 * SearchResultsList Component
 *
 * Client component for displaying search results with tabs.
 */

'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

import {
  ResultTabs,
  PropertyResultCard,
  TreatmentResultCard,
  ArticleResultCard,
  type PropertyResult,
  type TreatmentResult,
  type ArticleResult,
  type SearchType,
} from '@/components/search';

interface SearchResultsListProps {
  results: {
    properties: PropertyResult[];
    treatments: TreatmentResult[];
    articles: ArticleResult[];
  };
  counts: {
    all: number;
    properties: number;
    treatments: number;
    articles: number;
  };
  initialType: string;
}

export function SearchResultsList({ results, counts, initialType }: SearchResultsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeType = (
    ['all', 'properties', 'treatments', 'articles'].includes(initialType)
      ? initialType
      : 'all'
  ) as SearchType;

  const handleTypeChange = useCallback(
    (type: SearchType) => {
      const params = new URLSearchParams(searchParams.toString());
      if (type === 'all') {
        params.delete('type');
      } else {
        params.set('type', type);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const renderResults = () => {
    switch (activeType) {
      case 'properties':
        return (
          <div className="space-y-4">
            {results.properties.map((property) => (
              <PropertyResultCard key={property.id} result={property} />
            ))}
            {results.properties.length === 0 && (
              <p className="py-8 text-center text-slate">No properties found.</p>
            )}
          </div>
        );

      case 'treatments':
        return (
          <div className="space-y-4">
            {results.treatments.map((treatment) => (
              <TreatmentResultCard key={treatment.id} result={treatment} />
            ))}
            {results.treatments.length === 0 && (
              <p className="py-8 text-center text-slate">No treatments found.</p>
            )}
          </div>
        );

      case 'articles':
        return (
          <div className="space-y-4">
            {results.articles.map((article) => (
              <ArticleResultCard key={article.id} result={article} />
            ))}
            {results.articles.length === 0 && (
              <p className="py-8 text-center text-slate">No articles found.</p>
            )}
          </div>
        );

      case 'all':
      default:
        return (
          <div className="space-y-8">
            {/* Properties Section */}
            {results.properties.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl font-medium text-clarus-navy">
                    Properties
                  </h2>
                  {counts.properties > results.properties.length && (
                    <button
                      type="button"
                      onClick={() => handleTypeChange('properties')}
                      className="text-sm font-medium text-clarus-navy hover:underline"
                    >
                      View all {counts.properties} properties
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {results.properties.slice(0, 3).map((property) => (
                    <PropertyResultCard key={property.id} result={property} />
                  ))}
                </div>
              </section>
            )}

            {/* Treatments Section */}
            {results.treatments.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl font-medium text-clarus-navy">
                    Treatments
                  </h2>
                  {counts.treatments > results.treatments.length && (
                    <button
                      type="button"
                      onClick={() => handleTypeChange('treatments')}
                      className="text-sm font-medium text-clarus-navy hover:underline"
                    >
                      View all {counts.treatments} treatments
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {results.treatments.slice(0, 3).map((treatment) => (
                    <TreatmentResultCard key={treatment.id} result={treatment} />
                  ))}
                </div>
              </section>
            )}

            {/* Articles Section */}
            {results.articles.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl font-medium text-clarus-navy">
                    Articles
                  </h2>
                  {counts.articles > results.articles.length && (
                    <button
                      type="button"
                      onClick={() => handleTypeChange('articles')}
                      className="text-sm font-medium text-clarus-navy hover:underline"
                    >
                      View all {counts.articles} articles
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {results.articles.slice(0, 3).map((article) => (
                    <ArticleResultCard key={article.id} result={article} />
                  ))}
                </div>
              </section>
            )}
          </div>
        );
    }
  };

  return (
    <div>
      <ResultTabs activeTab={activeType} onChange={handleTypeChange} counts={counts} />
      <div className="mt-6">{renderResults()}</div>
    </div>
  );
}
