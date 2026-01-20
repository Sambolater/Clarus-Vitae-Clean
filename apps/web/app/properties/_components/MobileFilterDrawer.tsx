'use client';

import { Drawer, Button } from '@clarus-vitae/ui';
import { useState } from 'react';

import { PropertyFilters } from './PropertyFilters';

interface MobileFilterDrawerProps {
  activeFiltersCount: number;
}

export function MobileFilterDrawer({ activeFiltersCount }: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(true)}
        className="lg:hidden"
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filters
        {activeFiltersCount > 0 && (
          <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-clarus-navy text-xs text-white">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Filters"
        position="left"
      >
        <div className="p-4">
          <PropertyFilters />
        </div>
      </Drawer>
    </>
  );
}
