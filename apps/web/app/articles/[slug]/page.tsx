/**
 * Article Detail Page
 *
 * Displays full article content with author info and related properties.
 */

import { prisma } from '@clarus-vitae/database';
import {
  getArticleBySlug,
  getArticleSlugs,
  urlFor,
} from '@clarus-vitae/database/sanity';
import { Container } from '@clarus-vitae/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArticleContent } from '../_components/ArticleContent';
import { ArticleHeader } from '../_components/ArticleHeader';
import { RelatedArticles } from '../_components/RelatedArticles';
import { RelatedProperties } from '../_components/RelatedProperties';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const slugs = await getArticleSlugs();
    return slugs.map((slug: string) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  try {
    const article = await getArticleBySlug(params.slug);

    if (!article) {
      return {
        title: 'Article Not Found | Clarus Vitae',
      };
    }

    const title = article.seo?.metaTitle || article.title;
    const description = article.seo?.metaDescription || article.excerpt;

    return {
      title: `${title} | Clarus Vitae`,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: article.publishedAt,
        modifiedTime: article.updatedAt,
        authors: article.authorName ? [article.authorName] : undefined,
        images: article.seo?.ogImage
          ? [urlFor(article.seo.ogImage).width(1200).url()]
          : article.heroImage
            ? [urlFor(article.heroImage).width(1200).url()]
            : undefined,
      },
      robots: article.seo?.noIndex ? { index: false } : undefined,
    };
  } catch {
    return {
      title: 'Article | Clarus Vitae',
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  // Fetch author from PostgreSQL if we have an authorId
  let author: {
    id: string;
    slug: string;
    name: string;
    title: string | null;
    imageUrl: string | null;
    credentials: string[];
  } | null = null;
  if (article.authorId) {
    try {
      const authorData = await prisma.teamMember.findUnique({
        where: { id: article.authorId },
        select: {
          id: true,
          slug: true,
          name: true,
          title: true,
          photoUrl: true,
          credentials: true,
        },
      });
      if (authorData) {
        author = {
          ...authorData,
          imageUrl: authorData.photoUrl,
        };
      }
    } catch {
      // Author fetch failed, continue without author
    }
  }

  // Fetch related properties from PostgreSQL
  interface RelatedProperty {
    id: string;
    slug: string;
    name: string;
    country: string;
    city: string | null;
    tier: number;
    heroImageUrl: string | null;
    propertyScore: { overallScore: number } | null;
  }
  let relatedProperties: RelatedProperty[] = [];
  if (article.relatedProperties?.length) {
    try {
      const propertyData = await prisma.property.findMany({
        where: {
          slug: { in: article.relatedProperties },
        },
        select: {
          id: true,
          slug: true,
          name: true,
          country: true,
          city: true,
          tier: true,
          overallScore: true,
          images: {
            where: { isFeatured: true },
            select: { url: true },
            take: 1,
          },
        },
      });
      // Map to expected interface
      const tierToNumber: Record<string, number> = {
        TIER_1: 1,
        TIER_2: 2,
        TIER_3: 3,
      };
      relatedProperties = propertyData.map((p: {
        id: string;
        slug: string;
        name: string;
        country: string;
        city: string | null;
        tier: string;
        overallScore: number | null;
        images: { url: string }[];
      }) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        country: p.country,
        city: p.city,
        tier: tierToNumber[p.tier] || 3,
        heroImageUrl: p.images[0]?.url || null,
        propertyScore: p.overallScore ? { overallScore: p.overallScore } : null,
      }));
    } catch {
      // Properties fetch failed, continue without related properties
    }
  }

  const categoryLabels: Record<string, string> = {
    longevity: 'Longevity',
    'wellness-trends': 'Wellness Trends',
    'destination-guide': 'Destination Guide',
    'treatment-deep-dive': 'Treatment Deep Dive',
    'expert-interview': 'Expert Interview',
    'industry-news': 'Industry News',
  };

  return (
    <main className="min-h-screen bg-clarus-white">
      <article>
        {/* Breadcrumbs */}
        <div className="border-b border-stone bg-white">
          <Container>
            <nav className="flex items-center gap-2 py-4 text-sm text-slate">
              <Link href="/" className="hover:text-clarus-navy">
                Home
              </Link>
              <span>/</span>
              <Link href="/articles" className="hover:text-clarus-navy">
                Articles
              </Link>
              {article.category && (
                <>
                  <span>/</span>
                  <Link
                    href={`/articles?category=${article.category}`}
                    className="hover:text-clarus-navy"
                  >
                    {categoryLabels[article.category] || article.category}
                  </Link>
                </>
              )}
            </nav>
          </Container>
        </div>

        {/* Article Header */}
        <ArticleHeader
          title={article.title}
          excerpt={article.excerpt}
          category={article.category}
          categoryLabel={categoryLabels[article.category] || article.category}
          publishedAt={article.publishedAt}
          updatedAt={article.updatedAt}
          readingTime={article.readingTime}
          author={author}
          heroImage={article.heroImage}
        />

        {/* Article Content */}
        <section className="py-12 md:py-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <ArticleContent content={article.content} />
            </div>
          </Container>
        </section>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <section className="border-t border-stone bg-warm-gray py-12 md:py-16">
            <Container>
              <RelatedProperties properties={relatedProperties} />
            </Container>
          </section>
        )}

        {/* Related Articles */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <section className="border-t border-stone py-12 md:py-16">
            <Container>
              <RelatedArticles articles={article.relatedArticles} />
            </Container>
          </section>
        )}
      </article>
    </main>
  );
}
