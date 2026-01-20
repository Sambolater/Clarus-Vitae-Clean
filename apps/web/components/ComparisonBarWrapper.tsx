'use client';

import { ComparisonBar } from '@clarus-vitae/ui';
import { useComparison } from '@clarus-vitae/utils';
import { useEffect, useState } from 'react';

/**
 * Global comparison bar wrapper.
 * Renders the floating comparison bar when items are in the comparison list.
 * Should be included in the root layout.
 */
export function ComparisonBarWrapper() {
  const { items, removeFromComparison, clearComparison } = useComparison();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || items.length === 0) {
    return null;
  }

  return (
    <ComparisonBar
      items={items.map((item) => ({
        propertyId: item.propertyId,
        propertySlug: item.propertySlug,
        propertyName: item.propertyName,
        imageUrl: undefined, // Could be enhanced to store image URLs
      }))}
      maxItems={4}
      onRemoveItem={removeFromComparison}
      onClearAll={clearComparison}
    />
  );
}
