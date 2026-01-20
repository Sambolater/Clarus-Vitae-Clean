import { defineType, defineField } from 'sanity';

/**
 * FAQ Document Schema
 * For frequently asked questions, organized by category.
 */
export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'portableText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Properties & Facilities', value: 'properties' },
          { title: 'Treatments & Programs', value: 'treatments' },
          { title: 'The Clarus Index', value: 'index' },
          { title: 'Privacy & Security', value: 'privacy' },
          { title: 'Inquiries & Booking', value: 'booking' },
          { title: 'Reviews & Outcomes', value: 'reviews' },
          { title: 'Advisory Services', value: 'advisory' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first within the category.',
      initialValue: 0,
    }),
    defineField({
      name: 'relatedLinks',
      title: 'Related Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'text', type: 'string', title: 'Link Text' },
            { name: 'url', type: 'string', title: 'URL or Path' },
          ],
        },
      ],
      description: 'Links to related pages or resources.',
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'question',
      category: 'category',
      published: 'isPublished',
    },
    prepare({ title, category, published }) {
      const categoryLabels: Record<string, string> = {
        general: 'General',
        properties: 'Properties',
        treatments: 'Treatments',
        index: 'Index',
        privacy: 'Privacy',
        booking: 'Booking',
        reviews: 'Reviews',
        advisory: 'Advisory',
      };
      return {
        title: title || 'Untitled Question',
        subtitle: `${published ? '✅' : '📝'} ${categoryLabels[category] || 'Uncategorized'}`,
      };
    },
  },
  orderings: [
    {
      title: 'Category, then Order',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
});
