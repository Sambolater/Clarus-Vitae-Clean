import type { Metadata } from 'next';

interface TreatmentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TreatmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Treatment: ${slug}`,
    description: 'Detailed treatment information with evidence levels and property availability.',
  };
}

export default async function TreatmentPage({ params }: TreatmentPageProps) {
  const { slug } = await params;

  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-medium text-clarus-navy">
        Treatment: {slug}
      </h1>
      <p className="mt-4 text-slate">
        Treatment profile details will be implemented in Task 05.
      </p>
    </main>
  );
}
