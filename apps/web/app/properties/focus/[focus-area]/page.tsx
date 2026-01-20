import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { FocusArea } from '@clarus-vitae/database';
import { focusAreaLabels } from '@/lib/properties';

interface FocusAreaPageProps {
  params: Promise<{ 'focus-area': string }>;
}

// Map URL slugs to focus area enum values
const focusAreaSlugMap: Record<string, FocusArea> = {
  'longevity': 'LONGEVITY',
  'detox': 'DETOX',
  'weight-metabolic': 'WEIGHT_METABOLIC',
  'stress-burnout': 'STRESS_BURNOUT',
  'fitness-performance': 'FITNESS_PERFORMANCE',
  'beauty-aesthetic': 'BEAUTY_AESTHETIC',
  'holistic-spiritual': 'HOLISTIC_SPIRITUAL',
  'medical-assessment': 'MEDICAL_ASSESSMENT',
  'post-illness': 'POST_ILLNESS',
  'addiction-behavioral': 'ADDICTION_BEHAVIORAL',
  'cognitive-brain': 'COGNITIVE_BRAIN',
  'sleep': 'SLEEP',
  'womens-health': 'WOMENS_HEALTH',
  'mens-health': 'MENS_HEALTH',
  'general-rejuvenation': 'GENERAL_REJUVENATION',
};

// Generate metadata descriptions for each focus area
const focusAreaDescriptions: Record<FocusArea, string> = {
  LONGEVITY:
    'Discover properties specializing in longevity and anti-aging protocols, including biological age testing, cellular therapies, and healthspan optimization.',
  DETOX:
    'Find wellness retreats offering comprehensive detoxification programs, from medical-grade cleanses to holistic reset protocols.',
  WEIGHT_METABOLIC:
    'Explore destinations focused on weight management and metabolic health, with evidence-based programs and personalized nutrition plans.',
  STRESS_BURNOUT:
    'Recover from stress and burnout at specialized retreats offering restorative programs, executive wellness, and nervous system reset protocols.',
  FITNESS_PERFORMANCE:
    'Optimize your fitness and athletic performance at elite training facilities with sports medicine expertise and performance testing.',
  BEAUTY_AESTHETIC:
    'Experience advanced beauty and aesthetic treatments from non-invasive procedures to comprehensive rejuvenation programs.',
  HOLISTIC_SPIRITUAL:
    'Embark on transformative journeys at properties emphasizing holistic wellness, spiritual growth, and mind-body integration.',
  MEDICAL_ASSESSMENT:
    'Get comprehensive health assessments at facilities offering advanced diagnostics, full-body scans, and personalized health roadmaps.',
  POST_ILLNESS:
    'Find supportive environments for post-illness recovery, rehabilitation, and restoration of health after medical challenges.',
  ADDICTION_BEHAVIORAL:
    'Access specialized addiction recovery and behavioral health programs in confidential, supportive settings.',
  COGNITIVE_BRAIN:
    'Enhance cognitive function and brain health at facilities offering neurofeedback, cognitive training, and brain optimization protocols.',
  SLEEP:
    'Improve your sleep quality at specialized centers offering sleep diagnostics, sleep optimization programs, and circadian reset protocols.',
  WOMENS_HEALTH:
    "Explore properties with specialized women's health programs, from hormone optimization to fertility support and menopause management.",
  MENS_HEALTH:
    "Find men's health-focused programs addressing hormone optimization, prostate health, and performance enhancement.",
  GENERAL_REJUVENATION:
    'Experience overall rejuvenation and wellness renewal at properties offering comprehensive restoration programs.',
};

export async function generateMetadata({ params }: FocusAreaPageProps): Promise<Metadata> {
  const { 'focus-area': focusSlug } = await params;
  const focusArea = focusAreaSlugMap[focusSlug];

  if (!focusArea) {
    return { title: 'Not Found | Clarus Vitae' };
  }

  const label = focusAreaLabels[focusArea];

  return {
    title: `${label} Wellness Retreats | Clarus Vitae`,
    description: focusAreaDescriptions[focusArea],
    openGraph: {
      title: `${label} Wellness Retreats | Clarus Vitae`,
      description: focusAreaDescriptions[focusArea],
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(focusAreaSlugMap).map((focusArea) => ({
    'focus-area': focusArea,
  }));
}

export default async function FocusAreaPage({ params }: FocusAreaPageProps) {
  const { 'focus-area': focusSlug } = await params;
  const focusArea = focusAreaSlugMap[focusSlug];

  if (!focusArea) {
    notFound();
  }

  // Redirect to main properties page with focus area filter
  redirect(`/properties?focusAreas=${focusArea}`);
}
