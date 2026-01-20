/**
 * Dynamic Sitemap Generation
 *
 * Generates a sitemap.xml for search engine crawlers.
 * Includes all published properties, treatments, articles, and static pages.
 */

import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://clarusvitae.com';

// Lazy import db to avoid build-time failures when Prisma isn't generated
async function getDb() {
  try {
    const { db } = await import('@clarus-vitae/database');
    return db;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/treatments`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about/methodology`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const db = await getDb();

  // Fetch published properties
  let propertyPages: MetadataRoute.Sitemap = [];
  try {
    if (!db) throw new Error('Database not available');
    const properties = await db.property.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    propertyPages = properties.map((property: { slug: string; updatedAt: Date }) => ({
      url: `${BASE_URL}/properties/${property.slug}`,
      lastModified: property.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch {
    // Database not available - continue without dynamic property pages
  }

  // Fetch published treatments
  let treatmentPages: MetadataRoute.Sitemap = [];
  try {
    if (!db) throw new Error('Database not available');
    const treatments = await db.treatment.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    treatmentPages = treatments.map((treatment: { slug: string; updatedAt: Date }) => ({
      url: `${BASE_URL}/treatments/${treatment.slug}`,
      lastModified: treatment.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {
    // Database not available - continue without dynamic treatment pages
  }

  // Fetch diagnostics
  let diagnosticPages: MetadataRoute.Sitemap = [];
  try {
    if (!db) throw new Error('Database not available');
    const diagnostics = await db.diagnostic.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    diagnosticPages = diagnostics.map((diagnostic: { slug: string; updatedAt: Date }) => ({
      url: `${BASE_URL}/diagnostics/${diagnostic.slug}`,
      lastModified: diagnostic.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    // Database not available
  }

  // Fetch equipment (no published filter - all equipment is public)
  let equipmentPages: MetadataRoute.Sitemap = [];
  try {
    if (!db) throw new Error('Database not available');
    const equipment = await db.equipment.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    equipmentPages = equipment.map((item: { slug: string; updatedAt: Date }) => ({
      url: `${BASE_URL}/equipment/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    // Database not available
  }

  // Fetch articles
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    if (!db) throw new Error('Database not available');
    const articles = await db.article.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
    });

    articlePages = articles.map((article: { slug: string; updatedAt: Date; publishedAt: Date | null }) => ({
      url: `${BASE_URL}/articles/${article.slug}`,
      lastModified: article.updatedAt || article.publishedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    // Database not available
  }

  // Fetch team members
  let teamPages: MetadataRoute.Sitemap = [];
  try {
    if (!db) throw new Error('Database not available');
    const teamMembers = await db.teamMember.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    teamPages = teamMembers.map((member: { slug: string; updatedAt: Date }) => ({
      url: `${BASE_URL}/team/${member.slug}`,
      lastModified: member.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));
  } catch {
    // Database not available
  }

  // Fetch unique countries for destination pages
  let destinationPages: MetadataRoute.Sitemap = [];
  try {
    if (!db) throw new Error('Database not available');
    const countries = await db.property.findMany({
      where: { published: true },
      select: { country: true },
      distinct: ['country'],
    });

    destinationPages = countries.map((item: { country: string }) => ({
      url: `${BASE_URL}/properties/destination/${encodeURIComponent(item.country.toLowerCase().replace(/\s+/g, '-'))}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    // Database not available
  }

  // Focus area pages (using the FocusArea enum values)
  const focusAreaSlugs = [
    'longevity',
    'detox',
    'weight-metabolic',
    'stress-burnout',
    'fitness-performance',
    'beauty-aesthetic',
    'holistic-spiritual',
    'medical-assessment',
    'post-illness',
    'addiction-behavioral',
    'cognitive-brain',
    'sleep',
    'womens-health',
    'mens-health',
    'general-rejuvenation',
  ];

  const focusPages: MetadataRoute.Sitemap = focusAreaSlugs.map((slug) => ({
    url: `${BASE_URL}/properties/focus/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Tier pages
  const tierPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/properties/tier/medical-longevity`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/properties/tier/integrated-wellness`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/properties/tier/luxury-destination`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  return [
    ...staticPages,
    ...propertyPages,
    ...treatmentPages,
    ...diagnosticPages,
    ...equipmentPages,
    ...articlePages,
    ...teamPages,
    ...destinationPages,
    ...focusPages,
    ...tierPages,
  ];
}
