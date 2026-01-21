'use client';

import { type PropertyTier } from '@clarus-vitae/database/types';
import { TierBadge, ClarusIndexBadge, Modal } from '@clarus-vitae/ui';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const heroImage = images.find((img) => img.isFeatured) || images[0];
  const galleryImages = images.slice(0, 5);

  return (
    <section className="bg-white">
      {/* Image Gallery */}
      <div className="relative">
        {/* Main Image */}
        <div className="relative h-[400px] md:h-[500px]">
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

          {/* View Gallery Button */}
          {images.length > 1 && (
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-clarus-navy transition-colors hover:bg-white"
            >
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
              View All ({images.length})
            </button>
          )}
        </div>

        {/* Thumbnail Strip (Desktop) */}
        {galleryImages.length > 1 && (
          <div className="hidden gap-2 border-t border-stone bg-white p-2 md:flex">
            {galleryImages.map((img, index) => (
              <button
                key={img.id}
                onClick={() => {
                  setActiveImageIndex(index);
                  setIsGalleryOpen(true);
                }}
                className="relative h-20 w-28 overflow-hidden rounded-md"
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${name} image ${index + 1}`}
                  fill
                  className="object-cover transition-opacity hover:opacity-80"
                />
              </button>
            ))}
            {images.length > 5 && (
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="flex h-20 w-28 items-center justify-center rounded-md bg-stone text-sm text-slate transition-colors hover:bg-stone/80"
              >
                +{images.length - 5} more
              </button>
            )}
          </div>
        )}
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

      {/* Full Screen Gallery Modal */}
      <Modal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        title="Property Gallery"
        size="full"
      >
        <div className="relative flex h-full flex-col">
          {/* Main Image */}
          <div className="relative flex-1">
            {images[activeImageIndex] && (
              <Image
                src={images[activeImageIndex].url}
                alt={images[activeImageIndex].alt || `${name} image`}
                fill
                className="object-contain"
              />
            )}

            {/* Navigation Arrows */}
            <button
              onClick={() =>
                setActiveImageIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-clarus-navy transition-colors hover:bg-white"
              aria-label="Previous image"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() =>
                setActiveImageIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-clarus-navy transition-colors hover:bg-white"
              aria-label="Next image"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-2 overflow-x-auto border-t border-stone bg-white p-4">
            {images.map((img, index) => (
              <button
                key={img.id}
                onClick={() => setActiveImageIndex(index)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md ${
                  index === activeImageIndex ? 'ring-2 ring-clarus-navy' : ''
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </section>
  );
}
