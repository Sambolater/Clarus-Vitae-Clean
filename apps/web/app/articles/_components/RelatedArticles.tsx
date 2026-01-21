'use client';

import type { ArticleListItem } from '@clarus-vitae/database/sanity/types';
import Link from 'next/link';
import React from 'react';

interface RelatedArticlesProps {
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
    month: 'short',
    day: 'numeric',
  });
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-8 font-serif text-2xl font-medium text-clarus-navy">
        Related Articles
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <article
            key={article._id}
            className="group overflow-hidden rounded-lg border border-stone bg-white transition-shadow hover:shadow-md"
          >
            <Link href={`/articles/${article.slug.current}`}>
              {/* Image */}
              {article.heroImage && (
                <div className="aspect-[3/2] overflow-hidden bg-gray-100">
                  {/* In production, use urlFor:
                  <img
                    src={urlFor(article.heroImage).width(400).height(267).url()}
                    alt=""
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  */}
                  <div className="h-full w-full bg-gray-200" />
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                {article.category && (
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-clarus-gold">
                    {categoryLabels[article.category] || article.category}
                  </p>
                )}
                <h3 className="font-serif text-lg font-medium text-clarus-navy group-hover:text-clarus-gold line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-slate line-clamp-2">
                  {article.excerpt}
                </p>
                <time
                  dateTime={article.publishedAt}
                  className="mt-3 block text-xs text-gray-500"
                >
                  {formatDate(article.publishedAt)}
                </time>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
