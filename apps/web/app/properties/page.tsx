import { db, type PropertyTier, type FocusArea, type WellnessApproach } from '@clarus-vitae/database';
import { Container, LoadingSpinner, Breadcrumbs } from '@clarus-vitae/ui';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

import { type PropertyListItem, type PropertiesResponse } from '@/lib/properties';

import { MobileFilterDrawer } from './_components/MobileFilterDrawer';
import { PropertyFilters } from './_components/PropertyFilters';
import { PropertyGrid } from './_components/PropertyGrid';
import { SortControl, Pagination } from './_components/PropertySortAndPagination';

export const metadata: Metadata = {
  title: 'Best Wellness Retreats & Longevity Clinics | Clarus Vitae',
  description:
    "Discover the world's finest wellness destinations. Independent research on 200+ premium retreats and medical longevity clinics, rated by the Clarus Index.",
  openGraph: {
    title: 'Best Wellness Retreats & Longevity Clinics | Clarus Vitae',
    description:
      "Discover the world's finest wellness destinations. Independent research on 200+ premium retreats and medical longevity clinics, rated by the Clarus Index.",
    type: 'website',
  },
};

interface SearchParams {
  tier?: string;
  country?: string;
  approach?: string;
  focusAreas?: string;
  priceMin?: string;
  priceMax?: string;
  minScore?: string;
  verified?: string;
  editorChoice?: string;
  sort?: string;
  page?: string;
}

interface PropertiesPageProps {
  searchParams: Promise<SearchParams>;
}

type SortOption = 'score_desc' | 'score_asc' | 'price_asc' | 'price_desc' | 'newest' | 'reviews';

async function getProperties(searchParams: SearchParams): Promise<PropertiesResponse> {
  const tierParam = searchParams.tier;
  const approachParam = searchParams.approach;
  const focusAreasParam = searchParams.focusAreas;

  const filters = {
    tier: tierParam ? (tierParam.split(',') as PropertyTier[]) : undefined,
    country: searchParams.country || undefined,
    approach: approachParam ? (approachParam.split(',') as WellnessApproach[]) : undefined,
    focusAreas: focusAreasParam ? (focusAreasParam.split(',') as FocusArea[]) : undefined,
    priceMin: searchParams.priceMin ? parseInt(searchParams.priceMin, 10) : undefined,
    priceMax: searchParams.priceMax ? parseInt(searchParams.priceMax, 10) : undefined,
    minScore: searchParams.minScore ? parseInt(searchParams.minScore, 10) : undefined,
    verifiedOnly: searchParams.verified === 'true',
    editorChoiceOnly: searchParams.editorChoice === 'true',
  };

  const sort = (searchParams.sort as SortOption) || 'score_desc';
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const limit = 12;

  // Build where clause
  const where: Record<string, unknown> = {
    published: true,
  };

  if (filters.tier && filters.tier.length > 0) {
    where.tier = { in: filters.tier };
  }

  if (filters.country) {
    where.country = filters.country;
  }

  if (filters.approach && filters.approach.length > 0) {
    where.approach = { in: filters.approach };
  }

  if (filters.focusAreas && filters.focusAreas.length > 0) {
    where.focusAreas = { hasSome: filters.focusAreas };
  }

  if (filters.priceMin !== undefined) {
    where.priceMin = { gte: filters.priceMin };
  }

  if (filters.priceMax !== undefined) {
    where.priceMax = { lte: filters.priceMax };
  }

  if (filters.minScore !== undefined) {
    where.overallScore = { gte: filters.minScore };
  }

  if (filters.verifiedOnly) {
    where.verifiedExcellence = true;
  }

  if (filters.editorChoiceOnly) {
    where.editorChoice = { not: null };
  }

  // Build order by
  type OrderByInput = Record<string, 'asc' | 'desc' | { _count: 'desc' | 'asc' }>;
  let orderBy: OrderByInput;
  switch (sort) {
    case 'score_desc':
      orderBy = { overallScore: 'desc' };
      break;
    case 'score_asc':
      orderBy = { overallScore: 'asc' };
      break;
    case 'price_asc':
      orderBy = { priceMin: 'asc' };
      break;
    case 'price_desc':
      orderBy = { priceMax: 'desc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'reviews':
      orderBy = { reviews: { _count: 'desc' } };
      break;
    default:
      orderBy = { overallScore: 'desc' };
  }

  const skip = (page - 1) * limit;

  // Execute queries
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
  const transformedProperties: PropertyListItem[] = properties.map((property: any) => ({
    id: property.id,
    slug: property.slug,
    name: property.name,
    description:
      property.description.substring(0, 200) +
      (property.description.length > 200 ? '...' : ''),
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

  return {
    properties: transformedProperties,
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

function countActiveFilters(searchParams: SearchParams): number {
  let count = 0;
  if (searchParams.tier) count++;
  if (searchParams.country) count++;
  if (searchParams.approach) count++;
  if (searchParams.focusAreas) count++;
  if (searchParams.priceMin || searchParams.priceMax) count++;
  if (searchParams.minScore) count++;
  if (searchParams.verified === 'true') count++;
  if (searchParams.editorChoice === 'true') count++;
  return count;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const { properties, pagination } = await getProperties(params);
  const activeFiltersCount = countActiveFilters(params);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Retreats', href: '/properties' },
  ];

  return (
    <main className="min-h-screen bg-clarus-white">
      {/* Hero Section */}
      <section className="border-b border-stone bg-white py-12">
        <Container>
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-medium text-clarus-navy md:text-5xl">
              Wellness Retreats
            </h1>
            <p className="mt-4 text-lg text-slate">
              Discover the world&apos;s finest wellness destinations, independently
              evaluated using the Clarus Index methodology.
            </p>
          </div>
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
                  <PropertyFilters />
                </Suspense>
              </div>
            </aside>

            {/* Property Grid */}
            <div className="min-w-0 flex-1">
              {/* Mobile Filter Button & Sort */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Suspense fallback={null}>
                    <MobileFilterDrawer activeFiltersCount={activeFiltersCount} />
                  </Suspense>
                </div>
                <Suspense fallback={<LoadingSpinner size="sm" />}>
                  <SortControl totalCount={pagination.totalCount} />
                </Suspense>
              </div>

              {/* Grid */}
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                }
              >
                <PropertyGrid properties={properties} />
              </Suspense>

              {/* Pagination */}
              <div className="mt-8">
                <Suspense fallback={null}>
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    hasNextPage={pagination.hasNextPage}
                    hasPreviousPage={pagination.hasPreviousPage}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
