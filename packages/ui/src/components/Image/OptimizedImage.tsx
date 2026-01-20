/**
 * OptimizedImage Component
 *
 * Wrapper around Next.js Image with performance optimizations.
 * Provides responsive sizing, lazy loading, and blur placeholder support.
 */

'use client';

import { cn } from '@clarus-vitae/utils';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

// Tiny 1x1 transparent placeholder for blur effect
const BLUR_DATA_URL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'placeholder'> {
  /** Alt text for the image (required for accessibility) */
  alt: string;
  /** Image source URL */
  src: string;
  /** Width of the image */
  width: number;
  /** Height of the image */
  height: number;
  /** Priority loading for above-the-fold images */
  priority?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Container CSS classes */
  containerClassName?: string;
  /** Responsive sizes for srcset */
  sizes?: string;
  /** Aspect ratio for the container (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
  /** Whether to show loading skeleton */
  showSkeleton?: boolean;
  /** Custom blur data URL */
  blurDataURL?: string;
  /** Object fit style */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Object position */
  objectPosition?: string;
  /** Quality (1-100) */
  quality?: number;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  containerClassName,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  aspectRatio,
  showSkeleton = true,
  blurDataURL,
  objectFit = 'cover',
  objectPosition = 'center',
  quality = 85,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-stone text-slate',
          containerClassName
        )}
        style={aspectRatio ? { aspectRatio } : { width, height }}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div
      className={cn('relative overflow-hidden', containerClassName)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Loading skeleton */}
      {showSkeleton && isLoading && (
        <div
          className="absolute inset-0 animate-pulse bg-stone"
          aria-hidden="true"
        />
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL || BLUR_DATA_URL}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        style={{
          objectFit,
          objectPosition,
        }}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}

/**
 * PropertyHeroImage - Optimized for property hero sections
 */
export interface PropertyHeroImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export function PropertyHeroImage({
  src,
  alt,
  priority = false,
  className,
}: PropertyHeroImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      priority={priority}
      sizes="100vw"
      aspectRatio="16/9"
      quality={90}
      className={cn('h-full w-full', className)}
    />
  );
}

/**
 * PropertyCardImage - Optimized for property cards
 */
export interface PropertyCardImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function PropertyCardImage({
  src,
  alt,
  className,
}: PropertyCardImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={600}
      height={400}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      aspectRatio="3/2"
      quality={80}
      className={cn('h-full w-full', className)}
    />
  );
}

/**
 * TeamMemberImage - Optimized for team member portraits
 */
export interface TeamMemberImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TeamMemberImage({
  src,
  alt,
  size = 'md',
  className,
}: TeamMemberImageProps) {
  const dimensions = {
    sm: { width: 96, height: 96 },
    md: { width: 200, height: 200 },
    lg: { width: 400, height: 400 },
  };

  const { width, height } = dimensions[size];

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={`${width}px`}
      aspectRatio="1/1"
      quality={85}
      className={cn('rounded-full', className)}
      containerClassName="rounded-full"
    />
  );
}

/**
 * TreatmentImage - Optimized for treatment cards and pages
 */
export interface TreatmentImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function TreatmentImage({
  src,
  alt,
  className,
}: TreatmentImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={400}
      height={300}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      aspectRatio="4/3"
      quality={80}
      className={cn('h-full w-full', className)}
    />
  );
}
