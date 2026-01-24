/**
 * Clarus Vitae - Tier 2 Integrated Wellness Properties Expansion
 *
 * This seed file adds 15 Tier 2 properties (Integrative Wellness destinations).
 * Run AFTER the main seed.ts and seed-tier1-expansion.ts to preserve existing data.
 *
 * Tier 2 Criteria:
 * - $5,000-$30,000 programs
 * - Integrative/holistic approach
 * - Strong program structure but less clinical than Tier 1
 * - Clarus Index scores 75-89 (DISTINGUISHED tier)
 *
 * Properties added:
 * 1. Six Senses Douro Valley (Portugal)
 * 2. Como Shambhala Estate (Bali, Indonesia)
 * 3. Ananda in the Himalayas (India)
 * 4. The Ranch Malibu (USA)
 * 5. Lefay Resort & Spa Lago di Garda (Italy)
 * 6. Brenners Park-Hotel & Spa (Germany)
 * 7. Forestis Dolomites (Italy)
 * 8. Lily of the Valley (France)
 * 9. Euphoria Retreat (Greece)
 * 10. Schloss Elmau (Germany)
 * 11. Miraval Arizona (USA)
 * 12. Cal-a-Vie Health Spa (USA)
 * 13. The BodyHoliday (St. Lucia)
 * 14. Shanti Maurice (Mauritius)
 * 15. Absolute Sanctuary (Thailand)
 *
 * Usage:
 *   cd packages/database
 *   npx tsx prisma/seed-tier2-expansion.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌿 Starting Tier 2 Integrated Wellness Properties Expansion...\n');

  // Get existing treatments to link
  const treatments = await prisma.treatment.findMany();
  const treatmentMap = new Map(treatments.map((t) => [t.slug, t]));

  // Get existing diagnostics to link
  const diagnostics = await prisma.diagnostic.findMany();
  const diagnosticMap = new Map(diagnostics.map((d) => [d.slug, d]));

  // ============================================
  // PROPERTY 1: Six Senses Douro Valley (Portugal)
  // ============================================
  console.log('Creating Six Senses Douro Valley...');

  const sixSensesDouro = await prisma.property.create({
    data: {
      slug: 'six-senses-douro-valley',
      name: 'Six Senses Douro Valley',
      description:
        "Set within a 19th-century manor house overlooking the terraced hills of Portugal's UNESCO-listed Douro Valley wine region, Six Senses Douro Valley combines integrated wellness with sustainability and sensory experiences. The property's holistic approach encompasses sleep, nutrition, fitness, mindfulness, and spa therapies, all personalized through their signature wellness screening.",
      city: 'Lamego',
      country: 'Portugal',
      region: 'Douro Valley',
      latitude: 41.0922,
      longitude: -7.8086,
      nearestAirport: 'Porto Airport (OPO)',
      transferTime: '1 hour 30 minutes by car',
      tier: 'TIER_2',
      approach: 'INTEGRATIVE',
      focusAreas: ['STRESS_BURNOUT', 'SLEEP', 'DETOX', 'FITNESS_PERFORMANCE', 'HOLISTIC_SPIRITUAL'],
      priceMin: 5000,
      priceMax: 18000,
      currency: 'EUR',
      website: 'https://www.sixsenses.com/en/resorts/douro-valley',
      foundedYear: 2015,
      capacity: 57,
      accommodationType: 'Rooms, suites, and villas with valley or vineyard views',
      diningDescription:
        'Eat With Six Senses philosophy emphasizing local, organic, sustainable ingredients. Vale de Abraão restaurant showcases regional Portuguese cuisine with wellness-focused options.',
      facilitiesDescription:
        'Six Senses Spa with indoor/outdoor pools, thermal area, fitness center, yoga deck, alchemy bar for personalized supplements, organic gardens, vineyard tours.',
      setting: 'Historic estate overlooking UNESCO Douro Valley vineyards',
      overallScore: 86,
      clinicalRigorScore: 78,
      outcomeEvidenceScore: 75,
      programDepthScore: 88,
      experienceQualityScore: 94,
      valueAlignmentScore: 89,
      physicianPatientRatio: null,
      avgBookingLeadTime: '4-8 weeks',
      returnGuestPercentage: 45,
      staffTenure: 'Average 5 years',
      actualCustomization:
        'Comprehensive wellness screening assesses sleep, nutrition, fitness, and mindfulness. Programs tailored based on results with ongoing adjustments.',
      postVisitFollowup:
        'Personalized recommendations to take home. Access to Six Senses app. Return guest recognition.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Halal available'],
      privacyArchitecture: 'Private villas available, secluded spa treatment rooms',
      prayerFacilities: 'Meditation spaces, yoga pavilion',
      languagesMedical: ['English', 'Portuguese'],
      languagesService: ['English', 'Portuguese', 'Spanish', 'French', 'German'],
      soloTravelerFriendly: 'GOOD',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'CONTACTED',
      published: true,
      featured: false,
    },
  });

  // Six Senses Programs
  await prisma.program.create({
    data: {
      propertyId: sixSensesDouro.id,
      name: 'Integrated Wellness Program',
      description:
        'A comprehensive wellness journey beginning with Six Senses screening to identify areas for improvement across sleep, nutrition, movement, and mindfulness. Daily personalized activities and treatments.',
      durationDays: 5,
      price: 5500,
      currency: 'EUR',
      focusAreas: ['STRESS_BURNOUT', 'SLEEP', 'FITNESS_PERFORMANCE'],
      inclusions: [
        'Six Senses wellness screening',
        'Personal wellness consultation',
        'Daily spa treatments',
        'Fitness and movement sessions',
        'Mindfulness activities',
        'Healthy cuisine with wine pairings',
        'Vineyard experience',
      ],
      exclusions: ['Accommodation', 'Airport transfers', 'Additional treatments'],
      published: true,
    },
  });

  await prisma.program.create({
    data: {
      propertyId: sixSensesDouro.id,
      name: 'Sleep & De-stress',
      description:
        'Focused program addressing sleep quality and stress management through specialized treatments, sleep coaching, and relaxation techniques.',
      durationDays: 4,
      price: 4200,
      currency: 'EUR',
      focusAreas: ['SLEEP', 'STRESS_BURNOUT'],
      inclusions: [
        'Sleep assessment',
        'Sleep-focused treatments',
        'Relaxation therapies',
        'Evening rituals',
        'Sleep optimization consultation',
      ],
      exclusions: ['Accommodation', 'Airport transfers'],
      published: true,
    },
  });

  // ============================================
  // PROPERTY 2: Como Shambhala Estate (Bali)
  // ============================================
  console.log('Creating Como Shambhala Estate...');

  const comoShambhala = await prisma.property.create({
    data: {
      slug: 'como-shambhala-estate',
      name: 'Como Shambhala Estate',
      description:
        "A dedicated wellness retreat set within a sacred river valley near Ubud, Como Shambhala Estate has been a pioneer in holistic wellness for over two decades. The estate's approach integrates Eastern and Western healing traditions, emphasizing yoga, Ayurveda, movement, nutrition, and spiritual practices within Bali's mystical landscape.",
      city: 'Ubud',
      country: 'Indonesia',
      region: 'Bali',
      latitude: -8.4305,
      longitude: 115.2872,
      nearestAirport: 'Ngurah Rai International Airport (DPS)',
      transferTime: '1 hour 30 minutes by car',
      tier: 'TIER_2',
      approach: 'HOLISTIC',
      focusAreas: [
        'HOLISTIC_SPIRITUAL',
        'STRESS_BURNOUT',
        'FITNESS_PERFORMANCE',
        'DETOX',
        'GENERAL_REJUVENATION',
      ],
      priceMin: 4000,
      priceMax: 15000,
      currency: 'USD',
      website: 'https://www.comohotels.com/como-shambhala-estate',
      foundedYear: 1997,
      capacity: 30,
      accommodationType: 'Residences and suites in tropical gardens with river or valley views',
      diningDescription:
        'COMO Shambhala Cuisine emphasizes raw, organic, nutrient-rich foods. Glow restaurant serves healthy Indonesian and international dishes.',
      facilitiesDescription:
        'Extensive spa with hydrotherapy, vitality pool, yoga pavilions, Pilates studio, outdoor fitness, sacred springs, jungle trails.',
      setting: 'Sacred river valley near Ubud surrounded by jungle',
      overallScore: 85,
      clinicalRigorScore: 72,
      outcomeEvidenceScore: 70,
      programDepthScore: 88,
      experienceQualityScore: 95,
      valueAlignmentScore: 90,
      physicianPatientRatio: null,
      avgBookingLeadTime: '3-6 weeks',
      returnGuestPercentage: 50,
      staffTenure: 'Average 8 years',
      actualCustomization:
        'Initial consultation with resident experts determines personalized program. Ayurvedic assessment available. Daily schedule adjusted based on progress.',
      postVisitFollowup:
        'Take-home wellness recommendations. COMO at Home products and practices.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Raw food'],
      privacyArchitecture: 'Private residences, secluded treatment pavilions',
      prayerFacilities: 'Meditation pavilions, sacred springs, blessing ceremonies available',
      languagesMedical: ['English', 'Indonesian'],
      languagesService: ['English', 'Indonesian', 'Japanese', 'French'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
    },
  });

  await prisma.program.create({
    data: {
      propertyId: comoShambhala.id,
      name: 'Cleanse Program',
      description:
        'A detoxification journey combining COMO Shambhala Cuisine with specialized treatments and activities to cleanse body and mind.',
      durationDays: 7,
      price: 6500,
      currency: 'USD',
      focusAreas: ['DETOX', 'GENERAL_REJUVENATION'],
      inclusions: [
        'Initial wellness consultation',
        'Daily cleansing treatments',
        'COMO Shambhala cleanse cuisine',
        'Yoga and Pilates sessions',
        'Guided meditation',
        'Hydrotherapy circuit',
      ],
      exclusions: ['Accommodation', 'Airport transfers'],
      published: true,
    },
  });

  // ============================================
  // PROPERTY 3: Ananda in the Himalayas (India)
  // ============================================
  console.log('Creating Ananda in the Himalayas...');

  const ananda = await prisma.property.create({
    data: {
      slug: 'ananda-in-the-himalayas',
      name: 'Ananda in the Himalayas',
      description:
        "India's premier luxury wellness destination, Ananda sits in a 100-acre Maharaja's palace estate overlooking the sacred town of Rishikesh and the Ganges River. Drawing on India's ancient healing traditions including Ayurveda, Yoga, and Vedanta, Ananda offers transformative programs that address physical, mental, and spiritual well-being.",
      city: 'Rishikesh',
      country: 'India',
      region: 'Uttarakhand',
      latitude: 30.1158,
      longitude: 78.3284,
      nearestAirport: 'Dehradun Airport (DED)',
      transferTime: '45 minutes by car',
      tier: 'TIER_2',
      approach: 'HOLISTIC',
      focusAreas: [
        'HOLISTIC_SPIRITUAL',
        'STRESS_BURNOUT',
        'DETOX',
        'WEIGHT_METABOLIC',
        'GENERAL_REJUVENATION',
      ],
      priceMin: 3500,
      priceMax: 12000,
      currency: 'USD',
      website: 'https://www.anandaspa.com',
      foundedYear: 2000,
      capacity: 78,
      accommodationType: "Rooms and suites in the Maharaja's palace with Himalayan views",
      diningDescription:
        'Ayurvedic and spa cuisine with organic ingredients from the resort gardens. Personalized meal plans based on dosha assessment.',
      facilitiesDescription:
        '24,000 sq ft spa, Ayurvedic treatment rooms, yoga pavilion, meditation cave, outdoor pool, fitness center, golf course, nature trails.',
      setting: "Maharaja's palace estate in Himalayan foothills above Rishikesh",
      overallScore: 87,
      clinicalRigorScore: 80,
      outcomeEvidenceScore: 78,
      programDepthScore: 90,
      experienceQualityScore: 92,
      valueAlignmentScore: 88,
      physicianPatientRatio: '1:10',
      avgBookingLeadTime: '4-8 weeks',
      returnGuestPercentage: 55,
      staffTenure: 'Average 10 years',
      actualCustomization:
        'Comprehensive Ayurvedic consultation determines dosha and imbalances. Programs fully customized based on individual constitution and goals.',
      postVisitFollowup:
        'Detailed Ayurvedic report with home recommendations. Ananda products available for continued practice.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Ayurvedic diet plans'],
      privacyArchitecture: 'Private palace suites, individual treatment rooms',
      prayerFacilities: 'Meditation cave, yoga temple, access to Rishikesh ashrams',
      languagesMedical: ['English', 'Hindi'],
      languagesService: ['English', 'Hindi', 'French', 'German', 'Japanese'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'LEAD_GEN',
      published: true,
      featured: true,
      editorChoice: 'Best for Authentic Ayurveda',
      verifiedExcellence: true,
    },
  });

  await prisma.program.create({
    data: {
      propertyId: ananda.id,
      name: 'Ayurvedic Rejuvenation',
      description:
        'Traditional Panchakarma-based program for deep cleansing and rejuvenation according to Ayurvedic principles.',
      durationDays: 14,
      price: 7500,
      currency: 'USD',
      focusAreas: ['DETOX', 'GENERAL_REJUVENATION', 'HOLISTIC_SPIRITUAL'],
      inclusions: [
        'Ayurvedic physician consultations',
        'Daily Panchakarma treatments',
        'Personalized Ayurvedic diet',
        'Daily yoga and pranayama',
        'Meditation sessions',
        'Herbal supplements',
      ],
      exclusions: ['Accommodation', 'Airport transfers', 'Excursions'],
      published: true,
    },
  });

  await prisma.program.create({
    data: {
      propertyId: ananda.id,
      name: 'Stress Management',
      description:
        'Targeted program combining yoga, meditation, Ayurvedic treatments, and lifestyle counseling to address chronic stress and burnout.',
      durationDays: 7,
      price: 4500,
      currency: 'USD',
      focusAreas: ['STRESS_BURNOUT', 'SLEEP', 'HOLISTIC_SPIRITUAL'],
      inclusions: [
        'Stress assessment',
        'Daily therapeutic treatments',
        'Yoga and meditation instruction',
        'Breathing techniques',
        'Sleep optimization',
        'Lifestyle counseling',
      ],
      exclusions: ['Accommodation', 'Airport transfers'],
      published: true,
    },
  });

  // ============================================
  // PROPERTY 4: The Ranch Malibu (USA)
  // ============================================
  console.log('Creating The Ranch Malibu...');

  const ranchMalibu = await prisma.property.create({
    data: {
      slug: 'the-ranch-malibu',
      name: 'The Ranch Malibu',
      description:
        "America's most results-driven fitness retreat, The Ranch Malibu offers intensive week-long programs focused on physical transformation through hiking, exercise, plant-based nutrition, and digital detox. Set on 200 acres in the Santa Monica Mountains, the program's rigorous structure delivers measurable results for those ready to commit.",
      city: 'Malibu',
      country: 'United States',
      region: 'California',
      latitude: 34.0259,
      longitude: -118.7798,
      nearestAirport: 'Los Angeles International Airport (LAX)',
      transferTime: '1 hour by car',
      tier: 'TIER_2',
      approach: 'LIFESTYLE',
      focusAreas: ['FITNESS_PERFORMANCE', 'WEIGHT_METABOLIC', 'DETOX', 'STRESS_BURNOUT'],
      priceMin: 9500,
      priceMax: 9500,
      currency: 'USD',
      website: 'https://www.theranchmalibu.com',
      foundedYear: 2010,
      capacity: 18,
      accommodationType: 'Private cottages on 200-acre estate',
      diningDescription:
        'Organic, plant-based cuisine averaging 1,400 calories daily. All meals prepared on-site with ingredients from the property garden.',
      facilitiesDescription:
        '200-acre estate, hiking trails in Santa Monica Mountains, yoga studio, fitness facilities, swimming pool, organic garden, no WiFi or cell service.',
      setting: 'Secluded mountain retreat in Santa Monica Mountains',
      overallScore: 84,
      clinicalRigorScore: 75,
      outcomeEvidenceScore: 82,
      programDepthScore: 85,
      experienceQualityScore: 88,
      valueAlignmentScore: 86,
      physicianPatientRatio: null,
      avgBookingLeadTime: '8-12 weeks',
      returnGuestPercentage: 40,
      staffTenure: 'Average 6 years',
      actualCustomization:
        'Pre-arrival health questionnaire. On-site fitness assessment. Program intensity adjusted based on individual capacity.',
      postVisitFollowup:
        'Take-home nutrition and exercise guidelines. Alumni community access. Return visit discounts.',
      discretionLevel: 'ULTRA_HIGH',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegan (standard)', 'Gluten-free available'],
      privacyArchitecture: 'Private cottages, no phones or WiFi, celebrity-friendly',
      prayerFacilities: 'Meditation sessions, outdoor contemplation spaces',
      languagesMedical: ['English'],
      languagesService: ['English', 'Spanish'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
    },
  });

  await prisma.program.create({
    data: {
      propertyId: ranchMalibu.id,
      name: 'The Ranch 4.0 Program',
      description:
        'The signature week-long fitness immersion featuring daily 4-hour hikes, twice-daily exercise classes, plant-based meals, and complete digital detox.',
      durationDays: 7,
      price: 9500,
      currency: 'USD',
      focusAreas: ['FITNESS_PERFORMANCE', 'WEIGHT_METABOLIC', 'DETOX'],
      inclusions: [
        'Private cottage accommodation',
        'All organic plant-based meals',
        'Daily 4-hour guided hikes',
        'Twice-daily fitness classes',
        'Daily massage',
        'Evening yoga',
        'Cooking demonstration',
        'Airport transfers',
      ],
      exclusions: ['Gratuities'],
      typicalSchedule:
        '5:30am wake-up, 6am morning stretch, 7am breakfast, 8am-12pm guided mountain hike, 12:30pm lunch, 2pm afternoon exercise, 4pm restorative activities, 6pm dinner, 7:30pm evening program, 10pm lights out.',
      published: true,
    },
  });

  // ============================================
  // PROPERTY 5: Lefay Resort & Spa Lago di Garda (Italy)
  // ============================================
  console.log('Creating Lefay Resort & Spa Lago di Garda...');

  const lefay = await prisma.property.create({
    data: {
      slug: 'lefay-resort-lago-di-garda',
      name: 'Lefay Resort & Spa Lago di Garda',
      description:
        "Italy's leading eco-wellness resort overlooking Lake Garda, Lefay combines Classical Chinese Medicine principles with Western medical expertise. The resort's signature Lefay SPA Method integrates energy rebalancing, physical wellness, and aesthetic treatments within an award-winning sustainable architecture.",
      city: 'Gargnano',
      country: 'Italy',
      region: 'Lombardy',
      latitude: 45.6833,
      longitude: 10.6667,
      nearestAirport: 'Verona Airport (VRN) or Milan Bergamo (BGY)',
      transferTime: '1 hour from Verona, 1.5 hours from Milan',
      tier: 'TIER_2',
      approach: 'INTEGRATIVE',
      focusAreas: ['STRESS_BURNOUT', 'DETOX', 'BEAUTY_AESTHETIC', 'GENERAL_REJUVENATION', 'SLEEP'],
      priceMin: 4000,
      priceMax: 14000,
      currency: 'EUR',
      website: 'https://www.lefayresorts.com/en/lago-di-garda',
      foundedYear: 2008,
      capacity: 93,
      accommodationType: 'Suites with private terraces and lake views',
      diningDescription:
        'La Grande Limonaia restaurant serves Mediterranean cuisine with wellness options. Lefay Vital Gourmet menu designed for energy and vitality.',
      facilitiesDescription:
        '3,800m² spa with indoor/outdoor pools, salt lake, sauna village, fitness center, yoga studio, private beach, tennis courts.',
      setting: 'Hillside terraces overlooking Lake Garda',
      overallScore: 85,
      clinicalRigorScore: 79,
      outcomeEvidenceScore: 76,
      programDepthScore: 86,
      experienceQualityScore: 92,
      valueAlignmentScore: 87,
      physicianPatientRatio: '1:15',
      avgBookingLeadTime: '3-6 weeks',
      returnGuestPercentage: 48,
      staffTenure: 'Average 7 years',
      actualCustomization:
        'Energy diagnosis based on Chinese Medicine principles. Programs tailored to individual energy imbalances and health goals.',
      postVisitFollowup:
        'Personalized wellness report with home recommendations. Lefay products for continued care.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Lactose-free'],
      privacyArchitecture: 'Private suites, secluded treatment areas',
      prayerFacilities: 'Meditation spaces, relaxation areas',
      languagesMedical: ['Italian', 'English', 'German'],
      languagesService: ['Italian', 'English', 'German', 'French', 'Russian'],
      soloTravelerFriendly: 'GOOD',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
    },
  });

  await prisma.program.create({
    data: {
      propertyId: lefay.id,
      name: 'Lefay SPA Method - Global Detox',
      description:
        'Comprehensive detoxification program combining Chinese Medicine diagnostics with Western treatments to cleanse and rebalance the body.',
      durationDays: 7,
      price: 5800,
      currency: 'EUR',
      focusAreas: ['DETOX', 'GENERAL_REJUVENATION'],
      inclusions: [
        'Energy diagnosis consultation',
        'Personalized treatment plan',
        'Daily detox treatments',
        'Lefay Vital Gourmet cuisine',
        'Fitness and yoga activities',
        'Use of spa facilities',
      ],
      exclusions: ['Accommodation', 'Airport transfers'],
      published: true,
    },
  });

  // ============================================
  // PROPERTY 6: Brenners Park-Hotel & Spa (Germany)
  // ============================================
  console.log('Creating Brenners Park-Hotel & Spa...');

  const brenners = await prisma.property.create({
    data: {
      slug: 'brenners-park-hotel-spa',
      name: 'Brenners Park-Hotel & Spa',
      description:
        "One of Europe's most prestigious spa hotels, Brenners has welcomed wellness seekers to Baden-Baden since 1872. The Villa Stéphanie medical spa offers evidence-based wellness programs combining German medical expertise with luxury hospitality. Programs address preventive health, stress recovery, and longevity in an atmosphere of refined elegance.",
      city: 'Baden-Baden',
      country: 'Germany',
      region: 'Baden-Württemberg',
      latitude: 48.7606,
      longitude: 8.2406,
      nearestAirport: 'Frankfurt Airport (FRA) or Baden-Airpark (FKB)',
      transferTime: '1.5 hours from Frankfurt, 15 minutes from Baden-Airpark',
      tier: 'TIER_2',
      approach: 'INTEGRATIVE',
      focusAreas: ['STRESS_BURNOUT', 'LONGEVITY', 'MEDICAL_ASSESSMENT', 'BEAUTY_AESTHETIC', 'DETOX'],
      priceMin: 6000,
      priceMax: 25000,
      currency: 'EUR',
      website: 'https://www.oetkercollection.com/hotels/brenners-park-hotel-spa/',
      foundedYear: 1872,
      capacity: 100,
      accommodationType: 'Historic rooms, suites, and Villa Stéphanie residences',
      diningDescription:
        'Fritz & Felix restaurant, Wintergarten, and dedicated spa cuisine. Personalized nutrition plans available.',
      facilitiesDescription:
        'Villa Stéphanie medical spa, House of Wellbeing, indoor pool, fitness center, private park, thermal treatments.',
      setting: 'Historic grand hotel along Lichtentaler Allee in spa town of Baden-Baden',
      overallScore: 86,
      clinicalRigorScore: 85,
      outcomeEvidenceScore: 82,
      programDepthScore: 84,
      experienceQualityScore: 93,
      valueAlignmentScore: 85,
      physicianPatientRatio: '1:6',
      avgBookingLeadTime: '4-8 weeks',
      returnGuestPercentage: 52,
      staffTenure: 'Average 12 years',
      actualCustomization:
        'Comprehensive medical assessment by Villa Stéphanie physicians. Programs designed based on individual health status and goals.',
      postVisitFollowup:
        'Detailed medical report with recommendations. Follow-up consultations available. Return guest continuity of care.',
      discretionLevel: 'ULTRA_HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Kosher available', 'Halal available', 'Vegetarian', 'Vegan'],
      privacyArchitecture:
        'Private Villa Stéphanie suites with dedicated entrance, Faraday-cage rooms for complete digital isolation',
      prayerFacilities: 'Quiet rooms, meditation spaces',
      languagesMedical: ['German', 'English', 'French'],
      languagesService: ['German', 'English', 'French', 'Russian', 'Arabic'],
      soloTravelerFriendly: 'GOOD',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'CONTACTED',
      published: true,
      featured: false,
    },
  });

  await prisma.program.create({
    data: {
      propertyId: brenners.id,
      name: 'Villa Stéphanie Medical Check-Up',
      description:
        'Comprehensive preventive health assessment combining German medical precision with luxury spa experience.',
      durationDays: 3,
      price: 6500,
      currency: 'EUR',
      focusAreas: ['MEDICAL_ASSESSMENT', 'LONGEVITY'],
      inclusions: [
        'Full medical examination',
        'Blood and laboratory analysis',
        'Cardiovascular assessment',
        'Physician consultations',
        'Spa treatments',
        'Wellness cuisine',
      ],
      exclusions: ['Accommodation', 'Additional specialist consultations'],
      published: true,
    },
  });

  // ============================================
  // PROPERTY 7: Forestis Dolomites (Italy)
  // ============================================
  console.log('Creating Forestis Dolomites...');

  const forestis = await prisma.property.create({
    data: {
      slug: 'forestis-dolomites',
      name: 'Forestis Dolomites',
      description:
        "Perched at 1,800 meters in the UNESCO-protected Dolomites, Forestis is a sanctuary of forest wellness and alpine healing. The property's unique approach harnesses the therapeutic power of the surrounding larch and pine forests through forest bathing, local botanicals, and altitude-based wellness in an architecturally stunning environment.",
      city: 'Bressanone',
      country: 'Italy',
      region: 'South Tyrol',
      latitude: 46.7167,
      longitude: 11.6833,
      nearestAirport: 'Innsbruck Airport (INN) or Venice Marco Polo (VCE)',
      transferTime: '1 hour from Innsbruck, 2.5 hours from Venice',
      tier: 'TIER_2',
      approach: 'HOLISTIC',
      focusAreas: ['STRESS_BURNOUT', 'SLEEP', 'HOLISTIC_SPIRITUAL', 'GENERAL_REJUVENATION'],
      priceMin: 5500,
      priceMax: 16000,
      currency: 'EUR',
      website: 'https://www.forestis.it',
      foundedYear: 2020,
      capacity: 62,
      accommodationType: 'Suites with floor-to-ceiling windows and Dolomite views',
      diningDescription:
        'Forest-inspired cuisine using local and foraged ingredients. Focus on regional South Tyrolean traditions with wellness adaptations.',
      facilitiesDescription:
        '2,500m² spa with indoor/outdoor pools, forest sauna village, treatment rooms with Dolomite views, fitness studio, forest trails.',
      setting: 'Alpine forest at 1,800m elevation in UNESCO Dolomites',
      overallScore: 84,
      clinicalRigorScore: 70,
      outcomeEvidenceScore: 68,
      programDepthScore: 82,
      experienceQualityScore: 96,
      valueAlignmentScore: 92,
      physicianPatientRatio: null,
      avgBookingLeadTime: '6-10 weeks',
      returnGuestPercentage: 38,
      staffTenure: 'Average 3 years',
      actualCustomization:
        'Wellness consultation determines focus areas. Programs incorporate altitude therapy, forest bathing, and local healing traditions.',
      postVisitFollowup: 'Take-home forest wellness practices. Forestis botanical products.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free'],
      privacyArchitecture: 'Secluded suites, private spa experiences available',
      prayerFacilities: 'Forest meditation, contemplation spaces',
      languagesMedical: ['German', 'Italian', 'English'],
      languagesService: ['German', 'Italian', 'English', 'French'],
      soloTravelerFriendly: 'GOOD',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
      risingStar: true,
    },
  });

  await prisma.program.create({
    data: {
      propertyId: forestis.id,
      name: 'Forest Immersion',
      description:
        'Deep connection with the healing power of the Dolomite forests through guided forest bathing, altitude therapy, and nature-based treatments.',
      durationDays: 4,
      price: 3500,
      currency: 'EUR',
      focusAreas: ['STRESS_BURNOUT', 'HOLISTIC_SPIRITUAL'],
      inclusions: [
        'Forest bathing sessions',
        'Nature-based spa treatments',
        'Altitude wellness activities',
        'Local botanical therapies',
        'Guided mountain experiences',
      ],
      exclusions: ['Accommodation', 'Airport transfers'],
      published: true,
    },
  });

  // ============================================
  // PROPERTY 8: Lily of the Valley (France)
  // ============================================
  console.log('Creating Lily of the Valley...');

  const lilyValley = await prisma.property.create({
    data: {
      slug: 'lily-of-the-valley',
      name: 'Lily of the Valley',
      description:
        "A contemporary wellness destination on the French Riviera, Lily of the Valley combines sport, spa, and holistic wellness in a design-forward setting. The property emphasizes movement and outdoor activity within the natural landscape of Cap de Saint-Tropez, offering personalized wellness journeys that blend French art de vivre with evidence-based programs.",
      city: 'La Croix-Valmer',
      country: 'France',
      region: 'Provence-Alpes-Côte d\'Azur',
      latitude: 43.2,
      longitude: 6.5833,
      nearestAirport: 'Nice Côte d\'Azur Airport (NCE) or Toulon-Hyères (TLN)',
      transferTime: '1.5 hours from Nice, 45 minutes from Toulon',
      tier: 'TIER_2',
      approach: 'LIFESTYLE',
      focusAreas: ['FITNESS_PERFORMANCE', 'STRESS_BURNOUT', 'BEAUTY_AESTHETIC', 'WEIGHT_METABOLIC'],
      priceMin: 5000,
      priceMax: 15000,
      currency: 'EUR',
      website: 'https://www.lilyofthevalley.com',
      foundedYear: 2019,
      capacity: 44,
      accommodationType: 'Villas and suites with Mediterranean views',
      diningDescription:
        'Mediterranean wellness cuisine with produce from local markets and the property garden. Healthy gourmet approach.',
      facilitiesDescription:
        'Extensive spa, indoor/outdoor pools, sports complex with tennis and padel, fitness center, yoga pavilion, beach access, hiking trails.',
      setting: 'Mediterranean hillside overlooking the Bay of Cavalaire near Saint-Tropez',
      overallScore: 83,
      clinicalRigorScore: 72,
      outcomeEvidenceScore: 70,
      programDepthScore: 84,
      experienceQualityScore: 92,
      valueAlignmentScore: 88,
      physicianPatientRatio: null,
      avgBookingLeadTime: '4-8 weeks',
      returnGuestPercentage: 42,
      staffTenure: 'Average 4 years',
      actualCustomization:
        'Wellness assessment determines personalized activity and treatment program. Focus on individual goals and preferences.',
      postVisitFollowup: 'Personalized wellness recommendations. Return guest recognition.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Kosher available'],
      privacyArchitecture: 'Private villas, discrete service',
      prayerFacilities: 'Meditation spaces, yoga pavilion',
      languagesMedical: ['French', 'English'],
      languagesService: ['French', 'English', 'Italian', 'Russian'],
      soloTravelerFriendly: 'GOOD',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
    },
  });

  // ============================================
  // PROPERTY 9: Euphoria Retreat (Greece)
  // ============================================
  console.log('Creating Euphoria Retreat...');

  const euphoria = await prisma.property.create({
    data: {
      slug: 'euphoria-retreat',
      name: 'Euphoria Retreat',
      description:
        "A transformative wellness destination in the mystical Peloponnese, Euphoria Retreat is built around a unique sphere spa inspired by sacred geometry and Taoist philosophy. The property offers deeply healing programs combining Greek and Chinese healing traditions, emotional wellness, and spiritual practices in a setting steeped in ancient mythology.",
      city: 'Mystras',
      country: 'Greece',
      region: 'Peloponnese',
      latitude: 37.0833,
      longitude: 22.3833,
      nearestAirport: 'Kalamata International Airport (KLX) or Athens (ATH)',
      transferTime: '1 hour from Kalamata, 2.5 hours from Athens',
      tier: 'TIER_2',
      approach: 'HOLISTIC',
      focusAreas: ['HOLISTIC_SPIRITUAL', 'STRESS_BURNOUT', 'DETOX', 'SLEEP', 'GENERAL_REJUVENATION'],
      priceMin: 4000,
      priceMax: 12000,
      currency: 'EUR',
      website: 'https://www.euphoriaretreat.com',
      foundedYear: 2018,
      capacity: 45,
      accommodationType: 'Rooms and suites with Byzantine landscape views',
      diningDescription:
        'Gaia restaurant serves Mediterranean wellness cuisine with local organic ingredients. Programs include personalized nutrition.',
      facilitiesDescription:
        '3,000m² sphere spa with Byzantine hammam, indoor/outdoor pools, cold plunge, Finnish sauna, watsu pool, fitness studio, yoga spaces.',
      setting: 'Historic village near Byzantine ruins of Mystras',
      overallScore: 85,
      clinicalRigorScore: 74,
      outcomeEvidenceScore: 72,
      programDepthScore: 88,
      experienceQualityScore: 93,
      valueAlignmentScore: 90,
      physicianPatientRatio: null,
      avgBookingLeadTime: '3-6 weeks',
      returnGuestPercentage: 46,
      staffTenure: 'Average 5 years',
      actualCustomization:
        'In-depth wellness consultation exploring physical, emotional, and spiritual dimensions. Programs designed for individual transformation.',
      postVisitFollowup:
        'Personalized continuation program. Euphoria products and practices for home.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Greek Orthodox fasting menus'],
      privacyArchitecture: 'Private suites, secluded treatment spaces',
      prayerFacilities: 'Meditation sphere, spiritual guidance available, access to Byzantine churches',
      languagesMedical: ['Greek', 'English'],
      languagesService: ['Greek', 'English', 'French', 'German'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'LEAD_GEN',
      published: true,
      featured: true,
      editorChoice: 'Best for Emotional & Spiritual Wellness',
      verifiedExcellence: true,
    },
  });

  await prisma.program.create({
    data: {
      propertyId: euphoria.id,
      name: 'Emotional & Physical Transformation',
      description:
        'Deep healing journey combining physical treatments with emotional release work and spiritual practices.',
      durationDays: 7,
      price: 5500,
      currency: 'EUR',
      focusAreas: ['HOLISTIC_SPIRITUAL', 'STRESS_BURNOUT', 'GENERAL_REJUVENATION'],
      inclusions: [
        'Comprehensive wellness consultation',
        'Daily spa treatments',
        'Emotional release therapies',
        'Watsu sessions',
        'Yoga and meditation',
        'Wellness cuisine',
        'Spiritual guidance sessions',
      ],
      exclusions: ['Accommodation', 'Airport transfers'],
      published: true,
    },
  });

  // ============================================
  // PROPERTY 10: Schloss Elmau (Germany)
  // ============================================
  console.log('Creating Schloss Elmau...');

  const schlossElmau = await prisma.property.create({
    data: {
      slug: 'schloss-elmau',
      name: 'Schloss Elmau',
      description:
        "A cultural hideaway and luxury spa retreat in the Bavarian Alps, Schloss Elmau uniquely combines world-class wellness with an extraordinary cultural program of concerts, lectures, and literary events. The property's six spas offer diverse wellness philosophies from Eastern to Western traditions.",
      city: 'Elmau',
      country: 'Germany',
      region: 'Bavaria',
      latitude: 47.4667,
      longitude: 11.2,
      nearestAirport: 'Munich Airport (MUC) or Innsbruck (INN)',
      transferTime: '1.5 hours from Munich, 45 minutes from Innsbruck',
      tier: 'TIER_2',
      approach: 'INTEGRATIVE',
      focusAreas: ['STRESS_BURNOUT', 'HOLISTIC_SPIRITUAL', 'BEAUTY_AESTHETIC', 'GENERAL_REJUVENATION'],
      priceMin: 4500,
      priceMax: 15000,
      currency: 'EUR',
      website: 'https://www.schloss-elmau.de',
      foundedYear: 1916,
      capacity: 162,
      accommodationType: 'Rooms and suites in castle and retreat house',
      diningDescription:
        'Multiple restaurants including Michelin-starred Luce d\'Oro and healthy Fidelio. Focus on organic, regional, and wellness cuisine.',
      facilitiesDescription:
        'Six spas totaling 4,500m², multiple pools including rooftop infinity pool, hammam, yoga studios, concert hall, library, alpine activities.',
      setting: 'Historic castle in secluded Bavarian Alps valley',
      overallScore: 84,
      clinicalRigorScore: 73,
      outcomeEvidenceScore: 70,
      programDepthScore: 82,
      experienceQualityScore: 94,
      valueAlignmentScore: 88,
      physicianPatientRatio: null,
      avgBookingLeadTime: '4-8 weeks',
      returnGuestPercentage: 55,
      staffTenure: 'Average 9 years',
      actualCustomization:
        'Wellness consultation available. Guests design own experience from extensive spa and cultural offerings.',
      postVisitFollowup: 'Cultural program updates. Return guest benefits.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Kosher available', 'Vegetarian', 'Vegan', 'Gluten-free'],
      privacyArchitecture: 'Retreat House for adults-only experience, private suites',
      prayerFacilities: 'Meditation spaces, spiritual lectures, yoga studios',
      languagesMedical: ['German', 'English'],
      languagesService: ['German', 'English', 'French', 'Italian', 'Russian'],
      soloTravelerFriendly: 'GOOD',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
    },
  });

  // ============================================
  // PROPERTY 11: Miraval Arizona (USA)
  // ============================================
  console.log('Creating Miraval Arizona...');

  const miraval = await prisma.property.create({
    data: {
      slug: 'miraval-arizona',
      name: 'Miraval Arizona',
      description:
        "America's iconic mindfulness and life-balance resort in the Sonoran Desert, Miraval Arizona pioneered the concept of transformative destination wellness. The property offers hundreds of experiences from equine therapy to high ropes, meditation to fitness, all guided by the philosophy of living in the present.",
      city: 'Tucson',
      country: 'United States',
      region: 'Arizona',
      latitude: 32.4067,
      longitude: -111.0639,
      nearestAirport: 'Tucson International Airport (TUS)',
      transferTime: '40 minutes by car',
      tier: 'TIER_2',
      approach: 'HOLISTIC',
      focusAreas: ['STRESS_BURNOUT', 'HOLISTIC_SPIRITUAL', 'FITNESS_PERFORMANCE', 'GENERAL_REJUVENATION'],
      priceMin: 5000,
      priceMax: 15000,
      currency: 'USD',
      website: 'https://www.miravalresorts.com/arizona',
      foundedYear: 1995,
      capacity: 135,
      accommodationType: 'Casitas and suites in desert landscape',
      diningDescription:
        'Mindful eating philosophy with fresh, local ingredients. Multiple dining venues with healthy, flavorful options.',
      facilitiesDescription:
        '400-acre desert campus, Life in Balance Spa, equestrian center, extensive fitness facilities, pools, challenge course, meditation spaces.',
      setting: 'Sonoran Desert at the base of the Santa Catalina Mountains',
      overallScore: 83,
      clinicalRigorScore: 72,
      outcomeEvidenceScore: 70,
      programDepthScore: 85,
      experienceQualityScore: 90,
      valueAlignmentScore: 86,
      physicianPatientRatio: null,
      avgBookingLeadTime: '4-8 weeks',
      returnGuestPercentage: 48,
      staffTenure: 'Average 7 years',
      actualCustomization:
        'Personal pathway consultation helps design stay. Credit system allows guests to choose from extensive menu of experiences.',
      postVisitFollowup: 'Miraval Life podcast and online resources. Return guest recognition.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Kosher-style available'],
      privacyArchitecture: 'Private casitas, spread-out campus, digital wellness options',
      prayerFacilities: 'Meditation garden, spiritual programming, labyrinth',
      languagesMedical: ['English', 'Spanish'],
      languagesService: ['English', 'Spanish'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
    },
  });

  await prisma.program.create({
    data: {
      propertyId: miraval.id,
      name: 'Life in Balance Package',
      description:
        'Inclusive wellness experience with daily activities, spa treatments, and transformative experiences.',
      durationDays: 4,
      price: 4500,
      currency: 'USD',
      focusAreas: ['STRESS_BURNOUT', 'HOLISTIC_SPIRITUAL'],
      inclusions: [
        'All-inclusive accommodations',
        'Three mindful meals daily',
        'Nightly resort credit for spa and activities',
        'All fitness classes',
        'Lectures and workshops',
        'Airport transfers',
      ],
      exclusions: ['Premium experiences beyond credit', 'Gratuities'],
      published: true,
    },
  });

  // ============================================
  // PROPERTY 12: Cal-a-Vie Health Spa (USA)
  // ============================================
  console.log('Creating Cal-a-Vie Health Spa...');

  const calaVie = await prisma.property.create({
    data: {
      slug: 'cal-a-vie-health-spa',
      name: 'Cal-a-Vie Health Spa',
      description:
        "A European-style destination spa in the hills of Southern California, Cal-a-Vie offers intimate, all-inclusive wellness weeks focused on fitness, nutrition, and spa treatments. Limited to 32 guests at a time, the property provides personalized attention and measurable results in a charming Provençal setting.",
      city: 'Vista',
      country: 'United States',
      region: 'California',
      latitude: 33.1989,
      longitude: -117.0947,
      nearestAirport: 'San Diego International Airport (SAN)',
      transferTime: '45 minutes by car',
      tier: 'TIER_2',
      approach: 'LIFESTYLE',
      focusAreas: ['FITNESS_PERFORMANCE', 'WEIGHT_METABOLIC', 'BEAUTY_AESTHETIC', 'STRESS_BURNOUT'],
      priceMin: 8500,
      priceMax: 12000,
      currency: 'USD',
      website: 'https://www.cal-a-vie.com',
      foundedYear: 1986,
      capacity: 32,
      accommodationType: 'Private cottages in Provençal style',
      diningDescription:
        'Gourmet spa cuisine averaging 1,400-1,800 calories daily. European-inspired healthy cooking with organic ingredients.',
      facilitiesDescription:
        '200-acre estate, European spa, fitness facilities, tennis courts, pool, hiking trails, meditation spaces, cooking classes.',
      setting: 'Provençal-style estate in San Diego County hills',
      overallScore: 82,
      clinicalRigorScore: 74,
      outcomeEvidenceScore: 78,
      programDepthScore: 84,
      experienceQualityScore: 88,
      valueAlignmentScore: 84,
      physicianPatientRatio: null,
      avgBookingLeadTime: '6-10 weeks',
      returnGuestPercentage: 52,
      staffTenure: 'Average 11 years',
      actualCustomization:
        'Pre-arrival questionnaire. Fitness assessment on arrival. Program adjusted based on individual goals and capacity.',
      postVisitFollowup: 'Take-home recipes and exercise guidelines. Alumni community. Return visit priority.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Kosher-style available'],
      privacyArchitecture: 'Private cottages, intimate guest count',
      prayerFacilities: 'Meditation garden, spiritual wellness available',
      languagesMedical: ['English'],
      languagesService: ['English', 'Spanish', 'French'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
    },
  });

  // ============================================
  // PROPERTY 13: The BodyHoliday (St. Lucia)
  // ============================================
  console.log('Creating The BodyHoliday...');

  const bodyHoliday = await prisma.property.create({
    data: {
      slug: 'the-bodyholiday',
      name: 'The BodyHoliday',
      description:
        "The Caribbean's premier wellness resort, The BodyHoliday combines active vacation with restorative wellness on St. Lucia's northern coast. The unique all-inclusive model includes daily spa treatments, extensive activities from water sports to yoga, and personalized wellness programs, all within a vibrant tropical setting.",
      city: 'Cap Estate',
      country: 'Saint Lucia',
      region: 'Caribbean',
      latitude: 14.1,
      longitude: -60.95,
      nearestAirport: 'Hewanorra International Airport (UVF)',
      transferTime: '1 hour 30 minutes by car',
      tier: 'TIER_2',
      approach: 'LIFESTYLE',
      focusAreas: ['FITNESS_PERFORMANCE', 'STRESS_BURNOUT', 'GENERAL_REJUVENATION', 'BEAUTY_AESTHETIC'],
      priceMin: 4500,
      priceMax: 12000,
      currency: 'USD',
      website: 'https://www.thebodyholiday.com',
      foundedYear: 1988,
      capacity: 155,
      accommodationType: 'Ocean-view rooms and suites',
      diningDescription:
        'Multiple restaurants with Caribbean and international cuisine. Healthy options and personalized nutrition available.',
      facilitiesDescription:
        'Wellness Centre, beach, water sports, tennis, cycling, fitness center, yoga pavilions, dive center, golf nearby.',
      setting: 'Secluded cove on St. Lucia\'s northern coast',
      overallScore: 81,
      clinicalRigorScore: 68,
      outcomeEvidenceScore: 65,
      programDepthScore: 80,
      experienceQualityScore: 90,
      valueAlignmentScore: 88,
      physicianPatientRatio: null,
      avgBookingLeadTime: '4-8 weeks',
      returnGuestPercentage: 50,
      staffTenure: 'Average 8 years',
      actualCustomization:
        'Wellness consultation available. Daily complimentary treatment. Program designed around individual preferences and goals.',
      postVisitFollowup: 'Wellness recommendations. Return guest benefits.',
      discretionLevel: 'MODERATE',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free'],
      privacyArchitecture: 'Quiet zones, private beach areas',
      prayerFacilities: 'Meditation sessions, yoga spaces',
      languagesMedical: ['English'],
      languagesService: ['English', 'French', 'Spanish'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'AFFILIATE',
      published: true,
      featured: false,
    },
  });

  // ============================================
  // PROPERTY 14: Shanti Maurice (Mauritius)
  // ============================================
  console.log('Creating Shanti Maurice...');

  const shantiMaurice = await prisma.property.create({
    data: {
      slug: 'shanti-maurice',
      name: 'Shanti Maurice Resort & Spa',
      description:
        'A serene wellness sanctuary on the southern coast of Mauritius, Shanti Maurice combines Ayurvedic healing traditions with modern wellness in a stunning Indian Ocean setting. The Nira Spa specializes in traditional Indian therapies delivered by experts from Kerala.',
      city: 'Saint Félix',
      country: 'Mauritius',
      region: 'Indian Ocean',
      latitude: -20.4833,
      longitude: 57.5,
      nearestAirport: 'Sir Seewoosagur Ramgoolam International Airport (MRU)',
      transferTime: '1 hour by car',
      tier: 'TIER_2',
      approach: 'HOLISTIC',
      focusAreas: ['HOLISTIC_SPIRITUAL', 'STRESS_BURNOUT', 'DETOX', 'GENERAL_REJUVENATION', 'BEAUTY_AESTHETIC'],
      priceMin: 4000,
      priceMax: 12000,
      currency: 'EUR',
      website: 'https://www.shantimaurice.com',
      foundedYear: 2006,
      capacity: 61,
      accommodationType: 'Beachfront suites and villas with ocean views',
      diningDescription:
        'Multiple restaurants offering Ayurvedic, Asian, and international cuisine. Personalized nutrition programs available.',
      facilitiesDescription:
        '75,000 sq ft Nira Spa, Ayurvedic center, yoga pavilions, pools, fitness center, beach, water sports, nature trails.',
      setting: 'Secluded southern coast of Mauritius with pristine beach',
      overallScore: 82,
      clinicalRigorScore: 75,
      outcomeEvidenceScore: 72,
      programDepthScore: 84,
      experienceQualityScore: 90,
      valueAlignmentScore: 86,
      physicianPatientRatio: '1:12',
      avgBookingLeadTime: '3-6 weeks',
      returnGuestPercentage: 44,
      staffTenure: 'Average 6 years',
      actualCustomization:
        'Ayurvedic consultation determines dosha and program focus. Treatments and nutrition personalized accordingly.',
      postVisitFollowup: 'Ayurvedic recommendations for home. Nira Spa products.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Ayurvedic', 'Halal available'],
      privacyArchitecture: 'Private villas, secluded beach areas',
      prayerFacilities: 'Meditation pavilion, spiritual guidance available',
      languagesMedical: ['English', 'French', 'Hindi'],
      languagesService: ['English', 'French', 'German', 'Hindi'],
      soloTravelerFriendly: 'GOOD',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'LEAD_GEN',
      published: true,
      featured: false,
    },
  });

  await prisma.program.create({
    data: {
      propertyId: shantiMaurice.id,
      name: 'Ayurvedic Immersion',
      description:
        'Traditional Ayurvedic healing program with expert practitioners from Kerala, including dosha analysis, daily treatments, and personalized diet.',
      durationDays: 7,
      price: 5000,
      currency: 'EUR',
      focusAreas: ['HOLISTIC_SPIRITUAL', 'DETOX', 'GENERAL_REJUVENATION'],
      inclusions: [
        'Ayurvedic physician consultation',
        'Dosha analysis',
        'Daily Ayurvedic treatments',
        'Personalized Ayurvedic meals',
        'Yoga and meditation',
        'Herbal preparations',
      ],
      exclusions: ['Accommodation', 'Airport transfers'],
      published: true,
    },
  });

  // ============================================
  // PROPERTY 15: Absolute Sanctuary (Thailand)
  // ============================================
  console.log('Creating Absolute Sanctuary...');

  const absoluteSanctuary = await prisma.property.create({
    data: {
      slug: 'absolute-sanctuary',
      name: 'Absolute Sanctuary',
      description:
        "Thailand's leading boutique wellness destination, Absolute Sanctuary offers intensive detox, yoga, and fitness programs on the island of Koh Samui. The property's Moroccan-inspired architecture houses comprehensive wellness programs at accessible price points without compromising on quality.",
      city: 'Koh Samui',
      country: 'Thailand',
      region: 'Surat Thani',
      latitude: 9.5167,
      longitude: 100.05,
      nearestAirport: 'Koh Samui Airport (USM)',
      transferTime: '20 minutes by car',
      tier: 'TIER_2',
      approach: 'INTEGRATIVE',
      focusAreas: ['DETOX', 'FITNESS_PERFORMANCE', 'WEIGHT_METABOLIC', 'STRESS_BURNOUT', 'HOLISTIC_SPIRITUAL'],
      priceMin: 2500,
      priceMax: 8000,
      currency: 'USD',
      website: 'https://www.absolutesanctuary.com',
      foundedYear: 2008,
      capacity: 38,
      accommodationType: 'Moroccan-styled suites with garden or pool views',
      diningDescription:
        'Comprehensive detox and wellness menus from juice fasting to raw food to healthy Thai cuisine. Personalized nutrition for each program.',
      facilitiesDescription:
        'Detox center, yoga studio, Pilates reformer studio, fitness gym, pool, spa treatment rooms, colonic hydrotherapy suite.',
      setting: 'Hillside property with views of Koh Samui\'s northern coast',
      overallScore: 80,
      clinicalRigorScore: 74,
      outcomeEvidenceScore: 75,
      programDepthScore: 85,
      experienceQualityScore: 82,
      valueAlignmentScore: 88,
      physicianPatientRatio: '1:15',
      avgBookingLeadTime: '2-4 weeks',
      returnGuestPercentage: 55,
      staffTenure: 'Average 6 years',
      actualCustomization:
        'Pre-arrival questionnaire. Wellness consultation on arrival. Program intensity adjusted based on individual needs and response.',
      postVisitFollowup: 'Detailed wellness report. Ongoing support via email. Return guest discounts.',
      discretionLevel: 'MODERATE',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Raw food', 'Gluten-free'],
      privacyArchitecture: 'Private suites, discrete service',
      prayerFacilities: 'Meditation sessions, yoga philosophy classes',
      languagesMedical: ['English', 'Thai'],
      languagesService: ['English', 'Thai', 'German', 'French'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'AFFILIATE',
      published: true,
      featured: false,
    },
  });

  await prisma.program.create({
    data: {
      propertyId: absoluteSanctuary.id,
      name: 'Complete Detox Program',
      description:
        'Intensive cleansing program combining juice fasting, colonic hydrotherapy, and supportive therapies for deep detoxification.',
      durationDays: 7,
      price: 3500,
      currency: 'USD',
      focusAreas: ['DETOX', 'WEIGHT_METABOLIC'],
      inclusions: [
        'Wellness consultation',
        'Juice cleanse and detox diet',
        'Daily colonic hydrotherapy',
        'Infrared sauna sessions',
        'Detox massage and body wraps',
        'Yoga classes',
        'Wellness workshops',
      ],
      exclusions: ['Accommodation', 'Airport transfers'],
      published: true,
    },
  });

  await prisma.program.create({
    data: {
      propertyId: absoluteSanctuary.id,
      name: 'Yoga Immersion',
      description:
        'Comprehensive yoga retreat with daily classes, workshops, and meditation for practitioners of all levels.',
      durationDays: 7,
      price: 2800,
      currency: 'USD',
      focusAreas: ['FITNESS_PERFORMANCE', 'HOLISTIC_SPIRITUAL', 'STRESS_BURNOUT'],
      inclusions: [
        '2-3 yoga classes daily',
        'Meditation sessions',
        'Yoga philosophy workshops',
        'Healthy Thai cuisine',
        'Spa treatment',
        'Use of facilities',
      ],
      exclusions: ['Accommodation', 'Airport transfers'],
      published: true,
    },
  });

  // ============================================
  // LINK TREATMENTS TO NEW PROPERTIES
  // ============================================
  console.log('\n🔗 Linking treatments to properties...');

  const propertyTreatments = [
    // Six Senses Douro Valley
    { propertyId: sixSensesDouro.id, slug: 'acupuncture', price: 150 },
    { propertyId: sixSensesDouro.id, slug: 'lymphatic-drainage', price: 140 },
    { propertyId: sixSensesDouro.id, slug: 'craniosacral-therapy', price: 160 },
    { propertyId: sixSensesDouro.id, slug: 'breathwork', price: 80 },

    // Como Shambhala
    { propertyId: comoShambhala.id, slug: 'acupuncture', price: 100 },
    { propertyId: comoShambhala.id, slug: 'lymphatic-drainage', price: 90 },
    { propertyId: comoShambhala.id, slug: 'breathwork', price: 50 },

    // Ananda
    { propertyId: ananda.id, slug: 'acupuncture', price: 80 },
    { propertyId: ananda.id, slug: 'lymphatic-drainage', price: 70 },
    { propertyId: ananda.id, slug: 'breathwork', price: 40 },

    // The Ranch Malibu
    { propertyId: ranchMalibu.id, slug: 'lymphatic-drainage', price: 200 },
    { propertyId: ranchMalibu.id, slug: 'breathwork', price: 100 },

    // Lefay
    { propertyId: lefay.id, slug: 'acupuncture', price: 130 },
    { propertyId: lefay.id, slug: 'lymphatic-drainage', price: 120 },
    { propertyId: lefay.id, slug: 'colon-hydrotherapy', price: 100 },
    { propertyId: lefay.id, slug: 'infrared-sauna', price: 40 },

    // Brenners
    { propertyId: brenners.id, slug: 'iv-vitamin-therapy', price: 250 },
    { propertyId: brenners.id, slug: 'acupuncture', price: 150 },
    { propertyId: brenners.id, slug: 'lymphatic-drainage', price: 140 },

    // Forestis
    { propertyId: forestis.id, slug: 'lymphatic-drainage', price: 150 },
    { propertyId: forestis.id, slug: 'infrared-sauna', price: 50 },

    // Lily of the Valley
    { propertyId: lilyValley.id, slug: 'lymphatic-drainage', price: 160 },
    { propertyId: lilyValley.id, slug: 'acupuncture', price: 140 },

    // Euphoria
    { propertyId: euphoria.id, slug: 'acupuncture', price: 110 },
    { propertyId: euphoria.id, slug: 'lymphatic-drainage', price: 100 },
    { propertyId: euphoria.id, slug: 'breathwork', price: 60 },
    { propertyId: euphoria.id, slug: 'craniosacral-therapy', price: 120 },

    // Schloss Elmau
    { propertyId: schlossElmau.id, slug: 'lymphatic-drainage', price: 140 },
    { propertyId: schlossElmau.id, slug: 'acupuncture', price: 130 },

    // Miraval
    { propertyId: miraval.id, slug: 'acupuncture', price: 180 },
    { propertyId: miraval.id, slug: 'craniosacral-therapy', price: 200 },
    { propertyId: miraval.id, slug: 'biofeedback', price: 150 },

    // Cal-a-Vie
    { propertyId: calaVie.id, slug: 'lymphatic-drainage', price: 170 },
    { propertyId: calaVie.id, slug: 'acupuncture', price: 160 },

    // The BodyHoliday
    { propertyId: bodyHoliday.id, slug: 'lymphatic-drainage', price: 120 },
    { propertyId: bodyHoliday.id, slug: 'acupuncture', price: 110 },

    // Shanti Maurice
    { propertyId: shantiMaurice.id, slug: 'acupuncture', price: 100 },
    { propertyId: shantiMaurice.id, slug: 'lymphatic-drainage', price: 90 },
    { propertyId: shantiMaurice.id, slug: 'breathwork', price: 50 },

    // Absolute Sanctuary
    { propertyId: absoluteSanctuary.id, slug: 'colon-hydrotherapy', price: 60 },
    { propertyId: absoluteSanctuary.id, slug: 'infrared-sauna', price: 25 },
    { propertyId: absoluteSanctuary.id, slug: 'lymphatic-drainage', price: 70 },
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
  // LINK DIAGNOSTICS TO TIER 2 PROPERTIES (where applicable)
  // ============================================
  console.log('🔗 Linking diagnostics to properties...');

  const propertyDiagnostics = [
    { propertyId: brenners.id, slug: 'comprehensive-blood-panel' },
    { propertyId: ananda.id, slug: 'comprehensive-blood-panel' },
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
      propertyId: sixSensesDouro.id,
      overallScore: 86,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 78,
        outcomeEvidence: 75,
        programDepth: 88,
        experienceQuality: 94,
        valueAlignment: 89,
      },
    },
    {
      propertyId: comoShambhala.id,
      overallScore: 85,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 72,
        outcomeEvidence: 70,
        programDepth: 88,
        experienceQuality: 95,
        valueAlignment: 90,
      },
    },
    {
      propertyId: ananda.id,
      overallScore: 87,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 80,
        outcomeEvidence: 78,
        programDepth: 90,
        experienceQuality: 92,
        valueAlignment: 88,
      },
    },
    {
      propertyId: ranchMalibu.id,
      overallScore: 84,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 75,
        outcomeEvidence: 82,
        programDepth: 85,
        experienceQuality: 88,
        valueAlignment: 86,
      },
    },
    {
      propertyId: lefay.id,
      overallScore: 85,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 79,
        outcomeEvidence: 76,
        programDepth: 86,
        experienceQuality: 92,
        valueAlignment: 87,
      },
    },
    {
      propertyId: brenners.id,
      overallScore: 86,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 85,
        outcomeEvidence: 82,
        programDepth: 84,
        experienceQuality: 93,
        valueAlignment: 85,
      },
    },
    {
      propertyId: forestis.id,
      overallScore: 84,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 70,
        outcomeEvidence: 68,
        programDepth: 82,
        experienceQuality: 96,
        valueAlignment: 92,
      },
    },
    {
      propertyId: lilyValley.id,
      overallScore: 83,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 72,
        outcomeEvidence: 70,
        programDepth: 84,
        experienceQuality: 92,
        valueAlignment: 88,
      },
    },
    {
      propertyId: euphoria.id,
      overallScore: 85,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 74,
        outcomeEvidence: 72,
        programDepth: 88,
        experienceQuality: 93,
        valueAlignment: 90,
      },
    },
    {
      propertyId: schlossElmau.id,
      overallScore: 84,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 73,
        outcomeEvidence: 70,
        programDepth: 82,
        experienceQuality: 94,
        valueAlignment: 88,
      },
    },
    {
      propertyId: miraval.id,
      overallScore: 83,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 72,
        outcomeEvidence: 70,
        programDepth: 85,
        experienceQuality: 90,
        valueAlignment: 86,
      },
    },
    {
      propertyId: calaVie.id,
      overallScore: 82,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 74,
        outcomeEvidence: 78,
        programDepth: 84,
        experienceQuality: 88,
        valueAlignment: 84,
      },
    },
    {
      propertyId: bodyHoliday.id,
      overallScore: 81,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 68,
        outcomeEvidence: 65,
        programDepth: 80,
        experienceQuality: 90,
        valueAlignment: 88,
      },
    },
    {
      propertyId: shantiMaurice.id,
      overallScore: 82,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 75,
        outcomeEvidence: 72,
        programDepth: 84,
        experienceQuality: 90,
        valueAlignment: 86,
      },
    },
    {
      propertyId: absoluteSanctuary.id,
      overallScore: 80,
      tier: 'DISTINGUISHED' as const,
      dimensions: {
        clinicalRigor: 74,
        outcomeEvidence: 75,
        programDepth: 85,
        experienceQuality: 82,
        valueAlignment: 88,
      },
    },
  ];

  for (const score of indexScores) {
    await prisma.clarusIndexScore.create({
      data: {
        propertyId: score.propertyId,
        overallScore: score.overallScore,
        tier: score.tier,
        dimensions: score.dimensions,
        assessmentDate: new Date('2025-01-15'),
        assessedBy: 'Clarus Vitae Advisory Team',
        methodology: 'v1.0',
      },
    });
  }

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n✅ Tier 2 Expansion completed successfully!\n');
  console.log('Summary of new properties added:');
  console.log('  1. Six Senses Douro Valley (Portugal) - Score: 86');
  console.log('  2. Como Shambhala Estate (Indonesia) - Score: 85');
  console.log('  3. Ananda in the Himalayas (India) - Score: 87');
  console.log('  4. The Ranch Malibu (USA) - Score: 84');
  console.log('  5. Lefay Resort Lago di Garda (Italy) - Score: 85');
  console.log('  6. Brenners Park-Hotel & Spa (Germany) - Score: 86');
  console.log('  7. Forestis Dolomites (Italy) - Score: 84');
  console.log('  8. Lily of the Valley (France) - Score: 83');
  console.log('  9. Euphoria Retreat (Greece) - Score: 85');
  console.log('  10. Schloss Elmau (Germany) - Score: 84');
  console.log('  11. Miraval Arizona (USA) - Score: 83');
  console.log('  12. Cal-a-Vie Health Spa (USA) - Score: 82');
  console.log('  13. The BodyHoliday (St. Lucia) - Score: 81');
  console.log('  14. Shanti Maurice (Mauritius) - Score: 82');
  console.log('  15. Absolute Sanctuary (Thailand) - Score: 80');
  console.log('\nTotal Tier 2 properties: 15');
  console.log('Total programs created: 14');
  console.log('Total treatments linked: ' + propertyTreatments.length);
  console.log('Total diagnostics linked: ' + propertyDiagnostics.length);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding Tier 2 expansion:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
