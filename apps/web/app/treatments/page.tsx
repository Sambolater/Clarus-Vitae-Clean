import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Treatments',
  description:
    'Explore wellness treatments and modalities with evidence-based information and property availability.',
};

export default function TreatmentsPage() {
  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-medium text-clarus-navy">
        Treatment Database
      </h1>
      <p className="mt-4 text-slate">
        Treatment listings will be implemented in Task 05.
      </p>
    </main>
  );
}
