/**
 * useSearch Hook
 *
 * Manages search state and API interactions for the global search.
 * Supports debounced search suggestions and full search results.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useRef, useEffect } from 'react';

export interface SearchSuggestion {
  id: string;
  type: 'property' | 'treatment' | 'article';
  title: string;
  subtitle: string;
  url: string;
  imageUrl: string | null;
}

export interface GroupedSuggestions {
  properties: SearchSuggestion[];
  treatments: SearchSuggestion[];
  articles: SearchSuggestion[];
}

interface UseSearchOptions {
  debounceMs?: number;
  minChars?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 150, minChars = 2 } = options;

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GroupedSuggestions>({
    properties: [],
    treatments: [],
    articles: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch suggestions
  const fetchSuggestions = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < minChars) {
        setSuggestions({ properties: [], treatments: [], articles: [] });
        setIsOpen(false);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`,
          { signal: abortControllerRef.current.signal }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }

        const data = await response.json();
        setSuggestions(data.suggestions);
        setIsOpen(data.totalCount > 0);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return; // Ignore abort errors
        }
        setError('Search unavailable');
        setSuggestions({ properties: [], treatments: [], articles: [] });
      } finally {
        setIsLoading(false);
      }
    },
    [minChars]
  );

  // Handle query change with debounce
  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (newQuery.length < minChars) {
        setSuggestions({ properties: [], treatments: [], articles: [] });
        setIsOpen(false);
        return;
      }

      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(newQuery);
      }, debounceMs);
    },
    [debounceMs, fetchSuggestions, minChars]
  );

  // Navigate to search results
  const navigateToSearch = useCallback(
    (searchQuery?: string) => {
      const q = searchQuery || query;
      if (q.trim()) {
        router.push(`/search?q=${encodeURIComponent(q.trim())}`);
        setIsOpen(false);
      }
    },
    [query, router]
  );

  // Navigate to suggestion
  const navigateToSuggestion = useCallback(
    (suggestion: SearchSuggestion) => {
      router.push(suggestion.url);
      setIsOpen(false);
      setQuery('');
    },
    [router]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setSuggestions({ properties: [], treatments: [], articles: [] });
    setIsOpen(false);
    setError(null);
  }, []);

  // Close suggestions
  const closeSuggestions = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Open suggestions (if there are any)
  const openSuggestions = useCallback(() => {
    const totalCount =
      suggestions.properties.length +
      suggestions.treatments.length +
      suggestions.articles.length;
    if (totalCount > 0) {
      setIsOpen(true);
    }
  }, [suggestions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    query,
    suggestions,
    isLoading,
    isOpen,
    error,
    handleQueryChange,
    navigateToSearch,
    navigateToSuggestion,
    clearSearch,
    closeSuggestions,
    openSuggestions,
  };
}
