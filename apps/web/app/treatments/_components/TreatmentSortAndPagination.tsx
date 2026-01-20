'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Select, Button } from '@clarus-vitae/ui';
import { treatmentSortOptions, TreatmentSortOption } from '@/lib/treatments';

interface TreatmentSortAndPaginationProps {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function TreatmentSortAndPagination({
  totalCount,
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
}: TreatmentSortAndPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = (searchParams.get('sort') as TreatmentSortOption) || 'alphabetical';

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({
      sort: e.target.value === 'alphabetical' ? null : e.target.value,
      page: null, // Reset to page 1
    });
  };

  const handlePageChange = (page: number) => {
    updateParams({
      page: page === 1 ? null : page.toString(),
    });
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Results count and sort */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate">
          {totalCount} {totalCount === 1 ? 'treatment' : 'treatments'} found
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-slate">
            Sort:
          </label>
          <Select
            id="sort"
            value={currentSort}
            onChange={handleSortChange}
            options={treatmentSortOptions.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            className="w-40"
          />
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={!hasPreviousPage}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="px-4 text-sm text-slate">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={!hasNextPage}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
