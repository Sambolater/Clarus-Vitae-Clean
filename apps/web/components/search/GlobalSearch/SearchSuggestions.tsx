/**
 * SearchSuggestions Component
 *
 * Dropdown showing search suggestions grouped by type.
 * Supports keyboard navigation.
 */

'use client';

import { cn } from '@clarus-vitae/utils';
import { useRef, useEffect, useState, useMemo } from 'react';

import type { SearchSuggestion, GroupedSuggestions } from '../hooks/useSearch';

interface SearchSuggestionsProps {
  suggestions: GroupedSuggestions;
  isOpen: boolean;
  onSelect: (suggestion: SearchSuggestion) => void;
  onClose: () => void;
  onViewAllResults: () => void;
  query: string;
}

export function SearchSuggestions({
  suggestions,
  isOpen,
  onSelect,
  onClose,
  onViewAllResults,
  query,
}: SearchSuggestionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Flatten suggestions for keyboard navigation
  const allSuggestions: SearchSuggestion[] = useMemo(
    () => [
      ...suggestions.properties,
      ...suggestions.treatments,
      ...suggestions.articles,
    ],
    [suggestions.properties, suggestions.treatments, suggestions.articles]
  );

  const totalCount = allSuggestions.length;

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => {
            if (prev < totalCount) {
              return prev + 1;
            }
            return prev;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => Math.max(-1, prev - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex === -1 || activeIndex === totalCount) {
            onViewAllResults();
          } else if (activeIndex >= 0 && activeIndex < totalCount) {
            const suggestion = allSuggestions[activeIndex];
            if (suggestion) {
              onSelect(suggestion);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, totalCount, allSuggestions, onSelect, onClose, onViewAllResults]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || totalCount === 0) return null;

  const renderSection = (
    title: string,
    items: SearchSuggestion[],
    startIndex: number
  ) => {
    if (items.length === 0) return null;

    return (
      <div className="py-2">
        <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate">
          {title}
        </div>
        {items.map((item, idx) => {
          const itemIndex = startIndex + idx;
          const isActive = activeIndex === itemIndex;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              onMouseEnter={() => setActiveIndex(itemIndex)}
              className={cn(
                'flex w-full items-center gap-3 px-3 py-2 text-left transition-colors',
                isActive ? 'bg-stone' : 'hover:bg-warm-gray'
              )}
            >
              {/* Icon or Image */}
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-warm-gray">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-full w-full rounded object-cover"
                  />
                ) : (
                  <SuggestionIcon type={item.type} />
                )}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-clarus-navy">
                  {item.title}
                </div>
                <div className="truncate text-xs text-slate">{item.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const propertiesStartIndex = 0;
  const treatmentsStartIndex = suggestions.properties.length;
  const articlesStartIndex = treatmentsStartIndex + suggestions.treatments.length;

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[400px] overflow-y-auto rounded-lg border border-stone bg-white shadow-lg"
    >
      {/* Suggestion Sections */}
      {renderSection('Properties', suggestions.properties, propertiesStartIndex)}
      {suggestions.properties.length > 0 && suggestions.treatments.length > 0 && (
        <div className="mx-3 border-t border-stone" />
      )}
      {renderSection('Treatments', suggestions.treatments, treatmentsStartIndex)}
      {(suggestions.properties.length > 0 || suggestions.treatments.length > 0) &&
        suggestions.articles.length > 0 && <div className="mx-3 border-t border-stone" />}
      {renderSection('Articles', suggestions.articles, articlesStartIndex)}

      {/* View All Results */}
      <div className="border-t border-stone p-2">
        <button
          type="button"
          onClick={onViewAllResults}
          onMouseEnter={() => setActiveIndex(totalCount)}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-clarus-navy transition-colors',
            activeIndex === totalCount ? 'bg-stone' : 'hover:bg-warm-gray'
          )}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          View all results for &ldquo;{query}&rdquo;
        </button>
      </div>
    </div>
  );
}

function SuggestionIcon({ type }: { type: 'property' | 'treatment' | 'article' }) {
  const iconClass = 'h-4 w-4 text-slate';

  switch (type) {
    case 'property':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      );
    case 'treatment':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
          />
        </svg>
      );
    case 'article':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      );
  }
}
