import { defineType, defineField } from 'sanity';

/**
 * Guide Document Schema
 * For long-form, structured content like destination guides, treatment guides,
 * focus area guides, and planning guides.
 *
 * Features table of contents and sectioned content for better navigation.
 */
export default defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'structure', title: 'Structure' },
    { name: 'meta', title: 'Meta & Attribution' },
    { name: 'relations', title: 'Related Content' },
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
    }),
    defineField({
      name: 'guideType',
      title: 'Guide Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Destination Guide', value: 'destination' },
          { title: 'Treatment Guide', value: 'treatment' },
          { title: 'Focus Area Guide', value: 'focus-area' },
          { title: 'Planning Guide', value: 'planning' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      validation: (Rule) => Rule.max(300),
      description: 'A brief summary of what this guide covers.',
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
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'portableText',
      group: 'content',
      description: 'Opening content before the main sections.',
    }),

    // Structure group
    defineField({
      name: 'tableOfContents',
      title: 'Table of Contents',
      type: 'array',
      group: 'structure',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Section Title',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'anchor',
              type: 'string',
              title: 'Anchor ID',
              description: 'URL-friendly ID for linking (e.g., "medical-facilities")',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
      description: 'Define the navigation structure. Each item corresponds to a section below.',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'structure',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Section Title',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'anchor',
              type: 'string',
              title: 'Anchor ID',
              description: 'Must match the corresponding table of contents entry.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'content',
              type: 'portableText',
              title: 'Content',
            },
          ],
          preview: {
            select: { title: 'title', anchor: 'anchor' },
            prepare({ title, anchor }) {
              return {
                title: title || 'Untitled Section',
                subtitle: `#${anchor || 'no-anchor'}`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'conclusion',
      title: 'Conclusion',
      type: 'portableText',
      group: 'structure',
      description: 'Closing content with key takeaways or next steps.',
    }),

    // Meta group
    defineField({
      name: 'authorId',
      title: 'Author ID',
      type: 'string',
      group: 'meta',
      description: 'UUID of the team member author in PostgreSQL.',
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'meta',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      group: 'meta',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'In Review', value: 'review' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'estimatedReadTime',
      title: 'Estimated Read Time (minutes)',
      type: 'number',
      group: 'meta',
    }),

    // Relations group
    defineField({
      name: 'relatedGuides',
      title: 'Related Guides',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'guide' }] }],
    }),
    defineField({
      name: 'relatedProperties',
      title: 'Featured Properties',
      type: 'array',
      group: 'relations',
      of: [{ type: 'string' }],
      description: 'Property slugs from PostgreSQL.',
    }),
    defineField({
      name: 'relatedTreatments',
      title: 'Featured Treatments',
      type: 'array',
      group: 'relations',
      of: [{ type: 'string' }],
      description: 'Treatment slugs from PostgreSQL.',
    }),
    defineField({
      name: 'callToAction',
      title: 'Call to Action',
      type: 'callToAction',
      group: 'relations',
      description: 'Primary CTA displayed at the end of the guide.',
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
      guideType: 'guideType',
      media: 'heroImage',
      status: 'status',
    },
    prepare({ title, guideType, media, status }) {
      const typeLabels: Record<string, string> = {
        destination: '🌍 Destination',
        treatment: '💉 Treatment',
        'focus-area': '🎯 Focus Area',
        planning: '📋 Planning',
      };
      const statusEmoji: Record<string, string> = {
        draft: '📝',
        review: '👀',
        published: '✅',
        archived: '📦',
      };
      return {
        title,
        subtitle: `${statusEmoji[status] || '📝'} ${typeLabels[guideType] || 'Guide'}`,
        media,
      };
    },
  },
});
