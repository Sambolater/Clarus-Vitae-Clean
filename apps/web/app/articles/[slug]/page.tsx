import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@clarus-vitae/ui';
import {
  getArticleBySlug,
  getArticleSlugs,
  urlFor,
} from '@clarus-vitae/database/sanity';
import { prisma } from '@clarus-vitae/database';
import { ArticleHeader } from '../_components/ArticleHeader';
import { ArticleContent } from '../_components/ArticleContent';
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
  let author = null;
  if (article.authorId) {
    try {
      author = await prisma.teamMember.findUnique({
        where: { id: article.authorId },
        select: {
          id: true,
          slug: true,
          name: true,
          title: true,
          imageUrl: true,
          credentials: true,
        },
      });
    } catch {
      // Author fetch failed, continue without author
    }
  }

  // Fetch related properties from PostgreSQL
  let relatedProperties = [];
  if (article.relatedProperties?.length) {
    try {
      relatedProperties = await prisma.property.findMany({
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
          heroImageUrl: true,
          propertyScore: {
            select: {
              overallScore: true,
            },
          },
        },
      });
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
          urlFor={urlFor}
        />

        {/* Article Content */}
        <section className="py-12 md:py-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <ArticleContent content={article.content} urlFor={urlFor} />
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
              <RelatedArticles articles={article.relatedArticles} urlFor={urlFor} />
            </Container>
          </section>
        )}
      </article>
    </main>
  );
}
