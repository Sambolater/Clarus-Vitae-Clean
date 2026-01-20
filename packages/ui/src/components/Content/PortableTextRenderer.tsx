'use client';

import React from 'react';
import {
  PortableText,
  type PortableTextReactComponents,
  type PortableTextBlock,
} from '@portabletext/react';
import Link from 'next/link';
import { PropertyCardEmbed } from './PropertyCardEmbed';
import { TreatmentCardEmbed } from './TreatmentCardEmbed';
import { ComparisonTableEmbed } from './ComparisonTableEmbed';
import { Callout, type CalloutType } from './Callout';
import { VideoEmbed } from './VideoEmbed';
import { DataTable } from './DataTable';

// Type for the urlFor function
type UrlForFunction = (source: unknown) => { width: (w: number) => { url: () => string } };

interface PortableTextRendererProps {
  content: PortableTextBlock[];
  /** Image URL builder function from Sanity */
  urlFor?: UrlForFunction;
  /** Custom components to override defaults */
  components?: Partial<PortableTextReactComponents>;
}

/**
 * Create default Portable Text components
 */
function createDefaultComponents(urlFor?: UrlForFunction): PortableTextReactComponents {
  return {
    types: {
      image: ({ value }: { value: { alt?: string; caption?: string } }) => {
        if (!urlFor) {
          return (
            <figure className="my-8">
              <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-500">
                Image placeholder (urlFor not provided)
              </div>
              {value?.caption && (
                <figcaption className="mt-2 text-center text-sm text-gray-500">
                  {value.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        return (
          <figure className="my-8">
            <img
              src={urlFor(value).width(800).url()}
              alt={value?.alt || ''}
              className="w-full rounded-lg"
              loading="lazy"
            />
            {value?.caption && (
              <figcaption className="mt-2 text-center text-sm text-gray-500">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
      propertyCard: ({ value }: { value: { propertySlug: string } }) => (
        <PropertyCardEmbed slug={value.propertySlug} />
      ),
      treatmentCard: ({ value }: { value: { treatmentSlug: string } }) => (
        <TreatmentCardEmbed slug={value.treatmentSlug} />
      ),
      comparisonTable: ({
        value,
      }: {
        value: { propertySlugs: string[]; comparisonTitle?: string };
      }) => (
        <ComparisonTableEmbed slugs={value.propertySlugs} title={value.comparisonTitle} />
      ),
      callout: ({
        value,
      }: {
        value: { type: CalloutType; title?: string; content: string };
      }) => (
        <Callout type={value.type} title={value.title}>
          {value.content}
        </Callout>
      ),
      video: ({ value }: { value: { url: string; caption?: string } }) => (
        <VideoEmbed url={value.url} caption={value.caption} />
      ),
      dataTable: ({
        value,
      }: {
        value: { title?: string; headers: string[]; rows: Array<{ cells: string[] }> };
      }) => <DataTable title={value.title} headers={value.headers} rows={value.rows} />,
    },
    block: {
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="mb-4 mt-8 font-serif text-2xl font-semibold text-clarus-navy">
          {children}
        </h2>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="mb-3 mt-6 font-serif text-xl font-semibold text-clarus-navy">
          {children}
        </h3>
      ),
      h4: ({ children }: { children?: React.ReactNode }) => (
        <h4 className="mb-2 mt-4 text-lg font-semibold text-clarus-navy">{children}</h4>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="my-6 border-l-4 border-clarus-gold pl-4 italic text-slate">
          {children}
        </blockquote>
      ),
      normal: ({ children }: { children?: React.ReactNode }) => (
        <p className="mb-4 leading-relaxed text-clarus-navy">{children}</p>
      ),
    },
    list: {
      bullet: ({ children }: { children?: React.ReactNode }) => (
        <ul className="mb-4 list-disc space-y-2 pl-6 text-clarus-navy">{children}</ul>
      ),
      number: ({ children }: { children?: React.ReactNode }) => (
        <ol className="mb-4 list-decimal space-y-2 pl-6 text-clarus-navy">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: { children?: React.ReactNode }) => (
        <li className="leading-relaxed">{children}</li>
      ),
      number: ({ children }: { children?: React.ReactNode }) => (
        <li className="leading-relaxed">{children}</li>
      ),
    },
    marks: {
      strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      em: ({ children }: { children?: React.ReactNode }) => <em>{children}</em>,
      link: ({
        children,
        value,
      }: {
        children?: React.ReactNode;
        value?: { href?: string; openInNewTab?: boolean };
      }) => {
        const href = value?.href || '#';
        const isExternal = href.startsWith('http');

        if (isExternal || value?.openInNewTab) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-clarus-navy underline underline-offset-2 hover:text-clarus-gold"
            >
              {children}
            </a>
          );
        }

        return (
          <Link
            href={href}
            className="text-clarus-navy underline underline-offset-2 hover:text-clarus-gold"
          >
            {children}
          </Link>
        );
      },
      internalLink: ({
        children,
        value,
      }: {
        children?: React.ReactNode;
        value?: { reference?: { _type?: string; slug?: { current?: string } } };
      }) => {
        const type = value?.reference?._type;
        const slug = value?.reference?.slug?.current;

        if (!type || !slug) {
          return <span>{children}</span>;
        }

        const href = `/${type}s/${slug}`;

        return (
          <Link
            href={href}
            className="text-clarus-navy underline underline-offset-2 hover:text-clarus-gold"
          >
            {children}
          </Link>
        );
      },
    },
  };
}

/**
 * PortableTextRenderer - Renders Sanity Portable Text content
 *
 * This component handles all Portable Text blocks including:
 * - Standard blocks (headings, paragraphs, lists, quotes)
 * - Custom blocks (property cards, treatment cards, comparisons, callouts, videos)
 * - Marks (links, bold, italic)
 *
 * @example
 * import { PortableTextRenderer } from '@clarus-vitae/ui';
 * import { urlFor } from '@clarus/database/sanity';
 *
 * <PortableTextRenderer content={article.content} urlFor={urlFor} />
 */
export function PortableTextRenderer({
  content,
  urlFor,
  components: customComponents,
}: PortableTextRendererProps) {
  const defaultComponents = createDefaultComponents(urlFor);

  // Merge custom components with defaults
  const components = customComponents
    ? { ...defaultComponents, ...customComponents }
    : defaultComponents;

  return (
    <div className="portable-text prose prose-lg max-w-none">
      <PortableText value={content} components={components} />
    </div>
  );
}
