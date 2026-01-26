'use client';

import { type PropertyTier } from '@clarus-vitae/database/types';
import { TierBadge, ClarusIndexBadge } from '@clarus-vitae/ui';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback, useRef, useEffect } from 'react';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Sort images to put featured first
  const sortedImages = [...images].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  const currentImage: PropertyImage | undefined = sortedImages[currentIndex] ?? sortedImages[0];

  const goNext = useCallback(() => {
    if (sortedImages.length <= 1 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
  }, [sortedImages.length, isTransitioning]);

  const goPrev = useCallback(() => {
    if (sortedImages.length <= 1 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
  }, [sortedImages.length, isTransitioning]);

  // Reset transition lock
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    if (touch) touchStartX.current = touch.clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    if (touch) touchEndX.current = touch.clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (diff > threshold) {
      goNext();
    } else if (diff < -threshold) {
      goPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="bg-white">
      {/* Hero Gallery */}
      <div 
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-[400px] md:h-[500px] w-full">
          {currentImage ? (
            <Image
              key={currentImage.id}
              src={currentImage.url}
              alt={currentImage.alt || name}
              fill
              className="object-cover transition-opacity duration-400 ease-out"
              priority={currentIndex === 0}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-stone">
              <span className="text-slate">No image available</span>
            </div>
          )}

          {/* Overlay badges */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2 z-10">
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

          {/* Navigation Arrows */}
          {sortedImages.length > 1 && (
            <>
              {/* Previous Arrow */}
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/85 text-clarus-navy shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-105 active:scale-95"
                aria-label="Previous image"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Arrow */}
              <button
                type="button"
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/85 text-clarus-navy shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-105 active:scale-95"
                aria-label="Next image"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          {sortedImages.length > 1 && (
            <div className="absolute bottom-4 right-4 z-10 rounded-full bg-white/85 px-4 py-2 text-sm font-medium text-clarus-navy shadow-lg backdrop-blur-sm">
              {currentIndex + 1} / {sortedImages.length}
            </div>
          )}

          {/* Dot Indicators */}
          {sortedImages.length > 1 && sortedImages.length <= 8 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {sortedImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setCurrentIndex(index);
                    }
                  }}
                  className={`h-2 w-2 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
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

    </section>
  );
}
