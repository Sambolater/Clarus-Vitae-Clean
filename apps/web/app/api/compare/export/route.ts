/**
 * POST /api/compare/export
 *
 * Generates a PDF export of the property comparison.
 * Uses server-side HTML rendering for consistent output.
 *
 * Note: For full PDF generation, a library like puppeteer or @react-pdf/renderer
 * would be needed. This implementation provides a downloadable HTML report
 * that can be printed to PDF by the user.
 */

import { db } from '@clarus-vitae/database';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MAX_COMPARISON_ITEMS = 4;

const tierLabels: Record<string, string> = {
  TIER_1: 'Medical Longevity',
  TIER_2: 'Integrated Wellness',
  TIER_3: 'Luxury Destination',
};

const focusAreaLabels: Record<string, string> = {
  LONGEVITY: 'Longevity & Anti-aging',
  DETOX: 'Detox & Reset',
  WEIGHT_METABOLIC: 'Weight & Metabolic Health',
  STRESS_BURNOUT: 'Stress & Burnout Recovery',
  FITNESS_PERFORMANCE: 'Fitness & Performance',
  BEAUTY_AESTHETIC: 'Beauty & Aesthetic',
  HOLISTIC_SPIRITUAL: 'Holistic & Spiritual',
  MEDICAL_ASSESSMENT: 'Medical Assessment',
  POST_ILLNESS: 'Post-illness Recovery',
  ADDICTION_BEHAVIORAL: 'Addiction & Behavioral',
  COGNITIVE_BRAIN: 'Cognitive & Brain Health',
  SLEEP: 'Sleep Optimization',
  WOMENS_HEALTH: "Women's Health",
  MENS_HEALTH: "Men's Health",
  GENERAL_REJUVENATION: 'General Rejuvenation',
};

function getScoreTier(score: number | null): string {
  if (!score) return 'Not rated';
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Distinguished';
  if (score >= 70) return 'Notable';
  return 'Curated';
}

function formatPrice(min: number, max: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency });
  return `${formatter.format(min)} - ${formatter.format(max)}`;
}

export async function POST(request: NextRequest) {
  try {
    const { propertyIds } = await request.json();

    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid propertyIds' },
        { status: 400 }
      );
    }

    const slugs = propertyIds.slice(0, MAX_COMPARISON_ITEMS);

    // Fetch properties
    const properties = await db.property.findMany({
      where: {
        slug: { in: slugs },
        published: true,
      },
      include: {
        treatments: {
          include: {
            treatment: {
              select: {
                name: true,
                category: true,
              },
            },
          },
        },
        reviews: {
          where: { status: 'APPROVED' },
          select: {
            overallRating: true,
          },
        },
      },
    });

    // Sort to match requested order
    const sortedProperties = slugs
      .map((slug: string) => properties.find((p: typeof properties[0]) => p.slug === slug))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);

    if (sortedProperties.length === 0) {
      return NextResponse.json(
        { error: 'No valid properties found' },
        { status: 404 }
      );
    }

    // Generate HTML report
    const html = generateComparisonHTML(sortedProperties);

    // Return as HTML file download
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="clarus-vitae-comparison-${Date.now()}.html"`,
      },
    });
  } catch (error) {
    console.error('Error generating comparison export:', error);
    return NextResponse.json(
      { error: 'Failed to generate comparison export' },
      { status: 500 }
    );
  }
}

function generateComparisonHTML(properties: any[]): string {
  const propertyNames = properties.map(p => p.name).join(' vs ');
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const propertyColumns = properties.map((p) => {
    const reviewCount = p.reviews.length;
    const _avgRating = reviewCount > 0
      ? (p.reviews.reduce((sum: number, r: any) => sum + r.overallRating, 0) / reviewCount).toFixed(1)
      : 'N/A';

    return `
      <td class="property-col">
        <div class="property-header">
          <h3>${p.name}</h3>
          <p class="location">${p.city}, ${p.country}</p>
          <span class="tier">${tierLabels[p.tier] || p.tier}</span>
          ${p.overallScore ? `<div class="score">${p.overallScore}<span>/100</span></div>` : ''}
        </div>
      </td>
    `;
  }).join('');

  const createDataRow = (label: string, values: string[]): string => {
    const cells = values.map(v => `<td>${v || '—'}</td>`).join('');
    return `<tr><th>${label}</th>${cells}</tr>`;
  };

  // Overview section
  const overviewRows = [
    createDataRow('Property Tier', properties.map(p => tierLabels[p.tier] || p.tier)),
    createDataRow('Location', properties.map(p => `${p.city}, ${p.country}`)),
    createDataRow('Established', properties.map(p => p.foundedYear?.toString() || '—')),
    createDataRow('Capacity', properties.map(p => p.capacity ? `${p.capacity} rooms` : '—')),
    createDataRow('Price Range', properties.map(p => formatPrice(p.priceMin, p.priceMax, p.currency))),
  ].join('');

  // Scores section
  const scoreRows = [
    createDataRow('Overall Score', properties.map(p => p.overallScore ? `${p.overallScore} (${getScoreTier(p.overallScore)})` : '—')),
    createDataRow('Clinical Rigor', properties.map(p => p.clinicalRigorScore?.toString() || '—')),
    createDataRow('Outcome Evidence', properties.map(p => p.outcomeEvidenceScore?.toString() || '—')),
    createDataRow('Program Depth', properties.map(p => p.programDepthScore?.toString() || '—')),
    createDataRow('Experience Quality', properties.map(p => p.experienceQualityScore?.toString() || '—')),
    createDataRow('Value Alignment', properties.map(p => p.valueAlignmentScore?.toString() || '—')),
  ].join('');

  // Dark data section
  const darkDataRows = [
    createDataRow('Physician-to-Patient Ratio', properties.map(p => p.physicianPatientRatio || '—')),
    createDataRow('Booking Lead Time', properties.map(p => p.avgBookingLeadTime || '—')),
    createDataRow('Return Guest Rate', properties.map(p => p.returnGuestPercentage ? `${p.returnGuestPercentage}%` : '—')),
    createDataRow('Staff Tenure', properties.map(p => p.staffTenure || '—')),
    createDataRow('Discretion Level', properties.map(p => p.discretionLevel?.replace(/_/g, ' ') || '—')),
  ].join('');

  // Cultural fit section
  const culturalRows = [
    createDataRow('Languages (Medical)', properties.map(p => p.languagesMedical?.join(', ') || '—')),
    createDataRow('Dietary Options', properties.map(p => p.religiousDietaryOptions?.join(', ') || '—')),
    createDataRow('Privacy Architecture', properties.map(p => p.privacyArchitecture || '—')),
    createDataRow('Solo Traveler', properties.map(p => p.soloTravelerFriendly?.replace(/_/g, ' ') || '—')),
  ].join('');

  // Focus areas
  const focusAreasRow = createDataRow(
    'Focus Areas',
    properties.map(p =>
      p.focusAreas?.map((fa: string) => focusAreaLabels[fa] || fa).join(', ') || '—'
    )
  );

  // Treatments count
  const treatmentsRow = createDataRow(
    'Treatments Offered',
    properties.map(p => `${p.treatments?.length || 0} treatments`)
  );

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clarus Vitae Property Comparison - ${propertyNames}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1A2B4A;
      line-height: 1.5;
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 32px;
      font-weight: 500;
      margin-bottom: 8px;
    }
    h2 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 20px;
      font-weight: 500;
      margin: 32px 0 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #E8E6E3;
    }
    h3 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 18px;
      font-weight: 500;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid #E8E6E3;
    }
    .logo {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 24px;
      font-weight: 600;
      color: #1A2B4A;
    }
    .date {
      color: #64748B;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #E8E6E3;
      font-size: 14px;
    }
    th {
      width: 200px;
      color: #1A2B4A;
      font-weight: 500;
      background: #F5F5F4;
    }
    td {
      color: #64748B;
    }
    .property-header {
      text-align: center;
      padding: 16px;
      background: #F5F5F4;
    }
    .property-header h3 {
      margin-bottom: 4px;
    }
    .location {
      color: #64748B;
      font-size: 13px;
    }
    .tier {
      display: inline-block;
      margin-top: 8px;
      padding: 4px 8px;
      background: #1A2B4A;
      color: white;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-radius: 4px;
    }
    .score {
      margin-top: 12px;
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 36px;
      color: #C9A962;
    }
    .score span {
      font-size: 14px;
      color: #64748B;
    }
    .footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #E8E6E3;
      text-align: center;
      color: #64748B;
      font-size: 12px;
    }
    .disclaimer {
      margin-top: 16px;
      padding: 16px;
      background: #F5F5F4;
      font-size: 12px;
      color: #64748B;
    }
    @media print {
      body { padding: 20px; }
      h2 { page-break-before: auto; }
      table { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Clarus Vitae</div>
      <h1>Property Comparison</h1>
    </div>
    <div class="date">Generated: ${generatedDate}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th></th>
        ${propertyColumns}
      </tr>
    </thead>
  </table>

  <h2>Overview</h2>
  <table>
    <tbody>${overviewRows}</tbody>
  </table>

  <h2>Clarus Index Scores</h2>
  <table>
    <tbody>${scoreRows}</tbody>
  </table>

  <h2>Insider Intelligence</h2>
  <table>
    <tbody>${darkDataRows}</tbody>
  </table>

  <h2>Cultural Fit</h2>
  <table>
    <tbody>${culturalRows}</tbody>
  </table>

  <h2>Programs & Treatments</h2>
  <table>
    <tbody>
      ${focusAreasRow}
      ${treatmentsRow}
    </tbody>
  </table>

  <div class="disclaimer">
    <strong>Disclaimer:</strong> Clarus Vitae provides research and intelligence services only. We do not provide medical advice, diagnosis, or treatment. Consult qualified healthcare providers before making health decisions. Property assessments reflect our methodology at time of evaluation and may not reflect current conditions.
  </div>

  <div class="footer">
    <p>Clarus Vitae - Clarity for Life's Most Important Decisions</p>
    <p>clarusvitae.com</p>
  </div>
</body>
</html>
  `;
}
