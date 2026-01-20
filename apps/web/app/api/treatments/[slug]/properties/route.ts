/**
 * GET /api/treatments/[slug]/properties
 *
 * Retrieves a paginated list of properties that offer a specific treatment.
 * Supports filtering by country, tier, and price range.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, PropertyTier, Prisma } from '@clarus-vitae/database';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // ISR: 1 hour

interface PropertiesQueryParams {
  country?: string;
  tier?: PropertyTier[];
  priceMin?: number;
  priceMax?: number;
  page?: number;
  limit?: number;
}

function parseQueryParams(request: NextRequest): PropertiesQueryParams {
  const { searchParams } = new URL(request.url);

  const tierParam = searchParams.get('tier');

  return {
    country: searchParams.get('country') || undefined,
    tier: tierParam ? (tierParam.split(',') as PropertyTier[]) : undefined,
    priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!, 10) : undefined,
    priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!, 10) : undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1,
    limit: searchParams.get('limit') ? Math.min(parseInt(searchParams.get('limit')!, 10), 50) : 12,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const queryParams = parseQueryParams(request);

    // First, find the treatment
    const treatment = await db.treatment.findUnique({
      where: { slug },
      select: { id: true, published: true },
    });

    if (!treatment || !treatment.published) {
      return NextResponse.json(
        { error: 'Treatment not found' },
        { status: 404 }
      );
    }

    // Build property filter conditions
    const propertyWhere: Prisma.PropertyWhereInput = {
      published: true,
    };

    if (queryParams.country) {
      propertyWhere.country = queryParams.country;
    }

    if (queryParams.tier && queryParams.tier.length > 0) {
      propertyWhere.tier = { in: queryParams.tier };
    }

    if (queryParams.priceMin !== undefined) {
      propertyWhere.priceMin = { gte: queryParams.priceMin };
    }

    if (queryParams.priceMax !== undefined) {
      propertyWhere.priceMax = { lte: queryParams.priceMax };
    }

    const page = queryParams.page || 1;
    const limit = queryParams.limit || 12;
    const skip = (page - 1) * limit;

    // Get count and properties in parallel
    const [totalCount, propertyTreatments] = await Promise.all([
      db.propertyTreatment.count({
        where: {
          treatmentId: treatment.id,
          property: propertyWhere,
        },
      }),
      db.propertyTreatment.findMany({
        where: {
          treatmentId: treatment.id,
          property: propertyWhere,
        },
        skip,
        take: limit,
        orderBy: {
          property: {
            overallScore: 'desc',
          },
        },
        include: {
          property: {
            select: {
              id: true,
              slug: true,
              name: true,
              city: true,
              country: true,
              region: true,
              tier: true,
              overallScore: true,
              priceMin: true,
              priceMax: true,
              currency: true,
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
            },
          },
        },
      }),
    ]);

    // Transform the response
    const transformedProperties = propertyTreatments.map((pt) => ({
      id: pt.property.id,
      slug: pt.property.slug,
      name: pt.property.name,
      location: {
        city: pt.property.city,
        country: pt.property.country,
        region: pt.property.region,
      },
      tier: pt.property.tier,
      score: pt.property.overallScore,
      pricing: {
        min: pt.property.priceMin,
        max: pt.property.priceMax,
        currency: pt.property.currency,
      },
      priceAtProperty: pt.priceAtProperty,
      notes: pt.notes,
      badges: {
        verifiedExcellence: pt.property.verifiedExcellence,
        editorChoice: pt.property.editorChoice,
        risingStar: pt.property.risingStar,
      },
      featuredImage: pt.property.images[0] || null,
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
    console.error('Error fetching treatment properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
