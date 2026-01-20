'use client';

import { type PropertyTier } from '@clarus-vitae/database';
import { ScoreBreakdown, type DimensionScore } from '@clarus-vitae/ui';

interface PropertyScoreSectionProps {
  tier: PropertyTier;
  scores: {
    overall: number | null;
    clinicalRigor: number | null;
    outcomeEvidence: number | null;
    programDepth: number | null;
    experienceQuality: number | null;
    valueAlignment: number | null;
    latestAssessment: {
      assessmentDate: Date;
      assessedBy: string;
      methodology: string;
    } | null;
  };
}

export function PropertyScoreSection({ tier, scores }: PropertyScoreSectionProps) {
  if (scores.overall === null) {
    return null;
  }

  // Build dimension scores based on tier
  const dimensionScores: DimensionScore[] = [];

  // Tier 1 properties have Clinical Rigor
  if (tier === 'TIER_1' && scores.clinicalRigor !== null) {
    dimensionScores.push({
      dimension: 'clinicalRigor',
      score: scores.clinicalRigor,
      label: 'Clinical Rigor',
      description: 'Medical credentials, diagnostic depth, evidence-based protocols',
    });
  }

  // Tier 1 & 2 have Outcome Evidence
  if ((tier === 'TIER_1' || tier === 'TIER_2') && scores.outcomeEvidence !== null) {
    dimensionScores.push({
      dimension: 'outcomeEvidence',
      score: scores.outcomeEvidence,
      label: 'Outcome Evidence',
      description: 'Published results, guest-reported outcomes, follow-up protocols',
    });
  }

  // Tier 1 & 2 have Program Depth
  if ((tier === 'TIER_1' || tier === 'TIER_2') && scores.programDepth !== null) {
    dimensionScores.push({
      dimension: 'programDepth',
      score: scores.programDepth,
      label: 'Program Depth',
      description: 'Comprehensiveness, customization, duration options',
    });
  }

  // All tiers have Experience Quality
  if (scores.experienceQuality !== null) {
    dimensionScores.push({
      dimension: 'experienceQuality',
      score: scores.experienceQuality,
      label: 'Experience Quality',
      description: 'Facilities, service, accommodation, dining',
    });
  }

  // All tiers have Value Alignment
  if (scores.valueAlignment !== null) {
    dimensionScores.push({
      dimension: 'valueAlignment',
      score: scores.valueAlignment,
      label: 'Value Alignment',
      description: 'Price relative to what is delivered',
    });
  }

  // Calculate tier average (mock for now - would come from aggregated data)
  const tierAverage = tier === 'TIER_1' ? 82 : tier === 'TIER_2' ? 78 : 75;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-2xl font-medium text-clarus-navy">
          Clarus Index Score
        </h2>
        <p className="mt-2 text-slate">
          Our proprietary evaluation across key dimensions, with transparent methodology.
        </p>

        <div className="mt-8">
          <ScoreBreakdown
            overallScore={scores.overall}
            dimensions={dimensionScores}
            showComparison
            comparisonLabel={`Tier ${tier.split('_')[1]} Average`}
            comparisonScore={tierAverage}
          />
        </div>

        {scores.latestAssessment && (
          <p className="mt-6 text-sm text-slate">
            Last assessed:{' '}
            {new Date(scores.latestAssessment.assessmentDate).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}{' '}
            by {scores.latestAssessment.assessedBy} (Methodology v
            {scores.latestAssessment.methodology})
          </p>
        )}
      </div>
    </section>
  );
}
