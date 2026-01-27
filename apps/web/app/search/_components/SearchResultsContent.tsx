/**
 * SearchResultsContent Component
 *
 * Server-side rendered search results with tabs and filtering.
 * Falls back to database search when Meilisearch is unavailable.
 */

import { db } from '@clarus-vitae/database';
import { EmptyState, Alert } from '@clarus-vitae/ui';
import Link from 'next/link';

import { SearchResultsList } from './SearchResultsList';

interface SearchResultsContentProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

// Database fallback search
async function databaseSearch(query: string, limit: number = 20) {
  const [properties, treatments] = await Promise.all([
    db.property.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
          { country: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        city: true,
        country: true,
        tier: true,
        overallScore: true,
        images: {
          where: { isFeatured: true },
          take: 1,
          select: { url: true, alt: true },
        },
      },
      orderBy: { overallScore: 'desc' },
      take: limit,
    }),
    db.treatment.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        category: true,
        evidenceLevel: true,
        _count: { select: { properties: true } },
      },
      orderBy: { name: 'asc' },
      take: limit,
    }),
  ]);

  return {
    properties: properties.map((p: typeof properties[number]) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description ? p.description.substring(0, 200) + (p.description.length > 200 ? '...' : '') : '',
      location: { city: p.city, country: p.country },
      tier: p.tier,
      score: p.overallScore,
      image: p.images[0] || null,
      url: `/properties/${p.slug}`,
    })),
    treatments: treatments.map((t: typeof treatments[number]) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      description: t.description ? t.description.substring(0, 200) + (t.description.length > 200 ? '...' : '') : '',
      category: t.category,
      evidenceLevel: t.evidenceLevel,
      propertyCount: t._count.properties,
      url: `/treatments/${t.slug}`,
    })),
    articles: [] as Array<{
      id: string;
      slug: string;
      title: string;
      excerpt: string | null;
      category: string;
      authorName: string | null;
      image: string | null;
      publishedAt: string | null;
      url: string;
    }>,
  };
}

export async function SearchResultsContent({ searchParams }: SearchResultsContentProps) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  const type = typeof searchParams.type === 'string' ? searchParams.type : 'all';

  if (!query) {
    return null;
  }

  try {
    // Use database search directly (Meilisearch not configured on Vercel)
    const results = await databaseSearch(query, 20);

    const totalCount =
      results.properties.length +
      results.treatments.length +
      results.articles.length;

    if (totalCount === 0) {
      return (
        <EmptyState
          title="No results found"
          description={`We couldn't find any results for "${query}". Try a different search term or browse our properties and treatments.`}
          action={
            <Link
              href="/properties"
              className="inline-flex h-12 items-center justify-center rounded-md bg-clarus-navy px-8 text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
            >
              Browse Properties
            </Link>
          }
          className="py-20"
        />
      );
    }

    const counts = {
      all: totalCount,
      properties: results.properties.length,
      treatments: results.treatments.length,
      articles: results.articles.length,
    };

    return (
      <div>
        <p className="mb-6 text-sm text-slate">
          Found {totalCount} results for &ldquo;{query}&rdquo;
        </p>

        <SearchResultsList
          results={results}
          counts={counts}
          initialType={type}
        />
      </div>
    );
  } catch (error) {
    console.error('Search error:', error);

    return (
      <Alert
        variant="error"
        title="Search failed"
        className="my-8"
      >
        An error occurred while searching. Please try again or{' '}
        <Link href="/properties" className="underline">browse properties directly</Link>.
      </Alert>
    );
  }
}
