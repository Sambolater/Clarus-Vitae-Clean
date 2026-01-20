'use client';

import { cn } from '@clarus-vitae/utils';

interface TreatmentInfoSectionsProps {
  howItWorks: string | null;
  whatItAddresses: string[];
  typicalProtocol: string | null;
  evidenceSummary: string | null;
  potentialRisks: string | null;
  contraindications: string[];
}

export function TreatmentInfoSections({
  howItWorks,
  whatItAddresses,
  typicalProtocol,
  evidenceSummary,
  potentialRisks,
  contraindications,
}: TreatmentInfoSectionsProps) {
  return (
    <div className="space-y-12">
      {/* How It Works */}
      {howItWorks && (
        <section>
          <h2 className="font-display text-2xl font-medium text-clarus-navy">How It Works</h2>
          <div className="mt-4 rounded-lg border border-stone bg-white p-6">
            <p className="text-slate leading-relaxed whitespace-pre-line">{howItWorks}</p>
          </div>
        </section>
      )}

      {/* What It Addresses */}
      {whatItAddresses.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-medium text-clarus-navy">What It Addresses</h2>
          <p className="mt-2 text-sm text-slate">
            This treatment is commonly used for the following health goals and conditions:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {whatItAddresses.map((item, index) => (
              <span
                key={index}
                className="rounded-full bg-clarus-navy/5 px-4 py-2 text-sm font-medium text-clarus-navy"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Typical Protocol */}
      {typicalProtocol && (
        <section>
          <h2 className="font-display text-2xl font-medium text-clarus-navy">Typical Protocol</h2>
          <div className="mt-4 rounded-lg border border-stone bg-white p-6">
            <p className="text-slate leading-relaxed whitespace-pre-line">{typicalProtocol}</p>
          </div>
        </section>
      )}

      {/* Evidence & Research */}
      {evidenceSummary && (
        <section>
          <h2 className="font-display text-2xl font-medium text-clarus-navy">Evidence & Research</h2>
          <div className="mt-4 rounded-lg border border-stone bg-white p-6">
            <p className="text-slate leading-relaxed whitespace-pre-line">{evidenceSummary}</p>
          </div>
        </section>
      )}

      {/* Potential Considerations */}
      {(potentialRisks || contraindications.length > 0) && (
        <section>
          <h2 className="font-display text-2xl font-medium text-clarus-navy">
            Potential Considerations
          </h2>

          {potentialRisks && (
            <div className="mt-4 rounded-lg border border-alert-amber/30 bg-alert-amber/5 p-6">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-alert-amber"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-medium text-clarus-navy">Potential Risks</h3>
                  <p className="mt-2 text-sm text-slate leading-relaxed whitespace-pre-line">
                    {potentialRisks}
                  </p>
                </div>
              </div>
            </div>
          )}

          {contraindications.length > 0 && (
            <div className="mt-4 rounded-lg border border-error-red/30 bg-error-red/5 p-6">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-error-red"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-medium text-clarus-navy">Contraindications</h3>
                  <p className="mt-2 mb-3 text-sm text-slate">
                    This treatment may not be suitable for individuals with:
                  </p>
                  <ul className="space-y-1">
                    {contraindications.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate">
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-error-red" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
