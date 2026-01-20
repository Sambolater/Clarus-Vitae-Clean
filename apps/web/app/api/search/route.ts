/**
 * GET /api/search
 *
 * Full-text search across properties, treatments, and articles.
 * Uses Meilisearch for fast, typo-tolerant search.
 *
 * Query Parameters:
 * - q: Search query (required)
 * - type: all | properties | treatments | articles (default: all)
 * - limit: Number of results per category (default: 10, max: 50)
 *
 * For type-specific filtering, use the /api/properties or /api/treatments
 * endpoints which support more filtering options.
 */

import {
  searchAll,
  searchProperties,
  searchTreatments,
  searchArticles,
} from '@clarus-vitae/database';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type SearchType = 'all' | 'properties' | 'treatments' | 'articles';

interface SearchParams {
  query: string;
  type: SearchType;
  limit: number;
}

function parseSearchParams(request: NextRequest): SearchParams | { error: string } {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('q')?.trim();
  if (!query) {
    return { error: 'Query parameter "q" is required' };
  }

  const type = (searchParams.get('type') as SearchType) || 'all';
  if (!['all', 'properties', 'treatments', 'articles'].includes(type)) {
    return { error: 'Invalid type parameter. Must be: all, properties, treatments, or articles' };
  }

  const limitParam = searchParams.get('limit');
  let limit = 10;
  if (limitParam) {
    limit = Math.min(Math.max(parseInt(limitParam, 10) || 10, 1), 50);
  }

  return { query, type, limit };
}

export async function GET(request: NextRequest) {
  try {
    const params = parseSearchParams(request);

    if ('error' in params) {
      return NextResponse.json({ error: params.error }, { status: 400 });
    }

    const { query, type, limit } = params;

    // Perform search based on type
    if (type === 'all') {
      const results = await searchAll(query, { limit });

      return NextResponse.json({
        query,
        type: 'all',
        results: {
          properties: {
            hits: results.properties.hits.map(transformPropertyHit),
            totalHits: results.properties.totalHits,
          },
          treatments: {
            hits: results.treatments.hits.map(transformTreatmentHit),
            totalHits: results.treatments.totalHits,
          },
          articles: {
            hits: results.articles.hits.map(transformArticleHit),
            totalHits: results.articles.totalHits,
          },
        },
        processingTimeMs: results.totalProcessingTimeMs,
      });
    }

    if (type === 'properties') {
      const results = await searchProperties(query, { limit });
      return NextResponse.json({
        query,
        type: 'properties',
        hits: results.hits.map(transformPropertyHit),
        totalHits: results.totalHits,
        processingTimeMs: results.processingTimeMs,
      });
    }

    if (type === 'treatments') {
      const results = await searchTreatments(query, { limit });
      return NextResponse.json({
        query,
        type: 'treatments',
        hits: results.hits.map(transformTreatmentHit),
        totalHits: results.totalHits,
        processingTimeMs: results.processingTimeMs,
      });
    }

    if (type === 'articles') {
      const results = await searchArticles(query, { limit });
      return NextResponse.json({
        query,
        type: 'articles',
        hits: results.hits.map(transformArticleHit),
        totalHits: results.totalHits,
        processingTimeMs: results.processingTimeMs,
      });
    }

    return NextResponse.json({ error: 'Invalid search type' }, { status: 400 });
  } catch (error) {
    console.error('Search error:', error);

    // Check if Meilisearch is unavailable
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { error: 'Search service temporarily unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

// ============================================================================
// Transform Functions
// ============================================================================

function transformPropertyHit(hit: {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  country: string;
  tier: string;
  overallScore: number | null;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  _formatted?: Record<string, string>;
}) {
  return {
    id: hit.id,
    slug: hit.slug,
    name: hit.name,
    description: hit._formatted?.description || hit.description,
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
  };
}

function transformTreatmentHit(hit: {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  evidenceLevel: string;
  propertyCount: number;
  _formatted?: Record<string, string>;
}) {
  return {
    id: hit.id,
    slug: hit.slug,
    name: hit.name,
    description: hit._formatted?.description || hit.description,
    category: hit.category,
    evidenceLevel: hit.evidenceLevel,
    propertyCount: hit.propertyCount,
    url: `/treatments/${hit.slug}`,
  };
}

function transformArticleHit(hit: {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  authorName: string | null;
  featuredImage: string | null;
  publishedAt: number | null;
  _formatted?: Record<string, string>;
}) {
  return {
    id: hit.id,
    slug: hit.slug,
    title: hit.title,
    excerpt: hit._formatted?.excerpt || hit.excerpt,
    category: hit.category,
    authorName: hit.authorName,
    image: hit.featuredImage,
    publishedAt: hit.publishedAt ? new Date(hit.publishedAt).toISOString() : null,
    url: `/articles/${hit.slug}`,
  };
}
