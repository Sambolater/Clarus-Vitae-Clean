import { defineType, defineField } from 'sanity';

/**
 * Call to Action Object Schema
 * Used for buttons and promotional blocks throughout the site
 */
export default defineType({
  name: 'callToAction',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required().max(50),
      description: 'Keep it concise and action-oriented.',
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal Page', value: 'internal' },
          { title: 'External URL', value: 'external' },
          { title: 'Inquiry Form', value: 'inquiry' },
          { title: 'Contact Advisor', value: 'contact' },
        ],
      },
      initialValue: 'internal',
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal Link',
      type: 'reference',
      to: [{ type: 'article' }, { type: 'guide' }, { type: 'page' }],
      hidden: ({ parent }) => parent?.linkType !== 'internal',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({ parent }) => parent?.linkType !== 'external',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'propertySlug',
      title: 'Property Slug',
      type: 'string',
      description: 'For inquiry forms, specify the property slug if applicable.',
      hidden: ({ parent }) => parent?.linkType !== 'inquiry',
    }),
    defineField({
      name: 'variant',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (Navy)', value: 'primary' },
          { title: 'Secondary (Outline)', value: 'secondary' },
          { title: 'Tertiary (Subtle)', value: 'tertiary' },
          { title: 'Text Link', value: 'text' },
        ],
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: {
      text: 'text',
      linkType: 'linkType',
    },
    prepare({ text, linkType }) {
      return {
        title: text || 'Call to Action',
        subtitle: linkType ? `Type: ${linkType}` : undefined,
      };
    },
  },
});
