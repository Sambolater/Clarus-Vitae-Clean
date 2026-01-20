/**
 * GET /api/diagnostics/[slug]
 *
 * Retrieves a single diagnostic by slug with full details.
 */

import { db } from '@clarus-vitae/database';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // ISR: 1 hour

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const diagnostic = await db.diagnostic.findUnique({
      where: { slug },
      include: {
        properties: {
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
                published: true,
                images: {
                  where: { isFeatured: true },
                  take: 1,
                  select: {
                    url: true,
                    alt: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!diagnostic) {
      return NextResponse.json(
        { error: 'Diagnostic not found' },
        { status: 404 }
      );
    }

    if (!diagnostic.published) {
      return NextResponse.json(
        { error: 'Diagnostic not available' },
        { status: 404 }
      );
    }

    // Find related diagnostics (same category)
    const relatedDiagnostics = await db.diagnostic.findMany({
      where: {
        category: diagnostic.category,
        slug: { not: slug },
        published: true,
      },
      take: 4,
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        description: true,
        _count: {
          select: { properties: true },
        },
      },
    });

    const transformedDiagnostic = {
      id: diagnostic.id,
      slug: diagnostic.slug,
      name: diagnostic.name,
      category: diagnostic.category,
      description: diagnostic.description,
      whatItMeasures: diagnostic.whatItMeasures,
      properties: diagnostic.properties
        .filter((pd) => pd.property?.published)
        .map((pd) => ({
          id: pd.property.id,
          slug: pd.property.slug,
          name: pd.property.name,
          location: {
            city: pd.property.city,
            country: pd.property.country,
            region: pd.property.region,
          },
          tier: pd.property.tier,
          score: pd.property.overallScore,
          pricing: {
            min: pd.property.priceMin,
            max: pd.property.priceMax,
            currency: pd.property.currency,
          },
          notes: pd.notes,
          featuredImage: pd.property.images[0] || null,
        })),
      relatedDiagnostics: relatedDiagnostics.map((rd) => ({
        id: rd.id,
        slug: rd.slug,
        name: rd.name,
        category: rd.category,
        description: rd.description.substring(0, 100) + '...',
        propertiesCount: rd._count.properties,
      })),
      propertiesCount: diagnostic.properties.filter((pd) => pd.property?.published).length,
    };

    return NextResponse.json(transformedDiagnostic);
  } catch (error) {
    console.error('Error fetching diagnostic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diagnostic' },
      { status: 500 }
    );
  }
}
