'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

type SearchTab = 'retreats' | 'treatments';

export function HomeSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchTab>('retreats');
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const searchPath = activeTab === 'retreats' ? '/properties' : '/treatments';
      if (query.trim()) {
        router.push(`${searchPath}?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push(searchPath);
      }
    },
    [activeTab, query, router]
  );

  const placeholderText =
    activeTab === 'retreats'
      ? 'Search by destination, focus area, or property name...'
      : 'Search treatments, therapies, or diagnostics...';

  return (
    <div className="mx-auto max-w-xl">
      {/* Tabs */}
      <div className="mb-4 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('retreats')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'retreats'
              ? 'bg-clarus-navy text-white'
              : 'bg-stone text-slate hover:bg-clarus-navy/10 hover:text-clarus-navy'
          }`}
        >
          Search Retreats
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('treatments')}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'treatments'
              ? 'bg-clarus-navy text-white'
              : 'bg-stone text-slate hover:bg-clarus-navy/10 hover:text-clarus-navy'
          }`}
        >
          Search Treatments
        </button>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholderText}
            className="h-14 w-full rounded-lg border border-stone bg-white pl-12 pr-4 text-clarus-navy placeholder:text-slate/60 focus:border-clarus-navy focus:outline-none focus:ring-2 focus:ring-clarus-navy/20"
          />
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-clarus-navy py-3 text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
        >
          {activeTab === 'retreats' ? 'Explore Properties' : 'Browse Treatments'}
        </button>
      </form>

      {/* Quick Links */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {activeTab === 'retreats' ? (
          <>
            <QuickLink href="/properties?tier=TIER_1" label="Medical Longevity" />
            <QuickLink href="/properties?tier=TIER_2" label="Integrative Wellness" />
            <QuickLink href="/properties?focusAreas=LONGEVITY" label="Longevity" />
            <QuickLink href="/properties?focusAreas=DETOX" label="Detox" />
          </>
        ) : (
          <>
            <QuickLink href="/treatments?category=REGENERATIVE" label="Regenerative" />
            <QuickLink href="/treatments?category=IV_THERAPIES" label="IV Therapies" />
            <QuickLink href="/treatments?category=DIAGNOSTICS" label="Diagnostics" />
            <QuickLink href="/treatments?category=MIND_NEURO" label="Mind & Neuro" />
          </>
        )}
      </div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="rounded-full border border-stone bg-white px-3 py-1 text-xs text-slate transition-colors hover:border-clarus-navy hover:text-clarus-navy"
    >
      {label}
    </a>
  );
}
