# 13 - CONTENT & EDITORIAL SYSTEM
## Sanity CMS Integration & Content Architecture

> **Reference**: See `00_MASTER_PROJECT_BRIEF.md` for technical stack (Sanity CMS for editorial content) and content requirements.

---

## Task Objective

Set up Sanity CMS for all editorial content - articles, guides, methodology explanations, and marketing pages. Property data lives in PostgreSQL; editorial content lives in Sanity.

---

## Content Types

### What Goes in Sanity (Editorial)
- Articles and guides
- Methodology pages
- Legal pages (Privacy, Terms)
- About pages content
- Marketing landing pages
- FAQ content
- Glossary/terminology

### What Stays in PostgreSQL (Structured Data)
- Properties
- Treatments
- Reviews
- Inquiries
- Team member data
- Scores

---

## Deliverables

### 1. Sanity Studio Setup

```
apps/cms/
├── sanity.config.ts
├── sanity.cli.ts
├── schemas/
│   ├── index.ts
│   ├── documents/
│   │   ├── article.ts
│   │   ├── guide.ts
│   │   ├── page.ts
│   │   ├── faq.ts
│   │   └── glossaryTerm.ts
│   ├── objects/
│   │   ├── portableText.ts
│   │   ├── seo.ts
│   │   ├── author.ts
│   │   └── callToAction.ts
│   └── components/
│       └── customInputs.ts
├── desk/
│   └── deskStructure.ts
└── package.json
```

### 2. Article Schema

```typescript
// apps/cms/schemas/documents/article.ts

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required().max(100)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'teamMember' }],  // References PostgreSQL team member
      description: 'Team member ID from the database'
    }),
    defineField({
      name: 'authorId',
      title: 'Author ID',
      type: 'string',
      description: 'UUID of team member in PostgreSQL'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime'
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Longevity', value: 'longevity' },
          { title: 'Wellness Trends', value: 'wellness-trends' },
          { title: 'Destination Guide', value: 'destination-guide' },
          { title: 'Treatment Deep Dive', value: 'treatment-deep-dive' },
          { title: 'Expert Interview', value: 'expert-interview' },
          { title: 'Industry News', value: 'industry-news' }
        ]
      }
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().max(300)
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt Text', type: 'string' },
        { name: 'caption', title: 'Caption', type: 'string' }
      ]
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'portableText'
    }),
    defineField({
      name: 'relatedProperties',
      title: 'Related Properties',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Property slugs from PostgreSQL'
    }),
    defineField({
      name: 'relatedTreatments',
      title: 'Related Treatments',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Treatment slugs from PostgreSQL'
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo'
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'In Review', value: 'review' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' }
        ]
      },
      initialValue: 'draft'
    })
  ],
  preview: {
    select: {
      title: 'title',
      author: 'authorId',
      media: 'heroImage',
      status: 'status'
    },
    prepare({ title, status, media }) {
      return {
        title,
        subtitle: status,
        media
      };
    }
  }
});
```

### 3. Portable Text Schema (Rich Content)

```typescript
// apps/cms/schemas/objects/portableText.ts

import { defineType, defineArrayMember } from 'sanity';

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
        { title: 'Quote', value: 'blockquote' }
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' }
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              { name: 'href', type: 'url', title: 'URL' },
              { name: 'openInNewTab', type: 'boolean', title: 'Open in new tab' }
            ]
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal Link',
            fields: [
              {
                name: 'reference',
                type: 'reference',
                to: [{ type: 'article' }, { type: 'guide' }, { type: 'page' }]
              }
            ]
          }
        ]
      }
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text' },
        { name: 'caption', type: 'string', title: 'Caption' }
      ]
    }),
    defineArrayMember({
      name: 'propertyCard',
      type: 'object',
      title: 'Property Card',
      fields: [
        { name: 'propertySlug', type: 'string', title: 'Property Slug' }
      ],
      preview: {
        select: { slug: 'propertySlug' },
        prepare({ slug }) {
          return { title: `Property: ${slug}` };
        }
      }
    }),
    defineArrayMember({
      name: 'treatmentCard',
      type: 'object',
      title: 'Treatment Card',
      fields: [
        { name: 'treatmentSlug', type: 'string', title: 'Treatment Slug' }
      ]
    }),
    defineArrayMember({
      name: 'comparisonTable',
      type: 'object',
      title: 'Property Comparison',
      fields: [
        {
          name: 'propertySlugs',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Property Slugs'
        }
      ]
    }),
    defineArrayMember({
      name: 'callout',
      type: 'object',
      title: 'Callout Box',
      fields: [
        { name: 'type', type: 'string', options: { list: ['info', 'warning', 'tip', 'expert'] } },
        { name: 'title', type: 'string' },
        { name: 'content', type: 'text' }
      ]
    }),
    defineArrayMember({
      name: 'video',
      type: 'object',
      title: 'Video Embed',
      fields: [
        { name: 'url', type: 'url', title: 'Video URL' },
        { name: 'caption', type: 'string' }
      ]
    })
  ]
});
```

### 4. SEO Object Schema

```typescript
// apps/cms/schemas/objects/seo.ts

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      validation: Rule => Rule.max(60),
      description: 'Max 60 characters'
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(160),
      description: 'Max 160 characters'
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description: '1200x630 recommended'
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from Search Engines',
      type: 'boolean',
      initialValue: false
    })
  ]
});
```

### 5. Guide Schema (Long-form Content)

```typescript
// apps/cms/schemas/documents/guide.ts

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    }),
    defineField({
      name: 'guideType',
      title: 'Guide Type',
      type: 'string',
      options: {
        list: [
          { title: 'Destination Guide', value: 'destination' },
          { title: 'Treatment Guide', value: 'treatment' },
          { title: 'Focus Area Guide', value: 'focus-area' },
          { title: 'Planning Guide', value: 'planning' }
        ]
      }
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'tableOfContents',
      title: 'Table of Contents',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', type: 'string' },
          { name: 'anchor', type: 'string' }
        ]
      }]
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', type: 'string' },
          { name: 'anchor', type: 'string' },
          { name: 'content', type: 'portableText' }
        ]
      }]
    }),
    defineField({
      name: 'relatedGuides',
      title: 'Related Guides',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'guide' }] }]
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo'
    }),
    defineField({
      name: 'authorId',
      title: 'Author ID',
      type: 'string'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime'
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['draft', 'review', 'published', 'archived']
      }
    })
  ]
});
```

### 6. Static Page Schema

```typescript
// apps/cms/schemas/documents/page.ts

import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Legal', value: 'legal' },
          { title: 'About', value: 'about' },
          { title: 'Landing', value: 'landing' }
        ]
      }
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'portableText'
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo'
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime'
    })
  ]
});
```

### 7. Sanity Client Setup

```typescript
// packages/database/src/sanity/client.ts

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production'
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

// GROQ queries
export const queries = {
  allArticles: `*[_type == "article" && status == "published"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    heroImage,
    category,
    authorId,
    publishedAt
  }`,
  
  articleBySlug: `*[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    heroImage,
    content,
    category,
    authorId,
    publishedAt,
    updatedAt,
    relatedProperties,
    relatedTreatments,
    seo
  }`,
  
  allGuides: `*[_type == "guide" && status == "published"] | order(publishedAt desc)`,
  
  guideBySlug: `*[_type == "guide" && slug.current == $slug][0]`,
  
  pageBySlug: `*[_type == "page" && slug.current == $slug][0]`
};

// Fetch functions
export async function getArticles() {
  return sanityClient.fetch(queries.allArticles);
}

export async function getArticleBySlug(slug: string) {
  return sanityClient.fetch(queries.articleBySlug, { slug });
}

export async function getGuides() {
  return sanityClient.fetch(queries.allGuides);
}

export async function getGuideBySlug(slug: string) {
  return sanityClient.fetch(queries.guideBySlug, { slug });
}

export async function getPageBySlug(slug: string) {
  return sanityClient.fetch(queries.pageBySlug, { slug });
}
```

### 8. Portable Text Renderer

```typescript
// packages/ui/src/components/content/PortableTextRenderer.tsx

import { PortableText, PortableTextComponents } from '@portabletext/react';
import { PropertyCardEmbed } from './PropertyCardEmbed';
import { TreatmentCardEmbed } from './TreatmentCardEmbed';
import { ComparisonTableEmbed } from './ComparisonTableEmbed';
import { Callout } from './Callout';
import { VideoEmbed } from './VideoEmbed';

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <figure className="my-8">
        <img src={urlFor(value).width(800).url()} alt={value.alt || ''} className="rounded-lg" />
        {value.caption && <figcaption className="text-sm text-gray-500 mt-2">{value.caption}</figcaption>}
      </figure>
    ),
    propertyCard: ({ value }) => <PropertyCardEmbed slug={value.propertySlug} />,
    treatmentCard: ({ value }) => <TreatmentCardEmbed slug={value.treatmentSlug} />,
    comparisonTable: ({ value }) => <ComparisonTableEmbed slugs={value.propertySlugs} />,
    callout: ({ value }) => <Callout type={value.type} title={value.title}>{value.content}</Callout>,
    video: ({ value }) => <VideoEmbed url={value.url} caption={value.caption} />
  },
  block: {
    h2: ({ children }) => <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-semibold mt-4 mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-emerald-500 pl-4 italic my-6">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>
  },
  marks: {
    link: ({ children, value }) => (
      <a 
        href={value.href} 
        target={value.openInNewTab ? '_blank' : undefined}
        rel={value.openInNewTab ? 'noopener noreferrer' : undefined}
        className="text-emerald-600 hover:underline"
      >
        {children}
      </a>
    ),
    internalLink: ({ children, value }) => (
      <Link href={`/${value.reference._type}/${value.reference.slug.current}`} className="text-emerald-600 hover:underline">
        {children}
      </Link>
    )
  }
};

export function PortableTextRenderer({ content }: { content: any }) {
  return <PortableText value={content} components={components} />;
}
```

### 9. Article Page

```typescript
// apps/web/app/articles/[slug]/page.tsx

import { getArticleBySlug, getArticles } from '@clarus/database/sanity';
import { getTeamMemberById } from '@clarus/database';
import { PortableTextRenderer } from '@clarus/ui';
import { EditorialByline } from '@clarus/ui';

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article: any) => ({ slug: article.slug.current }));
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  const author = article.authorId ? await getTeamMemberById(article.authorId) : null;
  
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-8">
        <p className="text-emerald-600 mb-2">{article.category}</p>
        <h1 className="text-4xl font-serif mb-4">{article.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
        {author && <EditorialByline author={author} publishDate={article.publishedAt} />}
      </header>
      
      {article.heroImage && (
        <img 
          src={urlFor(article.heroImage).width(1200).url()} 
          alt={article.heroImage.alt || article.title}
          className="w-full rounded-lg mb-8"
        />
      )}
      
      <div className="prose prose-lg">
        <PortableTextRenderer content={article.content} />
      </div>
      
      {article.relatedProperties?.length > 0 && (
        <RelatedProperties slugs={article.relatedProperties} />
      )}
    </article>
  );
}
```

---

## Acceptance Criteria

- [ ] Sanity Studio running and accessible
- [ ] All schemas created and working
- [ ] Articles can be created, edited, published
- [ ] Guides with sections working
- [ ] Portable Text renders all custom blocks
- [ ] Property/Treatment embeds pull from PostgreSQL
- [ ] SEO fields populate meta tags
- [ ] Author bylines link to team profiles
- [ ] Content previews working in Studio
- [ ] GROQ queries optimized

---

## Notes

- Keep editorial in Sanity, structured data in PostgreSQL
- Use slugs to reference between systems
- Implement webhook for content updates (ISR)
- Consider preview mode for editors

---

*Content is what establishes authority. Make it easy to create and beautiful to read.*
