'use client';

import React from 'react';
import { PortableTextRenderer } from '@clarus-vitae/ui';
import type { PortableTextBlock } from '@portabletext/types';

interface ArticleContentProps {
  content: PortableTextBlock[];
  urlFor: (source: unknown) => { width: (w: number) => { url: () => string } };
}

export function ArticleContent({ content, urlFor }: ArticleContentProps) {
  if (!content || content.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No content available.</p>
      </div>
    );
  }

  return (
    <div className="article-content">
      <PortableTextRenderer content={content} urlFor={urlFor} />
    </div>
  );
}
