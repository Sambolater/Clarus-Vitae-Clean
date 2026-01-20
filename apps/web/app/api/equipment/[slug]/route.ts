/**
 * GET /api/equipment/[slug]
 *
 * Retrieves a single equipment item by slug with full details.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@clarus-vitae/database';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // ISR: 1 hour

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const equipment = await db.equipment.findUnique({
      where: { slug },
      include: {
        treatments: {
          include: {
            treatment: {
              select: {
                id: true,
                slug: true,
                name: true,
                category: true,
                evidenceLevel: true,
                description: true,
                published: true,
              },
            },
          },
        },
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

    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      );
    }

    // Find related equipment (same category)
    const relatedEquipment = await db.equipment.findMany({
      where: {
        category: equipment.category,
        slug: { not: slug },
      },
      take: 4,
      select: {
        id: true,
        slug: true,
        name: true,
        brand: true,
        model: true,
        category: true,
        description: true,
        _count: {
          select: { properties: true },
        },
      },
    });

    const transformedEquipment = {
      id: equipment.id,
      slug: equipment.slug,
      name: equipment.name,
      brand: equipment.brand,
      model: equipment.model,
      category: equipment.category,
      description: equipment.description,
      capabilities: equipment.capabilities,
      treatments: equipment.treatments
        .filter((te) => te.treatment?.published)
        .map((te) => ({
          id: te.treatment.id,
          slug: te.treatment.slug,
          name: te.treatment.name,
          category: te.treatment.category,
          evidenceLevel: te.treatment.evidenceLevel,
          description: te.treatment.description.substring(0, 100) + '...',
        })),
      properties: equipment.properties
        .filter((pe) => pe.property?.published)
        .map((pe) => ({
          id: pe.property.id,
          slug: pe.property.slug,
          name: pe.property.name,
          location: {
            city: pe.property.city,
            country: pe.property.country,
            region: pe.property.region,
          },
          tier: pe.property.tier,
          score: pe.property.overallScore,
          pricing: {
            min: pe.property.priceMin,
            max: pe.property.priceMax,
            currency: pe.property.currency,
          },
          installationYear: pe.installationYear,
          notes: pe.notes,
          featuredImage: pe.property.images[0] || null,
        })),
      relatedEquipment: relatedEquipment.map((re) => ({
        id: re.id,
        slug: re.slug,
        name: re.name,
        brand: re.brand,
        model: re.model,
        category: re.category,
        description: re.description.substring(0, 100) + '...',
        propertiesCount: re._count.properties,
      })),
      treatmentsCount: equipment.treatments.filter((te) => te.treatment?.published).length,
      propertiesCount: equipment.properties.filter((pe) => pe.property?.published).length,
    };

    return NextResponse.json(transformedEquipment);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 }
    );
  }
}
