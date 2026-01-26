'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';

interface GalleryImage {
  url: string;
  alt: string;
}

interface PropertyGalleryProps {
  images: GalleryImage[];
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(null);

  const goNext = useCallback(() => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex + 1) % images.length);
    }
  }, [activeIndex, images.length]);

  const goPrev = useCallback(() => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex - 1 + images.length) % images.length);
    }
  }, [activeIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeIndex, goNext, goPrev]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-6">
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Gallery
          </h2>
        </div>
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-4 px-4 sm:px-6 lg:px-8" style={{ width: 'max-content' }}>
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className="flex-shrink-0 group cursor-pointer"
              >
                <div className="relative w-[320px] h-[240px] rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="320px"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Close gallery"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/80 hover:text-white transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/80 hover:text-white transition-colors"
            aria-label="Next image"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Main image */}
          <div
            className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {images[activeIndex] && (
              <Image
                src={images[activeIndex].url.replace('w=800&h=600', 'w=1920&h=1280')}
                alt={images[activeIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            )}
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
