import { getArticles, getArticlesByCategory, type ArticleCategory } from '@clarus-vitae/database/sanity';
import { Container } from '@clarus-vitae/ui';
import type { Metadata } from 'next';
import Link from 'next/link';

import { ArticleCategoryNav } from './_components/ArticleCategoryNav';
import { ArticleGrid } from './_components/ArticleGrid';

export const metadata: Metadata = {
  title: 'Articles | Clarus Vitae',
  description:
    'Expert insights on longevity, wellness trends, treatment deep dives, and destination guides from the Clarus Vitae editorial team.',
};

interface ArticlesPageProps {
  searchParams: { category?: ArticleCategory };
}

const categoryDescriptions: Record<string, string> = {
  longevity: 'Evidence-based insights on longevity science and anti-aging strategies.',
  'wellness-trends': 'Analysis of emerging wellness trends and their effectiveness.',
  'destination-guide': 'Comprehensive guides to the world\'s finest wellness destinations.',
  'treatment-deep-dive': 'In-depth examinations of specific treatments and protocols.',
  'expert-interview': 'Conversations with leading practitioners and researchers.',
  'industry-news': 'Important developments in the premium wellness industry.',
};

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const category = searchParams.category;

  const articles = category
    ? await getArticlesByCategory(category)
    : await getArticles();

  const description = category
    ? categoryDescriptions[category]
    : 'Expert insights and analysis from the Clarus Vitae editorial team.';

  return (
    <main className="min-h-screen bg-clarus-white">
      {/* Hero Section */}
      <section className="bg-clarus-navy py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl font-medium text-white md:text-5xl">
              Editorial
            </h1>
            <p className="mt-4 text-lg text-white/80">
              {description}
            </p>
          </div>
        </Container>
      </section>

      {/* Category Navigation */}
      <section className="border-b border-stone bg-white">
        <Container>
          <ArticleCategoryNav currentCategory={category} />
        </Container>
      </section>

      {/* Articles Grid */}
      <section className="py-12 md:py-16">
        <Container>
          {articles.length > 0 ? (
            <ArticleGrid articles={articles} />
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg text-slate">
                No articles found{category ? ` in ${category.replace('-', ' ')}` : ''}.
              </p>
              {category && (
                <Link
                  href="/articles"
                  className="mt-4 inline-block text-clarus-navy underline hover:text-clarus-gold"
                >
                  View all articles
                </Link>
              )}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
