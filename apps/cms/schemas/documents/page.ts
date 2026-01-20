import { defineType, defineField } from 'sanity';

/**
 * Page Document Schema
 * For static pages like legal pages, about pages, and marketing landing pages.
 */
export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Settings' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Content group
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'The URL path for this page (e.g., "privacy-policy" → /privacy-policy)',
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Legal', value: 'legal' },
          { title: 'About', value: 'about' },
          { title: 'Landing', value: 'landing' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'content',
      description: 'Optional subtitle or tagline.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
      hidden: ({ document }) => document?.pageType === 'legal',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      group: 'content',
      description: 'For landing pages with multiple distinct sections.',
      hidden: ({ document }) => document?.pageType !== 'landing',
      of: [
        {
          type: 'object',
          name: 'heroSection',
          title: 'Hero Section',
          fields: [
            { name: 'heading', type: 'string', title: 'Heading' },
            { name: 'subheading', type: 'text', title: 'Subheading', rows: 2 },
            { name: 'backgroundImage', type: 'image', title: 'Background Image' },
            { name: 'cta', type: 'callToAction', title: 'Call to Action' },
          ],
        },
        {
          type: 'object',
          name: 'featureSection',
          title: 'Feature Section',
          fields: [
            { name: 'heading', type: 'string', title: 'Section Heading' },
            { name: 'subheading', type: 'text', title: 'Section Subheading', rows: 2 },
            {
              name: 'features',
              type: 'array',
              title: 'Features',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'title', type: 'string', title: 'Feature Title' },
                    { name: 'description', type: 'text', title: 'Description', rows: 2 },
                    { name: 'icon', type: 'string', title: 'Icon Name' },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'object',
          name: 'contentSection',
          title: 'Content Section',
          fields: [
            { name: 'heading', type: 'string', title: 'Heading' },
            { name: 'content', type: 'portableText', title: 'Content' },
          ],
        },
        {
          type: 'object',
          name: 'ctaSection',
          title: 'CTA Section',
          fields: [
            { name: 'heading', type: 'string', title: 'Heading' },
            { name: 'subheading', type: 'text', title: 'Subheading', rows: 2 },
            { name: 'cta', type: 'callToAction', title: 'Primary CTA' },
            { name: 'secondaryCta', type: 'callToAction', title: 'Secondary CTA' },
          ],
        },
      ],
    }),

    // Meta group
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      group: 'meta',
      description: 'Important for legal pages to show when terms were last modified.',
    }),
    defineField({
      name: 'effectiveDate',
      title: 'Effective Date',
      type: 'date',
      group: 'meta',
      description: 'For legal pages: when these terms become effective.',
      hidden: ({ document }) => document?.pageType !== 'legal',
    }),
    defineField({
      name: 'showInNavigation',
      title: 'Show in Navigation',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
    }),
    defineField({
      name: 'navigationOrder',
      title: 'Navigation Order',
      type: 'number',
      group: 'meta',
      hidden: ({ document }) => !document?.showInNavigation,
    }),

    // SEO group
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      pageType: 'pageType',
      media: 'heroImage',
    },
    prepare({ title, pageType, media }) {
      const typeLabels: Record<string, string> = {
        legal: '⚖️ Legal',
        about: '📄 About',
        landing: '🚀 Landing',
      };
      return {
        title,
        subtitle: typeLabels[pageType] || 'Page',
        media,
      };
    },
  },
});
