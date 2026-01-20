'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { Select, Button } from '@clarus-vitae/ui';
import { sortOptions } from '@/lib/properties';

interface SortControlProps {
  totalCount: number;
}

export function SortControl({ totalCount }: SortControlProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'score_desc';

  const updateSort = useCallback(
    (newSort: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', newSort);
      params.delete('page'); // Reset to page 1 when sorting changes
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate">
        {totalCount} {totalCount === 1 ? 'property' : 'properties'} found
      </p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate">Sort by:</span>
        <Select
          value={currentSort}
          onChange={(e) => updateSort(e.target.value)}
          options={sortOptions.map((opt) => ({
            value: opt.value,
            label: opt.label,
          }))}
          className="w-44"
        />
      </div>
    </div>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function Pagination({
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage === 1) {
        params.delete('page');
      } else {
        params.set('page', newPage.toString());
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    },
    [router, pathname, searchParams]
  );

  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showEllipsisStart = page > 3;
    const showEllipsisEnd = page < totalPages - 2;

    // Always show first page
    pages.push(1);

    if (showEllipsisStart) {
      pages.push('ellipsis');
    }

    // Show pages around current page
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (showEllipsisEnd) {
      pages.push('ellipsis');
    }

    // Always show last page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <Button
        variant="secondary"
        size="sm"
        onClick={() => goToPage(page - 1)}
        disabled={!hasPreviousPage}
        aria-label="Previous page"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Button>

      {getPageNumbers().map((pageNum, index) => {
        if (pageNum === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-slate"
            >
              ...
            </span>
          );
        }

        const isCurrentPage = pageNum === page;

        return (
          <Button
            key={pageNum}
            variant={isCurrentPage ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => goToPage(pageNum)}
            aria-current={isCurrentPage ? 'page' : undefined}
            aria-label={`Page ${pageNum}`}
          >
            {pageNum}
          </Button>
        );
      })}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => goToPage(page + 1)}
        disabled={!hasNextPage}
        aria-label="Next page"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Button>
    </nav>
  );
}
