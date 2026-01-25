/**
 * Clarus Vitae - Tier 2 Integrated Wellness Properties Expansion
 *
 * This seed file adds 15 Tier 2 properties (Integrated Wellness Retreats).
 * Run AFTER the main seed.ts and seed-treatments.ts to preserve existing data.
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
 * 14. Shanti Maurice Resort & Spa (Mauritius)
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
        'Nestled among the terraced vineyards of Portugal\'s UNESCO-listed Douro Valley wine region, Six Senses Douro Valley combines the brand\'s signature wellness philosophy with the region\'s rich heritage. The restored 19th-century manor house offers holistic programs, organic cuisine, and stunning river valley views. The integrated wellness approach blends ancient healing traditions with modern science.',
      city: 'Lamego',
      country: 'Portugal',
      region: 'Douro Valley',
      latitude: 41.0942,
      longitude: -7.8117,
      nearestAirport: 'Porto Airport (OPO)',
      transferTime: '1 hour 30 minutes by car',
      tier: 'TIER_2',
      approach: 'INTEGRATIVE',
      focusAreas: ['STRESS_BURNOUT', 'DETOX', 'SLEEP', 'HOLISTIC_SPIRITUAL', 'GENERAL_REJUVENATION'],
      priceMin: 5000,
      priceMax: 18000,
      currency: 'EUR',
      website: 'https://www.sixsenses.com/en/resorts/douro-valley',
      foundedYear: 2015,
      capacity: 71,
      accommodationType: 'Restored manor suites and vineyard quintas',
      diningDescription: 'Farm-to-table organic cuisine featuring local Douro products, wine pairings from the region, and Eat With Six Senses wellness menu options.',
      facilitiesDescription: 'Extensive spa with indoor/outdoor pools, vineyard views treatment rooms, yoga pavilion, meditation spaces, wine cellar, organic garden.',
      setting: 'UNESCO vineyard terraces overlooking Douro River',
      overallScore: 87,
      clinicalRigorScore: 78,
      outcomeEvidenceScore: 82,
      programDepthScore: 88,
      experienceQualityScore: 92,
      valueAlignmentScore: 85,
      physicianPatientRatio: '1:12',
      avgBookingLeadTime: '4-6 weeks',
      returnGuestPercentage: 45,
      staffTenure: 'Average 5 years',
      actualCustomization:
        'Wellness screening on arrival determines personalized program. Integrated wellness practitioners create bespoke treatments combining local traditions with Six Senses signature therapies.',
      postVisitFollowup:
        'Digital wellness resources, recommended home practices, periodic check-in emails.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free'],
      privacyArchitecture: 'Private quintas available, spread-out property',
      prayerFacilities: 'Meditation gardens, quiet spaces',
      languagesMedical: ['English', 'Portuguese'],
      languagesService: ['English', 'Portuguese', 'Spanish', 'French', 'German'],
      soloTravelerFriendly: 'GOOD',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: true,
      editorChoice: 'Best Wine Country Wellness',
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
        'Set within a sacred river valley near Ubud, Como Shambhala Estate is Bali\'s premier wellness destination, combining ancient Balinese healing traditions with contemporary wellness expertise. The estate features resident wellness experts including Ayurvedic doctors, yoga teachers, and holistic practitioners. Programs focus on sustainable lifestyle changes through movement, nutrition, and holistic therapies.',
      city: 'Ubud',
      country: 'Indonesia',
      region: 'Bali',
      latitude: -8.4095,
      longitude: 115.2336,
      nearestAirport: 'Ngurah Rai International Airport (DPS)',
      transferTime: '1 hour 30 minutes by car',
      tier: 'TIER_2',
      approach: 'HOLISTIC',
      focusAreas: ['STRESS_BURNOUT', 'HOLISTIC_SPIRITUAL', 'FITNESS_PERFORMANCE', 'DETOX', 'GENERAL_REJUVENATION'],
      priceMin: 6000,
      priceMax: 20000,
      currency: 'USD',
      website: 'https://www.comohotels.com/en/comoshambhalaestate',
      foundedYear: 2005,
      capacity: 30,
      accommodationType: 'Private residences and suites in jungle setting',
      diningDescription: 'Como Shambhala Cuisine - raw food focus, organic ingredients, personalized nutrition plans. Glow restaurant offers healthy gourmet options.',
      facilitiesDescription: 'Spa over sacred Ayung River, hydrotherapy, yoga pavilions, Pilates studio, outdoor pool, meditation spaces, jungle hiking trails.',
      setting: 'Sacred river valley jungle near Ubud',
      overallScore: 89,
      clinicalRigorScore: 80,
      outcomeEvidenceScore: 84,
      programDepthScore: 90,
      experienceQualityScore: 94,
      valueAlignmentScore: 88,
      physicianPatientRatio: '1:8',
      avgBookingLeadTime: '6-8 weeks',
      returnGuestPercentage: 52,
      staffTenure: 'Average 7 years',
      actualCustomization:
        'Initial wellness consultation with resident expert. Bespoke programs created combining Ayurveda, yoga, nutrition, and holistic treatments. Daily schedule tailored to individual goals.',
      postVisitFollowup:
        'Take-home wellness guide, recommended practices, Como Shambhala at-home products.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Raw', 'Ayurvedic'],
      privacyArchitecture: 'Private jungle residences, secluded property',
      prayerFacilities: 'Sacred springs, meditation pavilions, Balinese temple',
      languagesMedical: ['English', 'Indonesian'],
      languagesService: ['English', 'Indonesian', 'Japanese', 'Mandarin'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: true,
      editorChoice: 'Best for Holistic Transformation',
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
        'Housed in a palace estate of the Maharaja of Tehri-Garhwal, Ananda sits 1,000 meters above sea level overlooking the Ganges and the spiritual town of Rishikesh. This legendary destination spa combines traditional Ayurveda, yoga, and Vedanta with international wellness therapies. The setting in the birthplace of yoga adds an unmatched spiritual dimension to every program.',
      city: 'Rishikesh',
      country: 'India',
      region: 'Uttarakhand',
      latitude: 30.1158,
      longitude: 78.3228,
      nearestAirport: 'Dehradun Jolly Grant Airport (DED)',
      transferTime: '1 hour by car',
      tier: 'TIER_2',
      approach: 'INTEGRATIVE',
      focusAreas: ['HOLISTIC_SPIRITUAL', 'STRESS_BURNOUT', 'DETOX', 'WEIGHT_METABOLIC', 'SLEEP'],
      priceMin: 5500,
      priceMax: 22000,
      currency: 'USD',
      website: 'https://www.anandaspa.com',
      foundedYear: 2000,
      capacity: 78,
      accommodationType: 'Palace rooms and private villas with Himalayan views',
      diningDescription: 'Ayurvedic cuisine tailored to dosha, organic ingredients, Sattvic vegetarian options. Multiple restaurants including fine dining and spa cuisine.',
      facilitiesDescription: '24,000 sq ft spa, Ayurveda center, yoga pavilions, meditation caves, Hydrotherapy facilities, outdoor pool, golf course, nature trails.',
      setting: 'Himalayan palace estate above Rishikesh',
      overallScore: 88,
      clinicalRigorScore: 82,
      outcomeEvidenceScore: 85,
      programDepthScore: 91,
      experienceQualityScore: 90,
      valueAlignmentScore: 86,
      physicianPatientRatio: '1:6',
      avgBookingLeadTime: '4-8 weeks',
      returnGuestPercentage: 48,
      staffTenure: 'Average 8 years',
      actualCustomization:
        'Ayurvedic physician consultation determines dosha and creates personalized treatment plan. Programs combine traditional practices with modern wellness modalities.',
      postVisitFollowup:
        'Detailed Ayurvedic lifestyle recommendations, herb protocols, yoga sequences for home practice.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Ayurvedic', 'Sattvic'],
      privacyArchitecture: 'Private villas, secluded palace grounds',
      prayerFacilities: 'Meditation caves, yoga pavilions, proximity to Rishikesh temples',
      languagesMedical: ['English', 'Hindi'],
      languagesService: ['English', 'Hindi', 'French', 'German'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: true,
      editorChoice: 'Best for Authentic Ayurveda',
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
        'The Ranch Malibu is an immersive fitness and wellness program set on a historic ranch in the Santa Monica Mountains. Known for its transformative one-week program, The Ranch combines rigorous daily hiking (up to 4 hours), plant-based nutrition, yoga, and complete digital detox. This is wellness with intention - no spa indulgence, but real results.',
      city: 'Malibu',
      country: 'United States',
      region: 'California',
      latitude: 34.0259,
      longitude: -118.7798,
      nearestAirport: 'Los Angeles International Airport (LAX)',
      transferTime: '1 hour by car',
      tier: 'TIER_2',
      approach: 'LIFESTYLE',
      focusAreas: ['FITNESS_PERFORMANCE', 'WEIGHT_METABOLIC', 'STRESS_BURNOUT', 'DETOX', 'GENERAL_REJUVENATION'],
      priceMin: 9000,
      priceMax: 15000,
      currency: 'USD',
      website: 'https://www.theranchmalibu.com',
      foundedYear: 2010,
      capacity: 18,
      accommodationType: 'Private cottages on historic ranch',
      diningDescription: 'Organic plant-based cuisine, 1,400 calories daily, no caffeine or alcohol. All meals prepared on-site with organic produce.',
      facilitiesDescription: 'Mountain hiking trails, yoga barn, massage rooms, organic garden, swimming pool, no gym equipment by design.',
      setting: 'Santa Monica Mountains ranch',
      overallScore: 86,
      clinicalRigorScore: 75,
      outcomeEvidenceScore: 88,
      programDepthScore: 85,
      experienceQualityScore: 88,
      valueAlignmentScore: 90,
      physicianPatientRatio: 'None on-site',
      avgBookingLeadTime: '8-12 weeks',
      returnGuestPercentage: 40,
      staffTenure: 'Average 4 years',
      actualCustomization:
        'One program format for all guests - the structure is the secret. Medical questionnaire pre-arrival ensures suitability. Daily bodywork and yoga support the hiking program.',
      postVisitFollowup:
        'Recipe book, exercise recommendations, community support through alumni programs.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegan', 'Gluten-free'],
      privacyArchitecture: 'Private cottages, intimate group size',
      prayerFacilities: 'Mountain meditation spots, quiet nature spaces',
      languagesMedical: ['English'],
      languagesService: ['English', 'Spanish'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
      editorChoice: 'Best for Fitness Transformation',
    },
  });

  // ============================================
  // PROPERTY 5: Lefay Resort & Spa (Italy)
  // ============================================
  console.log('Creating Lefay Resort & Spa Lago di Garda...');

  const lefay = await prisma.property.create({
    data: {
      slug: 'lefay-resort-spa-lago-di-garda',
      name: 'Lefay Resort & Spa Lago di Garda',
      description:
        'Perched above Lake Garda with panoramic Alpine views, Lefay combines Classical Chinese Medicine philosophy with Western wellness in its signature Lefay SPA Method. The eco-sustainable resort offers comprehensive wellness programs guided by TCM practitioners, targeting energy balance, detox, and anti-aging through a blend of Eastern and Western modalities.',
      city: 'Gargnano',
      country: 'Italy',
      region: 'Lombardy',
      latitude: 45.7133,
      longitude: 10.6558,
      nearestAirport: 'Verona Airport (VRN) or Milan Bergamo (BGY)',
      transferTime: '1 hour 15 minutes by car',
      tier: 'TIER_2',
      approach: 'INTEGRATIVE',
      focusAreas: ['STRESS_BURNOUT', 'DETOX', 'BEAUTY_AESTHETIC', 'WEIGHT_METABOLIC', 'GENERAL_REJUVENATION'],
      priceMin: 4500,
      priceMax: 15000,
      currency: 'EUR',
      website: 'https://www.lefayresorts.com/en/lago-di-garda',
      foundedYear: 2008,
      capacity: 93,
      accommodationType: 'Lake-view suites and residences',
      diningDescription: 'Energy Cuisine based on TCM principles, organic Mediterranean ingredients, personalized nutrition plans.',
      facilitiesDescription: '3,800 sqm spa with saline lake, indoor/outdoor pools, fitness center, TCM consultation rooms, beauty treatments.',
      setting: 'Alpine hillside overlooking Lake Garda',
      overallScore: 85,
      clinicalRigorScore: 79,
      outcomeEvidenceScore: 80,
      programDepthScore: 86,
      experienceQualityScore: 90,
      valueAlignmentScore: 84,
      physicianPatientRatio: '1:15',
      avgBookingLeadTime: '3-5 weeks',
      returnGuestPercentage: 42,
      staffTenure: 'Average 6 years',
      actualCustomization:
        'TCM diagnostic consultation on arrival. Programs tailored to energy imbalances identified through pulse and tongue diagnosis. Western treatments complement Eastern approach.',
      postVisitFollowup:
        'Personalized wellness report, recommended practices, Lefay products for home use.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free'],
      privacyArchitecture: 'Private suites, adults-only spa areas',
      prayerFacilities: 'Meditation spaces, lake-view relaxation areas',
      languagesMedical: ['Italian', 'English', 'German'],
      languagesService: ['Italian', 'English', 'German', 'French', 'Russian'],
      soloTravelerFriendly: 'GOOD',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
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
        'A legendary European grand hotel in Baden-Baden since 1872, Brenners Park combines old-world elegance with a medically-focused spa. The Villa Stéphanie medical spa offers comprehensive health programs under physician supervision, while the main hotel provides classic luxury spa experiences. The setting in a historic spa town adds to the healing atmosphere.',
      city: 'Baden-Baden',
      country: 'Germany',
      region: 'Baden-Württemberg',
      latitude: 48.7619,
      longitude: 8.2389,
      nearestAirport: 'Stuttgart Airport (STR) or Baden-Baden Airpark (FKB)',
      transferTime: '1 hour from Stuttgart, 15 minutes from Baden-Baden',
      tier: 'TIER_2',
      approach: 'INTEGRATIVE',
      focusAreas: ['MEDICAL_ASSESSMENT', 'STRESS_BURNOUT', 'DETOX', 'BEAUTY_AESTHETIC', 'GENERAL_REJUVENATION'],
      priceMin: 6000,
      priceMax: 25000,
      currency: 'EUR',
      website: 'https://www.oetkercollection.com/hotels/brenners-park-hotel-spa',
      foundedYear: 1872,
      capacity: 100,
      accommodationType: 'Historic hotel rooms, suites, and private apartments',
      diningDescription: 'Multiple restaurants including Michelin-starred Fritz & Felix. Spa cuisine available. Traditional German wellness dining.',
      facilitiesDescription: 'Villa Stéphanie medical spa (5,000 sqm), classic spa, indoor pool, fitness, park gardens, access to historic thermal baths.',
      setting: 'Park setting in historic spa town',
      overallScore: 86,
      clinicalRigorScore: 84,
      outcomeEvidenceScore: 82,
      programDepthScore: 85,
      experienceQualityScore: 91,
      valueAlignmentScore: 83,
      physicianPatientRatio: '1:8',
      avgBookingLeadTime: '4-6 weeks',
      returnGuestPercentage: 55,
      staffTenure: 'Average 10 years',
      actualCustomization:
        'Villa Stéphanie offers comprehensive medical diagnostics. Programs created by physicians integrating traditional European spa medicine with modern wellness.',
      postVisitFollowup:
        'Medical report with recommendations, follow-up consultation options, continued relationship with medical team.',
      discretionLevel: 'ULTRA_HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Kosher available', 'Vegetarian', 'Gluten-free'],
      privacyArchitecture: 'Private apartments, discrete service, separate medical spa building',
      prayerFacilities: 'Quiet gardens, nearby historic churches',
      languagesMedical: ['German', 'English', 'French'],
      languagesService: ['German', 'English', 'French', 'Russian', 'Arabic'],
      soloTravelerFriendly: 'GOOD',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
      editorChoice: 'Best European Grand Hotel Spa',
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
        'At 1,800 meters altitude in the UNESCO-listed Dolomites, Forestis is a design-forward wellness retreat built around the healing power of the forest and mountains. The property\'s philosophy centers on the four elements - water, wood, light, and stone - incorporated into architecture, treatments, and cuisine. A haven for those seeking peace and natural restoration.',
      city: 'Bressanone',
      country: 'Italy',
      region: 'South Tyrol',
      latitude: 46.7553,
      longitude: 11.6917,
      nearestAirport: 'Innsbruck Airport (INN) or Verona (VRN)',
      transferTime: '1 hour from Innsbruck',
      tier: 'TIER_2',
      approach: 'HOLISTIC',
      focusAreas: ['STRESS_BURNOUT', 'SLEEP', 'HOLISTIC_SPIRITUAL', 'GENERAL_REJUVENATION'],
      priceMin: 5000,
      priceMax: 15000,
      currency: 'EUR',
      website: 'https://www.forestis.it',
      foundedYear: 2020,
      capacity: 62,
      accommodationType: 'Alpine suites with floor-to-ceiling Dolomite views',
      diningDescription: 'Forest-inspired cuisine using local, seasonal Alpine ingredients. Focus on purity and simplicity.',
      facilitiesDescription: 'Forest spa with indoor/outdoor pools, saunas, treatment rooms with mountain views, yoga spaces, hiking trails from property.',
      setting: 'Alpine forest at 1,800m elevation',
      overallScore: 84,
      clinicalRigorScore: 72,
      outcomeEvidenceScore: 78,
      programDepthScore: 82,
      experienceQualityScore: 95,
      valueAlignmentScore: 88,
      physicianPatientRatio: 'None on-site',
      avgBookingLeadTime: '6-10 weeks',
      returnGuestPercentage: 38,
      staffTenure: 'Average 3 years',
      actualCustomization:
        'Wellness consultation guides treatment selection. Programs built around natural elements and forest therapy principles. Less clinical, more experiential.',
      postVisitFollowup:
        'Limited formal follow-up. Focus is on the transformative experience during stay.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free'],
      privacyArchitecture: 'Intimate property size, private suites',
      prayerFacilities: 'Mountain meditation spaces, forest trails',
      languagesMedical: ['German', 'Italian', 'English'],
      languagesService: ['German', 'Italian', 'English'],
      soloTravelerFriendly: 'GOOD',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
      risingStar: true,
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
        'A contemporary wellness retreat on the French Riviera between Saint-Tropez and the sea, Lily of the Valley combines Mediterranean lifestyle with serious wellness programming. The property partners with leading practitioners and offers programs spanning fitness, nutrition, holistic therapies, and beauty, all in a stunning coastal setting.',
      city: 'La Croix-Valmer',
      country: 'France',
      region: 'Côte d\'Azur',
      latitude: 43.1833,
      longitude: 6.5667,
      nearestAirport: 'Nice Côte d\'Azur Airport (NCE)',
      transferTime: '1 hour 30 minutes by car',
      tier: 'TIER_2',
      approach: 'LIFESTYLE',
      focusAreas: ['FITNESS_PERFORMANCE', 'BEAUTY_AESTHETIC', 'STRESS_BURNOUT', 'WEIGHT_METABOLIC', 'GENERAL_REJUVENATION'],
      priceMin: 5500,
      priceMax: 18000,
      currency: 'EUR',
      website: 'https://www.lilyofthevalley.com',
      foundedYear: 2019,
      capacity: 44,
      accommodationType: 'Contemporary villas and suites with sea or garden views',
      diningDescription: 'Mediterranean wellness cuisine, organic ingredients, personalized nutrition options. Multiple restaurants including healthy poolside dining.',
      facilitiesDescription: '2,500 sqm spa, indoor/outdoor pools, tennis, yoga studio, fitness center, private beach access, botanical gardens.',
      setting: 'Coastal hillside overlooking Mediterranean',
      overallScore: 83,
      clinicalRigorScore: 74,
      outcomeEvidenceScore: 78,
      programDepthScore: 84,
      experienceQualityScore: 91,
      valueAlignmentScore: 82,
      physicianPatientRatio: '1:20',
      avgBookingLeadTime: '4-8 weeks',
      returnGuestPercentage: 35,
      staffTenure: 'Average 3 years',
      actualCustomization:
        'Wellness consultation on arrival. Programs combine fitness, spa treatments, and nutrition. Guest practitioners regularly in residence.',
      postVisitFollowup:
        'Wellness recommendations, product suggestions, newsletter with wellness content.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Kosher available'],
      privacyArchitecture: 'Private villas, intimate property',
      prayerFacilities: 'Meditation gardens, quiet spaces',
      languagesMedical: ['French', 'English'],
      languagesService: ['French', 'English', 'Italian', 'Russian'],
      soloTravelerFriendly: 'GOOD',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
      risingStar: true,
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
        'Set in a historic town in the Peloponnese near ancient Sparta, Euphoria Retreat is a holistic destination combining Greek wellness heritage with Chinese medicine and contemporary science. The striking architecture features a Byzantine-inspired sphere spa. Programs integrate physical, emotional, and spiritual elements for deep transformation.',
      city: 'Mystras',
      country: 'Greece',
      region: 'Peloponnese',
      latitude: 37.0761,
      longitude: 22.3711,
      nearestAirport: 'Athens International Airport (ATH)',
      transferTime: '2 hours 30 minutes by car',
      tier: 'TIER_2',
      approach: 'HOLISTIC',
      focusAreas: ['HOLISTIC_SPIRITUAL', 'STRESS_BURNOUT', 'DETOX', 'EMOTIONAL_HEALING', 'GENERAL_REJUVENATION'],
      priceMin: 4000,
      priceMax: 12000,
      currency: 'EUR',
      website: 'https://www.euphoriaretreat.com',
      foundedYear: 2018,
      capacity: 45,
      accommodationType: 'Minimalist luxury rooms and suites',
      diningDescription: 'Mediterranean-Asian fusion wellness cuisine, organic Greek ingredients, personalized meal plans.',
      facilitiesDescription: '3,500 sqm sphere spa with Byzantine-inspired design, thermal pools, watsu pool, outdoor activities, yoga spaces.',
      setting: 'Historic Mystras near ancient Sparta',
      overallScore: 85,
      clinicalRigorScore: 76,
      outcomeEvidenceScore: 80,
      programDepthScore: 88,
      experienceQualityScore: 89,
      valueAlignmentScore: 87,
      physicianPatientRatio: '1:10',
      avgBookingLeadTime: '4-6 weeks',
      returnGuestPercentage: 40,
      staffTenure: 'Average 4 years',
      actualCustomization:
        'Detailed pre-arrival questionnaire. Programs designed around emotional and physical goals. Integration of Greek healing traditions with modern approaches.',
      postVisitFollowup:
        'Wellness report, recommended practices, Euphoria products and supplements.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Greek Orthodox fasting'],
      privacyArchitecture: 'Intimate property, private treatment spaces',
      prayerFacilities: 'Meditation cave, Byzantine chapel nearby',
      languagesMedical: ['English', 'Greek'],
      languagesService: ['English', 'Greek', 'French', 'German'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: true,
      editorChoice: 'Best for Emotional Wellness',
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
        'A cultural hideaway in the Bavarian Alps, Schloss Elmau uniquely combines world-class cultural programming (concerts, lectures) with six distinct spas across two hotels. The property offers everything from family-friendly wellness to adults-only luxury, all set against dramatic Alpine scenery. Famous for hosting G7 summits, it maintains an atmosphere of refined sophistication.',
      city: 'Elmau',
      country: 'Germany',
      region: 'Bavaria',
      latitude: 47.4628,
      longitude: 11.1878,
      nearestAirport: 'Munich Airport (MUC) or Innsbruck (INN)',
      transferTime: '1 hour 30 minutes from Munich',
      tier: 'TIER_2',
      approach: 'LIFESTYLE',
      focusAreas: ['STRESS_BURNOUT', 'GENERAL_REJUVENATION', 'FITNESS_PERFORMANCE', 'HOLISTIC_SPIRITUAL'],
      priceMin: 5000,
      priceMax: 20000,
      currency: 'EUR',
      website: 'https://www.schloss-elmau.de',
      foundedYear: 1916,
      capacity: 162,
      accommodationType: 'Castle rooms and contemporary retreat suites',
      diningDescription: 'Multiple restaurants from casual to fine dining. Wellness cuisine, regional Bavarian, and international options.',
      facilitiesDescription: 'Six spas totaling 6,000 sqm, multiple pools, yoga, fitness, concert hall, library, tennis, golf nearby, skiing access.',
      setting: 'Alpine valley below dramatic peaks',
      overallScore: 84,
      clinicalRigorScore: 72,
      outcomeEvidenceScore: 76,
      programDepthScore: 82,
      experienceQualityScore: 93,
      valueAlignmentScore: 85,
      physicianPatientRatio: '1:25',
      avgBookingLeadTime: '6-10 weeks',
      returnGuestPercentage: 50,
      staffTenure: 'Average 7 years',
      actualCustomization:
        'Choose from six different spa concepts. Wellness programs available but property excels as lifestyle retreat with spa amenities rather than structured programs.',
      postVisitFollowup:
        'Cultural programming newsletter, event announcements, limited wellness follow-up.',
      discretionLevel: 'ULTRA_HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Kosher available', 'Vegetarian', 'Vegan'],
      privacyArchitecture: 'Adults-only retreat option, castle suites, multiple buildings',
      prayerFacilities: 'Chapel, meditation spaces',
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

  const miravalAZ = await prisma.property.create({
    data: {
      slug: 'miraval-arizona',
      name: 'Miraval Arizona',
      description:
        'The original Miraval property and pioneer of the American destination spa movement, Miraval Arizona offers an inclusive all-inclusive experience focused on mindfulness and life balance. Set in the Sonoran Desert near Tucson, the resort provides hundreds of activities from equine therapy to challenge courses, alongside comprehensive spa services and healthy cuisine.',
      city: 'Tucson',
      country: 'United States',
      region: 'Arizona',
      latitude: 32.4142,
      longitude: -111.0064,
      nearestAirport: 'Tucson International Airport (TUS)',
      transferTime: '35 minutes by car',
      tier: 'TIER_2',
      approach: 'LIFESTYLE',
      focusAreas: ['STRESS_BURNOUT', 'HOLISTIC_SPIRITUAL', 'FITNESS_PERFORMANCE', 'GENERAL_REJUVENATION'],
      priceMin: 5000,
      priceMax: 15000,
      currency: 'USD',
      website: 'https://www.miravalresorts.com/arizona',
      foundedYear: 1995,
      capacity: 133,
      accommodationType: 'Desert casitas and suites',
      diningDescription: 'Mindful eating philosophy, farm-to-table cuisine, no clocks in restaurants. Multiple dining venues.',
      facilitiesDescription: '400-acre property, Life in Balance Spa, equestrian center, challenge course, multiple pools, fitness center, hiking trails.',
      setting: 'Sonoran Desert foothills',
      overallScore: 83,
      clinicalRigorScore: 70,
      outcomeEvidenceScore: 78,
      programDepthScore: 85,
      experienceQualityScore: 87,
      valueAlignmentScore: 84,
      physicianPatientRatio: 'None on-site',
      avgBookingLeadTime: '4-6 weeks',
      returnGuestPercentage: 48,
      staffTenure: 'Average 6 years',
      actualCustomization:
        'Choose from hundreds of activities. Personal advisor helps create daily schedule. Inclusive pricing means guests explore freely. Credit for spa services included.',
      postVisitFollowup:
        'Miraval Life in Balance online resources, recipes, meditation library.',
      discretionLevel: 'STANDARD',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Kosher available'],
      privacyArchitecture: 'Spread-out casitas, private desert setting',
      prayerFacilities: 'Meditation spaces, labyrinth, desert contemplation areas',
      languagesMedical: ['English'],
      languagesService: ['English', 'Spanish'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
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
        'A European-inspired wellness village in the hills of Vista, California, Cal-a-Vie offers structured week-long programs focused on fitness, nutrition, and spa treatments. With a maximum of 32 guests and a staff-to-guest ratio approaching 4:1, the experience is highly personalized. The property features antique-filled French provincial cottages amid Mediterranean gardens.',
      city: 'Vista',
      country: 'United States',
      region: 'California',
      latitude: 33.1975,
      longitude: -117.2403,
      nearestAirport: 'San Diego International Airport (SAN)',
      transferTime: '45 minutes by car',
      tier: 'TIER_2',
      approach: 'LIFESTYLE',
      focusAreas: ['FITNESS_PERFORMANCE', 'WEIGHT_METABOLIC', 'BEAUTY_AESTHETIC', 'STRESS_BURNOUT', 'GENERAL_REJUVENATION'],
      priceMin: 8500,
      priceMax: 15000,
      currency: 'USD',
      website: 'https://www.cal-a-vie.com',
      foundedYear: 1986,
      capacity: 32,
      accommodationType: 'French provincial cottages with private gardens',
      diningDescription: 'Gourmet spa cuisine, 1,500 calories daily with Mediterranean influence. Award-winning healthy cuisine.',
      facilitiesDescription: '200 acres, fitness studios, pools, golf, tennis, hiking trails, spa, cooking school, chapel.',
      setting: 'Mediterranean-style estate in California hills',
      overallScore: 85,
      clinicalRigorScore: 74,
      outcomeEvidenceScore: 82,
      programDepthScore: 87,
      experienceQualityScore: 88,
      valueAlignmentScore: 86,
      physicianPatientRatio: 'None on-site',
      avgBookingLeadTime: '6-10 weeks',
      returnGuestPercentage: 55,
      staffTenure: 'Average 8 years',
      actualCustomization:
        'Structured weekly program but personalized within framework. High staff ratio enables attention to individual needs. Health history review guides program.',
      postVisitFollowup:
        'Recipe book, exercise DVD, ongoing newsletter. Return guest loyalty program.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Kosher available'],
      privacyArchitecture: 'Private cottages, limited guest numbers',
      prayerFacilities: 'Chapel, meditation gardens',
      languagesMedical: ['English'],
      languagesService: ['English', 'Spanish'],
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
        'An all-inclusive wellness resort on St. Lucia\'s northern coast, The BodyHoliday combines Caribbean relaxation with serious wellness programming. Each guest receives a daily complimentary spa treatment, and programs range from fitness to Ayurveda. The tropical setting, water sports, and vibrant atmosphere create a more social wellness experience.',
      city: 'Cap Estate',
      country: 'Saint Lucia',
      region: 'Caribbean',
      latitude: 14.1,
      longitude: -60.95,
      nearestAirport: 'Hewanorra International Airport (UVF)',
      transferTime: '1 hour 30 minutes by car',
      tier: 'TIER_2',
      approach: 'LIFESTYLE',
      focusAreas: ['FITNESS_PERFORMANCE', 'STRESS_BURNOUT', 'GENERAL_REJUVENATION', 'DETOX'],
      priceMin: 4000,
      priceMax: 12000,
      currency: 'USD',
      website: 'https://www.thebodyholiday.com',
      foundedYear: 1998,
      capacity: 155,
      accommodationType: 'Oceanfront rooms and garden suites',
      diningDescription: 'Multiple restaurants, healthy and indulgent options. All-inclusive includes fine dining.',
      facilitiesDescription: 'Wellness center, multiple pools, tennis, golf nearby, water sports, scuba, sailing, yoga pavilion.',
      setting: 'Caribbean beachfront cove',
      overallScore: 81,
      clinicalRigorScore: 68,
      outcomeEvidenceScore: 74,
      programDepthScore: 80,
      experienceQualityScore: 88,
      valueAlignmentScore: 85,
      physicianPatientRatio: 'None on-site',
      avgBookingLeadTime: '4-8 weeks',
      returnGuestPercentage: 45,
      staffTenure: 'Average 5 years',
      actualCustomization:
        'Daily spa treatment included. Choose from extensive activity menu. Structured programs (WellFit, Ayurveda) available for additional focus.',
      postVisitFollowup:
        'Limited. Focus is on the holiday experience.',
      discretionLevel: 'STANDARD',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free'],
      privacyArchitecture: 'Mix of social and private spaces',
      prayerFacilities: 'Meditation spaces, beach yoga',
      languagesMedical: ['English'],
      languagesService: ['English'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
    },
  });

  // ============================================
  // PROPERTY 14: Shanti Maurice (Mauritius)
  // ============================================
  console.log('Creating Shanti Maurice Resort & Spa...');

  const shantiMaurice = await prisma.property.create({
    data: {
      slug: 'shanti-maurice-resort-spa',
      name: 'Shanti Maurice Resort & Spa',
      description:
        'On the unspoiled south coast of Mauritius, Shanti Maurice offers an extensive Nira Spa with focus on Ayurvedic treatments delivered by practitioners from the subcontinent. The resort balances serious wellness with tropical beach luxury, making it ideal for couples with different wellness intensities.',
      city: 'St. Felix',
      country: 'Mauritius',
      region: 'Indian Ocean',
      latitude: -20.45,
      longitude: 57.5,
      nearestAirport: 'Sir Seewoosagur Ramgoolam International Airport (MRU)',
      transferTime: '45 minutes by car',
      tier: 'TIER_2',
      approach: 'INTEGRATIVE',
      focusAreas: ['HOLISTIC_SPIRITUAL', 'STRESS_BURNOUT', 'DETOX', 'GENERAL_REJUVENATION'],
      priceMin: 4500,
      priceMax: 15000,
      currency: 'EUR',
      website: 'https://www.shantimaurice.com',
      foundedYear: 2007,
      capacity: 61,
      accommodationType: 'Ocean-facing villas with private pools',
      diningDescription: 'Multiple restaurants, wellness menu options, Indian cuisine available, fresh seafood.',
      facilitiesDescription: 'Nira Spa with Ayurveda center, yoga pavilion, pools, tennis, water sports, golf nearby.',
      setting: 'Secluded south coast beach',
      overallScore: 82,
      clinicalRigorScore: 74,
      outcomeEvidenceScore: 76,
      programDepthScore: 84,
      experienceQualityScore: 88,
      valueAlignmentScore: 82,
      physicianPatientRatio: '1:15',
      avgBookingLeadTime: '4-6 weeks',
      returnGuestPercentage: 38,
      staffTenure: 'Average 5 years',
      actualCustomization:
        'Ayurvedic consultation determines dosha and treatment plan. Structured wellness programs available alongside à la carte spa services.',
      postVisitFollowup:
        'Ayurvedic recommendations, limited ongoing support.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Ayurvedic', 'Halal available'],
      privacyArchitecture: 'Private villas with pools',
      prayerFacilities: 'Meditation spaces, yoga pavilion',
      languagesMedical: ['English', 'Hindi'],
      languagesService: ['English', 'French', 'Hindi'],
      soloTravelerFriendly: 'GOOD',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
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
        'A vibrant Moroccan-inspired wellness resort on Koh Samui, Absolute Sanctuary specializes in yoga, detox, and fitness programs at accessible price points. Known for its colorful design and structured programs, it attracts a younger, active wellness crowd. Programs are results-oriented with clear daily schedules.',
      city: 'Koh Samui',
      country: 'Thailand',
      region: 'Surat Thani',
      latitude: 9.5667,
      longitude: 100.0628,
      nearestAirport: 'Koh Samui Airport (USM)',
      transferTime: '15 minutes by car',
      tier: 'TIER_2',
      approach: 'LIFESTYLE',
      focusAreas: ['FITNESS_PERFORMANCE', 'DETOX', 'WEIGHT_METABOLIC', 'STRESS_BURNOUT'],
      priceMin: 2500,
      priceMax: 8000,
      currency: 'USD',
      website: 'https://www.absolutesanctuary.com',
      foundedYear: 2008,
      capacity: 38,
      accommodationType: 'Moroccan-inspired suites and villas',
      diningDescription: 'Detox-friendly cuisine, raw options, juice fasting programs. Multiple meal plans based on program.',
      facilitiesDescription: 'Yoga shalas, Pilates studio, spa, pools, fitness classes, Thai boxing.',
      setting: 'Hillside above Koh Samui beaches',
      overallScore: 79,
      clinicalRigorScore: 68,
      outcomeEvidenceScore: 75,
      programDepthScore: 82,
      experienceQualityScore: 80,
      valueAlignmentScore: 88,
      physicianPatientRatio: 'None on-site',
      avgBookingLeadTime: '2-4 weeks',
      returnGuestPercentage: 35,
      staffTenure: 'Average 4 years',
      actualCustomization:
        'Choose from structured programs (yoga, detox, fitness, weight loss). Programs have set schedules but can be customized. Great value for wellness experience.',
      postVisitFollowup:
        'Program-specific recommendations, recipe guides, limited ongoing support.',
      discretionLevel: 'STANDARD',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Raw', 'Detox'],
      privacyArchitecture: 'Mix of private and shared spaces',
      prayerFacilities: 'Meditation spaces, yoga shalas',
      languagesMedical: ['English', 'Thai'],
      languagesService: ['English', 'Thai'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'NONE',
      published: true,
      featured: false,
    },
  });

  // ============================================
  // LINK TREATMENTS TO NEW PROPERTIES
  // ============================================
  console.log('\n🔗 Linking treatments to properties...');

  const propertyTreatments = [
    // Six Senses Douro Valley
    { propertyId: sixSensesDouro.id, slug: 'acupuncture', price: 150 },
    { propertyId: sixSensesDouro.id, slug: 'lymphatic-drainage', price: 120 },
    { propertyId: sixSensesDouro.id, slug: 'infrared-sauna', price: 40 },
    { propertyId: sixSensesDouro.id, slug: 'breathwork', price: 80 },

    // Como Shambhala
    { propertyId: comoShambhala.id, slug: 'acupuncture', price: 120 },
    { propertyId: comoShambhala.id, slug: 'craniosacral-therapy', price: 140 },
    { propertyId: comoShambhala.id, slug: 'breathwork', price: 60 },

    // Ananda
    { propertyId: ananda.id, slug: 'acupuncture', price: 80 },
    { propertyId: ananda.id, slug: 'tcm-herbal-medicine', price: 60 },
    { propertyId: ananda.id, slug: 'breathwork', price: 40 },
    { propertyId: ananda.id, slug: 'lymphatic-drainage', price: 70 },

    // The Ranch Malibu
    { propertyId: ranchMalibu.id, slug: 'lymphatic-drainage', price: 150 },
    { propertyId: ranchMalibu.id, slug: 'craniosacral-therapy', price: 180 },

    // Lefay
    { propertyId: lefay.id, slug: 'acupuncture', price: 130 },
    { propertyId: lefay.id, slug: 'tcm-herbal-medicine', price: 80 },
    { propertyId: lefay.id, slug: 'infrared-sauna', price: 50 },
    { propertyId: lefay.id, slug: 'lymphatic-drainage', price: 100 },

    // Brenners
    { propertyId: brenners.id, slug: 'iv-vitamin-therapy', price: 250 },
    { propertyId: brenners.id, slug: 'lymphatic-drainage', price: 130 },
    { propertyId: brenners.id, slug: 'colon-hydrotherapy', price: 120 },

    // Forestis
    { propertyId: forestis.id, slug: 'infrared-sauna', price: 60 },
    { propertyId: forestis.id, slug: 'breathwork', price: 90 },

    // Lily of the Valley
    { propertyId: lilyValley.id, slug: 'lymphatic-drainage', price: 140 },
    { propertyId: lilyValley.id, slug: 'red-light-therapy', price: 80 },

    // Euphoria
    { propertyId: euphoria.id, slug: 'acupuncture', price: 100 },
    { propertyId: euphoria.id, slug: 'breathwork', price: 70 },
    { propertyId: euphoria.id, slug: 'flotation-therapy', price: 90 },

    // Schloss Elmau
    { propertyId: schlossElmau.id, slug: 'lymphatic-drainage', price: 120 },
    { propertyId: schlossElmau.id, slug: 'infrared-sauna', price: 50 },

    // Miraval Arizona
    { propertyId: miravalAZ.id, slug: 'acupuncture', price: 180 },
    { propertyId: miravalAZ.id, slug: 'craniosacral-therapy', price: 200 },
    { propertyId: miravalAZ.id, slug: 'breathwork', price: 100 },
    { propertyId: miravalAZ.id, slug: 'biofeedback', price: 150 },

    // Cal-a-Vie
    { propertyId: calaVie.id, slug: 'lymphatic-drainage', price: 150 },
    { propertyId: calaVie.id, slug: 'infrared-sauna', price: 80 },

    // The BodyHoliday
    { propertyId: bodyHoliday.id, slug: 'acupuncture', price: 100 },
    { propertyId: bodyHoliday.id, slug: 'lymphatic-drainage', price: 90 },

    // Shanti Maurice
    { propertyId: shantiMaurice.id, slug: 'acupuncture', price: 110 },
    { propertyId: shantiMaurice.id, slug: 'tcm-herbal-medicine', price: 70 },

    // Absolute Sanctuary
    { propertyId: absoluteSanctuary.id, slug: 'colon-hydrotherapy', price: 50 },
    { propertyId: absoluteSanctuary.id, slug: 'infrared-sauna', price: 30 },
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
  // CREATE CLARUS INDEX SCORES
  // ============================================
  console.log('📊 Creating Clarus Index scores...');

  const indexScores = [
    {
      propertyId: sixSensesDouro.id,
      overallScore: 87,
      tier: 'DISTINGUISHED' as const,
      dimensions: { clinicalRigor: 78, outcomeEvidence: 82, programDepth: 88, experienceQuality: 92, valueAlignment: 85 },
    },
    {
      propertyId: comoShambhala.id,
      overallScore: 89,
      tier: 'DISTINGUISHED' as const,
      dimensions: { clinicalRigor: 80, outcomeEvidence: 84, programDepth: 90, experienceQuality: 94, valueAlignment: 88 },
    },
    {
      propertyId: ananda.id,
      overallScore: 88,
      tier: 'DISTINGUISHED' as const,
      dimensions: { clinicalRigor: 82, outcomeEvidence: 85, programDepth: 91, experienceQuality: 90, valueAlignment: 86 },
    },
    {
      propertyId: ranchMalibu.id,
      overallScore: 86,
      tier: 'DISTINGUISHED' as const,
      dimensions: { clinicalRigor: 75, outcomeEvidence: 88, programDepth: 85, experienceQuality: 88, valueAlignment: 90 },
    },
    {
      propertyId: lefay.id,
      overallScore: 85,
      tier: 'DISTINGUISHED' as const,
      dimensions: { clinicalRigor: 79, outcomeEvidence: 80, programDepth: 86, experienceQuality: 90, valueAlignment: 84 },
    },
    {
      propertyId: brenners.id,
      overallScore: 86,
      tier: 'DISTINGUISHED' as const,
      dimensions: { clinicalRigor: 84, outcomeEvidence: 82, programDepth: 85, experienceQuality: 91, valueAlignment: 83 },
    },
    {
      propertyId: forestis.id,
      overallScore: 84,
      tier: 'DISTINGUISHED' as const,
      dimensions: { clinicalRigor: 72, outcomeEvidence: 78, programDepth: 82, experienceQuality: 95, valueAlignment: 88 },
    },
    {
      propertyId: lilyValley.id,
      overallScore: 83,
      tier: 'DISTINGUISHED' as const,
      dimensions: { clinicalRigor: 74, outcomeEvidence: 78, programDepth: 84, experienceQuality: 91, valueAlignment: 82 },
    },
    {
      propertyId: euphoria.id,
      overallScore: 85,
      tier: 'DISTINGUISHED' as const,
      dimensions: { clinicalRigor: 76, outcomeEvidence: 80, programDepth: 88, experienceQuality: 89, valueAlignment: 87 },
    },
    {
      propertyId: schlossElmau.id,
      overallScore: 84,
      tier: 'DISTINGUISHED' as const,
      dimensions: { clinicalRigor: 72, outcomeEvidence: 76, programDepth: 82, experienceQuality: 93, valueAlignment: 85 },
    },
    {
      propertyId: miravalAZ.id,
      overallScore: 83,
      tier: 'DISTINGUISHED' as const,
      dimensions: { clinicalRigor: 70, outcomeEvidence: 78, programDepth: 85, experienceQuality: 87, valueAlignment: 84 },
    },
    {
      propertyId: calaVie.id,
      overallScore: 85,
      tier: 'DISTINGUISHED' as const,
      dimensions: { clinicalRigor: 74, outcomeEvidence: 82, programDepth: 87, experienceQuality: 88, valueAlignment: 86 },
    },
    {
      propertyId: bodyHoliday.id,
      overallScore: 81,
      tier: 'DISTINGUISHED' as const,
      dimensions: { clinicalRigor: 68, outcomeEvidence: 74, programDepth: 80, experienceQuality: 88, valueAlignment: 85 },
    },
    {
      propertyId: shantiMaurice.id,
      overallScore: 82,
      tier: 'DISTINGUISHED' as const,
      dimensions: { clinicalRigor: 74, outcomeEvidence: 76, programDepth: 84, experienceQuality: 88, valueAlignment: 82 },
    },
    {
      propertyId: absoluteSanctuary.id,
      overallScore: 79,
      tier: 'NOTABLE' as const,
      dimensions: { clinicalRigor: 68, outcomeEvidence: 75, programDepth: 82, experienceQuality: 80, valueAlignment: 88 },
    },
  ];

  for (const score of indexScores) {
    await prisma.clarusIndexScore.create({
      data: {
        propertyId: score.propertyId,
        overallScore: score.overallScore,
        tier: score.tier,
        dimensions: score.dimensions,
        assessmentDate: new Date('2024-12-01'),
        assessedBy: 'Clarus Team',
        methodology: 'v1.0',
      },
    });
  }

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n✅ Tier 2 Expansion completed successfully!\n');
  console.log('Summary of properties added:');
  console.log('  1. Six Senses Douro Valley (Portugal) - Score: 87');
  console.log('  2. Como Shambhala Estate (Bali) - Score: 89');
  console.log('  3. Ananda in the Himalayas (India) - Score: 88');
  console.log('  4. The Ranch Malibu (USA) - Score: 86');
  console.log('  5. Lefay Resort & Spa (Italy) - Score: 85');
  console.log('  6. Brenners Park-Hotel & Spa (Germany) - Score: 86');
  console.log('  7. Forestis Dolomites (Italy) - Score: 84');
  console.log('  8. Lily of the Valley (France) - Score: 83');
  console.log('  9. Euphoria Retreat (Greece) - Score: 85');
  console.log('  10. Schloss Elmau (Germany) - Score: 84');
  console.log('  11. Miraval Arizona (USA) - Score: 83');
  console.log('  12. Cal-a-Vie Health Spa (USA) - Score: 85');
  console.log('  13. The BodyHoliday (St. Lucia) - Score: 81');
  console.log('  14. Shanti Maurice (Mauritius) - Score: 82');
  console.log('  15. Absolute Sanctuary (Thailand) - Score: 79');
  console.log('\nTotal Tier 2 properties added: 15');
  console.log('Total treatments linked: ' + propertyTreatments.length);
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
