'use client';

import Image from 'next/image';

interface GalleryImage {
  url: string;
  alt: string;
}

interface PropertyGalleryProps {
  images: GalleryImage[];
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-6">
        <h2 className="font-display text-2xl font-medium text-clarus-navy">
          Gallery
        </h2>
      </div>
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-4 px-4 sm:px-6 lg:px-8" style={{ width: 'max-content' }}>
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 group"
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
            </div>
          ))}
        </div>
      </div>
      <p className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-4 text-xs text-slate/60">
        Representative images. Source: Unsplash
      </p>
    </section>
  );
}
