import { defineType, defineField } from 'sanity';

/**
 * Glossary Term Document Schema
 * For wellness and longevity terminology definitions.
 * Helps users understand industry-specific terms with evidence-based explanations.
 */
export default defineType({
  name: 'glossaryTerm',
  title: 'Glossary Term',
  type: 'document',
  fields: [
    defineField({
      name: 'term',
      title: 'Term',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The term to define (e.g., "NAD+ Therapy", "Biological Age").',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'term',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDefinition',
      title: 'Short Definition',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required().max(200),
      description: 'A concise definition for tooltips and quick reference (max 200 characters).',
    }),
    defineField({
      name: 'fullDefinition',
      title: 'Full Definition',
      type: 'portableText',
      description: 'Comprehensive explanation with context and evidence.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Longevity & Anti-aging', value: 'longevity' },
          { title: 'Diagnostics & Testing', value: 'diagnostics' },
          { title: 'Treatments & Therapies', value: 'treatments' },
          { title: 'Wellness Practices', value: 'wellness' },
          { title: 'Medical Terms', value: 'medical' },
          { title: 'Nutrition & Supplements', value: 'nutrition' },
          { title: 'Mental Health', value: 'mental-health' },
          { title: 'Technology & Equipment', value: 'technology' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'aliases',
      title: 'Aliases / Alternative Names',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Other names this term is known by.',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'evidenceLevel',
      title: 'Evidence Level',
      type: 'string',
      options: {
        list: [
          { title: 'Strong Evidence', value: 'strong' },
          { title: 'Moderate Evidence', value: 'moderate' },
          { title: 'Emerging Evidence', value: 'emerging' },
          { title: 'Limited Evidence', value: 'limited' },
          { title: 'Traditional/Historical', value: 'traditional' },
        ],
      },
      description: 'The strength of scientific evidence supporting this treatment or concept.',
    }),
    defineField({
      name: 'relatedTerms',
      title: 'Related Terms',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'glossaryTerm' }] }],
      description: 'Other glossary terms that are related.',
    }),
    defineField({
      name: 'relatedTreatments',
      title: 'Related Treatments',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Treatment slugs from PostgreSQL.',
    }),
    defineField({
      name: 'sources',
      title: 'Sources & References',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Source Title' },
            { name: 'url', type: 'url', title: 'URL' },
            { name: 'publication', type: 'string', title: 'Publication/Journal' },
            { name: 'year', type: 'number', title: 'Year' },
          ],
        },
      ],
      description: 'Scientific sources backing the definition.',
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
      title: 'term',
      category: 'category',
      evidenceLevel: 'evidenceLevel',
      published: 'isPublished',
    },
    prepare({ title, category, evidenceLevel, published }) {
      const categoryLabels: Record<string, string> = {
        longevity: '🧬',
        diagnostics: '🔬',
        treatments: '💉',
        wellness: '🧘',
        medical: '⚕️',
        nutrition: '🥗',
        'mental-health': '🧠',
        technology: '🔧',
      };
      const evidenceEmoji: Record<string, string> = {
        strong: '✅',
        moderate: '📊',
        emerging: '🔄',
        limited: '⚠️',
        traditional: '📜',
      };
      return {
        title: title || 'Untitled Term',
        subtitle: `${published ? '' : '📝 '} ${categoryLabels[category] || ''} ${evidenceEmoji[evidenceLevel] || ''} ${category || ''}`,
      };
    },
  },
  orderings: [
    {
      title: 'Term (A-Z)',
      name: 'termAsc',
      by: [{ field: 'term', direction: 'asc' }],
    },
    {
      title: 'Category, then Term',
      name: 'categoryTerm',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'term', direction: 'asc' },
      ],
    },
  ],
});
