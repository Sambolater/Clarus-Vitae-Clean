/**
 * GET /api/diagnostics
 *
 * Retrieves a paginated list of diagnostics with optional filtering.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, DiagnosticCategory, Prisma } from '@clarus-vitae/database';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // ISR: 1 hour

type SortOption = 'alphabetical' | 'properties_desc' | 'category';

interface DiagnosticsQueryParams {
  category?: DiagnosticCategory[];
  search?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

function parseQueryParams(request: NextRequest): DiagnosticsQueryParams {
  const { searchParams } = new URL(request.url);

  const categoryParam = searchParams.get('category');

  return {
    category: categoryParam ? (categoryParam.split(',') as DiagnosticCategory[]) : undefined,
    search: searchParams.get('search') || undefined,
    sort: (searchParams.get('sort') as SortOption) || 'alphabetical',
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1,
    limit: searchParams.get('limit') ? Math.min(parseInt(searchParams.get('limit')!, 10), 50) : 12,
  };
}

function buildWhereClause(params: DiagnosticsQueryParams): Prisma.DiagnosticWhereInput {
  const where: Prisma.DiagnosticWhereInput = {
    published: true,
  };

  if (params.category && params.category.length > 0) {
    where.category = { in: params.category };
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  return where;
}

function buildOrderBy(sort: SortOption): Prisma.DiagnosticOrderByWithRelationInput | Prisma.DiagnosticOrderByWithRelationInput[] {
  switch (sort) {
    case 'alphabetical':
      return { name: 'asc' };
    case 'properties_desc':
      return { properties: { _count: 'desc' } };
    case 'category':
      return [{ category: 'asc' }, { name: 'asc' }];
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

    const [totalCount, diagnostics] = await Promise.all([
      db.diagnostic.count({ where }),
      db.diagnostic.findMany({
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
          _count: {
            select: { properties: true },
          },
        },
      }),
    ]);

    const transformedDiagnostics = diagnostics.map((diagnostic) => ({
      id: diagnostic.id,
      slug: diagnostic.slug,
      name: diagnostic.name,
      category: diagnostic.category,
      description: diagnostic.description.substring(0, 200) + (diagnostic.description.length > 200 ? '...' : ''),
      propertiesCount: diagnostic._count.properties,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      diagnostics: transformedDiagnostics,
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
    console.error('Error fetching diagnostics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diagnostics' },
      { status: 500 }
    );
  }
}
