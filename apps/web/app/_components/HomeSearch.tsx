/**
 * HomeSearch Component
 *
 * Hero search component for the homepage with tabs for
 * Retreats (Properties) and Treatments search.
 *
 * Features:
 * - Tab switching between search types
 * - Search input with type-ahead suggestions
 * - Quick navigation to browse pages
 */

'use client';

import { cn } from '@clarus-vitae/utils';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useRef, useEffect } from 'react';

type SearchTab = 'retreats' | 'treatments';

interface SearchSuggestion {
  id: string;
  type: 'property' | 'treatment';
  title: string;
  subtitle?: string;
  slug: string;
}

export function HomeSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchTab>('retreats');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(query)}&limit=5`,
          { signal: controller.signal }
        );
        if (response.ok) {
          const data = await response.json();
          // Filter by active tab type
          const filtered = activeTab === 'retreats'
            ? (data.properties || []).map((p: { id: string; name: string; city: string; country: string; slug: string }) => ({
                id: p.id,
                type: 'property' as const,
                title: p.name,
                subtitle: `${p.city}, ${p.country}`,
                slug: p.slug,
              }))
            : (data.treatments || []).map((t: { id: string; name: string; category: string; slug: string }) => ({
                id: t.id,
                type: 'treatment' as const,
                title: t.name,
                subtitle: t.category,
                slug: t.slug,
              }));
          setSuggestions(filtered);
        }
      } catch {
        // Ignore aborted requests
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 150);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [query, activeTab]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        const type = activeTab === 'retreats' ? 'properties' : 'treatments';
        router.push(`/search?q=${encodeURIComponent(query)}&type=${type}`);
      } else {
        // Navigate to browse page
        router.push(activeTab === 'retreats' ? '/properties' : '/treatments');
      }
    },
    [query, activeTab, router]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: SearchSuggestion) => {
      const basePath = suggestion.type === 'property' ? '/properties' : '/treatments';
      router.push(`${basePath}/${suggestion.slug}`);
    },
    [router]
  );

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-lg bg-stone p-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('retreats');
              setQuery('');
              setSuggestions([]);
            }}
            className={cn(
              'px-6 py-2 text-sm font-medium rounded-md transition-all duration-200',
              activeTab === 'retreats'
                ? 'bg-white text-clarus-navy shadow-sm'
                : 'text-slate hover:text-clarus-navy'
            )}
          >
            Retreats
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('treatments');
              setQuery('');
              setSuggestions([]);
            }}
            className={cn(
              'px-6 py-2 text-sm font-medium rounded-md transition-all duration-200',
              activeTab === 'treatments'
                ? 'bg-white text-clarus-navy shadow-sm'
                : 'text-slate hover:text-clarus-navy'
            )}
          >
            Treatments
          </button>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          {/* Search Icon */}
          <div className="pointer-events-none absolute left-4 flex items-center">
            {isLoading ? (
              <svg
                className="h-5 w-5 animate-spin text-slate"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-slate"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={
              activeTab === 'retreats'
                ? 'Search wellness retreats by name, location, or focus...'
                : 'Search treatments by name or category...'
            }
            className={cn(
              'h-14 w-full rounded-xl border-2 border-stone bg-white pl-12 pr-32 text-base text-clarus-navy placeholder:text-slate/60',
              'focus:border-clarus-navy focus:outline-none focus:ring-2 focus:ring-clarus-navy/20',
              'transition-all duration-200 shadow-sm'
            )}
            aria-label={`Search ${activeTab}`}
          />

          {/* Search Button */}
          <button
            type="submit"
            className="absolute right-2 h-10 px-6 rounded-lg bg-clarus-navy text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
          >
            Search
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-stone shadow-lg z-50 overflow-hidden">
            <ul className="py-2">
              {suggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-stone/50 transition-colors"
                  >
                    <div className="font-medium text-clarus-navy">{suggestion.title}</div>
                    {suggestion.subtitle && (
                      <div className="text-sm text-slate">{suggestion.subtitle}</div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-stone px-4 py-3">
              <button
                type="submit"
                className="text-sm text-clarus-navy hover:underline"
              >
                View all results for &quot;{query}&quot;
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Quick Links */}
      <div className="mt-4 flex justify-center gap-6 text-sm">
        <span className="text-slate">Popular:</span>
        {activeTab === 'retreats' ? (
          <>
            <a href="/properties?focus=LONGEVITY" className="text-clarus-navy hover:underline">
              Longevity
            </a>
            <a href="/properties?focus=DETOX" className="text-clarus-navy hover:underline">
              Detox
            </a>
            <a href="/properties?focus=STRESS_BURNOUT" className="text-clarus-navy hover:underline">
              Stress Recovery
            </a>
            <a href="/properties?tier=TIER_1" className="text-clarus-navy hover:underline">
              Medical Wellness
            </a>
          </>
        ) : (
          <>
            <a href="/treatments?category=REGENERATIVE" className="text-clarus-navy hover:underline">
              Regenerative
            </a>
            <a href="/treatments?category=IV_THERAPIES" className="text-clarus-navy hover:underline">
              IV Therapies
            </a>
            <a href="/treatments?category=DETOXIFICATION" className="text-clarus-navy hover:underline">
              Detox
            </a>
            <a href="/treatments?category=MIND_NEURO" className="text-clarus-navy hover:underline">
              Mind & Neuro
            </a>
          </>
        )}
      </div>
    </div>
  );
}
