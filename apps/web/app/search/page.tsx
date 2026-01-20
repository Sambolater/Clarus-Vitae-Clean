/**
 * Search Results Page
 *
 * Displays search results across properties, treatments, and articles.
 * Supports filtering and pagination.
 */

import { Container, Breadcrumbs, LoadingSpinner, EmptyState } from '@clarus-vitae/ui';
import { type Metadata } from 'next';
import { Suspense } from 'react';

import { SearchHeader } from './_components/SearchHeader';
import { SearchResultsContent } from './_components/SearchResultsContent';

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';

  return {
    title: query ? `Search: ${query}` : 'Search',
    description: query
      ? `Search results for "${query}" - Find wellness properties, treatments, and articles.`
      : 'Search the Clarus Vitae database of premium wellness properties, treatments, and articles.',
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';

  return (
    <main className="min-h-screen bg-clarus-white">
      <Container className="py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Search', href: '/search' },
          ]}
          className="mb-6"
        />

        {/* Search Header */}
        <SearchHeader initialQuery={query} />

        {/* Results */}
        {query ? (
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            }
          >
            <SearchResultsContent searchParams={searchParams} />
          </Suspense>
        ) : (
          <EmptyState
            title="Enter a search term"
            description="Search for wellness properties, treatments, or articles to get started."
            className="py-20"
          />
        )}
      </Container>
    </main>
  );
}
