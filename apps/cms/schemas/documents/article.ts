import { defineType, defineField } from 'sanity';

/**
 * Article Document Schema
 * For editorial content like longevity articles, wellness trends, destination guides,
 * treatment deep dives, expert interviews, and industry news.
 *
 * Authors reference team members from PostgreSQL via authorId.
 */
export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
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
      validation: (Rule) => Rule.required().max(100),
      description: 'Keep it concise and insight-leading (5-10 words ideal).',
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
      description: 'A compelling summary (15-25 words). Used in article listings and social shares.',
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
      name: 'content',
      title: 'Content',
      type: 'portableText',
      group: 'content',
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
      description: 'Display name (synced from PostgreSQL or manual override).',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Longevity', value: 'longevity' },
          { title: 'Wellness Trends', value: 'wellness-trends' },
          { title: 'Destination Guide', value: 'destination-guide' },
          { title: 'Treatment Deep Dive', value: 'treatment-deep-dive' },
          { title: 'Expert Interview', value: 'expert-interview' },
          { title: 'Industry News', value: 'industry-news' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'meta',
      validation: (Rule) => Rule.required(),
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
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      group: 'meta',
      description: 'Estimated reading time. Auto-calculated if left empty.',
    }),

    // Relations group
    defineField({
      name: 'relatedProperties',
      title: 'Related Properties',
      type: 'array',
      group: 'relations',
      of: [{ type: 'string' }],
      description: 'Property slugs from PostgreSQL to show as related content.',
    }),
    defineField({
      name: 'relatedTreatments',
      title: 'Related Treatments',
      type: 'array',
      group: 'relations',
      of: [{ type: 'string' }],
      description: 'Treatment slugs from PostgreSQL to show as related content.',
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Related Articles',
      type: 'array',
      group: 'relations',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      description: 'Other articles to recommend at the end.',
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
      author: 'authorName',
      media: 'heroImage',
      status: 'status',
      category: 'category',
    },
    prepare({ title, author, status, media, category }) {
      const statusEmoji: Record<string, string> = {
        draft: '📝',
        review: '👀',
        published: '✅',
        archived: '📦',
      };
      return {
        title,
        subtitle: `${statusEmoji[status] || '📝'} ${category || 'Uncategorized'} ${author ? `• ${author}` : ''}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date, Old',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
});
