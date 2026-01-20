import { db, type DiagnosticCategory } from '@clarus-vitae/database';
import { Container, Breadcrumbs, EmptyState } from '@clarus-vitae/ui';
import type { Metadata } from 'next';
import Link from 'next/link';

import { diagnosticCategoryLabels } from '@/lib/treatments';

export const metadata: Metadata = {
  title: 'Diagnostics & Testing Database | Clarus Vitae',
  description:
    'Explore advanced diagnostic tests and health assessments. From full-body MRI to genetic testing, find where to access the latest diagnostic technologies.',
  openGraph: {
    title: 'Diagnostics & Testing Database | Clarus Vitae',
    description:
      'Explore advanced diagnostic tests and health assessments. From full-body MRI to genetic testing, find where to access the latest diagnostic technologies.',
    type: 'website',
  },
};

interface SearchParams {
  category?: string;
  page?: string;
}

interface DiagnosticsPageProps {
  searchParams: Promise<SearchParams>;
}

async function getDiagnostics(searchParams: SearchParams) {
  const categoryParam = searchParams.category;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const limit = 12;

  const where: Record<string, unknown> = {
    published: true,
  };

  if (categoryParam) {
    where.category = { in: categoryParam.split(',') as DiagnosticCategory[] };
  }

  const skip = (page - 1) * limit;

  const [totalCount, diagnostics] = await Promise.all([
    db.diagnostic.count({ where }),
    db.diagnostic.findMany({
      where,
      orderBy: { name: 'asc' },
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

  const totalPages = Math.ceil(totalCount / limit);

  return {
    diagnostics: diagnostics.map((d: any) => ({
      ...d,
      propertiesCount: d._count.properties,
    })),
    pagination: {
      page,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export default async function DiagnosticsPage({ searchParams }: DiagnosticsPageProps) {
  const params = await searchParams;
  const { diagnostics, pagination } = await getDiagnostics(params);

  const selectedCategory = params.category as DiagnosticCategory | undefined;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Diagnostics', href: '/diagnostics' },
  ];

  const categories = Object.keys(diagnosticCategoryLabels) as DiagnosticCategory[];

  return (
    <main className="min-h-screen bg-clarus-white">
      {/* Hero Section */}
      <section className="border-b border-stone bg-white py-12">
        <Container>
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-medium text-clarus-navy md:text-5xl">
              Diagnostic Database
            </h1>
            <p className="mt-4 text-lg text-slate">
              Discover advanced diagnostic tests and health assessments offered at premium
              wellness destinations worldwide.
            </p>
          </div>
        </Container>
      </section>

      {/* Category Navigation */}
      <section className="border-b border-stone bg-white py-4">
        <Container>
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
            <Link
              href="/diagnostics"
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-clarus-navy text-white'
                  : 'bg-stone text-clarus-navy hover:bg-stone/80'
              }`}
            >
              All Diagnostics
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/diagnostics?category=${category}`}
                className={`flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-clarus-navy text-white'
                    : 'bg-stone text-clarus-navy hover:bg-stone/80'
                }`}
              >
                {diagnosticCategoryLabels[category]}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <Container>
          <div className="mb-6">
            <span className="text-sm text-slate">
              {pagination.totalCount} {pagination.totalCount === 1 ? 'diagnostic' : 'diagnostics'} found
            </span>
          </div>

          {diagnostics.length === 0 ? (
            <EmptyState
              title="No diagnostics found"
              description="Try selecting a different category."
              icon={
                <svg
                  className="h-12 w-12 text-slate"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              }
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {diagnostics.map((diagnostic: any) => (
                <Link
                  key={diagnostic.id}
                  href={`/diagnostics/${diagnostic.slug}`}
                  className="group rounded-lg border border-stone bg-white p-6 transition-shadow hover:shadow-card-hover"
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-slate">
                    {diagnosticCategoryLabels[diagnostic.category as DiagnosticCategory]}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-medium text-clarus-navy group-hover:underline">
                    {diagnostic.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate">
                    {diagnostic.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-stone pt-3">
                    <span className="text-xs text-slate">
                      <span className="font-medium text-clarus-navy">
                        {diagnostic.propertiesCount}
                      </span>{' '}
                      {diagnostic.propertiesCount === 1 ? 'property' : 'properties'}
                    </span>
                    <span className="text-xs font-medium text-clarus-navy">View details →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              {pagination.hasPreviousPage && (
                <Link
                  href={`/diagnostics?${selectedCategory ? `category=${selectedCategory}&` : ''}page=${pagination.page - 1}`}
                  className="rounded-lg border border-clarus-navy px-4 py-2 text-sm font-medium text-clarus-navy hover:bg-stone"
                >
                  Previous
                </Link>
              )}
              <span className="text-sm text-slate">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              {pagination.hasNextPage && (
                <Link
                  href={`/diagnostics?${selectedCategory ? `category=${selectedCategory}&` : ''}page=${pagination.page + 1}`}
                  className="rounded-lg border border-clarus-navy px-4 py-2 text-sm font-medium text-clarus-navy hover:bg-stone"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* Medical Disclaimer */}
      <section className="border-t border-stone bg-warm-gray py-8">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm text-slate">
              The information provided is for educational purposes only and is not intended as
              medical advice. Diagnostic tests should be ordered and interpreted by qualified
              healthcare providers. Clarus Vitae does not endorse specific diagnostic procedures.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
