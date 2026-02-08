import { db, type TreatmentCategory, type EvidenceLevel } from '@clarus-vitae/database';
import { Container, LoadingSpinner, Breadcrumbs, Input } from '@clarus-vitae/ui';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

import {
  type TreatmentListItem,
  type TreatmentsResponse,
  type TreatmentSortOption,
} from '@/lib/treatments';

import { CategoryNav } from './_components/CategoryNav';
import { TreatmentFilters } from './_components/TreatmentFilters';
import { TreatmentGrid } from './_components/TreatmentGrid';
import { TreatmentSortAndPagination } from './_components/TreatmentSortAndPagination';


export const metadata: Metadata = {
  title: 'Treatments & Therapies Database | Clarus Vitae',
  description:
    'Explore evidence-based wellness treatments and medical therapies. Search by treatment type, evidence level, and find premium properties offering each modality.',
  openGraph: {
    title: 'Treatments & Therapies Database | Clarus Vitae',
    description:
      'Explore evidence-based wellness treatments and medical therapies. Search by treatment type, evidence level, and find premium properties offering each modality.',
    type: 'website',
  },
};

interface SearchParams {
  category?: string;
  evidenceLevel?: string;
  priceMin?: string;
  priceMax?: string;
  search?: string;
  sort?: string;
  page?: string;
}

interface TreatmentsPageProps {
  searchParams: Promise<SearchParams>;
}

// Evidence level ordering for sorting
const evidenceLevelOrder: Record<EvidenceLevel, number> = {
  STRONG: 5,
  MODERATE: 4,
  EMERGING: 3,
  EXPERIMENTAL: 2,
  TRADITIONAL: 1,
};

async function getTreatments(searchParams: SearchParams): Promise<TreatmentsResponse> {
  const categoryParam = searchParams.category;
  const evidenceParam = searchParams.evidenceLevel;

  const filters = {
    category: categoryParam ? (categoryParam.split(',') as TreatmentCategory[]) : undefined,
    evidenceLevel: evidenceParam ? (evidenceParam.split(',') as EvidenceLevel[]) : undefined,
    priceMin: searchParams.priceMin ? parseInt(searchParams.priceMin, 10) : undefined,
    priceMax: searchParams.priceMax ? parseInt(searchParams.priceMax, 10) : undefined,
    search: searchParams.search || undefined,
  };

  const sort = (searchParams.sort as TreatmentSortOption) || 'alphabetical';
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const limit = 12;

  // Build where clause
  const where: Record<string, unknown> = {
    published: true,
    // Only show treatments that have at least one property offering them
    properties: { some: {} },
  };

  if (filters.category && filters.category.length > 0) {
    where.category = { in: filters.category };
  }

  if (filters.evidenceLevel && filters.evidenceLevel.length > 0) {
    where.evidenceLevel = { in: filters.evidenceLevel };
  }

  if (filters.priceMin !== undefined) {
    where.priceRangeMin = { gte: filters.priceMin };
  }

  if (filters.priceMax !== undefined) {
    where.priceRangeMax = { lte: filters.priceMax };
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { aliases: { has: filters.search } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  // Build order by
  type OrderByInput = Record<string, 'asc' | 'desc' | { _count: 'desc' | 'asc' }>;
  let orderBy: OrderByInput;
  switch (sort) {
    case 'alphabetical':
      orderBy = { name: 'asc' };
      break;
    case 'properties_desc':
      orderBy = { properties: { _count: 'desc' } };
      break;
    case 'evidence_desc':
      // We'll sort in memory after fetching
      orderBy = { name: 'asc' };
      break;
    case 'price_asc':
      orderBy = { priceRangeMin: 'asc' };
      break;
    case 'price_desc':
      orderBy = { priceRangeMax: 'desc' };
      break;
    default:
      orderBy = { name: 'asc' };
  }

  const skip = (page - 1) * limit;

  // Execute queries
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
        imageUrl: true,
        _count: {
          select: { properties: true },
        },
      },
    }),
  ]);

  // Transform the response
  let transformedTreatments: TreatmentListItem[] = treatments.map((treatment: any) => ({
    id: treatment.id,
    slug: treatment.slug,
    name: treatment.name,
    category: treatment.category,
    description:
      treatment.description.substring(0, 200) +
      (treatment.description.length > 200 ? '...' : ''),
    evidenceLevel: treatment.evidenceLevel,
    priceRangeMin: treatment.priceRangeMin,
    priceRangeMax: treatment.priceRangeMax,
    propertiesCount: treatment._count.properties,
    imageUrl: treatment.imageUrl,
  }));

  // Sort by evidence level if needed
  if (sort === 'evidence_desc') {
    transformedTreatments = transformedTreatments.sort(
      (a, b) => (evidenceLevelOrder[b.evidenceLevel] ?? 0) - (evidenceLevelOrder[a.evidenceLevel] ?? 0)
    );
  }

  const totalPages = Math.ceil(totalCount / limit);

  return {
    treatments: transformedTreatments,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

function SearchInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <form className="relative w-full max-w-2xl">
      <Input
        type="search"
        name="search"
        placeholder="Search treatments, therapies, diagnostics..."
        defaultValue={defaultValue}
        className="w-full pr-12"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-clarus-navy"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  );
}

export default async function TreatmentsPage({ searchParams }: TreatmentsPageProps) {
  const params = await searchParams;
  const { treatments, pagination } = await getTreatments(params);

  // Get selected category for nav highlighting
  const selectedCategory = params.category && !params.category.includes(',')
    ? (params.category as TreatmentCategory)
    : undefined;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Treatments', href: '/treatments' },
  ];

  return (
    <main className="min-h-screen bg-clarus-white">
      {/* Hero Section */}
      <section className="border-b border-stone bg-white py-12">
        <Container>
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-medium text-clarus-navy md:text-5xl">
              Treatment Database
            </h1>
            <p className="mt-4 text-lg text-slate">
              Explore evidence-based wellness treatments and therapies. Find the right modality
              for your health goals and discover which properties offer each treatment.
            </p>
            {/* Search Bar */}
            <div className="mt-8 flex justify-center">
              <SearchInput defaultValue={params.search} />
            </div>
          </div>
        </Container>
      </section>

      {/* Category Navigation */}
      <section className="border-b border-stone bg-white py-4">
        <Container>
          <Suspense fallback={null}>
            <CategoryNav selectedCategory={selectedCategory} />
          </Suspense>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <Container>
          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24">
                <Suspense fallback={<LoadingSpinner />}>
                  <TreatmentFilters />
                </Suspense>
              </div>
            </aside>

            {/* Treatment Grid */}
            <div className="min-w-0 flex-1">
              {/* Sort and Pagination Controls */}
              <Suspense fallback={<LoadingSpinner size="sm" />}>
                <TreatmentSortAndPagination
                  totalCount={pagination.totalCount}
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPreviousPage={pagination.hasPreviousPage}
                />
              </Suspense>

              {/* Grid */}
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                }
              >
                <TreatmentGrid treatments={treatments} />
              </Suspense>

              {/* Bottom Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Suspense fallback={null}>
                    <TreatmentSortAndPagination
                      totalCount={pagination.totalCount}
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      hasNextPage={pagination.hasNextPage}
                      hasPreviousPage={pagination.hasPreviousPage}
                    />
                  </Suspense>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Medical Disclaimer */}
      <section className="border-t border-stone bg-warm-gray py-8">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm text-slate">
              The information provided is for educational purposes only and is not intended as
              medical advice. Individual results vary. Always consult with qualified healthcare
              providers before pursuing any treatment. Clarus Vitae does not endorse specific
              treatments or make claims about efficacy.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
