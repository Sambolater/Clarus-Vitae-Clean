import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Properties',
  description:
    'Compare wellness properties side-by-side with Clarus Index scores and detailed assessments.',
};

export default function ComparePage() {
  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-medium text-clarus-navy">
        Compare Properties
      </h1>
      <p className="mt-4 text-slate">
        Comparison tool will be implemented in Task 09.
      </p>
    </main>
  );
}
