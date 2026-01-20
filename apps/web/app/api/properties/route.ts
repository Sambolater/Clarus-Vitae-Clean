/**
 * GET /api/properties
 *
 * Retrieves a paginated list of properties with optional filtering and sorting.
 * All filters are applied via query parameters.
 */

import { db, type PropertyTier, type WellnessApproach, type FocusArea, type Prisma } from '@clarus-vitae/database';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // ISR: 1 hour

// Valid sort options
type SortOption = 'score_desc' | 'score_asc' | 'price_asc' | 'price_desc' | 'newest' | 'reviews';

interface PropertiesQueryParams {
  tier?: PropertyTier[];
  country?: string;
  region?: string;
  approach?: WellnessApproach[];
  focusAreas?: FocusArea[];
  priceMin?: number;
  priceMax?: number;
  minScore?: number;
  verifiedOnly?: boolean;
  editorChoiceOnly?: boolean;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

function parseQueryParams(request: NextRequest): PropertiesQueryParams {
  const { searchParams } = new URL(request.url);

  const tierParam = searchParams.get('tier');
  const approachParam = searchParams.get('approach');
  const focusAreasParam = searchParams.get('focusAreas');

  return {
    tier: tierParam ? (tierParam.split(',') as PropertyTier[]) : undefined,
    country: searchParams.get('country') || undefined,
    region: searchParams.get('region') || undefined,
    approach: approachParam ? (approachParam.split(',') as WellnessApproach[]) : undefined,
    focusAreas: focusAreasParam ? (focusAreasParam.split(',') as FocusArea[]) : undefined,
    priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!, 10) : undefined,
    priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!, 10) : undefined,
    minScore: searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!, 10) : undefined,
    verifiedOnly: searchParams.get('verified') === 'true',
    editorChoiceOnly: searchParams.get('editorChoice') === 'true',
    sort: (searchParams.get('sort') as SortOption) || 'score_desc',
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1,
    limit: searchParams.get('limit') ? Math.min(parseInt(searchParams.get('limit')!, 10), 50) : 12,
  };
}

function buildWhereClause(params: PropertiesQueryParams): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {
    published: true,
  };

  if (params.tier && params.tier.length > 0) {
    where.tier = { in: params.tier };
  }

  if (params.country) {
    where.country = params.country;
  }

  if (params.region) {
    where.region = params.region;
  }

  if (params.approach && params.approach.length > 0) {
    where.approach = { in: params.approach };
  }

  if (params.focusAreas && params.focusAreas.length > 0) {
    where.focusAreas = { hasSome: params.focusAreas };
  }

  if (params.priceMin !== undefined) {
    where.priceMin = { gte: params.priceMin };
  }

  if (params.priceMax !== undefined) {
    where.priceMax = { lte: params.priceMax };
  }

  if (params.minScore !== undefined) {
    where.overallScore = { gte: params.minScore };
  }

  if (params.verifiedOnly) {
    where.verifiedExcellence = true;
  }

  if (params.editorChoiceOnly) {
    where.editorChoice = { not: null };
  }

  return where;
}

function buildOrderBy(sort: SortOption): Prisma.PropertyOrderByWithRelationInput {
  switch (sort) {
    case 'score_desc':
      return { overallScore: 'desc' };
    case 'score_asc':
      return { overallScore: 'asc' };
    case 'price_asc':
      return { priceMin: 'asc' };
    case 'price_desc':
      return { priceMax: 'desc' };
    case 'newest':
      return { createdAt: 'desc' };
    case 'reviews':
      return { reviews: { _count: 'desc' } };
    default:
      return { overallScore: 'desc' };
  }
}

export async function GET(request: NextRequest) {
  try {
    const params = parseQueryParams(request);
    const where = buildWhereClause(params);
    const orderBy = buildOrderBy(params.sort!);

    const page = params.page || 1;
    const limit = params.limit || 12;
    const skip = (page - 1) * limit;

    // Execute count and data queries in parallel
    const [totalCount, properties] = await Promise.all([
      db.property.count({ where }),
      db.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          city: true,
          country: true,
          region: true,
          tier: true,
          approach: true,
          focusAreas: true,
          priceMin: true,
          priceMax: true,
          currency: true,
          overallScore: true,
          verifiedExcellence: true,
          editorChoice: true,
          risingStar: true,
          images: {
            where: { isFeatured: true },
            take: 1,
            select: {
              url: true,
              alt: true,
              width: true,
              height: true,
            },
          },
          _count: {
            select: { reviews: true },
          },
        },
      }),
    ]);

    // Transform the response
    const transformedProperties = properties.map((property: any) => ({
      id: property.id,
      slug: property.slug,
      name: property.name,
      description: property.description.substring(0, 200) + (property.description.length > 200 ? '...' : ''),
      location: {
        city: property.city,
        country: property.country,
        region: property.region,
      },
      tier: property.tier,
      approach: property.approach,
      focusAreas: property.focusAreas,
      pricing: {
        min: property.priceMin,
        max: property.priceMax,
        currency: property.currency,
      },
      score: property.overallScore,
      badges: {
        verifiedExcellence: property.verifiedExcellence,
        editorChoice: property.editorChoice,
        risingStar: property.risingStar,
      },
      featuredImage: property.images[0] || null,
      reviewCount: property._count.reviews,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      properties: transformedProperties,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
