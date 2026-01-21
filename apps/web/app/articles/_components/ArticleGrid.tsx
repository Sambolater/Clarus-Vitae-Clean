'use client';

import type { ArticleListItem } from '@clarus-vitae/database/sanity/types';
import Link from 'next/link';
import React from 'react';

interface ArticleGridProps {
  articles: ArticleListItem[];
}

const categoryLabels: Record<string, string> = {
  longevity: 'Longevity',
  'wellness-trends': 'Wellness Trends',
  'destination-guide': 'Destination Guide',
  'treatment-deep-dive': 'Treatment Deep Dive',
  'expert-interview': 'Expert Interview',
  'industry-news': 'Industry News',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <article
          key={article._id}
          className="group overflow-hidden rounded-lg border border-stone bg-white transition-shadow hover:shadow-md"
        >
          <Link href={`/articles/${article.slug.current}`}>
            {/* Image */}
            {article.heroImage && (
              <div className="aspect-[3/2] overflow-hidden bg-gray-100">
                <div className="h-full w-full bg-gray-200" />
                {/* In production, use urlFor from Sanity:
                <img
                  src={urlFor(article.heroImage).width(600).height(400).url()}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                */}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Category */}
              {article.category && (
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-clarus-gold">
                  {categoryLabels[article.category] || article.category}
                </p>
              )}

              {/* Title */}
              <h2 className="font-serif text-xl font-medium text-clarus-navy group-hover:text-clarus-gold">
                {article.title}
              </h2>

              {/* Excerpt */}
              <p className="mt-2 text-sm text-slate line-clamp-3">{article.excerpt}</p>

              {/* Meta */}
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt)}
                </time>
                {article.readingTime && (
                  <>
                    <span>•</span>
                    <span>{article.readingTime} min read</span>
                  </>
                )}
              </div>

              {/* Author */}
              {article.authorName && (
                <p className="mt-3 text-sm text-clarus-navy">
                  By {article.authorName}
                </p>
              )}
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
