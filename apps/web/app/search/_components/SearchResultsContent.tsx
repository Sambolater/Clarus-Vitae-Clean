/**
 * SearchResultsContent Component
 *
 * Server-side rendered search results with tabs and filtering.
 */

import { searchAll } from '@clarus-vitae/database';
import { EmptyState, Alert } from '@clarus-vitae/ui';

import { SearchResultsList } from './SearchResultsList';

interface SearchResultsContentProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function SearchResultsContent({ searchParams }: SearchResultsContentProps) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  const type = typeof searchParams.type === 'string' ? searchParams.type : 'all';

  if (!query) {
    return null;
  }

  try {
    const results = await searchAll(query, { limit: 20 });

    const totalCount =
      results.properties.totalHits +
      results.treatments.totalHits +
      results.articles.totalHits;

    if (totalCount === 0) {
      return (
        <EmptyState
          title="No results found"
          description={`We couldn't find any results for "${query}". Try a different search term or browse our properties and treatments.`}
          action={{
            label: 'Browse Properties',
            href: '/properties',
          }}
          className="py-20"
        />
      );
    }

    // Transform results for the client component
    const transformedResults = {
      properties: results.properties.hits.map((hit) => ({
        id: hit.id,
        slug: hit.slug,
        name: hit.name,
        description: hit.description.substring(0, 200) + (hit.description.length > 200 ? '...' : ''),
        location: {
          city: hit.city,
          country: hit.country,
        },
        tier: hit.tier,
        score: hit.overallScore,
        image: hit.featuredImageUrl
          ? {
              url: hit.featuredImageUrl,
              alt: hit.featuredImageAlt,
            }
          : null,
        url: `/properties/${hit.slug}`,
      })),
      treatments: results.treatments.hits.map((hit) => ({
        id: hit.id,
        slug: hit.slug,
        name: hit.name,
        description: hit.description.substring(0, 200) + (hit.description.length > 200 ? '...' : ''),
        category: hit.category,
        evidenceLevel: hit.evidenceLevel,
        propertyCount: hit.propertyCount,
        url: `/treatments/${hit.slug}`,
      })),
      articles: results.articles.hits.map((hit) => ({
        id: hit.id,
        slug: hit.slug,
        title: hit.title,
        excerpt: hit.excerpt,
        category: hit.category,
        authorName: hit.authorName,
        image: hit.featuredImage,
        publishedAt: hit.publishedAt ? new Date(hit.publishedAt).toISOString() : null,
        url: `/articles/${hit.slug}`,
      })),
    };

    const counts = {
      all: totalCount,
      properties: results.properties.totalHits,
      treatments: results.treatments.totalHits,
      articles: results.articles.totalHits,
    };

    return (
      <div>
        <p className="mb-6 text-sm text-slate">
          Found {totalCount} results for &ldquo;{query}&rdquo; in {results.totalProcessingTimeMs}ms
        </p>

        <SearchResultsList
          results={transformedResults}
          counts={counts}
          initialType={type}
        />
      </div>
    );
  } catch (error) {
    console.error('Search error:', error);

    // Check if Meilisearch is unavailable
    const isMeilisearchError =
      error instanceof Error && error.message.includes('ECONNREFUSED');

    return (
      <Alert
        variant="error"
        title={isMeilisearchError ? 'Search service unavailable' : 'Search failed'}
        className="my-8"
      >
        {isMeilisearchError
          ? 'The search service is temporarily unavailable. Please try again later or browse our properties directly.'
          : 'An error occurred while searching. Please try again.'}
      </Alert>
    );
  }
}
