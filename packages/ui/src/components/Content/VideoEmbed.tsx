'use client';

import React from 'react';

interface VideoEmbedProps {
  url: string;
  caption?: string;
}

/**
 * Extract video ID and platform from URL
 */
function parseVideoUrl(url: string): { platform: 'youtube' | 'vimeo' | null; id: string | null } {
  // YouTube patterns
  const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch && youtubeMatch[1]) {
    return { platform: 'youtube', id: youtubeMatch[1] };
  }

  // Vimeo patterns
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return { platform: 'vimeo', id: vimeoMatch[1] };
  }

  return { platform: null, id: null };
}

/**
 * VideoEmbed component for embedding YouTube and Vimeo videos
 *
 * @example
 * <VideoEmbed
 *   url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
 *   caption="Introduction to longevity treatments"
 * />
 */
export function VideoEmbed({ url, caption }: VideoEmbedProps) {
  const { platform, id } = parseVideoUrl(url);

  if (!platform || !id) {
    return (
      <div className="my-6 rounded-lg bg-gray-100 p-6 text-center text-gray-500">
        <p>Unable to embed video from: {url}</p>
      </div>
    );
  }

  const embedUrl =
    platform === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${id}?rel=0`
      : `https://player.vimeo.com/video/${id}?dnt=1`;

  return (
    <figure className="my-8">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
        <iframe
          src={embedUrl}
          title={caption || 'Embedded video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
