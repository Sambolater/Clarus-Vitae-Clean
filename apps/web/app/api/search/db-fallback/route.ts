/**
 * Database Fallback Search API
 * 
 * Simple database-based search when Meilisearch is unavailable.
 * Uses Prisma's contains/search for basic text matching.
 */

import { db } from '@clarus-vitae/database';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();
    const type = searchParams.get('type') || 'all';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    const results: {
      properties: unknown[];
      treatments: unknown[];
      articles: unknown[];
    } = {
      properties: [],
      treatments: [],
      articles: [],
    };

    // Search properties
    if (type === 'all' || type === 'properties') {
      const properties = await db.property.findMany({
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
      });

      results.properties = properties.map((p: typeof properties[number]) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description?.slice(0, 200) + '...',
        location: { city: p.city, country: p.country },
        tier: p.tier,
        score: p.overallScore,
        image: p.images[0] || null,
        url: `/properties/${p.slug}`,
      }));
    }

    // Search treatments
    if (type === 'all' || type === 'treatments') {
      const treatments = await db.treatment.findMany({
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
      });

      results.treatments = treatments.map((t: typeof treatments[number]) => ({
        id: t.id,
        slug: t.slug,
        name: t.name,
        description: t.description?.slice(0, 200) + '...',
        category: t.category,
        evidenceLevel: t.evidenceLevel,
        propertyCount: t._count.properties,
        url: `/treatments/${t.slug}`,
      }));
    }

    return NextResponse.json({
      query,
      type,
      results: type === 'all' ? {
        properties: { hits: results.properties, totalHits: results.properties.length },
        treatments: { hits: results.treatments, totalHits: results.treatments.length },
        articles: { hits: results.articles, totalHits: 0 },
      } : type === 'properties' ? {
        hits: results.properties,
        totalHits: results.properties.length,
      } : {
        hits: results.treatments,
        totalHits: results.treatments.length,
      },
      processingTimeMs: 0,
      fallback: true,
    });
  } catch (error) {
    console.error('DB Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
