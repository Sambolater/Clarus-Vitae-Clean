/**
 * GlobalSearch Component
 *
 * Main search bar component for the site header.
 * Features type-ahead suggestions with keyboard navigation.
 *
 * Privacy: In Research Mode, no search queries are logged.
 * Recent searches are stored in localStorage only.
 */

'use client';

import { cn } from '@clarus-vitae/utils';
import { useRef, useCallback } from 'react';

import { useSearch } from '../hooks/useSearch';

import { SearchInput } from './SearchInput';
import { SearchSuggestions } from './SearchSuggestions';

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export function GlobalSearch({
  className,
  placeholder = 'Search properties, treatments, articles...',
  autoFocus = false,
}: GlobalSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    query,
    suggestions,
    isLoading,
    isOpen,
    handleQueryChange,
    navigateToSearch,
    navigateToSuggestion,
    clearSearch,
    closeSuggestions,
    openSuggestions,
  } = useSearch();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      navigateToSearch();
    },
    [navigateToSearch]
  );

  const handleFocus = useCallback(() => {
    if (query.length >= 2) {
      openSuggestions();
    }
  }, [query, openSuggestions]);

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} role="search">
        <SearchInput
          ref={inputRef}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={handleFocus}
          onClear={clearSearch}
          isLoading={isLoading}
          placeholder={placeholder}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          aria-label="Search"
          aria-expanded={isOpen}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
        />
      </form>

      <SearchSuggestions
        suggestions={suggestions}
        isOpen={isOpen}
        onSelect={navigateToSuggestion}
        onClose={closeSuggestions}
        onViewAllResults={navigateToSearch}
        query={query}
      />
    </div>
  );
}
