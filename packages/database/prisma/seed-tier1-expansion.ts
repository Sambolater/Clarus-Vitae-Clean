/**
 * Clarus Vitae - Tier 1 Elite Medical Longevity Properties Expansion
 * 
 * This seed file adds 8 additional Tier 1 properties to bring the total to 10.
 * Run AFTER the main seed.ts to preserve existing data.
 * 
 * Properties added:
 * 1. SHA Wellness Clinic (Spain)
 * 2. VIVAMAYR Maria Wörth (Austria)
 * 3. Buchinger Wilhelmi (Germany)
 * 4. Chenot Palace Weggis (Switzerland)
 * 5. Palazzo Fiuggi (Italy)
 * 6. Park Igls (Austria)
 * 7. The Maybourne Riviera (France - opening clinic)
 * 8. Canyon Ranch Tucson (USA)
 * 
 * Usage:
 *   cd packages/database
 *   npx tsx prisma/seed-tier1-expansion.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏥 Starting Tier 1 Elite Properties Expansion...\n');

  // Get existing treatments to link
  const treatments = await prisma.treatment.findMany();
  const treatmentMap = new Map(treatments.map((t) => [t.slug, t]));

  // Get existing diagnostics to link
  const diagnostics = await prisma.diagnostic.findMany();
  const diagnosticMap = new Map(diagnostics.map((d) => [d.slug, d]));

  // Get existing team members for reviews
  const teamMembers = await prisma.teamMember.findMany();
  const drChen = teamMembers.find((t) => t.slug === 'dr-sarah-chen');
  const jamesW = teamMembers.find((t) => t.slug === 'james-worthington');

  // ============================================
  // PROPERTY 1: SHA Wellness Clinic (Spain)
  // ============================================
  console.log('Creating SHA Wellness Clinic...');
  
  const shaWellness = await prisma.property.create({
    data: {
      slug: 'sha-wellness-clinic',
      name: 'SHA Wellness Clinic',
      description:
        'SHA Wellness Clinic is the world\'s most acclaimed medical wellness destination, integrating everything proven to optimize health and performance into one seamless, science-driven method refined over nearly two decades. Located on Spain\'s Costa Blanca overlooking the Mediterranean, SHA offers hyper-personalized longevity programs combining 50+ medical and holistic specialties, next-generation diagnostics, functional precision medicine, and innovative biohacking techniques.',
      city: 'Altea',
      country: 'Spain',
      region: 'Alicante, Costa Blanca',
      latitude: 38.5989,
      longitude: -0.0513,
      nearestAirport: 'Alicante-Elche Airport (ALC)',
      transferTime: '45 minutes by car',
      tier: 'TIER_1',
      approach: 'INTEGRATIVE',
      focusAreas: ['LONGEVITY', 'DETOX', 'WEIGHT_METABOLIC', 'STRESS_BURNOUT', 'COGNITIVE_BRAIN', 'SLEEP'],
      priceMin: 7500,
      priceMax: 45000,
      currency: 'EUR',
      website: 'https://shawellness.com',
      foundedYear: 2008,
      capacity: 104,
      accommodationType: 'Suites and residences with Mediterranean views',
      diningDescription: 'SHA Nutrition concept - alkaline, anti-inflammatory macrobiotic-inspired cuisine prepared by acclaimed chefs. SHAmadi restaurant offers healthy haute cuisine.',
      facilitiesDescription: '6,000m² wellness area with 90+ treatment rooms, hydrotherapy circuit, indoor/outdoor pools, fitness center with sea views, meditation gardens, yoga pavilions.',
      setting: 'Mediterranean hillside with sea views',
      overallScore: 95,
      clinicalRigorScore: 94,
      outcomeEvidenceScore: 93,
      programDepthScore: 96,
      experienceQualityScore: 95,
      valueAlignmentScore: 92,
      physicianPatientRatio: '1:4',
      avgBookingLeadTime: '6-10 weeks',
      returnGuestPercentage: 65,
      staffTenure: 'Average 9 years',
      actualCustomization:
        'Every program begins with comprehensive diagnostics including 88-biomarker longevity panel, 3D body scan, cardiovascular analysis, and cognitive testing. Daily protocols adjusted based on real-time feedback and biomarker response.',
      postVisitFollowup:
        'Post-program remote monitoring with SHA experts. Personalized lifestyle recommendations. Annual program reviews. Access to SHA Method app for ongoing guidance.',
      discretionLevel: 'ULTRA_HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Halal available', 'Vegetarian', 'Vegan', 'Gluten-free', 'Macrobiotic'],
      privacyArchitecture: 'Private suites, VIP residences with dedicated staff',
      prayerFacilities: 'Meditation gardens, quiet contemplation spaces',
      languagesMedical: ['English', 'Spanish', 'French', 'German', 'Italian', 'Russian', 'Arabic'],
      languagesService: ['English', 'Spanish', 'French', 'German', 'Italian', 'Russian', 'Arabic', 'Portuguese', 'Mandarin'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'AFFILIATE',
      published: true,
      featured: true,
      editorChoice: "World's Best for Integrative Longevity Medicine",
      verifiedExcellence: true,
    },
  });

  await prisma.tierOneDetails.create({
    data: {
      propertyId: shaWellness.id,
      medicalDirector: 'Dr. Vicente Mera',
      medicalDirectorCreds: 'MD, Head of Internal Medicine and Anti-aging, 20+ years in longevity medicine',
      medicalTeamSize: 50,
      certifications: ['ISO 9001:2015', 'World Travel Awards - World\'s Best Wellness Clinic'],
      hospitalAffiliations: [],
      researchPublications: [
        'SHA Method: Integrative approach to longevity optimization',
        'Biomarker-guided wellness interventions: Clinical outcomes',
      ],
    },
  });

  // SHA Programs
  await prisma.program.create({
    data: {
      propertyId: shaWellness.id,
      name: 'Advanced Longevity Program',
      description:
        'SHA\'s flagship longevity program designed to slow down cellular aging and enhance overall health. Through stimulation and natural regeneration of metabolic processes, this preventive approach uses innovative functional medicine and longevity treatments to optimize health and promote longevity.',
      durationDays: 7,
      price: 7500,
      currency: 'EUR',
      focusAreas: ['LONGEVITY', 'MEDICAL_ASSESSMENT', 'COGNITIVE_BRAIN'],
      inclusions: [
        'Well-aging biological profile (88 key biomarkers)',
        '3D body scanner analysis',
        'Cardiovascular and nervous system assessment',
        'Cognitive domain testing',
        'Personalized treatment protocol',
        'Daily therapies and treatments',
        'SHA nutrition with all meals',
        'Group wellness activities',
        'Post-program follow-up consultation',
      ],
      exclusions: ['Accommodation', 'Airport transfers', 'Additional specialist consultations'],
      typicalSchedule:
        'Day 1: Arrival, initial consultation, diagnostic testing. Days 2-5: Personalized treatments, regenerative therapies, longevity protocols. Day 6: Results review. Day 7: Lifestyle recommendations and departure.',
      published: true,
    },
  });

  await prisma.program.create({
    data: {
      propertyId: shaWellness.id,
      name: "Leader's Performance Program",
      description:
        'Optimal performance and lasting vitality for those living high-demand lifestyles. Designed for executives and leaders seeking to enhance physical and mental performance while managing stress and maintaining peak cognitive function.',
      durationDays: 4,
      price: 4000,
      currency: 'EUR',
      focusAreas: ['STRESS_BURNOUT', 'COGNITIVE_BRAIN', 'FITNESS_PERFORMANCE'],
      inclusions: [
        'Executive health assessment',
        'Stress and cortisol analysis',
        'Cognitive performance testing',
        'Personalized performance protocol',
        'Energy optimization treatments',
        'SHA nutrition',
        'Personal training sessions',
      ],
      exclusions: ['Accommodation', 'Airport transfers'],
      published: true,
    },
  });

  // ============================================
  // PROPERTY 2: VIVAMAYR Maria Wörth (Austria)
  // ============================================
  console.log('Creating VIVAMAYR Maria Wörth...');

  const vivamayr = await prisma.property.create({
    data: {
      slug: 'vivamayr-maria-worth',
      name: 'VIVAMAYR Maria Wörth',
      description:
        'The birthplace of Modern Mayr Medicine, VIVAMAYR Maria Wörth sits on a picturesque peninsula on Lake Wörthersee in Austria. This world-leading medical health resort combines traditional F.X. Mayr diagnostics with modern complementary medicine to create personalized health concepts focused on gut health, detoxification, and lasting well-being. Every program is medically supervised and individually tailored.',
      city: 'Maria Wörth',
      country: 'Austria',
      region: 'Carinthia',
      latitude: 46.6167,
      longitude: 14.1667,
      nearestAirport: 'Klagenfurt Airport (KLU)',
      transferTime: '20 minutes by car',
      tier: 'TIER_1',
      approach: 'INTEGRATIVE',
      focusAreas: ['DETOX', 'WEIGHT_METABOLIC', 'STRESS_BURNOUT', 'MEDICAL_ASSESSMENT', 'SLEEP'],
      priceMin: 5000,
      priceMax: 25000,
      currency: 'EUR',
      website: 'https://www.vivamayr.com',
      foundedYear: 2004,
      capacity: 60,
      accommodationType: 'Lakeside rooms and suites with Alpine views',
      diningDescription: 'Mayr cuisine focused on gut regeneration. Personalized meal plans based on individual constitution and treatment goals. Emphasis on proper chewing and food combining.',
      facilitiesDescription: '1,000m² medical spa, saltwater indoor pool, infrared saunas, Finnish sauna, gym with lake views, private beach access, water sports equipment.',
      setting: 'Lakeside peninsula on Lake Wörthersee',
      overallScore: 91,
      clinicalRigorScore: 93,
      outcomeEvidenceScore: 89,
      programDepthScore: 92,
      experienceQualityScore: 90,
      valueAlignmentScore: 91,
      physicianPatientRatio: '1:5',
      avgBookingLeadTime: '4-8 weeks',
      returnGuestPercentage: 58,
      staffTenure: 'Average 7 years',
      actualCustomization:
        'Pre-arrival microbiome analysis and blood tests. Initial physician examination determines personalized therapy plan. Daily adjustments based on progress. Nutrition plan created specifically for each guest.',
      postVisitFollowup:
        'Detailed therapy report with home recommendations. Follow-up consultation available. Return guest programs with progressive protocols.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Lactose-free', 'Gluten-free'],
      privacyArchitecture: 'Private treatment rooms, lakeside suites',
      prayerFacilities: 'Quiet meditation spaces',
      languagesMedical: ['German', 'English'],
      languagesService: ['German', 'English', 'Italian', 'Russian'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'LEAD_GEN',
      published: true,
      featured: true,
      editorChoice: 'Best for Modern Mayr Medicine',
      verifiedExcellence: true,
    },
  });

  await prisma.tierOneDetails.create({
    data: {
      propertyId: vivamayr.id,
      medicalDirector: 'Dr. Harald Stossier',
      medicalDirectorCreds: 'MD, Pioneer of Modern Mayr Medicine, 30+ years clinical experience',
      medicalTeamSize: 15,
      certifications: ['Austrian Medical Facility License', 'TÜV Certified'],
      hospitalAffiliations: [],
      researchPublications: [
        'Modern Mayr Medicine: Principles and clinical applications',
        'Gut-brain axis: Therapeutic interventions through digestive optimization',
      ],
    },
  });

  // VIVAMAYR Programs
  await prisma.program.create({
    data: {
      propertyId: vivamayr.id,
      name: 'VIVAMAYR Classic Program',
      description:
        'The foundation program at VIVAMAYR, completely customized to individual needs. Includes comprehensive medical care, diagnostic testing, and therapeutic treatments. Additional therapies determined after initial physician examination.',
      durationDays: 7,
      price: 3825,
      currency: 'EUR',
      focusAreas: ['DETOX', 'WEIGHT_METABOLIC', 'MEDICAL_ASSESSMENT'],
      inclusions: [
        'Initial medical examination',
        'Abdominal treatment (Mayr massage)',
        'Blood and laboratory tests',
        'Acid-base analysis',
        'Kneipp hydrotherapy',
        'Mayr cuisine with personalized meal plan',
        'Daily medical supervision',
      ],
      exclusions: ['Accommodation', 'Supplements', 'Special laboratory tests', 'Additional therapies'],
      typicalSchedule:
        'Daily: Morning nurse check, doctor consultation, abdominal massage, meals at designated times. Therapies scheduled throughout day based on individual plan.',
      published: true,
    },
  });

  // ============================================
  // PROPERTY 3: Buchinger Wilhelmi (Germany)
  // ============================================
  console.log('Creating Buchinger Wilhelmi...');

  const buchinger = await prisma.property.create({
    data: {
      slug: 'buchinger-wilhelmi',
      name: 'Buchinger Wilhelmi',
      description:
        'The world\'s leading therapeutic fasting clinic, Buchinger Wilhelmi has refined the art and science of fasting over four generations and 100+ years. Situated high above Lake Constance with views to the Alps, this prestigious clinic combines traditional fasting with integrative medicine, naturopathy, and psychosomatic approaches. More than 250,000 successful fasting treatments have been conducted here.',
      city: 'Überlingen',
      country: 'Germany',
      region: 'Baden-Württemberg',
      latitude: 47.7697,
      longitude: 9.1717,
      nearestAirport: 'Zurich Airport (ZRH) or Friedrichshafen (FDH)',
      transferTime: '1 hour from Zurich, 30 minutes from Friedrichshafen',
      tier: 'TIER_1',
      approach: 'INTEGRATIVE',
      focusAreas: ['DETOX', 'WEIGHT_METABOLIC', 'STRESS_BURNOUT', 'HOLISTIC_SPIRITUAL', 'MEDICAL_ASSESSMENT'],
      priceMin: 4000,
      priceMax: 20000,
      currency: 'EUR',
      website: 'https://www.buchinger-wilhelmi.com',
      foundedYear: 1953,
      capacity: 150,
      accommodationType: 'Rooms and suites in six residences overlooking Lake Constance',
      diningDescription: 'During fasting: vegetable consommés, herbal teas, fresh juices. Post-fast: award-winning Demeter-certified organic gourmet vegetarian cuisine.',
      facilitiesDescription: 'Heated outdoor pool, Kneipp facility, fitness studio, book-lined fasting lounge with lake views, extensive gardens, cultural programming spaces.',
      setting: 'Hillside overlooking Lake Constance with Alpine panorama',
      overallScore: 93,
      clinicalRigorScore: 95,
      outcomeEvidenceScore: 94,
      programDepthScore: 91,
      experienceQualityScore: 92,
      valueAlignmentScore: 93,
      physicianPatientRatio: '1:6',
      avgBookingLeadTime: '6-12 weeks',
      returnGuestPercentage: 55,
      staffTenure: 'Average 11 years',
      actualCustomization:
        'Initial comprehensive medical examination determines fasting suitability and protocol. Daily monitoring by nurses. Therapy plan adjusted based on individual response. Over 250 different treatments available.',
      postVisitFollowup:
        '"Feel well after Buchinger Wilhelmi" program with ongoing support. Digital fasting coach app. Annual return visits common among regular guests.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegan', 'Vegetarian', 'Gluten-free'],
      privacyArchitecture: 'Private suites available, quiet zones throughout',
      prayerFacilities: 'Meditation rooms, contemplation spaces, chapel',
      languagesMedical: ['German', 'English', 'French'],
      languagesService: ['German', 'English', 'French', 'Spanish', 'Italian'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'LEAD_GEN',
      published: true,
      featured: true,
      editorChoice: 'Gold Standard for Therapeutic Fasting',
      verifiedExcellence: true,
    },
  });

  await prisma.tierOneDetails.create({
    data: {
      propertyId: buchinger.id,
      medicalDirector: 'Dr. Françoise Wilhelmi de Toledo',
      medicalDirectorCreds: 'MD, 40+ years in fasting medicine, leading fasting researcher',
      medicalTeamSize: 8,
      certifications: ['German Medical Facility License', 'Demeter Organic Certification'],
      hospitalAffiliations: [],
      researchPublications: [
        'Safety, health improvement and well-being during a 4 to 21-day fasting period',
        'Fasting and cancer: molecular mechanisms and clinical application',
        'The effects of periodic fasting on cardiovascular risk markers',
      ],
    },
  });

  // Buchinger Programs
  await prisma.program.create({
    data: {
      propertyId: buchinger.id,
      name: 'Buchinger Med Programme',
      description:
        'The signature therapeutic fasting program built around the method developed by Dr. Otto Buchinger over 100 years ago. Combines fasting with personal medical care, physical fitness, conscious nutrition, and spiritual inspiration for holistic regeneration.',
      durationDays: 10,
      price: 4200,
      currency: 'EUR',
      focusAreas: ['DETOX', 'WEIGHT_METABOLIC', 'HOLISTIC_SPIRITUAL'],
      inclusions: [
        'Medical consultations',
        'Daily nurse monitoring',
        'Fasting provisions (consommés, juices, teas)',
        'Therapy voucher (€35/day)',
        'Group exercise and relaxation',
        'Cultural program',
        'Use of all facilities',
        'Refeeding meals',
      ],
      exclusions: ['Accommodation', 'Additional treatments beyond voucher', 'Specialist consultations'],
      typicalSchedule:
        'Day 1: Medical consultation, digestive rest. Days 2-7: Fasting with daily consommés and juices, treatments, exercise. Days 8-10: Gradual refeeding with organic cuisine.',
      published: true,
    },
  });

  // ============================================
  // PROPERTY 4: Chenot Palace Weggis (Switzerland)
  // ============================================
  console.log('Creating Chenot Palace Weggis...');

  const chenot = await prisma.property.create({
    data: {
      slug: 'chenot-palace-weggis',
      name: 'Chenot Palace Weggis',
      description:
        'Chenot Palace represents the pinnacle of the Chenot Method, a revolutionary approach to health and longevity developed over 50 years by Henri Chenot. Set in a stunning lakeside palace on Lake Lucerne, this ultra-exclusive destination combines advanced diagnostics, detoxification, bioenergetic treatments, and proprietary protocols to achieve deep cellular regeneration and lasting wellness transformation.',
      city: 'Weggis',
      country: 'Switzerland',
      region: 'Lucerne',
      latitude: 47.0333,
      longitude: 8.4333,
      nearestAirport: 'Zurich Airport (ZRH)',
      transferTime: '1 hour by car',
      tier: 'TIER_1',
      approach: 'INTEGRATIVE',
      focusAreas: ['LONGEVITY', 'DETOX', 'WEIGHT_METABOLIC', 'COGNITIVE_BRAIN', 'BEAUTY_AESTHETIC'],
      priceMin: 12000,
      priceMax: 60000,
      currency: 'CHF',
      website: 'https://chenotpalaceweggis.com',
      foundedYear: 2020,
      capacity: 97,
      accommodationType: 'Luxury palace rooms and suites with lake and mountain views',
      diningDescription: 'Chenot Diet - scientifically formulated meals that are calorie-controlled yet gourmet. Emphasis on plant-based nutrition and optimal macronutrient ratios.',
      facilitiesDescription: '5,000m² medical spa, hydrotherapy circuit, indoor pool, state-of-the-art gym, private treatment suites, meditation pavilion.',
      setting: 'Historic palace on Lake Lucerne with mountain backdrop',
      overallScore: 94,
      clinicalRigorScore: 93,
      outcomeEvidenceScore: 91,
      programDepthScore: 95,
      experienceQualityScore: 96,
      valueAlignmentScore: 89,
      physicianPatientRatio: '1:4',
      avgBookingLeadTime: '8-12 weeks',
      returnGuestPercentage: 62,
      staffTenure: 'Average 6 years',
      actualCustomization:
        'Comprehensive biomarker analysis and body composition assessment. Proprietary Chenot diagnostic methods determine individualized protocol. Daily adjustments based on bioenergetic readings and clinical observations.',
      postVisitFollowup:
        'Detailed wellness report with home protocols. Chenot supplements and home products available. Annual program recommendations.',
      discretionLevel: 'ULTRA_HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Kosher available', 'Halal available'],
      privacyArchitecture: 'VIP suites with private spa access, discrete arrival arrangements',
      prayerFacilities: 'Multi-faith meditation spaces',
      languagesMedical: ['English', 'French', 'German', 'Italian', 'Russian'],
      languagesService: ['English', 'French', 'German', 'Italian', 'Russian', 'Arabic', 'Mandarin'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'CONTACTED',
      published: true,
      featured: true,
      editorChoice: 'Best for Comprehensive Detox & Longevity',
      verifiedExcellence: true,
    },
  });

  await prisma.tierOneDetails.create({
    data: {
      propertyId: chenot.id,
      medicalDirector: 'Dr. George Gaitanos',
      medicalDirectorCreds: 'MD, PhD in Nutrition Science, Chenot Scientific Director',
      medicalTeamSize: 20,
      certifications: ['Swiss Medical Facility License'],
      hospitalAffiliations: [],
      researchPublications: [
        'The Chenot Method: Scientific foundations of integrative detoxification',
      ],
    },
  });

  // ============================================
  // PROPERTY 5: Palazzo Fiuggi (Italy)
  // ============================================
  console.log('Creating Palazzo Fiuggi...');

  const palazzoFiuggi = await prisma.property.create({
    data: {
      slug: 'palazzo-fiuggi',
      name: 'Palazzo Fiuggi Wellness Medical Retreat',
      description:
        'Opened in 2021 in a meticulously restored historic palazzo, Palazzo Fiuggi brings together world-renowned medical expertise and transformative wellness programs in the Italian tradition. The retreat offers cutting-edge longevity medicine, functional nutrition supervised by Michelin-starred chef Heinz Beck, and comprehensive wellness protocols set amid Renaissance gardens and natural thermal springs.',
      city: 'Fiuggi',
      country: 'Italy',
      region: 'Lazio',
      latitude: 41.7989,
      longitude: 13.2283,
      nearestAirport: 'Rome Fiumicino Airport (FCO)',
      transferTime: '1 hour 15 minutes by car',
      tier: 'TIER_1',
      approach: 'INTEGRATIVE',
      focusAreas: ['LONGEVITY', 'WEIGHT_METABOLIC', 'DETOX', 'BEAUTY_AESTHETIC', 'MEDICAL_ASSESSMENT'],
      priceMin: 10000,
      priceMax: 50000,
      currency: 'EUR',
      website: 'https://www.palazzofiuggi.com',
      foundedYear: 2021,
      capacity: 102,
      accommodationType: 'Palazzo suites with Renaissance gardens or mountain views',
      diningDescription: 'Functional gastronomy by 3-Michelin star chef Heinz Beck. Nutritional programs integrate pleasure with therapeutic goals. Acclaimed healthy gourmet cuisine.',
      facilitiesDescription: '6,000m² wellness and medical center, thermal pools, state-of-the-art diagnostics, fitness center, yoga studios, historic gardens.',
      setting: 'Renaissance palazzo with historic gardens and thermal springs',
      overallScore: 92,
      clinicalRigorScore: 91,
      outcomeEvidenceScore: 88,
      programDepthScore: 93,
      experienceQualityScore: 95,
      valueAlignmentScore: 90,
      physicianPatientRatio: '1:5',
      avgBookingLeadTime: '6-10 weeks',
      returnGuestPercentage: 48,
      staffTenure: 'Average 4 years',
      actualCustomization:
        'Comprehensive initial assessment including advanced diagnostics. Programs designed by multidisciplinary medical team. Nutrition protocols developed in collaboration with chef Heinz Beck.',
      postVisitFollowup:
        'Detailed medical report with lifestyle recommendations. Follow-up teleconsultations available. Home nutrition guidance.',
      discretionLevel: 'ULTRA_HIGH',
      genderSeparatedFacilities: 'ON_REQUEST',
      religiousDietaryOptions: ['Kosher available', 'Halal available', 'Vegetarian', 'Vegan'],
      privacyArchitecture: 'Private villa accommodations available, discrete service',
      prayerFacilities: 'Chapel, meditation gardens',
      languagesMedical: ['Italian', 'English', 'French', 'German'],
      languagesService: ['Italian', 'English', 'French', 'German', 'Spanish', 'Russian', 'Arabic'],
      soloTravelerFriendly: 'GOOD',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
      risingStar: true,
    },
  });

  await prisma.tierOneDetails.create({
    data: {
      propertyId: palazzoFiuggi.id,
      medicalDirector: 'Prof. David Della Morte Canosci',
      medicalDirectorCreds: 'MD, PhD, Professor of Internal Medicine, University of Rome Tor Vergata',
      medicalTeamSize: 25,
      certifications: ['Italian Healthcare Accreditation'],
      hospitalAffiliations: ['University of Rome Tor Vergata'],
      researchPublications: [],
    },
  });

  // ============================================
  // PROPERTY 6: Park Igls (Austria)
  // ============================================
  console.log('Creating Park Igls...');

  const parkIgls = await prisma.property.create({
    data: {
      slug: 'park-igls',
      name: 'Park Igls',
      description:
        'Park Igls is a distinguished medical spa hotel specializing in Modern Mayr Medicine, set in the pristine Alpine landscape above Innsbruck. The clinic combines the proven F.X. Mayr method with cutting-edge diagnostics and a comprehensive range of complementary therapies. Known for its rigorous medical approach and exceptional staff expertise, Park Igls delivers measurable health improvements.',
      city: 'Igls',
      country: 'Austria',
      region: 'Tyrol',
      latitude: 47.2308,
      longitude: 11.4097,
      nearestAirport: 'Innsbruck Airport (INN)',
      transferTime: '15 minutes by car',
      tier: 'TIER_1',
      approach: 'INTEGRATIVE',
      focusAreas: ['DETOX', 'WEIGHT_METABOLIC', 'STRESS_BURNOUT', 'SLEEP', 'MEDICAL_ASSESSMENT'],
      priceMin: 5000,
      priceMax: 18000,
      currency: 'EUR',
      website: 'https://www.park-igls.at',
      foundedYear: 1989,
      capacity: 55,
      accommodationType: 'Alpine-style rooms and suites with mountain views',
      diningDescription: 'Modern Mayr cuisine emphasizing gentle foods, proper chewing, and optimal digestion. Organic, regional ingredients. Individual meal plans.',
      facilitiesDescription: 'Medical center with diagnostic equipment, spa with Alpine views, indoor pool, sauna landscape, fitness room, hiking trails from property.',
      setting: 'Alpine hillside above Innsbruck',
      overallScore: 90,
      clinicalRigorScore: 92,
      outcomeEvidenceScore: 88,
      programDepthScore: 90,
      experienceQualityScore: 89,
      valueAlignmentScore: 92,
      physicianPatientRatio: '1:5',
      avgBookingLeadTime: '3-6 weeks',
      returnGuestPercentage: 60,
      staffTenure: 'Average 10 years',
      actualCustomization:
        'Comprehensive Mayr diagnostics including abdominal examination. Individual therapy plan created by physician. Daily medical supervision. Treatments adjusted based on progress.',
      postVisitFollowup:
        'Detailed medical report. Home program recommendations. Return guest priority booking.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Lactose-free'],
      privacyArchitecture: 'Private treatment rooms, quiet zones',
      prayerFacilities: 'Meditation room',
      languagesMedical: ['German', 'English'],
      languagesService: ['German', 'English', 'Italian'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
    },
  });

  await prisma.tierOneDetails.create({
    data: {
      propertyId: parkIgls.id,
      medicalDirector: 'Dr. Peter Gartner',
      medicalDirectorCreds: 'MD, Specialist in Internal Medicine, Modern Mayr physician',
      medicalTeamSize: 8,
      certifications: ['Austrian Medical Facility License', 'F.X. Mayr Certified Center'],
      hospitalAffiliations: [],
      researchPublications: [],
    },
  });

  // ============================================
  // PROPERTY 7: SHA Mexico (Riviera Maya)
  // ============================================
  console.log('Creating SHA Mexico...');

  const shaMexico = await prisma.property.create({
    data: {
      slug: 'sha-mexico',
      name: 'SHA Mexico',
      description:
        'SHA Mexico brings the world-renowned SHA Method to the Caribbean coast, offering the same hyper-personalized, science-driven wellness programs in a spectacular tropical setting. Opened in 2024, this newest SHA destination features cutting-edge longevity medicine, 50+ medical and holistic specialties, and innovative biohacking techniques overlooking the turquoise waters of the Mexican Caribbean.',
      city: 'Playa Mujeres',
      country: 'Mexico',
      region: 'Quintana Roo',
      latitude: 21.2587,
      longitude: -86.8069,
      nearestAirport: 'Cancun International Airport (CUN)',
      transferTime: '30 minutes by car',
      tier: 'TIER_1',
      approach: 'INTEGRATIVE',
      focusAreas: ['LONGEVITY', 'DETOX', 'WEIGHT_METABOLIC', 'STRESS_BURNOUT', 'COGNITIVE_BRAIN'],
      priceMin: 6500,
      priceMax: 40000,
      currency: 'USD',
      website: 'https://shawellness.com/sha-mexico',
      foundedYear: 2024,
      capacity: 80,
      accommodationType: 'Ocean-view suites and private residences',
      diningDescription: 'SHA Nutrition concept adapted with Mexican influences. Alkaline, anti-inflammatory cuisine with Caribbean flair.',
      facilitiesDescription: 'State-of-the-art medical and wellness center, beachfront location, infinity pools, extensive spa facilities, fitness center, yoga pavilions.',
      setting: 'Caribbean beachfront',
      overallScore: 91,
      clinicalRigorScore: 92,
      outcomeEvidenceScore: 89,
      programDepthScore: 94,
      experienceQualityScore: 93,
      valueAlignmentScore: 88,
      physicianPatientRatio: '1:5',
      avgBookingLeadTime: '4-8 weeks',
      returnGuestPercentage: 40,
      staffTenure: 'Average 2 years',
      actualCustomization:
        'Same comprehensive SHA diagnostic protocol as Spain. 88-biomarker analysis, 3D body scanning, personalized treatment plans. Programs mirror SHA Spain with tropical adaptations.',
      postVisitFollowup:
        'Post-program monitoring via SHA app. Virtual follow-up consultations. Consistent SHA protocol allows seamless care between locations.',
      discretionLevel: 'ULTRA_HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Kosher available'],
      privacyArchitecture: 'Private beachfront residences, discrete VIP services',
      prayerFacilities: 'Meditation spaces, beach contemplation areas',
      languagesMedical: ['English', 'Spanish'],
      languagesService: ['English', 'Spanish', 'French', 'Portuguese'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'AFFILIATE',
      published: true,
      featured: false,
      risingStar: true,
    },
  });

  await prisma.tierOneDetails.create({
    data: {
      propertyId: shaMexico.id,
      medicalDirector: 'Dr. Carlos Villaverde',
      medicalDirectorCreds: 'MD, SHA-trained physician, specialist in integrative medicine',
      medicalTeamSize: 30,
      certifications: ['Mexican Healthcare License', 'SHA Method Certified'],
      hospitalAffiliations: [],
      researchPublications: [],
    },
  });

  // ============================================
  // PROPERTY 8: Canyon Ranch Tucson (USA)
  // ============================================
  console.log('Creating Canyon Ranch Tucson...');

  const canyonRanch = await prisma.property.create({
    data: {
      slug: 'canyon-ranch-tucson',
      name: 'Canyon Ranch Tucson',
      description:
        'The original destination wellness resort and a pioneer in integrative health since 1979. Canyon Ranch Tucson offers evidence-based health and wellness programs on a stunning 150-acre desert campus in the Sonoran Desert. With a comprehensive medical staff, extensive diagnostics, and hundreds of daily activities, it remains America\'s premier health resort.',
      city: 'Tucson',
      country: 'United States',
      region: 'Arizona',
      latitude: 32.3372,
      longitude: -110.8847,
      nearestAirport: 'Tucson International Airport (TUS)',
      transferTime: '30 minutes by car',
      tier: 'TIER_1',
      approach: 'INTEGRATIVE',
      focusAreas: ['LONGEVITY', 'WEIGHT_METABOLIC', 'STRESS_BURNOUT', 'FITNESS_PERFORMANCE', 'MEDICAL_ASSESSMENT'],
      priceMin: 8000,
      priceMax: 30000,
      currency: 'USD',
      website: 'https://www.canyonranch.com/tucson',
      foundedYear: 1979,
      capacity: 240,
      accommodationType: 'Casita-style accommodations in desert landscape',
      diningDescription: 'Award-winning healthy cuisine. Farm-to-table focus with Canyon Ranch\'s own organic garden. Multiple dining venues.',
      facilitiesDescription: '150-acre campus, world-class spa, extensive fitness facilities, multiple pools, tennis courts, hiking trails, climbing wall, golf course nearby.',
      setting: 'Sonoran Desert foothills',
      overallScore: 88,
      clinicalRigorScore: 86,
      outcomeEvidenceScore: 85,
      programDepthScore: 90,
      experienceQualityScore: 90,
      valueAlignmentScore: 87,
      physicianPatientRatio: '1:8',
      avgBookingLeadTime: '4-8 weeks',
      returnGuestPercentage: 52,
      staffTenure: 'Average 8 years',
      actualCustomization:
        'Comprehensive health assessment available. Guests choose from hundreds of activities and services. Personal programming consultation helps design stay.',
      postVisitFollowup:
        'Health assessment report with recommendations. Online resources and app. Return guest recognition program.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Kosher available', 'Halal available', 'Vegetarian', 'Vegan', 'Gluten-free'],
      privacyArchitecture: 'Private casitas, spread-out campus',
      prayerFacilities: 'Spiritual wellness programs, meditation spaces, labyrinth',
      languagesMedical: ['English', 'Spanish'],
      languagesService: ['English', 'Spanish'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
    },
  });

  await prisma.tierOneDetails.create({
    data: {
      propertyId: canyonRanch.id,
      medicalDirector: 'Dr. Richard Carmona',
      medicalDirectorCreds: 'MD, MPH, Former U.S. Surgeon General, Distinguished Professor',
      medicalTeamSize: 25,
      certifications: ['Arizona Medical Facility License', 'CHPA Certified'],
      hospitalAffiliations: ['University of Arizona'],
      researchPublications: [],
    },
  });

  // ============================================
  // LINK TREATMENTS TO NEW PROPERTIES
  // ============================================
  console.log('\n🔗 Linking treatments to properties...');

  const propertyTreatments = [
    // SHA Wellness
    { propertyId: shaWellness.id, slug: 'nad-iv-therapy', price: 600 },
    { propertyId: shaWellness.id, slug: 'iv-vitamin-therapy', price: 300 },
    { propertyId: shaWellness.id, slug: 'hyperbaric-oxygen-therapy', price: 200 },
    { propertyId: shaWellness.id, slug: 'whole-body-cryotherapy', price: 100 },
    { propertyId: shaWellness.id, slug: 'neurofeedback', price: 200 },
    { propertyId: shaWellness.id, slug: 'hormone-optimization', price: 1500 },
    { propertyId: shaWellness.id, slug: 'acupuncture', price: 120 },
    
    // VIVAMAYR
    { propertyId: vivamayr.id, slug: 'colon-hydrotherapy', price: 100 },
    { propertyId: vivamayr.id, slug: 'iv-vitamin-therapy', price: 200 },
    { propertyId: vivamayr.id, slug: 'ozone-therapy', price: 150 },
    { propertyId: vivamayr.id, slug: 'infrared-sauna', price: 50 },
    { propertyId: vivamayr.id, slug: 'lymphatic-drainage', price: 120 },
    
    // Buchinger Wilhelmi
    { propertyId: buchinger.id, slug: 'colon-hydrotherapy', price: 80 },
    { propertyId: buchinger.id, slug: 'lymphatic-drainage', price: 100 },
    { propertyId: buchinger.id, slug: 'acupuncture', price: 90 },
    { propertyId: buchinger.id, slug: 'breathwork', price: 60 },
    
    // Chenot Palace
    { propertyId: chenot.id, slug: 'nad-iv-therapy', price: 900 },
    { propertyId: chenot.id, slug: 'iv-vitamin-therapy', price: 400 },
    { propertyId: chenot.id, slug: 'hyperbaric-oxygen-therapy', price: 250 },
    { propertyId: chenot.id, slug: 'whole-body-cryotherapy', price: 120 },
    { propertyId: chenot.id, slug: 'colon-hydrotherapy', price: 150 },
    { propertyId: chenot.id, slug: 'lymphatic-drainage', price: 180 },
    
    // Palazzo Fiuggi
    { propertyId: palazzoFiuggi.id, slug: 'iv-vitamin-therapy', price: 350 },
    { propertyId: palazzoFiuggi.id, slug: 'colon-hydrotherapy', price: 120 },
    { propertyId: palazzoFiuggi.id, slug: 'hyperbaric-oxygen-therapy', price: 200 },
    
    // Park Igls
    { propertyId: parkIgls.id, slug: 'colon-hydrotherapy', price: 90 },
    { propertyId: parkIgls.id, slug: 'iv-vitamin-therapy', price: 180 },
    { propertyId: parkIgls.id, slug: 'lymphatic-drainage', price: 100 },
    
    // SHA Mexico
    { propertyId: shaMexico.id, slug: 'nad-iv-therapy', price: 550 },
    { propertyId: shaMexico.id, slug: 'iv-vitamin-therapy', price: 280 },
    { propertyId: shaMexico.id, slug: 'whole-body-cryotherapy', price: 90 },
    { propertyId: shaMexico.id, slug: 'neurofeedback', price: 180 },
    
    // Canyon Ranch
    { propertyId: canyonRanch.id, slug: 'iv-vitamin-therapy', price: 300 },
    { propertyId: canyonRanch.id, slug: 'acupuncture', price: 150 },
    { propertyId: canyonRanch.id, slug: 'craniosacral-therapy', price: 180 },
    { propertyId: canyonRanch.id, slug: 'biofeedback', price: 150 },
  ];

  for (const pt of propertyTreatments) {
    const treatment = treatmentMap.get(pt.slug);
    if (treatment) {
      await prisma.propertyTreatment.create({
        data: {
          propertyId: pt.propertyId,
          treatmentId: treatment.id,
          priceAtProperty: pt.price,
        },
      });
    }
  }

  // ============================================
  // LINK DIAGNOSTICS TO NEW PROPERTIES
  // ============================================
  console.log('🔗 Linking diagnostics to properties...');

  const propertyDiagnostics = [
    // SHA Wellness
    { propertyId: shaWellness.id, slug: 'comprehensive-blood-panel' },
    { propertyId: shaWellness.id, slug: 'genetic-testing' },
    { propertyId: shaWellness.id, slug: 'gut-microbiome-analysis' },
    { propertyId: shaWellness.id, slug: 'coronary-calcium-score' },
    
    // VIVAMAYR
    { propertyId: vivamayr.id, slug: 'comprehensive-blood-panel' },
    { propertyId: vivamayr.id, slug: 'gut-microbiome-analysis' },
    
    // Buchinger Wilhelmi
    { propertyId: buchinger.id, slug: 'comprehensive-blood-panel' },
    
    // Chenot Palace
    { propertyId: chenot.id, slug: 'comprehensive-blood-panel' },
    { propertyId: chenot.id, slug: 'full-body-mri' },
    { propertyId: chenot.id, slug: 'genetic-testing' },
    
    // Palazzo Fiuggi
    { propertyId: palazzoFiuggi.id, slug: 'comprehensive-blood-panel' },
    { propertyId: palazzoFiuggi.id, slug: 'full-body-mri' },
    
    // Park Igls
    { propertyId: parkIgls.id, slug: 'comprehensive-blood-panel' },
    { propertyId: parkIgls.id, slug: 'gut-microbiome-analysis' },
    
    // SHA Mexico
    { propertyId: shaMexico.id, slug: 'comprehensive-blood-panel' },
    { propertyId: shaMexico.id, slug: 'genetic-testing' },
    
    // Canyon Ranch
    { propertyId: canyonRanch.id, slug: 'comprehensive-blood-panel' },
    { propertyId: canyonRanch.id, slug: 'coronary-calcium-score' },
  ];

  for (const pd of propertyDiagnostics) {
    const diagnostic = diagnosticMap.get(pd.slug);
    if (diagnostic) {
      await prisma.propertyDiagnostic.create({
        data: {
          propertyId: pd.propertyId,
          diagnosticId: diagnostic.id,
        },
      });
    }
  }

  // ============================================
  // CREATE CLARUS INDEX SCORES
  // ============================================
  console.log('📊 Creating Clarus Index scores...');

  const indexScores = [
    {
      propertyId: shaWellness.id,
      overallScore: 95,
      tier: 'EXCEPTIONAL' as const,
      dimensions: {
        clinicalRigor: 94,
        outcomeEvidence: 93,
        programDepth: 96,
        experienceQuality: 95,
        valueAlignment: 92,
      },
      assessedBy: 'Dr. Sarah Chen',
    },
    {
      propertyId: vivamayr.id,
      overallScore: 91,
      tier: 'EXCEPTIONAL' as const,
      dimensions: {
        clinicalRigor: 93,
        outcomeEvidence: 89,
        programDepth: 92,
        experienceQuality: 90,
        valueAlignment: 91,
      },
      assessedBy: 'James Worthington',
    },
    {
      propertyId: buchinger.id,
      overallScore: 93,
      tier: 'EXCEPTIONAL' as const,
      dimensions: {
        clinicalRigor: 95,
        outcomeEvidence: 94,
        programDepth: 91,
        experienceQuality: 92,
        valueAlignment: 93,
      },
      assessedBy: 'Dr. Sarah Chen',
    },
    {
      propertyId: chenot.id,
      overallScore: 94,
      tier: 'EXCEPTIONAL' as const,
      dimensions: {
        clinicalRigor: 93,
        outcomeEvidence: 91,
        programDepth: 95,
        experienceQuality: 96,
        valueAlignment: 89,
      },
      assessedBy: 'James Worthington',
    },
    {
      propertyId: palazzoFiuggi.id,
      overallScore: 92,
      tier: 'EXCEPTIONAL' as const,
      dimensions: {
        clinicalRigor: 91,
        outcomeEvidence: 88,
        programDepth: 93,
        experienceQuality: 95,
        valueAlignment: 90,
      },
      assessedBy: 'Dr. Sarah Chen',
    },
    {
      propertyId: parkIgls.id,
      overallScore: 90,
      tier: 'EXCEPTIONAL' as const,
      dimensions: {
        clinicalRigor: 92,
        outcomeEvidence: 88,
        programDepth: 90,
        experienceQuality: 89,
        valueAlignment: 92,
      },
      assessedBy: 'James Worthington',
    },
    {
      propertyId: shaMexico.id,
      overallScore: 91,
      tier: 'EXCEPTIONAL' as const,
      dimensions: {
        clinicalRigor: 92,
        outcomeEvidence: 89,
        programDepth: 94,
        experienceQuality: 93,
        valueAlignment: 88,
      },
      assessedBy: 'Dr. Sarah Chen',
    },
    {
      propertyId: canyonRanch.id,
      overallScore: 88,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 86,
        outcomeEvidence: 85,
        programDepth: 90,
        experienceQuality: 90,
        valueAlignment: 87,
      },
      assessedBy: 'James Worthington',
    },
  ];

  for (const score of indexScores) {
    await prisma.clarusIndexScore.create({
      data: {
        propertyId: score.propertyId,
        overallScore: score.overallScore,
        tier: score.tier,
        dimensions: score.dimensions,
        assessmentDate: new Date('2024-11-15'),
        assessedBy: score.assessedBy,
        methodology: 'v1.0',
      },
    });
  }

  // ============================================
  // CREATE SAMPLE REVIEWS
  // ============================================
  console.log('⭐ Creating sample reviews...');

  if (drChen) {
    await prisma.review.create({
      data: {
        propertyId: shaWellness.id,
        isTeamReview: true,
        teamMemberId: drChen.id,
        reviewerName: 'Dr. Sarah Chen',
        visitDate: new Date('2024-09-20'),
        programType: 'Advanced Longevity Program',
        stayLengthDays: 10,
        statedGoals: ['Comprehensive health optimization', 'Longevity protocol evaluation', 'Stress recovery'],
        overallRating: 5,
        serviceRating: 5,
        facilitiesRating: 5,
        diningRating: 5,
        valueRating: 4,
        goalAchievement: 'FULLY',
        protocolQualityRating: 5,
        followupQualityRating: 5,
        physicianEndorsement: 'YES',
        bioAgeChange: -4,
        energyImprovement: 9,
        sleepImprovement: 8,
        specificOutcomes:
          'Comprehensive 88-biomarker panel showed remarkable improvements across inflammatory markers, metabolic function, and hormonal balance. Epigenetic age testing indicated 4-year biological age reversal.',
        reviewText:
          'SHA represents the gold standard in integrative longevity medicine. The depth of their diagnostic capabilities rivals academic medical centers, while the therapeutic arsenal—from cutting-edge biohacking to traditional Chinese medicine—is unmatched. The SHA Method is not a gimmick; it\'s a scientifically grounded approach refined over two decades. The food alone is transformative—Michelin-quality healthy cuisine that makes every meal a pleasure. My only caveat is the price point, though the value delivered justifies the investment for those who can afford it.',
        pros: [
          'Unparalleled diagnostic depth with 88-biomarker longevity panel',
          'World-class medical team with 50+ specialists',
          'Exceptional macrobiotic-inspired cuisine',
          'Stunning Mediterranean setting',
          'Measurable, lasting results',
        ],
        cons: [
          'Premium pricing requires significant investment',
          'Minimum stay of 4+ nights required for meaningful results',
          'Can feel overwhelming with treatment options',
        ],
        verified: true,
        verificationMethod: 'team_visit',
        status: 'APPROVED',
        helpfulCount: 38,
      },
    });
  }

  if (jamesW) {
    await prisma.review.create({
      data: {
        propertyId: buchinger.id,
        isTeamReview: true,
        teamMemberId: jamesW.id,
        reviewerName: 'James Worthington',
        visitDate: new Date('2024-07-15'),
        programType: 'Buchinger Med Programme',
        stayLengthDays: 14,
        statedGoals: ['Reset metabolism', 'Mental clarity', 'Stress recovery'],
        overallRating: 5,
        serviceRating: 5,
        facilitiesRating: 4,
        diningRating: 5,
        valueRating: 5,
        goalAchievement: 'FULLY',
        protocolQualityRating: 5,
        followupQualityRating: 4,
        physicianEndorsement: 'YES',
        bioAgeChange: -2,
        weightChange: -5.5,
        energyImprovement: 9,
        sleepImprovement: 9,
        specificOutcomes:
          'Lost 5.5kg while maintaining muscle mass (verified by bioimpedance). Blood pressure normalized. Inflammatory markers decreased by 40%. Mental clarity and energy levels dramatically improved.',
        reviewText:
          'Buchinger Wilhelmi is the original and still the best therapeutic fasting clinic in the world. There\'s a reason guests have been returning for 40+ years. The fasting experience here is carefully designed to be not just tolerable but genuinely pleasant—the daily consommés are delicious, the cultural programming is enriching, and the views over Lake Constance are restorative. Unlike trendy fasting protocols, Buchinger\'s approach is backed by rigorous research and a century of clinical experience. The refeeding process is masterfully handled, and I left feeling completely renewed.',
        pros: [
          'Gold standard therapeutic fasting protocol',
          'Exceptional research pedigree',
          'Beautiful Lake Constance setting',
          'Outstanding organic cuisine post-fast',
          'Excellent value for the medical depth',
        ],
        cons: [
          'Facilities show age in some areas',
          'German efficiency can feel clinical',
          'Remote location requires planning',
        ],
        verified: true,
        verificationMethod: 'team_visit',
        status: 'APPROVED',
        helpfulCount: 45,
      },
    });
  }

  // Update team member property visits
  if (drChen) {
    const existingVisits = drChen.propertiesVisited || [];
    await prisma.teamMember.update({
      where: { id: drChen.id },
      data: {
        propertiesVisited: [
          ...existingVisits,
          shaWellness.id,
          buchinger.id,
          palazzoFiuggi.id,
          shaMexico.id,
        ],
      },
    });
  }

  if (jamesW) {
    const existingVisits = jamesW.propertiesVisited || [];
    await prisma.teamMember.update({
      where: { id: jamesW.id },
      data: {
        propertiesVisited: [
          ...existingVisits,
          vivamayr.id,
          buchinger.id,
          chenot.id,
          parkIgls.id,
          canyonRanch.id,
        ],
      },
    });
  }

  // ============================================
  // CREATE HERO IMAGES
  // ============================================
  console.log('🖼️ Adding hero images...');

  const heroImages = [
    { propertyId: shaWellness.id, url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&h=1080&fit=crop&q=80', alt: 'SHA Wellness Clinic Mediterranean clifftop view' },
    { propertyId: vivamayr.id, url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&h=1080&fit=crop&q=80', alt: 'VIVAMAYR Maria Wörth Austrian lakeside' },
    { propertyId: buchinger.id, url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop&q=80', alt: 'Buchinger Wilhelmi Lake Constance setting' },
    { propertyId: chenot.id, url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&h=1080&fit=crop&q=80', alt: 'Chenot Palace Weggis Swiss lakeside palace' },
    { propertyId: palazzoFiuggi.id, url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1920&h=1080&fit=crop&q=80', alt: 'Palazzo Fiuggi Italian hilltop palazzo' },
    { propertyId: parkIgls.id, url: 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=1920&h=1080&fit=crop&q=80', alt: 'Park Igls Tyrolean mountain views' },
    { propertyId: shaMexico.id, url: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=1920&h=1080&fit=crop&q=80', alt: 'SHA Mexico Riviera Maya jungle and ocean' },
    { propertyId: canyonRanch.id, url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=1080&fit=crop&q=80', alt: 'Canyon Ranch Tucson Sonoran desert landscape' },
  ];

  for (const img of heroImages) {
    await prisma.propertyImage.create({
      data: {
        propertyId: img.propertyId,
        url: img.url,
        alt: img.alt,
        width: 1920,
        height: 1080,
        aspectRatio: '16:9',
        category: 'hero',
        isFeatured: true,
        sortOrder: 0,
      },
    });
  }

  console.log(`Created ${heroImages.length} hero images`);

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n✅ Tier 1 Expansion completed successfully!\n');
  console.log('Summary of new properties added:');
  console.log('  1. SHA Wellness Clinic (Spain) - Score: 95');
  console.log('  2. VIVAMAYR Maria Wörth (Austria) - Score: 91');
  console.log('  3. Buchinger Wilhelmi (Germany) - Score: 93');
  console.log('  4. Chenot Palace Weggis (Switzerland) - Score: 94');
  console.log('  5. Palazzo Fiuggi (Italy) - Score: 92');
  console.log('  6. Park Igls (Austria) - Score: 90');
  console.log('  7. SHA Mexico (Mexico) - Score: 91');
  console.log('  8. Canyon Ranch Tucson (USA) - Score: 88');
  console.log('\nTotal Tier 1 properties: 10 (2 existing + 8 new)');
  console.log('Total treatments linked: ' + propertyTreatments.length);
  console.log('Total diagnostics linked: ' + propertyDiagnostics.length);
  console.log('Total team reviews added: 2');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding Tier 1 expansion:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
