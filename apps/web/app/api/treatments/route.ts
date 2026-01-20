/**
 * GET /api/treatments
 *
 * Retrieves a paginated list of treatments with optional filtering and sorting.
 * Supports filtering by category, evidence level, price range, and search.
 */

import { db, type TreatmentCategory, type EvidenceLevel, type Prisma } from '@clarus-vitae/database';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // ISR: 1 hour

// Valid sort options
type SortOption = 'alphabetical' | 'properties_desc' | 'evidence_desc' | 'price_asc' | 'price_desc';

interface TreatmentsQueryParams {
  category?: TreatmentCategory[];
  evidenceLevel?: EvidenceLevel[];
  priceMin?: number;
  priceMax?: number;
  search?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

function parseQueryParams(request: NextRequest): TreatmentsQueryParams {
  const { searchParams } = new URL(request.url);

  const categoryParam = searchParams.get('category');
  const evidenceLevelParam = searchParams.get('evidenceLevel');

  return {
    category: categoryParam ? (categoryParam.split(',') as TreatmentCategory[]) : undefined,
    evidenceLevel: evidenceLevelParam ? (evidenceLevelParam.split(',') as EvidenceLevel[]) : undefined,
    priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!, 10) : undefined,
    priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!, 10) : undefined,
    search: searchParams.get('search') || undefined,
    sort: (searchParams.get('sort') as SortOption) || 'alphabetical',
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1,
    limit: searchParams.get('limit') ? Math.min(parseInt(searchParams.get('limit')!, 10), 50) : 12,
  };
}

function buildWhereClause(params: TreatmentsQueryParams): Prisma.TreatmentWhereInput {
  const where: Prisma.TreatmentWhereInput = {
    published: true,
  };

  if (params.category && params.category.length > 0) {
    where.category = { in: params.category };
  }

  if (params.evidenceLevel && params.evidenceLevel.length > 0) {
    where.evidenceLevel = { in: params.evidenceLevel };
  }

  if (params.priceMin !== undefined) {
    where.priceRangeMin = { gte: params.priceMin };
  }

  if (params.priceMax !== undefined) {
    where.priceRangeMax = { lte: params.priceMax };
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { aliases: { has: params.search } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  return where;
}

// Evidence level ordering for sorting
const evidenceLevelOrder: Record<EvidenceLevel, number> = {
  STRONG: 5,
  MODERATE: 4,
  EMERGING: 3,
  EXPERIMENTAL: 2,
  TRADITIONAL: 1,
};

function buildOrderBy(sort: SortOption): Prisma.TreatmentOrderByWithRelationInput | Prisma.TreatmentOrderByWithRelationInput[] {
  switch (sort) {
    case 'alphabetical':
      return { name: 'asc' };
    case 'properties_desc':
      return { properties: { _count: 'desc' } };
    case 'evidence_desc':
      // Sort by evidence level strength - we'll handle this specially
      return { evidenceLevel: 'asc' };
    case 'price_asc':
      return { priceRangeMin: 'asc' };
    case 'price_desc':
      return { priceRangeMax: 'desc' };
    default:
      return { name: 'asc' };
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
    const [totalCount, treatments] = await Promise.all([
      db.treatment.count({ where }),
      db.treatment.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          name: true,
          category: true,
          description: true,
          evidenceLevel: true,
          priceRangeMin: true,
          priceRangeMax: true,
          _count: {
            select: { properties: true },
          },
        },
      }),
    ]);

    // Transform and potentially re-sort if evidence level sort
    let transformedTreatments = treatments.map((treatment: any) => ({
      id: treatment.id,
      slug: treatment.slug,
      name: treatment.name,
      category: treatment.category,
      description: treatment.description.substring(0, 200) + (treatment.description.length > 200 ? '...' : ''),
      evidenceLevel: treatment.evidenceLevel,
      priceRangeMin: treatment.priceRangeMin,
      priceRangeMax: treatment.priceRangeMax,
      propertiesCount: treatment._count.properties,
    }));

    // Re-sort for evidence level (since Prisma can't sort by enum value directly)
    if (params.sort === 'evidence_desc') {
      transformedTreatments = transformedTreatments.sort(
        (a: { evidenceLevel: EvidenceLevel }, b: { evidenceLevel: EvidenceLevel }) =>
          (evidenceLevelOrder[b.evidenceLevel] ?? 0) - (evidenceLevelOrder[a.evidenceLevel] ?? 0)
      );
    }

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      treatments: transformedTreatments,
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
    console.error('Error fetching treatments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch treatments' },
      { status: 500 }
    );
  }
}
