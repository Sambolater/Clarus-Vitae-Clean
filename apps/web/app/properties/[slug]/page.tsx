import type { Metadata } from 'next';

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Property: ${slug}`,
    description: 'Detailed property profile with Clarus Index score and comprehensive assessment.',
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;

  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-medium text-clarus-navy">
        Property Profile: {slug}
      </h1>
      <p className="mt-4 text-slate">
        Property profile details will be implemented in Task 04.
      </p>
    </main>
  );
}
