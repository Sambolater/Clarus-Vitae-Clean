/**
 * SearchHeader Component
 *
 * Header for the search results page with search input.
 */

'use client';

import { Heading } from '@clarus-vitae/ui';

import { GlobalSearch } from '@/components/search';

interface SearchHeaderProps {
  initialQuery: string;
}

export function SearchHeader({ initialQuery }: SearchHeaderProps) {
  return (
    <div className="mb-8">
      <Heading level={1} className="mb-4">
        Search
      </Heading>

      <div className="max-w-2xl">
        <GlobalSearch
          placeholder="Search properties, treatments, articles..."
          autoFocus={!initialQuery}
        />
      </div>
    </div>
  );
}
