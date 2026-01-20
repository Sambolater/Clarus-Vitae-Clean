import { defineType, defineField } from 'sanity';

/**
 * SEO Object Schema
 * Provides consistent SEO metadata fields across all content types
 */
export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      validation: (Rule) => Rule.max(60),
      description: 'Max 60 characters. If empty, the page title will be used.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160),
      description: 'Max 160 characters. A compelling summary for search results.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description: '1200x630 pixels recommended for optimal display on social platforms.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Optional. Use if this content exists elsewhere and needs a canonical reference.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from Search Engines',
      type: 'boolean',
      initialValue: false,
      description: 'Enable to prevent this page from being indexed by search engines.',
    }),
    defineField({
      name: 'keywords',
      title: 'Focus Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Optional keywords for internal reference. Not used directly in meta tags.',
      options: {
        layout: 'tags',
      },
    }),
  ],
});
