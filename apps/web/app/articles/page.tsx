import { Container } from '@clarus-vitae/ui';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Articles | Clarus Vitae',
  description:
    'Insights on longevity, wellness trends, treatment deep dives, and destination guides from Clarus Vitae.',
};

export default function ArticlesPage() {
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
              Expert insights and analysis from the Clarus Vitae editorial team.
            </p>
          </div>
        </Container>
      </section>

      {/* Coming Soon Content */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="py-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mb-6 text-5xl">📝</div>
              <h2 className="text-2xl font-serif font-medium text-clarus-navy mb-4">
                Editorial Coming Soon
              </h2>
              <p className="text-slate mb-6">
                Our editorial team is preparing in-depth articles on longevity science, 
                treatment deep dives, and destination guides. Check back soon.
              </p>
              <Link
                href="/properties"
                className="inline-flex h-10 items-center justify-center rounded-md bg-clarus-navy px-6 text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
              >
                Explore Retreats
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
