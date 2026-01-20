/**
 * Search Indexing Utilities
 *
 * Functions to transform database records into search documents
 * and sync them with Meilisearch indexes.
 */

import { db } from '../client';
import { searchClient, SEARCH_INDEXES } from './client';
import { propertiesIndexSettings, treatmentsIndexSettings, articlesIndexSettings } from './config';
import type { PropertySearchDocument, TreatmentSearchDocument, ArticleSearchDocument } from './types';

// ============================================================================
// Index Setup
// ============================================================================

/**
 * Initialize all search indexes with their configurations
 */
export async function initializeSearchIndexes(): Promise<void> {
  console.log('Initializing search indexes...');

  // Create indexes
  await Promise.all([
    searchClient.createIndex(SEARCH_INDEXES.PROPERTIES, { primaryKey: 'id' }),
    searchClient.createIndex(SEARCH_INDEXES.TREATMENTS, { primaryKey: 'id' }),
    searchClient.createIndex(SEARCH_INDEXES.ARTICLES, { primaryKey: 'id' }),
  ]);

  // Wait for index creation
  const propertiesIndex = searchClient.index(SEARCH_INDEXES.PROPERTIES);
  const treatmentsIndex = searchClient.index(SEARCH_INDEXES.TREATMENTS);
  const articlesIndex = searchClient.index(SEARCH_INDEXES.ARTICLES);

  // Configure indexes
  await Promise.all([
    propertiesIndex.updateSettings(propertiesIndexSettings),
    treatmentsIndex.updateSettings(treatmentsIndexSettings),
    articlesIndex.updateSettings(articlesIndexSettings),
  ]);

  console.log('Search indexes initialized successfully');
}

// ============================================================================
// Property Indexing
// ============================================================================

/**
 * Transform a database property into a search document
 */
export function transformPropertyToDocument(
  property: {
    id: string;
    slug: string;
    name: string;
    description: string;
    city: string;
    country: string;
    region: string | null;
    tier: string;
    approach: string | null;
    focusAreas: string[];
    priceMin: number;
    priceMax: number;
    currency: string;
    overallScore: number | null;
    published: boolean;
    verifiedExcellence: boolean;
    editorChoice: string | null;
    risingStar: boolean;
    createdAt: Date;
    images?: { url: string; alt: string }[];
    _count?: { reviews: number };
  }
): PropertySearchDocument {
  return {
    id: property.id,
    slug: property.slug,
    name: property.name,
    description: property.description,
    city: property.city,
    country: property.country,
    region: property.region,
    tier: property.tier as PropertySearchDocument['tier'],
    approach: property.approach as PropertySearchDocument['approach'],
    focusAreas: property.focusAreas as PropertySearchDocument['focusAreas'],
    priceMin: property.priceMin,
    priceMax: property.priceMax,
    currency: property.currency,
    overallScore: property.overallScore,
    published: property.published,
    verifiedExcellence: property.verifiedExcellence,
    editorChoice: property.editorChoice,
    risingStar: property.risingStar,
    featuredImageUrl: property.images?.[0]?.url || null,
    featuredImageAlt: property.images?.[0]?.alt || null,
    reviewCount: property._count?.reviews || 0,
    createdAt: property.createdAt.getTime(),
  };
}

/**
 * Index a single property
 */
export async function indexProperty(propertyId: string): Promise<void> {
  const property = await db.property.findUnique({
    where: { id: propertyId },
    include: {
      images: {
        where: { isFeatured: true },
        take: 1,
        select: { url: true, alt: true },
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!property) {
    console.warn(`Property ${propertyId} not found`);
    return;
  }

  const document = transformPropertyToDocument(property);
  const index = searchClient.index(SEARCH_INDEXES.PROPERTIES);
  await index.addDocuments([document]);
}

/**
 * Remove a property from the search index
 */
export async function removePropertyFromIndex(propertyId: string): Promise<void> {
  const index = searchClient.index(SEARCH_INDEXES.PROPERTIES);
  await index.deleteDocument(propertyId);
}

/**
 * Index all published properties
 */
export async function indexAllProperties(): Promise<number> {
  console.log('Indexing all properties...');

  const properties = await db.property.findMany({
    where: { published: true },
    include: {
      images: {
        where: { isFeatured: true },
        take: 1,
        select: { url: true, alt: true },
      },
      _count: { select: { reviews: true } },
    },
  });

  if (properties.length === 0) {
    console.log('No published properties to index');
    return 0;
  }

  const documents = properties.map(transformPropertyToDocument);
  const index = searchClient.index(SEARCH_INDEXES.PROPERTIES);
  await index.addDocuments(documents);

  console.log(`Indexed ${documents.length} properties`);
  return documents.length;
}

// ============================================================================
// Treatment Indexing
// ============================================================================

/**
 * Transform a database treatment into a search document
 */
export function transformTreatmentToDocument(
  treatment: {
    id: string;
    slug: string;
    name: string;
    aliases: string[];
    category: string;
    description: string;
    howItWorks: string | null;
    whatItAddresses: string[];
    evidenceLevel: string;
    priceRangeMin: number | null;
    priceRangeMax: number | null;
    published: boolean;
    _count?: { properties: number };
  }
): TreatmentSearchDocument {
  return {
    id: treatment.id,
    slug: treatment.slug,
    name: treatment.name,
    aliases: treatment.aliases,
    category: treatment.category as TreatmentSearchDocument['category'],
    description: treatment.description,
    howItWorks: treatment.howItWorks,
    whatItAddresses: treatment.whatItAddresses,
    evidenceLevel: treatment.evidenceLevel as TreatmentSearchDocument['evidenceLevel'],
    priceRangeMin: treatment.priceRangeMin,
    priceRangeMax: treatment.priceRangeMax,
    published: treatment.published,
    propertyCount: treatment._count?.properties || 0,
  };
}

/**
 * Index a single treatment
 */
export async function indexTreatment(treatmentId: string): Promise<void> {
  const treatment = await db.treatment.findUnique({
    where: { id: treatmentId },
    include: {
      _count: { select: { properties: true } },
    },
  });

  if (!treatment) {
    console.warn(`Treatment ${treatmentId} not found`);
    return;
  }

  const document = transformTreatmentToDocument(treatment);
  const index = searchClient.index(SEARCH_INDEXES.TREATMENTS);
  await index.addDocuments([document]);
}

/**
 * Remove a treatment from the search index
 */
export async function removeTreatmentFromIndex(treatmentId: string): Promise<void> {
  const index = searchClient.index(SEARCH_INDEXES.TREATMENTS);
  await index.deleteDocument(treatmentId);
}

/**
 * Index all published treatments
 */
export async function indexAllTreatments(): Promise<number> {
  console.log('Indexing all treatments...');

  const treatments = await db.treatment.findMany({
    where: { published: true },
    include: {
      _count: { select: { properties: true } },
    },
  });

  if (treatments.length === 0) {
    console.log('No published treatments to index');
    return 0;
  }

  const documents = treatments.map(transformTreatmentToDocument);
  const index = searchClient.index(SEARCH_INDEXES.TREATMENTS);
  await index.addDocuments(documents);

  console.log(`Indexed ${documents.length} treatments`);
  return documents.length;
}

// ============================================================================
// Article Indexing
// ============================================================================

/**
 * Transform a database article into a search document
 */
export function transformArticleToDocument(
  article: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    category: string;
    tags: string[];
    authorId: string | null;
    author?: { name: string } | null;
    featuredImage: string | null;
    published: boolean;
    publishedAt: Date | null;
  }
): ArticleSearchDocument {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    // Strip HTML/markdown for search
    content: article.content.replace(/<[^>]*>/g, '').replace(/[#*_~`]/g, ''),
    category: article.category as ArticleSearchDocument['category'],
    tags: article.tags,
    authorId: article.authorId,
    authorName: article.author?.name || null,
    featuredImage: article.featuredImage,
    published: article.published,
    publishedAt: article.publishedAt?.getTime() || null,
  };
}

/**
 * Index a single article
 */
export async function indexArticle(articleId: string): Promise<void> {
  const article = await db.article.findUnique({
    where: { id: articleId },
    include: {
      author: { select: { name: true } },
    },
  });

  if (!article) {
    console.warn(`Article ${articleId} not found`);
    return;
  }

  const document = transformArticleToDocument(article);
  const index = searchClient.index(SEARCH_INDEXES.ARTICLES);
  await index.addDocuments([document]);
}

/**
 * Remove an article from the search index
 */
export async function removeArticleFromIndex(articleId: string): Promise<void> {
  const index = searchClient.index(SEARCH_INDEXES.ARTICLES);
  await index.deleteDocument(articleId);
}

/**
 * Index all published articles
 */
export async function indexAllArticles(): Promise<number> {
  console.log('Indexing all articles...');

  const articles = await db.article.findMany({
    where: { published: true },
    include: {
      author: { select: { name: true } },
    },
  });

  if (articles.length === 0) {
    console.log('No published articles to index');
    return 0;
  }

  const documents = articles.map(transformArticleToDocument);
  const index = searchClient.index(SEARCH_INDEXES.ARTICLES);
  await index.addDocuments(documents);

  console.log(`Indexed ${documents.length} articles`);
  return documents.length;
}

// ============================================================================
// Full Reindex
// ============================================================================

/**
 * Clear and reindex all search content
 */
export async function reindexAll(): Promise<{
  properties: number;
  treatments: number;
  articles: number;
}> {
  console.log('Starting full reindex...');

  // Delete all documents from indexes
  const propertiesIndex = searchClient.index(SEARCH_INDEXES.PROPERTIES);
  const treatmentsIndex = searchClient.index(SEARCH_INDEXES.TREATMENTS);
  const articlesIndex = searchClient.index(SEARCH_INDEXES.ARTICLES);

  await Promise.all([
    propertiesIndex.deleteAllDocuments(),
    treatmentsIndex.deleteAllDocuments(),
    articlesIndex.deleteAllDocuments(),
  ]);

  // Wait for deletions to complete
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Reindex all content
  const [propertiesCount, treatmentsCount, articlesCount] = await Promise.all([
    indexAllProperties(),
    indexAllTreatments(),
    indexAllArticles(),
  ]);

  console.log('Full reindex complete');

  return {
    properties: propertiesCount,
    treatments: treatmentsCount,
    articles: articlesCount,
  };
}

/**
 * Get index statistics
 */
export async function getIndexStats(): Promise<{
  properties: { numberOfDocuments: number; isIndexing: boolean };
  treatments: { numberOfDocuments: number; isIndexing: boolean };
  articles: { numberOfDocuments: number; isIndexing: boolean };
}> {
  const [propertiesStats, treatmentsStats, articlesStats] = await Promise.all([
    searchClient.index(SEARCH_INDEXES.PROPERTIES).getStats(),
    searchClient.index(SEARCH_INDEXES.TREATMENTS).getStats(),
    searchClient.index(SEARCH_INDEXES.ARTICLES).getStats(),
  ]);

  return {
    properties: {
      numberOfDocuments: propertiesStats.numberOfDocuments,
      isIndexing: propertiesStats.isIndexing,
    },
    treatments: {
      numberOfDocuments: treatmentsStats.numberOfDocuments,
      isIndexing: treatmentsStats.isIndexing,
    },
    articles: {
      numberOfDocuments: articlesStats.numberOfDocuments,
      isIndexing: articlesStats.isIndexing,
    },
  };
}
