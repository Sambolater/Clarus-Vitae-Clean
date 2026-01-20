'use client';

import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';

import type { TeamMemberSummary } from '@clarus-vitae/types';

export interface EditorialBylineProps extends HTMLAttributes<HTMLDivElement> {
  author: TeamMemberSummary;
  publishDate: Date;
  readTime?: number;
  updatedDate?: Date;
  variant?: 'full' | 'compact' | 'inline';
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * EditorialByline component for attributing content to team members.
 *
 * Features:
 * - Author photo and name with link to profile
 * - Title and credentials
 * - Publish date and read time
 * - Updated date indicator
 * - Multiple variants (full, compact, inline)
 */
export const EditorialByline = forwardRef<HTMLDivElement, EditorialBylineProps>(
  (
    {
      author,
      publishDate,
      readTime,
      updatedDate,
      variant = 'full',
      className,
      ...props
    },
    ref
  ) => {
    if (variant === 'inline') {
      return (
        <div
          ref={ref}
          className={cn('flex items-center gap-2 text-sm text-slate', className)}
          {...props}
        >
          <span>By</span>
          <a
            href={`/team/${author.slug}`}
            className="font-medium text-clarus-navy hover:text-clarus-gold"
          >
            {author.name}
          </a>
          <span className="text-slate/50">|</span>
          <time dateTime={new Date(publishDate).toISOString()}>
            {formatDate(publishDate)}
          </time>
          {readTime && (
            <>
              <span className="text-slate/50">|</span>
              <span>{readTime} min read</span>
            </>
          )}
        </div>
      );
    }

    if (variant === 'compact') {
      return (
        <div
          ref={ref}
          className={cn('flex items-center gap-3', className)}
          {...props}
        >
          <a href={`/team/${author.slug}`} className="shrink-0">
            {author.photoUrl ? (
              <img
                src={author.photoUrl}
                alt={author.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-clarus-navy text-sm font-medium text-clarus-gold">
                {author.name.charAt(0).toUpperCase()}
              </div>
            )}
          </a>
          <div className="min-w-0 text-sm">
            <a
              href={`/team/${author.slug}`}
              className="block truncate font-medium text-clarus-navy hover:text-clarus-gold"
            >
              {author.name}
            </a>
            <div className="flex items-center gap-2 text-slate">
              <time dateTime={new Date(publishDate).toISOString()}>
                {formatDate(publishDate)}
              </time>
              {readTime && <span>{readTime} min read</span>}
            </div>
          </div>
        </div>
      );
    }

    // Full variant (default)
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-4 border-y border-stone py-4', className)}
        {...props}
      >
        <a href={`/team/${author.slug}`} className="shrink-0">
          {author.photoUrl ? (
            <img
              src={author.photoUrl}
              alt={author.name}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-clarus-navy text-lg font-medium text-clarus-gold">
              {author.name.charAt(0).toUpperCase()}
            </div>
          )}
        </a>
        <div className="min-w-0 flex-1">
          <a
            href={`/team/${author.slug}`}
            className="font-medium text-clarus-navy hover:text-clarus-gold"
          >
            {author.name}
          </a>
          <p className="text-sm text-slate">
            {author.title}
            {author.propertiesVisited && (
              <span> | {author.propertiesVisited} properties visited</span>
            )}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate">
            <time dateTime={new Date(publishDate).toISOString()}>
              {formatDate(publishDate)}
            </time>
            {readTime && (
              <>
                <span className="text-slate/50">|</span>
                <span>{readTime} min read</span>
              </>
            )}
            {updatedDate && (
              <>
                <span className="text-slate/50">|</span>
                <span className="text-clarus-gold">
                  Updated {formatDate(updatedDate)}
                </span>
              </>
            )}
          </div>
        </div>
        {author.credentials && author.credentials.length > 0 && (
          <div className="hidden flex-wrap gap-1 md:flex">
            {author.credentials.slice(0, 2).map((cred) => (
              <span
                key={cred}
                className="rounded-full bg-stone px-2 py-0.5 text-xs text-slate"
              >
                {cred}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
);

EditorialByline.displayName = 'EditorialByline';
