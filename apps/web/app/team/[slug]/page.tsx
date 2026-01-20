import type { PropertyVisit, TeamMember, TeamMemberReview } from '@clarus-vitae/types';
import {
  ContactAdvisor,
  TeamMemberBio,
  TeamMemberCredentials,
  TeamMemberHeader,
  TeamMemberVisits,
} from '@clarus-vitae/ui';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface TeamMemberPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate metadata for the team member page.
 */
export async function generateMetadata({
  params,
}: TeamMemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);

  if (!member) {
    return {
      title: 'Team Member Not Found | Clarus Vitae',
    };
  }

  return {
    title: `${member.name} - ${member.title} | Clarus Vitae`,
    description: member.shortBio,
    openGraph: {
      title: `${member.name} - ${member.title} | Clarus Vitae`,
      description: member.shortBio,
      type: 'profile',
      images: member.photoUrl ? [{ url: member.photoUrl }] : undefined,
    },
  };
}

/**
 * Get team member by slug.
 * In production, this would query the database.
 */
async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  // TODO: Replace with actual database query
  const allMembers = await getAllTeamMembers();
  return allMembers.find((m) => m.slug === slug) || null;
}

/**
 * Get property visits for a team member.
 * In production, this would query the database.
 */
async function getMemberPropertyVisits(memberId: string): Promise<PropertyVisit[]> {
  // TODO: Replace with actual database query
  // Sample data for MVP
  const _memberId = memberId; // Acknowledge parameter for future use
  return [
    {
      teamMemberId: memberId,
      propertyId: 'prop-1',
      propertyName: 'Clinique La Prairie',
      propertySlug: 'clinique-la-prairie',
      visitDate: new Date('2024-09-15'),
      visitType: 'full_program',
      reviewId: 'rev-1',
    },
    {
      teamMemberId: memberId,
      propertyId: 'prop-2',
      propertyName: 'SHA Wellness Clinic',
      propertySlug: 'sha-wellness-clinic',
      visitDate: new Date('2024-07-20'),
      visitType: 'evaluation',
    },
    {
      teamMemberId: memberId,
      propertyId: 'prop-3',
      propertyName: 'Lanserhof Tegernsee',
      propertySlug: 'lanserhof-tegernsee',
      visitDate: new Date('2024-05-10'),
      visitType: 'full_program',
      reviewId: 'rev-2',
    },
    {
      teamMemberId: memberId,
      propertyId: 'prop-4',
      propertyName: 'Chenot Palace Weggis',
      propertySlug: 'chenot-palace-weggis',
      visitDate: new Date('2024-03-05'),
      visitType: 'site_visit',
    },
  ];
}

/**
 * Get reviews written by a team member.
 * In production, this would query the database.
 */
async function getMemberReviews(_memberId: string): Promise<TeamMemberReview[]> {
  // TODO: Replace with actual database query
  return [];
}

/**
 * Get all team members for static generation.
 */
async function getAllTeamMembers(): Promise<TeamMember[]> {
  // TODO: Replace with actual database query
  return [
    {
      id: 'tm-1',
      slug: 'dr-elena-marchetti',
      name: 'Dr. Elena Marchetti',
      title: 'Founding Medical Director',
      role: 'founder',
      bio: 'Dr. Marchetti brings over 20 years of experience in integrative medicine and longevity science. She has personally evaluated more than 80 medical wellness facilities across Europe, Asia, and North America.\n\nHer background includes clinical practice in anti-aging medicine, research in regenerative therapies, and consulting for several leading wellness destinations. She holds board certifications in internal medicine and integrative medicine.\n\nPrior to founding Clarus Vitae, Dr. Marchetti served as Associate Director at the Cleveland Clinic Center for Integrative Medicine, where she led clinical programs and research initiatives focused on longevity and preventive health.\n\nHer evaluation methodology emphasizes clinical rigor, outcome measurement, and the integration of evidence-based protocols with personalized care approaches.',
      shortBio:
        'Founding Medical Director with 20+ years in integrative medicine and longevity science. Has personally evaluated 80+ facilities worldwide.',
      credentials: ['MD', 'ABIM', 'ABOIM'],
      certifications: [
        'Board Certified Internal Medicine',
        'Board Certified Integrative Medicine',
        'Certified in Anti-Aging Medicine (A4M)',
        'Fellow, American College of Physicians',
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
        {
          institution: 'Harvard University',
          degree: 'BA',
          field: 'Biology',
          year: 1997,
        },
      ],
      previousRoles: [
        {
          organization: 'Cleveland Clinic Center for Integrative Medicine',
          title: 'Associate Director',
          years: '2010-2018',
          description: 'Led clinical programs and research initiatives focused on longevity and preventive health',
        },
        {
          organization: 'Private Practice',
          title: 'Founder, Longevity Medicine',
          years: '2018-2022',
          description: 'Concierge integrative medicine practice serving high-net-worth clients',
        },
        {
          organization: 'Mayo Clinic',
          title: 'Physician, Internal Medicine',
          years: '2005-2010',
          description: 'Clinical practice in internal medicine with focus on complex cases',
        },
      ],
      specializations: [
        'Medical Longevity',
        'Regenerative Medicine',
        'Metabolic Health',
        'Advanced Diagnostics',
        'Personalized Protocols',
      ],
      focusAreas: ['LONGEVITY', 'MEDICAL_ASSESSMENT', 'DETOX', 'COGNITIVE_BRAIN'],
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
      bio: 'James Hartley is a former luxury travel journalist turned wellness advisor, with particular expertise in European destination spas and Asian wellness retreats. He has written for leading publications including Conde Nast Traveller, Travel + Leisure, and the Financial Times.\n\nHis approach combines rigorous assessment methodology with an understanding of the experiential elements that distinguish exceptional wellness destinations. James believes that the best wellness experiences balance clinical effectiveness with genuine hospitality and transformative environments.\n\nOver 15 years in luxury travel journalism, James developed expertise in evaluating service quality, facility design, and program authenticity. His network of industry contacts provides insight into property operations that goes beyond what guests typically experience.',
      shortBio:
        'Former luxury travel journalist with expertise in European destination spas and Asian wellness retreats.',
      credentials: ['CWC', 'CHWC'],
      certifications: [
        'Certified Wellness Coach (CWC)',
        'Certified Health & Wellness Coach (CHWC)',
        'Wine & Spirit Education Trust Level 3',
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
          description: 'Authored over 200 wellness destination features',
        },
        {
          organization: 'Travel + Leisure',
          title: 'Contributing Writer',
          years: '2010-2018',
        },
        {
          organization: 'Independent',
          title: 'Wellness Travel Consultant',
          years: '2020-2023',
          description: 'Advised UHNW clients on wellness travel planning',
        },
      ],
      specializations: [
        'Luxury Wellness',
        'Destination Spas',
        'Holistic Retreats',
        'Stress Recovery',
        'Executive Wellness',
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
      bio: 'Dr. Chen specializes in traditional Chinese medicine integration with modern longevity protocols. Based in Singapore, she provides expert assessment of wellness facilities across the Asia-Pacific region.\n\nHer unique perspective bridges Eastern and Western approaches to health optimization, with particular expertise in evaluating facilities that combine traditional practices with evidence-based medicine. She has been instrumental in developing our assessment criteria for integrative wellness programs.\n\nDr. Chen\'s clinical background spans both conventional medicine and traditional Chinese medicine, giving her rare dual expertise in evaluating hybrid wellness approaches.',
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
          description: 'Led integrative medicine programs combining TCM with conventional care',
        },
      ],
      specializations: [
        'Traditional Medicine Integration',
        'Longevity Protocols',
        'Mind-Body Medicine',
        'Acupuncture',
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
      bio: 'Sophia Andersson brings a data-driven approach to wellness program evaluation. With a background in health economics and outcomes research, she ensures our assessments incorporate rigorous analysis of program effectiveness and value.\n\nShe leads our outcome tracking initiatives and develops the quantitative frameworks behind the Clarus Index. Her work ensures that our recommendations are grounded in measurable results rather than subjective impressions.\n\nBefore joining Clarus Vitae, Sophia spent five years at McKinsey & Company in the healthcare practice, where she advised pharmaceutical companies and health systems on outcomes measurement and value-based care.',
      shortBio:
        'Data-driven analyst with background in health economics. Leads outcome tracking and Clarus Index methodology.',
      credentials: ['MPH', 'CHES'],
      certifications: [
        'Certified Health Education Specialist',
        'Health Outcomes Research Certificate',
        'Six Sigma Green Belt',
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
          description: 'Outcomes measurement and value-based care consulting',
        },
      ],
      specializations: [
        'Outcomes Research',
        'Program Effectiveness',
        'Health Economics',
        'Data Analysis',
        'Value Assessment',
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
      bio: 'Marcus Williams is a former professional athlete turned wellness consultant, specializing in performance optimization and recovery facilities. His firsthand experience with elite sports medicine informs his evaluation of athletic wellness programs.\n\nHe brings a unique perspective on the intersection of high-performance training and wellness recovery. Having personally experienced both the benefits and limitations of various recovery modalities during his athletic career, Marcus provides practical insight into what actually works for performance optimization.\n\nMarcus evaluates facilities from the perspective of serious athletes and executives who need to maintain peak performance while managing the physical demands of their lifestyle.',
      shortBio:
        'Former professional athlete specializing in performance optimization and recovery facility assessment.',
      credentials: ['CSCS', 'PES'],
      certifications: [
        'Certified Strength & Conditioning Specialist',
        'Performance Enhancement Specialist',
        'Functional Movement Screen Certified',
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
          description: 'Advised professional sports teams on recovery protocols',
        },
      ],
      specializations: [
        'Athletic Recovery',
        'Performance Optimization',
        'Sports Medicine',
        'Biohacking',
        'Sleep Optimization',
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

/**
 * Generate static params for all team member pages.
 */
export async function generateStaticParams() {
  const members = await getAllTeamMembers();
  return members.map((member) => ({
    slug: member.slug,
  }));
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  const [visits, _reviews] = await Promise.all([
    getMemberPropertyVisits(member.id),
    getMemberReviews(member.id),
  ]);

  return (
    <main>
      <TeamMemberHeader member={member} />
      <TeamMemberBio member={member} />
      <TeamMemberCredentials member={member} />
      <TeamMemberVisits visits={visits} />

      {member.isContactAvailable && (
        <section className="border-t border-stone bg-warm-gray py-12">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-md">
              <h2 className="mb-6 text-center font-display text-2xl text-clarus-navy">
                Connect with {member.name.split(' ')[0]}
              </h2>
              <ContactAdvisor
                member={{
                  id: member.id,
                  slug: member.slug,
                  name: member.name,
                  title: member.title,
                  photoUrl: member.photoUrl,
                  credentials: member.credentials,
                  propertiesVisited: member.propertiesVisited,
                }}
                variant="inline"
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
