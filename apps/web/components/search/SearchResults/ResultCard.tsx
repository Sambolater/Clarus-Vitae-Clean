/**
 * ResultCard Component
 *
 * Generic card for displaying search results.
 * Adapts to property, treatment, or article results.
 */

'use client';

import Link from 'next/link';
import { cn } from '@clarus-vitae/utils';
import { TierBadge, EvidenceLevel, ClarusIndexBadge } from '@clarus-vitae/ui';

// Property result type
export interface PropertyResult {
  id: string;
  slug: string;
  name: string;
  description: string;
  location: {
    city: string;
    country: string;
  };
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  score: number | null;
  image: {
    url: string;
    alt: string | null;
  } | null;
  url: string;
}

// Treatment result type
export interface TreatmentResult {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  evidenceLevel: 'STRONG' | 'MODERATE' | 'EMERGING' | 'EXPERIMENTAL' | 'TRADITIONAL';
  propertyCount: number;
  url: string;
}

// Article result type
export interface ArticleResult {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  authorName: string | null;
  image: string | null;
  publishedAt: string | null;
  url: string;
}

// Property Result Card
export function PropertyResultCard({ result }: { result: PropertyResult }) {
  return (
    <Link
      href={result.url}
      className="group flex gap-4 rounded-lg border border-stone bg-white p-4 transition-all hover:border-clarus-navy/20 hover:shadow-sm"
    >
      {/* Image */}
      <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-md bg-warm-gray">
        {result.image ? (
          <img
            src={result.image.url}
            alt={result.image.alt || result.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-medium text-clarus-navy group-hover:underline">
              {result.name}
            </h3>
            <p className="text-sm text-slate">
              {result.location.city}, {result.location.country}
            </p>
          </div>
          {result.score && (
            <ClarusIndexBadge score={result.score} size="small" />
          )}
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-clarus-navy/80">
          {result.description}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <TierBadge tier={result.tier} />
        </div>
      </div>
    </Link>
  );
}

// Treatment Result Card
export function TreatmentResultCard({ result }: { result: TreatmentResult }) {
  return (
    <Link
      href={result.url}
      className="group flex gap-4 rounded-lg border border-stone bg-white p-4 transition-all hover:border-clarus-navy/20 hover:shadow-sm"
    >
      {/* Icon */}
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-warm-gray text-slate">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-medium text-clarus-navy group-hover:underline">
              {result.name}
            </h3>
            <p className="text-sm text-slate">
              {formatCategory(result.category)}
            </p>
          </div>
          <EvidenceLevel level={result.evidenceLevel} />
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-clarus-navy/80">
          {result.description}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-slate">
          <span>Available at {result.propertyCount} properties</span>
        </div>
      </div>
    </Link>
  );
}

// Article Result Card
export function ArticleResultCard({ result }: { result: ArticleResult }) {
  return (
    <Link
      href={result.url}
      className="group flex gap-4 rounded-lg border border-stone bg-white p-4 transition-all hover:border-clarus-navy/20 hover:shadow-sm"
    >
      {/* Image */}
      <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-md bg-warm-gray">
        {result.image ? (
          <img
            src={result.image}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-clarus-gold">
            {formatCategory(result.category)}
          </p>
          <h3 className="mt-1 font-display text-lg font-medium text-clarus-navy group-hover:underline">
            {result.title}
          </h3>
        </div>

        {result.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-clarus-navy/80">
            {result.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-slate">
          {result.authorName && <span>By {result.authorName}</span>}
          {result.authorName && result.publishedAt && <span>·</span>}
          {result.publishedAt && (
            <span>{new Date(result.publishedAt).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Helper to format category strings
function formatCategory(category: string): string {
  return category
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}
