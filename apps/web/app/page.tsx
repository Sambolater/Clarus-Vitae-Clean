export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <h1 className="font-display text-5xl font-medium tracking-tight text-clarus-navy md:text-6xl">
          The Wellness Industry Has a Trust Problem.
        </h1>
        <p className="mt-6 text-lg text-slate leading-relaxed">
          We solve it with verified intelligence, transparent methodology, and experts who put
          their names behind every assessment.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="/properties"
            className="inline-flex h-12 items-center justify-center rounded-md bg-clarus-navy px-8 text-sm font-medium text-white transition-colors hover:bg-clarus-navy/90"
          >
            Explore Properties
          </a>
          <a
            href="/treatments"
            className="inline-flex h-12 items-center justify-center rounded-md border border-clarus-navy px-8 text-sm font-medium text-clarus-navy transition-colors hover:bg-stone"
          >
            Browse Treatments
          </a>
        </div>
        <p className="mt-12 text-sm text-slate">
          No tracking. No cookies. No footprint.
        </p>
      </div>
    </main>
  );
}
