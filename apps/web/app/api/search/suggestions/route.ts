/**
 * GET /api/search/suggestions
 *
 * Type-ahead search suggestions for the global search bar.
 * Returns top results from each category (properties, treatments, articles).
 *
 * Query Parameters:
 * - q: Partial search query (required, minimum 2 characters)
 * - limit: Results per category (default: 5, max: 10)
 *
 * Privacy Note:
 * In Research Mode, search queries are not logged. The client-side
 * implementation stores recent searches only in localStorage.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSearchSuggestions } from '@clarus-vitae/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    // Require at least 2 characters
    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = await getSearchSuggestions(query);

    // Group suggestions by type for easier rendering
    const grouped = {
      properties: suggestions.filter((s) => s.type === 'property'),
      treatments: suggestions.filter((s) => s.type === 'treatment'),
      articles: suggestions.filter((s) => s.type === 'article'),
    };

    return NextResponse.json({
      query,
      suggestions: grouped,
      totalCount:
        grouped.properties.length + grouped.treatments.length + grouped.articles.length,
    });
  } catch (error) {
    console.error('Search suggestions error:', error);

    // Check if Meilisearch is unavailable
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return NextResponse.json({ suggestions: { properties: [], treatments: [], articles: [] }, totalCount: 0 });
    }

    return NextResponse.json(
      { error: 'Failed to get suggestions' },
      { status: 500 }
    );
  }
}
