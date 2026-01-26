'use client';

import { type PropertyTier } from '@clarus-vitae/database/types';
import { TierBadge, ClarusIndexBadge } from '@clarus-vitae/ui';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

import { formatPriceRange, tierLabels } from '@/lib/properties';


interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: string;
  category: string | null;
  isFeatured: boolean;
}

interface PropertyHeroProps {
  name: string;
  city: string;
  country: string;
  tier: PropertyTier;
  score: number | null;
  images: PropertyImage[];
  pricing: {
    min: number;
    max: number;
    currency: string;
  };
  foundedYear: number | null;
  capacity: number | null;
  verifiedExcellence: boolean;
  editorChoice: string | null;
  slug: string;
}

export function PropertyHero({
  name,
  city,
  country,
  tier,
  score,
  images,
  pricing,
  foundedYear,
  capacity,
  verifiedExcellence,
  editorChoice,
  slug,
}: PropertyHeroProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const heroImage = images.find((img) => img.isFeatured) || images[0];

  const openGallery = (index: number) => setActiveImageIndex(index);
  const closeGallery = () => setActiveImageIndex(null);

  const goNext = useCallback(() => {
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex + 1) % images.length);
    }
  }, [activeImageIndex, images.length]);

  const goPrev = useCallback(() => {
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length);
    }
  }, [activeImageIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') closeGallery();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeImageIndex, goNext, goPrev]);

  return (
    <section className="bg-white">
      {/* Hero Image */}
      <div className="relative">
        <div 
          className="relative h-[400px] md:h-[500px] cursor-pointer"
          onClick={() => images.length > 0 && openGallery(0)}
        >
          {heroImage ? (
            <Image
              src={heroImage.url}
              alt={heroImage.alt || name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-stone">
              <span className="text-slate">No image available</span>
            </div>
          )}

          {/* Overlay badges */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <TierBadge tier={tier} />
            {verifiedExcellence && (
              <span className="rounded-md bg-verification-green px-3 py-1 text-xs font-medium text-white">
                Verified Excellence
              </span>
            )}
            {editorChoice && (
              <span className="rounded-md bg-clarus-gold px-3 py-1 text-xs font-medium text-clarus-navy">
                Editor&apos;s Choice: {editorChoice}
              </span>
            )}
          </div>

          {/* View Gallery hint */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-black/50 px-4 py-2 text-sm font-medium text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              1 / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Property Info Bar */}
      <div className="border-b border-stone">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: Name and Location */}
            <div className="flex-1">
              <h1 className="font-display text-3xl font-medium text-clarus-navy md:text-4xl">
                {name}
              </h1>
              <p className="mt-2 text-lg text-slate">
                {city}, {country}
              </p>

              {/* Quick Facts */}
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate">
                <span>{tierLabels[tier]}</span>
                {foundedYear && <span>Est. {foundedYear}</span>}
                {capacity && <span>{capacity} rooms</span>}
              </div>
            </div>

            {/* Right: Score and CTAs */}
            <div className="flex flex-col items-start gap-4 lg:items-end">
              {/* Score */}
              {score !== null && (
                <ClarusIndexBadge score={score} size="lg" showLabel />
              )}

              {/* Price and Duration */}
              <div className="text-right">
                <p className="text-lg font-medium text-clarus-navy">
                  {formatPriceRange(pricing.min, pricing.max, pricing.currency)}
                </p>
                <p className="text-sm text-slate">per program</p>
              </div>

              {/* CTAs */}
              <div className="flex gap-3">
                <Link
                  href={`/inquire/${slug}`}
                  className="inline-flex h-12 items-center justify-center rounded-md bg-clarus-navy px-8 text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
                >
                  Request Information
                </Link>
                <Link
                  href={`/compare?add=${slug}`}
                  className="inline-flex h-12 items-center justify-center rounded-md border border-clarus-navy bg-transparent px-8 text-sm font-medium text-clarus-navy transition-colors hover:bg-stone"
                >
                  Add to Compare
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery */}
      {activeImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={closeGallery}
        >
          {/* Close button */}
          <button
            onClick={closeGallery}
            className="absolute top-6 right-6 z-10 p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Close gallery"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-4 text-white/70 hover:text-white transition-colors"
              aria-label="Previous image"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-4 text-white/70 hover:text-white transition-colors"
              aria-label="Next image"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Main image */}
          <div
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {images[activeImageIndex] && (
              <Image
                src={images[activeImageIndex].url}
                alt={images[activeImageIndex].alt || `${name} image`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            )}
          </div>

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-lg font-medium">
              {activeImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
