'use client';

import { Container } from '@clarus-vitae/ui';
import Link from 'next/link';
import React from 'react';

interface Author {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  imageUrl: string | null;
  credentials: string[];
}

interface HeroImage {
  alt?: string;
  caption?: string;
}

interface ArticleHeaderProps {
  title: string;
  excerpt: string;
  category?: string;
  categoryLabel?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime?: number;
  author: Author | null;
  heroImage?: HeroImage;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ArticleHeader({
  title,
  excerpt,
  category,
  categoryLabel,
  publishedAt,
  updatedAt,
  readingTime,
  author,
  heroImage,
}: ArticleHeaderProps) {
  return (
    <header>
      {/* Meta section */}
      <div className="bg-white py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            {/* Category */}
            {category && categoryLabel && (
              <Link
                href={`/articles?category=${category}`}
                className="mb-4 inline-block text-sm font-medium uppercase tracking-wide text-clarus-gold hover:underline"
              >
                {categoryLabel}
              </Link>
            )}

            {/* Title */}
            <h1 className="font-serif text-3xl font-medium text-clarus-navy md:text-4xl lg:text-5xl">
              {title}
            </h1>

            {/* Excerpt */}
            <p className="mt-6 text-lg text-slate md:text-xl">{excerpt}</p>

            {/* Author & Meta */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {/* Author */}
              {author && (
                <div className="flex items-center gap-3">
                  {author.imageUrl ? (
                    <img
                      src={author.imageUrl}
                      alt={author.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-clarus-navy text-white">
                      {author.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-medium text-clarus-navy">{author.name}</p>
                    {author.title && (
                      <p className="text-sm text-slate">{author.title}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Divider */}
              {author && <span className="hidden text-gray-300 md:inline">|</span>}

              {/* Date & Reading Time */}
              <div className="flex items-center gap-4 text-sm text-slate">
                <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
                {readingTime && (
                  <>
                    <span>•</span>
                    <span>{readingTime} min read</span>
                  </>
                )}
              </div>
            </div>

            {/* Updated notice */}
            {updatedAt && updatedAt !== publishedAt && (
              <p className="mt-4 text-sm text-gray-500">
                Updated {formatDate(updatedAt)}
              </p>
            )}
          </div>
        </Container>
      </div>

      {/* Hero Image */}
      {heroImage && (
        <div className="relative">
          <Container>
            <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
              {/* In production, use urlFor:
              <img
                src={urlFor(heroImage).width(1600).height(900).url()}
                alt={heroImage.alt || title}
                className="h-full w-full object-cover"
              />
              */}
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                Hero Image Placeholder
              </div>
            </div>
            {heroImage.caption && (
              <p className="mt-2 text-center text-sm text-gray-500">
                {heroImage.caption}
              </p>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
