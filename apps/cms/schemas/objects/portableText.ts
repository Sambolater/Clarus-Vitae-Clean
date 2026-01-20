import { defineType, defineArrayMember } from 'sanity';

/**
 * Portable Text Schema for rich editorial content
 * Supports custom blocks for property cards, treatment cards, comparison tables,
 * callouts, and video embeds that integrate with PostgreSQL data
 */
export default defineType({
  name: 'portableText',
  title: 'Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'External Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
              {
                name: 'openInNewTab',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: true,
              },
            ],
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal Link',
            fields: [
              {
                name: 'reference',
                type: 'reference',
                title: 'Reference',
                to: [{ type: 'article' }, { type: 'guide' }, { type: 'page' }],
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Required for accessibility',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),
    defineArrayMember({
      name: 'propertyCard',
      type: 'object',
      title: 'Property Card',
      description: 'Embed a property card from the database',
      fields: [
        {
          name: 'propertySlug',
          type: 'string',
          title: 'Property Slug',
          description: 'The slug of the property from PostgreSQL',
          validation: (Rule) => Rule.required(),
        },
      ],
      preview: {
        select: { slug: 'propertySlug' },
        prepare({ slug }) {
          return {
            title: `Property: ${slug || 'Not specified'}`,
            subtitle: 'Embedded property card',
          };
        },
      },
    }),
    defineArrayMember({
      name: 'treatmentCard',
      type: 'object',
      title: 'Treatment Card',
      description: 'Embed a treatment card from the database',
      fields: [
        {
          name: 'treatmentSlug',
          type: 'string',
          title: 'Treatment Slug',
          description: 'The slug of the treatment from PostgreSQL',
          validation: (Rule) => Rule.required(),
        },
      ],
      preview: {
        select: { slug: 'treatmentSlug' },
        prepare({ slug }) {
          return {
            title: `Treatment: ${slug || 'Not specified'}`,
            subtitle: 'Embedded treatment card',
          };
        },
      },
    }),
    defineArrayMember({
      name: 'comparisonTable',
      type: 'object',
      title: 'Property Comparison',
      description: 'Compare multiple properties side by side',
      fields: [
        {
          name: 'propertySlugs',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Property Slugs',
          description: 'Slugs of properties to compare (2-4 recommended)',
          validation: (Rule) => Rule.min(2).max(4),
        },
        {
          name: 'comparisonTitle',
          type: 'string',
          title: 'Comparison Title',
          description: 'Optional title for the comparison section',
        },
      ],
      preview: {
        select: { slugs: 'propertySlugs' },
        prepare({ slugs }) {
          const count = slugs?.length || 0;
          return {
            title: `Property Comparison`,
            subtitle: `${count} properties`,
          };
        },
      },
    }),
    defineArrayMember({
      name: 'callout',
      type: 'object',
      title: 'Callout Box',
      description: 'Highlight important information',
      fields: [
        {
          name: 'type',
          type: 'string',
          title: 'Callout Type',
          options: {
            list: [
              { title: 'Information', value: 'info' },
              { title: 'Warning', value: 'warning' },
              { title: 'Tip', value: 'tip' },
              { title: 'Expert Insight', value: 'expert' },
            ],
          },
          initialValue: 'info',
        },
        {
          name: 'title',
          type: 'string',
          title: 'Title',
        },
        {
          name: 'content',
          type: 'text',
          title: 'Content',
          rows: 3,
          validation: (Rule) => Rule.required(),
        },
      ],
      preview: {
        select: { type: 'type', title: 'title' },
        prepare({ type, title }) {
          const typeLabels: Record<string, string> = {
            info: '💡 Info',
            warning: '⚠️ Warning',
            tip: '✨ Tip',
            expert: '👤 Expert',
          };
          return {
            title: title || 'Callout',
            subtitle: typeLabels[type] || 'Callout',
          };
        },
      },
    }),
    defineArrayMember({
      name: 'video',
      type: 'object',
      title: 'Video Embed',
      description: 'Embed a video from YouTube or Vimeo',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'Video URL',
          description: 'YouTube or Vimeo URL',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
      preview: {
        select: { url: 'url', caption: 'caption' },
        prepare({ url, caption }) {
          return {
            title: caption || 'Video Embed',
            subtitle: url,
          };
        },
      },
    }),
    defineArrayMember({
      name: 'dataTable',
      type: 'object',
      title: 'Data Table',
      description: 'Display structured data in a table format',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Table Title',
        },
        {
          name: 'headers',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Column Headers',
          validation: (Rule) => Rule.required().min(2),
        },
        {
          name: 'rows',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'cells',
                  type: 'array',
                  of: [{ type: 'string' }],
                  title: 'Cells',
                },
              ],
            },
          ],
          title: 'Table Rows',
        },
      ],
      preview: {
        select: { title: 'title' },
        prepare({ title }) {
          return {
            title: title || 'Data Table',
            subtitle: 'Structured data table',
          };
        },
      },
    }),
  ],
});
