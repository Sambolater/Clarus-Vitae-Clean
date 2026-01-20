import type { CollectiveStats, TeamMember } from '@clarus-vitae/types';
import {
  ContactAdvisorCTA,
  TeamGrid,
  TeamHero,
  TrustStatement,
} from '@clarus-vitae/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Advisory Team | Clarus Vitae',
  description:
    'Meet the experts behind every Clarus Vitae assessment. Real credentials, real expertise, real accountability. Our team has collectively visited 200+ properties worldwide.',
  openGraph: {
    title: 'Our Advisory Team | Clarus Vitae',
    description:
      'Meet the experts behind every Clarus Vitae assessment. Real credentials, real expertise, real accountability.',
    type: 'website',
  },
};

/**
 * Get collective statistics for the advisory team.
 * In production, this would query the database.
 */
async function getCollectiveStats(): Promise<CollectiveStats> {
  // TODO: Replace with actual database query
  return {
    totalMembers: 5,
    totalPropertiesVisited: 215,
    totalProgramsEvaluated: 342,
    totalYearsExperience: 68,
    countriesCovered: 32,
  };
}

/**
 * Get all active team members.
 * In production, this would query the database.
 */
async function getActiveTeamMembers(): Promise<TeamMember[]> {
  // TODO: Replace with actual database query
  // Sample data for MVP - will be replaced with real team members
  return [
    {
      id: 'tm-1',
      slug: 'dr-elena-marchetti',
      name: 'Dr. Elena Marchetti',
      title: 'Founding Medical Director',
      role: 'founder',
      bio: 'Dr. Marchetti brings over 20 years of experience in integrative medicine and longevity science. She has personally evaluated more than 80 medical wellness facilities across Europe, Asia, and North America.\n\nHer background includes clinical practice in anti-aging medicine, research in regenerative therapies, and consulting for several leading wellness destinations. She holds board certifications in internal medicine and integrative medicine.',
      shortBio:
        'Founding Medical Director with 20+ years in integrative medicine and longevity science. Has personally evaluated 80+ facilities worldwide.',
      credentials: ['MD', 'ABIM', 'ABOIM'],
      certifications: [
        'Board Certified Internal Medicine',
        'Board Certified Integrative Medicine',
        'Certified in Anti-Aging Medicine (A4M)',
      ],
      education: [
        {
          institution: 'Johns Hopkins University School of Medicine',
          degree: 'MD',
          field: 'Medicine',
          year: 2001,
        },
        {
          institution: 'University of Arizona',
          degree: 'Fellowship',
          field: 'Integrative Medicine',
          year: 2005,
        },
      ],
      previousRoles: [
        {
          organization: 'Cleveland Clinic Center for Integrative Medicine',
          title: 'Associate Director',
          years: '2010-2018',
          description: 'Led clinical programs and research initiatives',
        },
        {
          organization: 'Private Practice',
          title: 'Founder, Longevity Medicine',
          years: '2018-2022',
          description: 'Concierge integrative medicine practice',
        },
      ],
      specializations: [
        'Medical Longevity',
        'Regenerative Medicine',
        'Metabolic Health',
        'Diagnostics',
      ],
      focusAreas: ['LONGEVITY', 'MEDICAL_ASSESSMENT', 'DETOX'],
      languages: ['English', 'Italian', 'Spanish'],
      propertiesVisited: 82,
      programsEvaluated: 156,
      yearsExperience: 22,
      photoUrl: '/images/team/dr-elena-marchetti.jpg',
      photoAlt: 'Dr. Elena Marchetti, Founding Medical Director',
      isContactAvailable: true,
      linkedinUrl: 'https://linkedin.com/in/',
      displayOrder: 1,
      isActive: true,
    },
    {
      id: 'tm-2',
      slug: 'james-hartley',
      name: 'James Hartley',
      title: 'Senior Wellness Advisor',
      role: 'senior_advisor',
      bio: 'James Hartley is a former luxury travel journalist turned wellness advisor, with particular expertise in European destination spas and Asian wellness retreats. He has written for leading publications including Conde Nast Traveller and Travel + Leisure.\n\nHis approach combines rigorous assessment methodology with an understanding of the experiential elements that distinguish exceptional wellness destinations.',
      shortBio:
        'Former luxury travel journalist with expertise in European destination spas and Asian wellness retreats.',
      credentials: ['CWC', 'CHWC'],
      certifications: [
        'Certified Wellness Coach (CWC)',
        'Certified Health & Wellness Coach (CHWC)',
      ],
      education: [
        {
          institution: 'Cornell University',
          degree: 'BA',
          field: 'Hospitality Management',
          year: 2008,
        },
      ],
      previousRoles: [
        {
          organization: 'Conde Nast Traveller',
          title: 'Contributing Editor, Wellness',
          years: '2012-2020',
        },
        {
          organization: 'Independent',
          title: 'Wellness Travel Consultant',
          years: '2020-2023',
        },
      ],
      specializations: [
        'Luxury Wellness',
        'Destination Spas',
        'Holistic Retreats',
        'Stress Recovery',
      ],
      focusAreas: ['STRESS_BURNOUT', 'HOLISTIC_SPIRITUAL', 'GENERAL_REJUVENATION'],
      languages: ['English', 'French'],
      propertiesVisited: 64,
      programsEvaluated: 89,
      yearsExperience: 15,
      photoUrl: '/images/team/james-hartley.jpg',
      photoAlt: 'James Hartley, Senior Wellness Advisor',
      isContactAvailable: true,
      linkedinUrl: 'https://linkedin.com/in/',
      displayOrder: 2,
      isActive: true,
    },
    {
      id: 'tm-3',
      slug: 'dr-maya-chen',
      name: 'Dr. Maya Chen',
      title: 'Medical Advisor, Asia-Pacific',
      role: 'medical_advisor',
      bio: 'Dr. Chen specializes in traditional Chinese medicine integration with modern longevity protocols. Based in Singapore, she provides expert assessment of wellness facilities across the Asia-Pacific region.\n\nHer unique perspective bridges Eastern and Western approaches to health optimization, with particular expertise in evaluating facilities that combine traditional practices with evidence-based medicine.',
      shortBio:
        'Specializes in TCM integration with modern longevity protocols. Expert assessor for Asia-Pacific facilities.',
      credentials: ['MD', 'DAOM', 'L.Ac'],
      certifications: [
        'Doctor of Acupuncture and Oriental Medicine',
        'Licensed Acupuncturist',
        'Board Certified Integrative Medicine',
      ],
      education: [
        {
          institution: 'National University of Singapore',
          degree: 'MD',
          field: 'Medicine',
          year: 2006,
        },
        {
          institution: 'Pacific College of Oriental Medicine',
          degree: 'DAOM',
          field: 'Acupuncture and Oriental Medicine',
          year: 2010,
        },
      ],
      previousRoles: [
        {
          organization: 'Singapore General Hospital',
          title: 'Consultant, Integrative Medicine',
          years: '2010-2019',
        },
      ],
      specializations: [
        'Traditional Medicine Integration',
        'Longevity Protocols',
        'Mind-Body Medicine',
      ],
      focusAreas: ['LONGEVITY', 'HOLISTIC_SPIRITUAL', 'COGNITIVE_BRAIN'],
      languages: ['English', 'Mandarin', 'Cantonese'],
      propertiesVisited: 38,
      programsEvaluated: 52,
      yearsExperience: 17,
      photoUrl: '/images/team/dr-maya-chen.jpg',
      photoAlt: 'Dr. Maya Chen, Medical Advisor Asia-Pacific',
      isContactAvailable: true,
      linkedinUrl: 'https://linkedin.com/in/',
      displayOrder: 3,
      isActive: true,
    },
    {
      id: 'tm-4',
      slug: 'sophia-andersson',
      name: 'Sophia Andersson',
      title: 'Wellness Program Analyst',
      role: 'advisor',
      bio: 'Sophia Andersson brings a data-driven approach to wellness program evaluation. With a background in health economics and outcomes research, she ensures our assessments incorporate rigorous analysis of program effectiveness and value.\n\nShe leads our outcome tracking initiatives and develops the quantitative frameworks behind the Clarus Index.',
      shortBio:
        'Data-driven analyst with background in health economics. Leads outcome tracking and Clarus Index methodology.',
      credentials: ['MPH', 'CHES'],
      certifications: [
        'Certified Health Education Specialist',
        'Health Outcomes Research Certificate',
      ],
      education: [
        {
          institution: 'Karolinska Institute',
          degree: 'MPH',
          field: 'Health Economics',
          year: 2015,
        },
        {
          institution: 'Stockholm University',
          degree: 'BSc',
          field: 'Statistics',
          year: 2012,
        },
      ],
      previousRoles: [
        {
          organization: 'McKinsey & Company',
          title: 'Associate, Healthcare Practice',
          years: '2015-2020',
        },
      ],
      specializations: [
        'Outcomes Research',
        'Program Effectiveness',
        'Health Economics',
        'Data Analysis',
      ],
      focusAreas: ['MEDICAL_ASSESSMENT', 'WEIGHT_METABOLIC', 'FITNESS_PERFORMANCE'],
      languages: ['English', 'Swedish', 'German'],
      propertiesVisited: 24,
      programsEvaluated: 35,
      yearsExperience: 9,
      photoUrl: '/images/team/sophia-andersson.jpg',
      photoAlt: 'Sophia Andersson, Wellness Program Analyst',
      isContactAvailable: true,
      linkedinUrl: 'https://linkedin.com/in/',
      displayOrder: 4,
      isActive: true,
    },
    {
      id: 'tm-5',
      slug: 'marcus-williams',
      name: 'Marcus Williams',
      title: 'Contributor, Performance & Recovery',
      role: 'contributor',
      bio: 'Marcus Williams is a former professional athlete turned wellness consultant, specializing in performance optimization and recovery facilities. His firsthand experience with elite sports medicine informs his evaluation of athletic wellness programs.\n\nHe brings a unique perspective on the intersection of high-performance training and wellness recovery.',
      shortBio:
        'Former professional athlete specializing in performance optimization and recovery facility assessment.',
      credentials: ['CSCS', 'PES'],
      certifications: [
        'Certified Strength & Conditioning Specialist',
        'Performance Enhancement Specialist',
      ],
      education: [
        {
          institution: 'University of Texas at Austin',
          degree: 'BS',
          field: 'Kinesiology',
          year: 2010,
        },
      ],
      previousRoles: [
        {
          organization: 'Professional Athletics',
          title: 'Professional Athlete',
          years: '2010-2018',
        },
        {
          organization: 'Elite Performance Lab',
          title: 'Recovery Consultant',
          years: '2018-2022',
        },
      ],
      specializations: [
        'Athletic Recovery',
        'Performance Optimization',
        'Sports Medicine',
        'Biohacking',
      ],
      focusAreas: ['FITNESS_PERFORMANCE', 'POST_ILLNESS', 'SLEEP'],
      languages: ['English'],
      propertiesVisited: 17,
      programsEvaluated: 28,
      yearsExperience: 6,
      photoUrl: '/images/team/marcus-williams.jpg',
      photoAlt: 'Marcus Williams, Contributor Performance & Recovery',
      isContactAvailable: false,
      linkedinUrl: 'https://linkedin.com/in/',
      displayOrder: 5,
      isActive: true,
    },
  ];
}

export default async function TeamPage() {
  const [stats, teamMembers] = await Promise.all([
    getCollectiveStats(),
    getActiveTeamMembers(),
  ]);

  return (
    <main>
      <TeamHero stats={stats} />
      <TrustStatement />
      <TeamGrid members={teamMembers} />
      <ContactAdvisorCTA />
    </main>
  );
}
