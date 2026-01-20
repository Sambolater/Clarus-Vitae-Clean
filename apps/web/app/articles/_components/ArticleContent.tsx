'use client';

import { PortableTextRenderer } from '@clarus-vitae/ui';
import React from 'react';

interface ArticleContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[];
}

export function ArticleContent({ content }: ArticleContentProps) {
  if (!content || content.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No content available.</p>
      </div>
    );
  }

  return (
    <div className="article-content">
      <PortableTextRenderer content={content} />
    </div>
  );
}
