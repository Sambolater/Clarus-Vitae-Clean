/**
 * GET /api/treatments/[slug]
 *
 * Retrieves a single treatment by slug with full details including
 * properties that offer this treatment and related equipment.
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

    const treatment = await db.treatment.findUnique({
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
        equipment: {
          include: {
            equipment: {
              select: {
                id: true,
                slug: true,
                name: true,
                brand: true,
                model: true,
                category: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!treatment) {
      return NextResponse.json(
        { error: 'Treatment not found' },
        { status: 404 }
      );
    }

    if (!treatment.published) {
      return NextResponse.json(
        { error: 'Treatment not available' },
        { status: 404 }
      );
    }

    // Find related treatments (same category, excluding current)
    const relatedTreatments = await db.treatment.findMany({
      where: {
        category: treatment.category,
        slug: { not: slug },
        published: true,
      },
      take: 4,
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        evidenceLevel: true,
        description: true,
        _count: {
          select: { properties: true },
        },
      },
    });

    // Transform the response
    const transformedTreatment = {
      id: treatment.id,
      slug: treatment.slug,
      name: treatment.name,
      aliases: treatment.aliases,
      category: treatment.category,
      description: treatment.description,
      howItWorks: treatment.howItWorks,
      whatItAddresses: treatment.whatItAddresses,
      evidenceLevel: treatment.evidenceLevel,
      evidenceSummary: treatment.evidenceSummary,
      typicalProtocol: treatment.typicalProtocol,
      priceRangeMin: treatment.priceRangeMin,
      priceRangeMax: treatment.priceRangeMax,
      potentialRisks: treatment.potentialRisks,
      contraindications: treatment.contraindications,
      properties: treatment.properties
        .filter((pt) => pt.property)
        .map((pt) => ({
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
          featuredImage: pt.property.images[0] || null,
        })),
      equipment: treatment.equipment.map((te) => ({
        id: te.equipment.id,
        slug: te.equipment.slug,
        name: te.equipment.name,
        brand: te.equipment.brand,
        model: te.equipment.model,
        category: te.equipment.category,
        description: te.equipment.description.substring(0, 150) + '...',
      })),
      relatedTreatments: relatedTreatments.map((rt) => ({
        id: rt.id,
        slug: rt.slug,
        name: rt.name,
        category: rt.category,
        evidenceLevel: rt.evidenceLevel,
        description: rt.description.substring(0, 100) + '...',
        propertiesCount: rt._count.properties,
      })),
      propertiesCount: treatment.properties.length,
    };

    return NextResponse.json(transformedTreatment);
  } catch (error) {
    console.error('Error fetching treatment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch treatment' },
      { status: 500 }
    );
  }
}
