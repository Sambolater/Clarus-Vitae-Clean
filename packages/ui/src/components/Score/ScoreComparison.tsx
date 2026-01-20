import { cn } from '@clarus-vitae/utils';
import { type HTMLAttributes, forwardRef } from 'react';
import { type IndexDimension, type DimensionScore } from './ScoreBreakdown';

export interface ComparisonProperty {
  id: string;
  name: string;
  overallScore: number;
  dimensions: DimensionScore[];
}

export interface ScoreComparisonProps extends HTMLAttributes<HTMLDivElement> {
  properties: ComparisonProperty[];
  highlightBest?: boolean;
}

const dimensionLabels: Record<IndexDimension, string> = {
  scientific_rigor: 'Scientific Rigor',
  safety_profile: 'Safety Profile',
  efficacy_data: 'Efficacy Data',
  provider_quality: 'Provider Quality',
  value_alignment: 'Value Alignment',
};

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-verification-green';
  if (score >= 70) return 'text-clarus-navy';
  if (score >= 50) return 'text-slate';
  return 'text-alert-amber';
}

/**
 * ScoreComparison component for side-by-side property comparison.
 *
 * Displays multiple properties with their Clarus Index scores in a comparison table format.
 */
export const ScoreComparison = forwardRef<HTMLDivElement, ScoreComparisonProps>(
  ({ properties, highlightBest = true, className, ...props }, ref) => {
    const dimensions: IndexDimension[] = [
      'scientific_rigor',
      'safety_profile',
      'efficacy_data',
      'provider_quality',
      'value_alignment',
    ];

    // Find best scores for each dimension
    const bestScores = highlightBest
      ? dimensions.reduce(
          (acc, dim) => {
            const scores = properties.map(
              (p) => p.dimensions.find((d) => d.dimension === dim)?.score || 0
            );
            acc[dim] = Math.max(...scores);
            return acc;
          },
          {} as Record<IndexDimension, number>
        )
      : ({} as Record<IndexDimension, number>);

    const bestOverall = highlightBest ? Math.max(...properties.map((p) => p.overallScore)) : 0;

    return (
      <div ref={ref} className={cn('overflow-x-auto', className)} {...props}>
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b border-stone">
              <th className="py-3 pr-4 text-left text-sm font-medium text-slate uppercase tracking-wide">
                Dimension
              </th>
              {properties.map((property) => (
                <th
                  key={property.id}
                  className="px-4 py-3 text-center text-sm font-medium text-clarus-navy"
                >
                  {property.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Overall Score Row */}
            <tr className="border-b border-stone bg-warm-gray/50">
              <td className="py-4 pr-4 text-sm font-semibold text-clarus-navy">Overall Score</td>
              {properties.map((property) => (
                <td key={property.id} className="px-4 py-4 text-center">
                  <span
                    className={cn(
                      'font-display text-2xl',
                      highlightBest && property.overallScore === bestOverall
                        ? 'text-clarus-gold'
                        : getScoreColor(property.overallScore)
                    )}
                  >
                    {property.overallScore}
                  </span>
                  {highlightBest && property.overallScore === bestOverall && (
                    <span className="ml-1 text-xs text-clarus-gold">★</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Dimension Rows */}
            {dimensions.map((dimension) => (
              <tr key={dimension} className="border-b border-stone/50">
                <td className="py-3 pr-4 text-sm text-clarus-navy">
                  {dimensionLabels[dimension]}
                </td>
                {properties.map((property) => {
                  const dimScore = property.dimensions.find((d) => d.dimension === dimension);
                  const score = dimScore?.score || 0;
                  const isBest = highlightBest && score === bestScores[dimension] && score > 0;

                  return (
                    <td key={property.id} className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          'text-lg font-medium',
                          isBest ? 'text-clarus-gold' : getScoreColor(score)
                        )}
                      >
                        {score}
                      </span>
                      {isBest && <span className="ml-0.5 text-xs text-clarus-gold">★</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

ScoreComparison.displayName = 'ScoreComparison';
