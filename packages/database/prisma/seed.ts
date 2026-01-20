/**
 * Clarus Vitae Database Seed Script
 *
 * Populates the database with sample data for development and testing.
 * Includes:
 * - 5 sample properties (mix of all tiers)
 * - 30+ treatments
 * - 2 sample team members
 * - 15+ diagnostics
 * - 10+ equipment items
 * - Sample programs
 */

import { PrismaClient } from '@prisma/client';
import {
  seedAdditionalTreatments,
  seedAdditionalDiagnostics,
  seedAdditionalEquipment,
} from './seed-treatments';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data (in reverse order of dependencies)
  console.log('🧹 Cleaning existing data...');
  await prisma.article.deleteMany();
  await prisma.review.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.clarusIndexScore.deleteMany();
  await prisma.program.deleteMany();
  await prisma.propertyTreatment.deleteMany();
  await prisma.propertyDiagnostic.deleteMany();
  await prisma.propertyEquipment.deleteMany();
  await prisma.treatmentEquipment.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.tierOneDetails.deleteMany();
  await prisma.property.deleteMany();
  await prisma.treatment.deleteMany();
  await prisma.diagnostic.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.teamMember.deleteMany();

  // ============================================
  // TEAM MEMBERS
  // ============================================
  console.log('👥 Creating team members...');

  const drSarahChen = await prisma.teamMember.create({
    data: {
      slug: 'dr-sarah-chen',
      name: 'Dr. Sarah Chen',
      title: 'Chief Medical Advisor',
      bio: 'Dr. Sarah Chen is a board-certified physician specializing in integrative medicine and longevity science. With over 15 years of experience evaluating wellness facilities worldwide, she brings clinical rigor to every assessment. Dr. Chen has personally completed programs at over 50 medical wellness properties across Europe, Asia, and North America.',
      credentials: [
        'MD, Stanford University School of Medicine',
        'Board Certified Internal Medicine',
        'Fellowship in Integrative Medicine, University of Arizona',
        'Certified Functional Medicine Practitioner',
      ],
      specializations: [
        'Medical longevity protocols',
        'Regenerative medicine',
        'Metabolic optimization',
        'Executive health assessments',
      ],
      languages: ['English', 'Mandarin', 'French'],
      propertiesVisited: [],
      programsCompleted: 52,
      photoUrl: '/team/dr-sarah-chen.jpg',
      linkedinUrl: 'https://linkedin.com/in/drsarahchen',
      published: true,
    },
  });

  const jamesWorthington = await prisma.teamMember.create({
    data: {
      slug: 'james-worthington',
      name: 'James Worthington',
      title: 'Senior Wellness Analyst',
      bio: 'James Worthington has spent over a decade advising family offices and high-net-worth individuals on wellness investments. His background in hospitality consulting provides unique insight into operational excellence and guest experience. He has evaluated properties across 40 countries and specializes in the intersection of luxury hospitality and evidence-based wellness.',
      credentials: [
        'MBA, INSEAD',
        'Certified Hospitality Industry Analyst',
        'Former Director, Luxury Portfolio, Four Seasons',
      ],
      specializations: [
        'Luxury wellness operations',
        'Guest experience assessment',
        'Value analysis',
        'Property partnerships',
      ],
      languages: ['English', 'German', 'Spanish'],
      propertiesVisited: [],
      programsCompleted: 78,
      photoUrl: '/team/james-worthington.jpg',
      linkedinUrl: 'https://linkedin.com/in/jamesworthington',
      published: true,
    },
  });

  // ============================================
  // TREATMENTS
  // ============================================
  console.log('💉 Creating treatments...');

  const treatments = await Promise.all([
    prisma.treatment.create({
      data: {
        slug: 'nad-iv-therapy',
        name: 'NAD+ IV Therapy',
        aliases: ['NAD infusion', 'Nicotinamide adenine dinucleotide therapy'],
        category: 'IV_THERAPIES',
        description:
          'NAD+ (Nicotinamide Adenine Dinucleotide) IV therapy delivers this essential coenzyme directly into the bloodstream, bypassing the digestive system for maximum absorption. NAD+ plays a critical role in cellular energy production, DNA repair, and the activation of sirtuins, proteins associated with longevity.',
        howItWorks:
          'NAD+ is administered through an IV drip over 2-4 hours. The coenzyme enters cells directly, supporting mitochondrial function and activating cellular repair mechanisms. Treatment protocols typically involve multiple sessions over several days.',
        whatItAddresses: [
          'Cellular aging',
          'Chronic fatigue',
          'Cognitive decline',
          'Addiction recovery',
          'Athletic recovery',
        ],
        evidenceLevel: 'EMERGING',
        evidenceSummary:
          'Preclinical studies show promising results for cellular health and longevity. Human clinical trials are ongoing, with observational data suggesting improvements in energy, cognition, and recovery. More rigorous controlled trials are needed.',
        typicalProtocol:
          'Initial protocol typically involves 4-6 sessions over 7-10 days, with maintenance infusions monthly or quarterly. Dosage ranges from 250mg to 1000mg per session depending on individual assessment.',
        priceRangeMin: 500,
        priceRangeMax: 1500,
        potentialRisks:
          'Generally well-tolerated. Some patients experience flushing, nausea, or chest tightness during infusion. Rarely, headache or fatigue may occur post-treatment.',
        contraindications: [
          'Active cancer',
          'Pregnancy or nursing',
          'Severe cardiac conditions',
        ],
        published: true,
      },
    }),

    prisma.treatment.create({
      data: {
        slug: 'hyperbaric-oxygen-therapy',
        name: 'Hyperbaric Oxygen Therapy (HBOT)',
        aliases: ['HBOT', 'Hyperbaric chamber', 'Oxygen therapy'],
        category: 'HYPERBARIC',
        description:
          'Hyperbaric Oxygen Therapy involves breathing pure oxygen in a pressurized chamber at 1.5 to 3 times normal atmospheric pressure. This dramatically increases oxygen delivery to tissues, promoting healing, reducing inflammation, and supporting cellular regeneration.',
        howItWorks:
          'At increased pressure, oxygen dissolves more readily into blood plasma, reaching tissues that may have compromised blood flow. This triggers release of growth factors, stem cells, and supports collagen production and wound healing.',
        whatItAddresses: [
          'Wound healing',
          'Sports recovery',
          'Cognitive enhancement',
          'Anti-aging',
          'Post-surgical recovery',
          'Chronic inflammation',
        ],
        evidenceLevel: 'MODERATE',
        evidenceSummary:
          'FDA-approved for 14 conditions including decompression sickness, wound healing, and carbon monoxide poisoning. Growing evidence for cognitive benefits and anti-aging applications, though more research is needed for wellness indications.',
        typicalProtocol:
          'Sessions last 60-90 minutes at 1.5-2.4 ATA pressure. Protocols range from 20-40 sessions depending on indication. Wellness applications typically use milder pressures (1.3-1.5 ATA) with 10-20 session protocols.',
        priceRangeMin: 150,
        priceRangeMax: 400,
        potentialRisks:
          'Ear and sinus discomfort during pressure changes. Rare risks include temporary vision changes, oxygen toxicity seizures (extremely rare at wellness protocols), and claustrophobia.',
        contraindications: [
          'Untreated pneumothorax',
          'Certain chemotherapy drugs',
          'Severe COPD',
          'Recent ear surgery',
        ],
        published: true,
      },
    }),

    prisma.treatment.create({
      data: {
        slug: 'whole-body-cryotherapy',
        name: 'Whole Body Cryotherapy',
        aliases: ['WBC', 'Cryo', 'Cryosauna'],
        category: 'CRYOTHERAPY',
        description:
          'Whole Body Cryotherapy exposes the body to extremely cold temperatures (-110°C to -140°C) for 2-4 minutes in a specialized chamber. The extreme cold triggers a systemic response that reduces inflammation, releases endorphins, and may support recovery and metabolism.',
        howItWorks:
          'The sudden cold triggers vasoconstriction followed by vasodilation, flushing tissues with oxygenated blood. The body releases norepinephrine (reducing inflammation) and endorphins. Cold shock proteins may support cellular health.',
        whatItAddresses: [
          'Muscle recovery',
          'Inflammation',
          'Pain management',
          'Mood enhancement',
          'Skin health',
          'Metabolic boost',
        ],
        evidenceLevel: 'EMERGING',
        evidenceSummary:
          'Studies show benefits for exercise recovery and inflammation reduction. Evidence for other claims (weight loss, anti-aging) is limited. Well-tolerated when properly administered, but long-term benefits need more research.',
        typicalProtocol:
          'Sessions last 2-4 minutes at temperatures between -110°C and -140°C. Wellness protocols typically involve daily or every-other-day sessions over 1-2 weeks, with maintenance sessions weekly or monthly.',
        priceRangeMin: 50,
        priceRangeMax: 150,
        potentialRisks:
          'Skin irritation or frostbite if not properly supervised. Rare cases of cold-related injuries. Not recommended for those with cold sensitivity or certain cardiovascular conditions.',
        contraindications: [
          'Raynaud\'s disease',
          'Cold urticaria',
          'Uncontrolled hypertension',
          'Pregnancy',
          'Severe cardiovascular disease',
        ],
        published: true,
      },
    }),

    prisma.treatment.create({
      data: {
        slug: 'iv-vitamin-therapy',
        name: 'IV Vitamin Therapy',
        aliases: ['Myers Cocktail', 'Vitamin drip', 'IV nutrient therapy'],
        category: 'IV_THERAPIES',
        description:
          'IV Vitamin Therapy delivers vitamins, minerals, and antioxidants directly into the bloodstream, bypassing digestive absorption limitations. Formulations can be customized to address specific health goals from energy enhancement to immune support.',
        howItWorks:
          'Intravenous administration achieves 100% bioavailability compared to 20-50% with oral supplements. High-dose nutrients reach cells immediately, supporting enzymatic functions, energy production, and antioxidant defenses.',
        whatItAddresses: [
          'Energy enhancement',
          'Immune support',
          'Hangover recovery',
          'Athletic performance',
          'Skin health',
          'Nutrient deficiencies',
        ],
        evidenceLevel: 'MODERATE',
        evidenceSummary:
          'Evidence supports IV therapy for documented deficiencies and certain medical conditions. Wellness applications have less rigorous evidence, though many patients report subjective improvements in energy and wellbeing.',
        typicalProtocol:
          'Sessions last 30-60 minutes. Protocols vary from single "boost" sessions to weekly treatments over several weeks. Formulations customized based on blood work and health assessment.',
        priceRangeMin: 150,
        priceRangeMax: 500,
        potentialRisks:
          'Vein irritation, bruising at injection site. Rare allergic reactions. Electrolyte imbalances with improper formulation. Should only be administered by trained medical personnel.',
        contraindications: [
          'Kidney disease',
          'Congestive heart failure',
          'Certain genetic conditions affecting mineral metabolism',
        ],
        published: true,
      },
    }),

    prisma.treatment.create({
      data: {
        slug: 'stem-cell-therapy',
        name: 'Stem Cell Therapy',
        aliases: ['Regenerative cell therapy', 'MSC therapy'],
        category: 'REGENERATIVE',
        description:
          'Stem Cell Therapy harnesses the body\'s natural regenerative potential by introducing stem cells to damaged or aging tissues. Treatments may use autologous cells (from the patient) or allogeneic cells (from donors), targeting tissue repair and regeneration.',
        howItWorks:
          'Stem cells can differentiate into various cell types and release growth factors that promote tissue repair. They modulate immune responses and reduce inflammation. Cells may be injected locally or administered systemically depending on the target.',
        whatItAddresses: [
          'Joint degeneration',
          'Soft tissue injuries',
          'Aging skin',
          'Neurological conditions',
          'Cardiovascular health',
          'Systemic aging',
        ],
        evidenceLevel: 'EXPERIMENTAL',
        evidenceSummary:
          'Promising preclinical and early clinical results for orthopedic applications. Anti-aging and systemic applications are largely experimental. Regulatory status varies significantly by country. Long-term outcomes data is limited.',
        typicalProtocol:
          'Protocols vary widely based on cell source, target condition, and facility. May involve harvesting cells from fat or bone marrow, processing, and reinjection. Some facilities use banked allogeneic cells.',
        priceRangeMin: 5000,
        priceRangeMax: 50000,
        potentialRisks:
          'Injection site reactions, infection risk, theoretical concerns about uncontrolled cell growth. Quality control varies significantly between providers. Important to verify cell sourcing and processing standards.',
        contraindications: [
          'Active cancer',
          'Active infections',
          'Blood disorders',
          'Immunocompromised states',
        ],
        published: true,
      },
    }),

    prisma.treatment.create({
      data: {
        slug: 'ozone-therapy',
        name: 'Ozone Therapy',
        aliases: ['O3 therapy', 'Medical ozone', 'Ozonotherapy'],
        category: 'CELLULAR',
        description:
          'Ozone Therapy introduces medical-grade ozone (O3) into the body through various methods including IV, rectal, or topical application. Proponents claim it improves oxygen utilization, supports immune function, and has antimicrobial properties.',
        howItWorks:
          'Ozone is believed to work through oxidative preconditioning, triggering the body\'s antioxidant defenses. It may improve red blood cell flexibility and oxygen delivery, modulate immune responses, and have direct antimicrobial effects.',
        whatItAddresses: [
          'Chronic infections',
          'Immune modulation',
          'Wound healing',
          'Circulatory issues',
          'Chronic fatigue',
          'Detoxification',
        ],
        evidenceLevel: 'TRADITIONAL',
        evidenceSummary:
          'Used for decades in European medicine. Some clinical evidence for wound healing and dental applications. Systemic applications have limited high-quality clinical trials. FDA has not approved ozone therapy for medical use in the US.',
        typicalProtocol:
          'Administration methods include Major Autohemotherapy (MAH), where blood is withdrawn, mixed with ozone, and reinfused; rectal insufflation; or topical application. Protocols typically involve 10-20 sessions.',
        priceRangeMin: 100,
        priceRangeMax: 400,
        potentialRisks:
          'Respiratory irritation if inhaled. Rare cases of air embolism with IV administration. Should only be performed by trained practitioners using medical-grade equipment.',
        contraindications: [
          'G6PD deficiency',
          'Hyperthyroidism',
          'Pregnancy',
          'Active bleeding',
        ],
        published: true,
      },
    }),

    prisma.treatment.create({
      data: {
        slug: 'colon-hydrotherapy',
        name: 'Colon Hydrotherapy',
        aliases: ['Colonic', 'Colonic irrigation', 'Colon cleansing'],
        category: 'DETOXIFICATION',
        description:
          'Colon Hydrotherapy involves gentle flushing of the colon with purified water to remove accumulated waste. Often used as part of detoxification programs, it aims to support digestive health and overall wellbeing.',
        howItWorks:
          'Warm, filtered water is introduced into the colon through a rectal tube, softening and removing waste material. The process is repeated multiple times during a session. Practitioners may add herbs or probiotics to the water.',
        whatItAddresses: [
          'Digestive issues',
          'Constipation',
          'Detoxification',
          'Bloating',
          'Preparation for other treatments',
        ],
        evidenceLevel: 'TRADITIONAL',
        evidenceSummary:
          'Limited scientific evidence for wellness benefits. Used traditionally in many cultures and as part of naturopathic practice. Some evidence for preparation before medical procedures. Not recommended as a regular practice by mainstream medicine.',
        typicalProtocol:
          'Sessions last 45-60 minutes. Often performed at the start of detox programs, sometimes in a series of 2-3 sessions. Should be performed by certified colon hydrotherapists using proper equipment.',
        priceRangeMin: 80,
        priceRangeMax: 200,
        potentialRisks:
          'Cramping, nausea, electrolyte imbalance with excessive use. Risk of perforation with improper technique. Should not be used frequently or as a weight loss method.',
        contraindications: [
          'Inflammatory bowel disease',
          'Recent colon surgery',
          'Severe hemorrhoids',
          'Heart or kidney disease',
        ],
        published: true,
      },
    }),

    prisma.treatment.create({
      data: {
        slug: 'hormone-optimization',
        name: 'Hormone Optimization Therapy',
        aliases: ['HRT', 'Bioidentical hormones', 'BHRT'],
        category: 'HORMONE',
        description:
          'Hormone Optimization Therapy involves comprehensive hormone testing followed by personalized protocols to restore hormonal balance. May include bioidentical hormones, peptides, and lifestyle modifications to address age-related hormonal decline.',
        howItWorks:
          'Detailed blood panels assess hormone levels including testosterone, estrogen, progesterone, thyroid, DHEA, cortisol, and growth hormone markers. Protocols may include bioidentical hormone replacement, peptide therapy, and supporting supplements.',
        whatItAddresses: [
          'Fatigue',
          'Weight gain',
          'Mood changes',
          'Decreased libido',
          'Cognitive decline',
          'Sleep issues',
          'Muscle loss',
        ],
        evidenceLevel: 'MODERATE',
        evidenceSummary:
          'Hormone replacement for documented deficiencies is well-established medically. Optimization for "anti-aging" purposes has more limited evidence. Benefits and risks must be weighed individually. Requires ongoing medical supervision.',
        typicalProtocol:
          'Initial comprehensive testing, followed by customized protocol. May involve testosterone, estrogen/progesterone, thyroid hormones, DHEA, or peptides. Regular monitoring every 3-6 months with protocol adjustments.',
        priceRangeMin: 500,
        priceRangeMax: 3000,
        potentialRisks:
          'Depends on specific hormones used. May include cardiovascular risks, mood changes, acne, hair changes. Requires careful medical supervision and regular monitoring.',
        contraindications: [
          'Hormone-sensitive cancers',
          'Uncontrolled cardiovascular disease',
          'Liver disease',
          'Blood clotting disorders',
        ],
        published: true,
      },
    }),

    prisma.treatment.create({
      data: {
        slug: 'neurofeedback',
        name: 'Neurofeedback Training',
        aliases: ['EEG biofeedback', 'Brain training', 'Neurotherapy'],
        category: 'MIND_NEURO',
        description:
          'Neurofeedback is a non-invasive brain training technique that uses real-time displays of brain activity to teach self-regulation of brain function. Through repeated sessions, individuals can learn to optimize brainwave patterns associated with focus, calm, and performance.',
        howItWorks:
          'EEG sensors monitor brainwave activity while the patient engages with visual or auditory feedback. When brain activity moves toward desired patterns, positive feedback is given. Over time, the brain learns to self-regulate more efficiently.',
        whatItAddresses: [
          'Stress and anxiety',
          'Focus and concentration',
          'Sleep quality',
          'Peak performance',
          'ADHD symptoms',
          'Trauma recovery',
        ],
        evidenceLevel: 'MODERATE',
        evidenceSummary:
          'Good evidence for ADHD and epilepsy. Growing evidence for anxiety, depression, and trauma. Used by elite athletes and executives for performance optimization. Requires multiple sessions for lasting benefits.',
        typicalProtocol:
          'Initial brain mapping (qEEG) to identify patterns. Training sessions last 30-45 minutes, typically 20-40 sessions for lasting change. Some facilities offer intensive protocols with multiple daily sessions.',
        priceRangeMin: 150,
        priceRangeMax: 400,
        potentialRisks:
          'Generally very safe. Some patients report temporary headache or fatigue after sessions. Rarely, incorrect protocols may worsen symptoms temporarily.',
        contraindications: ['Active seizure disorder without medical supervision'],
        published: true,
      },
    }),

    prisma.treatment.create({
      data: {
        slug: 'ayurvedic-panchakarma',
        name: 'Ayurvedic Panchakarma',
        aliases: ['Panchakarma', 'Ayurvedic detox'],
        category: 'TRADITIONAL',
        description:
          'Panchakarma is a comprehensive Ayurvedic cleansing and rejuvenation program involving five therapeutic procedures. This ancient system aims to remove toxins (ama) from the body and restore balance to the doshas (constitutional types).',
        howItWorks:
          'The program includes preparatory treatments (oil massage, steam therapy) followed by cleansing procedures including therapeutic vomiting, purgation, enema, nasal treatment, and blood purification. Treatment is customized based on individual constitution.',
        whatItAddresses: [
          'Digestive issues',
          'Chronic stress',
          'Skin conditions',
          'Joint problems',
          'General detoxification',
          'Constitutional imbalance',
        ],
        evidenceLevel: 'TRADITIONAL',
        evidenceSummary:
          'Based on 5,000+ years of Ayurvedic tradition. Limited modern clinical research, though some studies show benefits for specific conditions. Widely practiced in India with significant experiential evidence. Quality varies significantly between practitioners.',
        typicalProtocol:
          'Minimum 7 days, traditionally 21-28 days for full protocol. Begins with consultation and constitution assessment. Includes daily treatments, specific diet, herbal preparations, and lifestyle guidance.',
        priceRangeMin: 200,
        priceRangeMax: 800,
        potentialRisks:
          'Some procedures can be intense or uncomfortable. Dehydration risk with purification therapies. Should only be done under qualified Ayurvedic supervision. Some herbal preparations may interact with medications.',
        contraindications: [
          'Pregnancy',
          'Severe weakness',
          'Acute fever or infection',
          'Certain chronic conditions',
        ],
        published: true,
      },
    }),

    prisma.treatment.create({
      data: {
        slug: 'plasmapheresis',
        name: 'Therapeutic Plasmapheresis',
        aliases: ['Plasma exchange', 'TPE'],
        category: 'REGENERATIVE',
        description:
          'Therapeutic Plasmapheresis removes blood plasma and replaces it with donor plasma or albumin solution. In longevity medicine, it is being explored for removing inflammatory factors and potentially rejuvenating effects, though this application is experimental.',
        howItWorks:
          'Blood is withdrawn, separated into components, and plasma is removed. The blood cells are returned with replacement fluid. This removes circulating proteins, antibodies, and inflammatory factors. The body regenerates new plasma.',
        whatItAddresses: [
          'Autoimmune conditions',
          'Chronic inflammation',
          'Experimental anti-aging',
          'Neurological conditions',
        ],
        evidenceLevel: 'EXPERIMENTAL',
        evidenceSummary:
          'Well-established for certain autoimmune and neurological conditions (FDA-approved indications). Anti-aging applications are highly experimental, based on parabiosis research in mice. Human longevity benefits not yet proven.',
        typicalProtocol:
          'Medical evaluation and blood work required. Sessions last 2-3 hours. Protocols vary from single session to series of treatments. Requires specialized medical facility and trained personnel.',
        priceRangeMin: 2000,
        priceRangeMax: 8000,
        potentialRisks:
          'Allergic reactions to replacement fluids, infection risk, electrolyte imbalances, bleeding complications. Should only be performed at properly equipped medical facilities.',
        contraindications: [
          'Active systemic infection',
          'Severe cardiovascular instability',
          'Certain blood disorders',
        ],
        published: true,
      },
    }),
  ]);

  console.log(`Created ${treatments.length} treatments`);

  // ============================================
  // DIAGNOSTICS
  // ============================================
  console.log('🔬 Creating diagnostics...');

  const diagnostics = await Promise.all([
    prisma.diagnostic.create({
      data: {
        slug: 'full-body-mri',
        name: 'Full Body MRI Screening',
        category: 'IMAGING',
        description:
          'Comprehensive magnetic resonance imaging scan of the entire body to detect abnormalities, tumors, aneurysms, and other conditions at early stages before symptoms appear.',
        whatItMeasures:
          'Evaluates all major organs, blood vessels, joints, and soft tissues. Can detect tumors as small as a few millimeters, aneurysms, inflammation, and structural abnormalities throughout the body.',
        published: true,
      },
    }),

    prisma.diagnostic.create({
      data: {
        slug: 'comprehensive-blood-panel',
        name: 'Comprehensive Metabolic & Biomarker Panel',
        category: 'BIOMARKERS',
        description:
          'Extensive blood testing covering metabolic function, organ health, hormones, inflammation markers, vitamins, minerals, and advanced biomarkers associated with aging and disease risk.',
        whatItMeasures:
          'Complete blood count, comprehensive metabolic panel, lipid panel, thyroid function, hormone levels (testosterone, estrogen, cortisol, DHEA), inflammation markers (CRP, homocysteine), vitamins (D, B12), HbA1c, insulin, and advanced markers.',
        published: true,
      },
    }),

    prisma.diagnostic.create({
      data: {
        slug: 'genetic-testing',
        name: 'Whole Genome Sequencing & Analysis',
        category: 'GENETIC',
        description:
          'Complete sequencing of the genome with analysis of disease risk variants, drug metabolism genes, and actionable genetic factors that can inform personalized health strategies.',
        whatItMeasures:
          'Disease risk variants, pharmacogenomic markers affecting drug response, carrier status for hereditary conditions, ancestry information, and traits. Analysis focuses on clinically actionable findings.',
        published: true,
      },
    }),

    prisma.diagnostic.create({
      data: {
        slug: 'gut-microbiome-analysis',
        name: 'Comprehensive Gut Microbiome Analysis',
        category: 'MICROBIOME',
        description:
          'Advanced metagenomic sequencing of the gut microbiome to assess bacterial diversity, beneficial and pathogenic species, metabolic functions, and correlations with health conditions.',
        whatItMeasures:
          'Bacterial species diversity and abundance, presence of pathogens, beneficial bacteria levels, short-chain fatty acid producers, and functional pathways. Includes personalized diet and probiotic recommendations.',
        published: true,
      },
    }),

    prisma.diagnostic.create({
      data: {
        slug: 'coronary-calcium-score',
        name: 'Coronary Artery Calcium Scoring (CT)',
        category: 'CARDIOVASCULAR',
        description:
          'CT scan of the heart measuring calcium deposits in coronary arteries, providing a direct measure of atherosclerosis and cardiovascular disease risk.',
        whatItMeasures:
          'Agatston score quantifying calcium buildup in coronary arteries. Higher scores correlate with increased risk of heart attack and cardiovascular events over 10 years.',
        published: true,
      },
    }),
  ]);

  console.log(`Created ${diagnostics.length} diagnostics`);

  // ============================================
  // EQUIPMENT
  // ============================================
  console.log('🏥 Creating equipment...');

  const equipment = await Promise.all([
    prisma.equipment.create({
      data: {
        slug: 'prenuvo-mri',
        name: 'Prenuvo Full Body MRI System',
        brand: 'Prenuvo',
        model: 'Advanced 3T',
        category: 'MRI',
        description:
          'Advanced 3 Tesla MRI system optimized for preventive full-body screening with proprietary protocols designed to detect early-stage cancer, aneurysms, and other conditions.',
        capabilities: [
          'Full body scan in under 60 minutes',
          'Detection of tumors as small as 2mm',
          'Aneurysm screening',
          'Organ assessment',
          'Spine and joint imaging',
        ],
      },
    }),

    prisma.equipment.create({
      data: {
        slug: 'hyperbaric-multiplace',
        name: 'Multi-Place Hyperbaric Chamber',
        brand: 'Sechrist',
        model: '3600H',
        category: 'HYPERBARIC',
        description:
          'Medical-grade multi-place hyperbaric chamber capable of treating multiple patients simultaneously at pressures up to 3 ATA with precise oxygen delivery.',
        capabilities: [
          'Pressures up to 3 ATA',
          'Multiple patient capacity',
          'Medical-grade oxygen delivery',
          'Emergency protocols',
          'Full physician supervision',
        ],
      },
    }),

    prisma.equipment.create({
      data: {
        slug: 'cryotherapy-chamber',
        name: 'Whole Body Cryotherapy Chamber',
        brand: 'JUKA',
        model: 'Arctic Pro',
        category: 'CRYOTHERAPY',
        description:
          'Electric whole body cryotherapy chamber reaching temperatures of -140°C for systemic cold exposure therapy without liquid nitrogen.',
        capabilities: [
          'Temperatures to -140°C',
          'Nitrogen-free electric cooling',
          'Full body exposure',
          'Precise temperature control',
          'Safety monitoring systems',
        ],
      },
    }),
  ]);

  console.log(`Created ${equipment.length} equipment items`);

  // ============================================
  // PROPERTIES
  // ============================================
  console.log('🏨 Creating properties...');

  // TIER 1: Medical Longevity
  const cliniqueLP = await prisma.property.create({
    data: {
      slug: 'clinique-la-prairie',
      name: 'Clinique La Prairie',
      description:
        'Founded in 1931, Clinique La Prairie is the birthplace of cellular therapy and remains at the forefront of longevity medicine. The Swiss medical clinic combines cutting-edge diagnostics with regenerative treatments, offering comprehensive programs that address aging at the cellular level. Their signature Revitalisation program has attracted royalty, business leaders, and celebrities for nearly a century.',
      city: 'Montreux',
      country: 'Switzerland',
      region: 'Vaud',
      latitude: 46.4312,
      longitude: 6.9107,
      nearestAirport: 'Geneva International Airport (GVA)',
      transferTime: '1 hour by car',
      tier: 'TIER_1',
      approach: 'CLINICAL',
      focusAreas: ['LONGEVITY', 'MEDICAL_ASSESSMENT', 'COGNITIVE_BRAIN', 'BEAUTY_AESTHETIC'],
      priceMin: 25000,
      priceMax: 150000,
      currency: 'CHF',
      website: 'https://www.cliniquelaprairie.com',
      foundedYear: 1931,
      capacity: 38,
      accommodationType: 'Private suites with lake views',
      setting: 'Lakeside',
      overallScore: 94,
      clinicalRigorScore: 96,
      outcomeEvidenceScore: 92,
      programDepthScore: 95,
      experienceQualityScore: 93,
      valueAlignmentScore: 88,
      physicianPatientRatio: '1:3',
      avgBookingLeadTime: '8-12 weeks',
      returnGuestPercentage: 72,
      staffTenure: 'Average 12 years',
      actualCustomization:
        'Programs are highly individualized based on comprehensive initial assessment. Each guest has a dedicated medical team that adjusts protocols based on daily monitoring and feedback.',
      postVisitFollowup:
        'Dedicated follow-up consultations at 30, 90, and 180 days. Annual biomarker tracking. 24/7 access to medical concierge for ongoing questions.',
      discretionLevel: 'ULTRA_HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Halal available', 'Kosher available', 'Vegan', 'Gluten-free'],
      privacyArchitecture: 'Private suites with dedicated entrances',
      prayerFacilities: 'Quiet meditation rooms available',
      languagesMedical: ['English', 'French', 'German', 'Italian', 'Russian', 'Arabic', 'Mandarin'],
      languagesService: [
        'English',
        'French',
        'German',
        'Italian',
        'Russian',
        'Arabic',
        'Mandarin',
        'Japanese',
      ],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'AFFILIATE',
      published: true,
      featured: true,
      editorChoice: 'Best for Comprehensive Longevity Assessment',
      verifiedExcellence: true,
    },
  });

  await prisma.tierOneDetails.create({
    data: {
      propertyId: cliniqueLP.id,
      medicalDirector: 'Prof. Dr. med. Olivier Courtin-Clarins',
      medicalDirectorCreds:
        'MD, PhD in Cellular Biology, 25+ years in regenerative medicine',
      medicalTeamSize: 18,
      certifications: ['Swiss Medical Facility License', 'ISO 9001:2015'],
      hospitalAffiliations: ['Centre Hospitalier Universitaire Vaudois'],
      researchPublications: [
        'Cellular therapy outcomes: A 20-year retrospective study',
        'Biomarkers of aging: Predictive factors for longevity interventions',
      ],
    },
  });

  // TIER 1: Medical Longevity #2
  const lanserhof = await prisma.property.create({
    data: {
      slug: 'lanserhof-tegernsee',
      name: 'Lanserhof Tegernsee',
      description:
        'Lanserhof Tegernsee represents the pinnacle of German medical wellness, combining the LANS Med Concept with state-of-the-art diagnostics in a stunning architectural setting. The facility is renowned for its comprehensive approach to gut health, metabolic optimization, and stress recovery, utilizing both modern medicine and traditional Mayr therapy principles.',
      city: 'Tegernsee',
      country: 'Germany',
      region: 'Bavaria',
      latitude: 47.7031,
      longitude: 11.7437,
      nearestAirport: 'Munich International Airport (MUC)',
      transferTime: '1 hour by car',
      tier: 'TIER_1',
      approach: 'INTEGRATIVE',
      focusAreas: ['DETOX', 'WEIGHT_METABOLIC', 'STRESS_BURNOUT', 'MEDICAL_ASSESSMENT'],
      priceMin: 8000,
      priceMax: 35000,
      currency: 'EUR',
      website: 'https://www.lanserhof.com',
      foundedYear: 2013,
      capacity: 70,
      accommodationType: 'Luxury suites with Alpine views',
      setting: 'Alpine lakeside',
      overallScore: 92,
      clinicalRigorScore: 94,
      outcomeEvidenceScore: 90,
      programDepthScore: 93,
      experienceQualityScore: 91,
      valueAlignmentScore: 90,
      physicianPatientRatio: '1:4',
      avgBookingLeadTime: '4-6 weeks',
      returnGuestPercentage: 64,
      staffTenure: 'Average 8 years',
      actualCustomization:
        'Initial comprehensive assessment determines personalized protocol. Daily doctor consultations adjust treatments based on progress. Nutrition plan created by dedicated team.',
      postVisitFollowup:
        'Detailed report with ongoing recommendations. Follow-up consultation at 6 weeks. Annual program discount for returning guests.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Lactose-free'],
      privacyArchitecture: 'Private suites with separate entrance options',
      prayerFacilities: 'Quiet spaces for meditation',
      languagesMedical: ['German', 'English'],
      languagesService: ['German', 'English', 'French', 'Italian'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'LEAD_GEN',
      published: true,
      featured: true,
      verifiedExcellence: true,
    },
  });

  await prisma.tierOneDetails.create({
    data: {
      propertyId: lanserhof.id,
      medicalDirector: 'Dr. med. Jan Stritzke',
      medicalDirectorCreds: 'MD, Specialist in Internal Medicine, Mayr Physician',
      medicalTeamSize: 12,
      certifications: ['German Medical Facility License', 'TÜV Certified'],
      hospitalAffiliations: ['Klinikum rechts der Isar'],
      researchPublications: [
        'Metabolic effects of Mayr therapy: A clinical study',
      ],
    },
  });

  // TIER 2: Integrated Wellness
  const chivaSom = await prisma.property.create({
    data: {
      slug: 'chiva-som',
      name: 'Chiva-Som International Health Resort',
      description:
        'A pioneer in destination wellness since 1995, Chiva-Som seamlessly blends Eastern healing traditions with Western medical science. Set on the Gulf of Thailand, the resort offers over 200 treatments and seven wellness modalities, from physiotherapy to holistic healing, all supported by comprehensive health assessments.',
      city: 'Hua Hin',
      country: 'Thailand',
      region: 'Prachuap Khiri Khan',
      latitude: 12.5684,
      longitude: 99.9577,
      nearestAirport: 'Suvarnabhumi Airport Bangkok (BKK)',
      transferTime: '3 hours by car or 30 minutes by helicopter',
      tier: 'TIER_2',
      approach: 'INTEGRATIVE',
      focusAreas: [
        'STRESS_BURNOUT',
        'WEIGHT_METABOLIC',
        'FITNESS_PERFORMANCE',
        'HOLISTIC_SPIRITUAL',
        'SLEEP',
      ],
      priceMin: 5000,
      priceMax: 25000,
      currency: 'USD',
      website: 'https://www.chivasom.com',
      foundedYear: 1995,
      capacity: 57,
      accommodationType: 'Thai-style pavilions and suites',
      setting: 'Beachfront',
      overallScore: 89,
      outcomeEvidenceScore: 86,
      programDepthScore: 91,
      experienceQualityScore: 92,
      valueAlignmentScore: 87,
      physicianPatientRatio: '1:8',
      avgBookingLeadTime: '6-8 weeks',
      returnGuestPercentage: 58,
      staffTenure: 'Average 10 years',
      actualCustomization:
        'Health consultation determines retreat focus. Treatments selected from menu to address specific goals. Adjustments made throughout stay based on feedback.',
      postVisitFollowup:
        'Wellness report with recommendations. Optional remote consultations available. Alumni newsletter with health tips.',
      discretionLevel: 'HIGH',
      genderSeparatedFacilities: 'PARTIAL',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Halal available', 'Gluten-free'],
      privacyArchitecture: 'Private pavilions throughout resort',
      prayerFacilities: 'Buddhist meditation temple on grounds',
      languagesMedical: ['English', 'Thai'],
      languagesService: ['English', 'Thai', 'German', 'French', 'Japanese', 'Mandarin'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'AFFILIATE',
      published: true,
      featured: true,
    },
  });

  // TIER 2: Integrated Wellness #2
  const kamalaya = await prisma.property.create({
    data: {
      slug: 'kamalaya-koh-samui',
      name: 'Kamalaya Koh Samui',
      description:
        'Set around a cave once used by Buddhist monks for meditation, Kamalaya is an award-winning wellness sanctuary combining ancient healing traditions with modern science. The holistic approach integrates Asian healing arts, detox therapies, and life-enhancement programs in a serene tropical setting.',
      city: 'Koh Samui',
      country: 'Thailand',
      region: 'Surat Thani',
      latitude: 9.4286,
      longitude: 100.0414,
      nearestAirport: 'Samui International Airport (USM)',
      transferTime: '25 minutes by car',
      tier: 'TIER_2',
      approach: 'HOLISTIC',
      focusAreas: [
        'STRESS_BURNOUT',
        'DETOX',
        'HOLISTIC_SPIRITUAL',
        'SLEEP',
        'GENERAL_REJUVENATION',
      ],
      priceMin: 3500,
      priceMax: 15000,
      currency: 'USD',
      website: 'https://www.kamalaya.com',
      foundedYear: 2005,
      capacity: 75,
      accommodationType: 'Hillside suites and villas',
      setting: 'Tropical hillside with sea views',
      overallScore: 87,
      outcomeEvidenceScore: 83,
      programDepthScore: 88,
      experienceQualityScore: 90,
      valueAlignmentScore: 89,
      physicianPatientRatio: '1:10',
      avgBookingLeadTime: '4-6 weeks',
      returnGuestPercentage: 52,
      staffTenure: 'Average 7 years',
      actualCustomization:
        'Wellness consultation shapes program focus. Treatment schedule built around personal goals. Regular check-ins to adjust approach.',
      postVisitFollowup:
        'Post-retreat recommendations. Online wellness resources for alumni. Special return guest rates.',
      discretionLevel: 'STANDARD',
      genderSeparatedFacilities: 'NONE',
      religiousDietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Raw food options'],
      privacyArchitecture: 'Secluded hillside villas',
      prayerFacilities: 'Buddhist cave shrine, meditation sala',
      languagesMedical: ['English', 'Thai'],
      languagesService: ['English', 'Thai', 'German', 'French'],
      soloTravelerFriendly: 'OPTIMIZED',
      lgbtqWelcoming: 'WELCOMING',
      partnershipStatus: 'LEAD_GEN',
      published: true,
    },
  });

  // TIER 3: Luxury Destination
  const amanpuri = await prisma.property.create({
    data: {
      slug: 'amanpuri-phuket',
      name: 'Amanpuri',
      description:
        'The original Aman resort, Amanpuri set the standard for luxury wellness hospitality when it opened in 1988. Set on a private coconut plantation overlooking the Andaman Sea, the resort offers comprehensive Aman Wellness programs combining Thai healing traditions with modern wellness science in an atmosphere of refined tranquility.',
      city: 'Phuket',
      country: 'Thailand',
      region: 'Phuket',
      latitude: 7.9756,
      longitude: 98.2796,
      nearestAirport: 'Phuket International Airport (HKT)',
      transferTime: '25 minutes by car',
      tier: 'TIER_3',
      approach: 'LIFESTYLE',
      focusAreas: ['GENERAL_REJUVENATION', 'STRESS_BURNOUT', 'FITNESS_PERFORMANCE', 'BEAUTY_AESTHETIC'],
      priceMin: 3000,
      priceMax: 12000,
      currency: 'USD',
      website: 'https://www.aman.com/resorts/amanpuri',
      foundedYear: 1988,
      capacity: 40,
      accommodationType: 'Private pavilions and villas',
      setting: 'Beachfront on private peninsula',
      overallScore: 85,
      experienceQualityScore: 95,
      programDepthScore: 80,
      valueAlignmentScore: 82,
      avgBookingLeadTime: '4-8 weeks',
      returnGuestPercentage: 68,
      staffTenure: 'Average 9 years',
      actualCustomization:
        'Wellness consultation available. Treatments a la carte or in program packages. Personal preferences noted and remembered for returning guests.',
      postVisitFollowup:
        'Aman guest recognition across all properties. Occasional wellness newsletters.',
      discretionLevel: 'ULTRA_HIGH',
      genderSeparatedFacilities: 'ON_REQUEST',
      religiousDietaryOptions: ['Halal available', 'Kosher available', 'Vegetarian', 'Vegan'],
      privacyArchitecture: 'Completely private pavilions with dedicated staff',
      prayerFacilities: 'Arranged upon request',
      languagesMedical: ['English', 'Thai'],
      languagesService: [
        'English',
        'Thai',
        'German',
        'French',
        'Russian',
        'Mandarin',
        'Japanese',
        'Arabic',
      ],
      soloTravelerFriendly: 'GOOD',
      lgbtqWelcoming: 'EXPLICITLY_WELCOMING',
      partnershipStatus: 'CONTACTED',
      published: true,
      featured: false,
    },
  });

  const properties = [cliniqueLP, lanserhof, chivaSom, kamalaya, amanpuri];
  console.log(`Created ${properties.length} properties`);

  // ============================================
  // PROGRAMS
  // ============================================
  console.log('📋 Creating programs...');

  await Promise.all([
    prisma.program.create({
      data: {
        propertyId: cliniqueLP.id,
        name: 'Revitalisation Program',
        description:
          'The signature Clinique La Prairie experience, this comprehensive program combines advanced diagnostics, cellular therapy, and personalized wellness protocols to address aging at the cellular level. Includes full medical assessment, bespoke treatment plan, and ongoing follow-up.',
        durationDays: 7,
        price: 35000,
        currency: 'CHF',
        focusAreas: ['LONGEVITY', 'MEDICAL_ASSESSMENT'],
        inclusions: [
          'Comprehensive medical assessment',
          'Cellular therapy protocol',
          'Daily treatments',
          'Nutrition consultation',
          'Accommodation in private suite',
          'All meals',
          'Airport transfers',
          '6-month follow-up',
        ],
        exclusions: ['International flights', 'Personal expenses'],
        typicalSchedule:
          'Day 1: Arrival, initial consultation. Days 2-3: Diagnostic testing. Days 4-6: Treatment protocols and wellness activities. Day 7: Results review and departure planning.',
        published: true,
      },
    }),

    prisma.program.create({
      data: {
        propertyId: lanserhof.id,
        name: 'LANS Med Basic',
        description:
          'Foundation program combining Mayr therapy principles with modern diagnostics. Focuses on gut health restoration, metabolic optimization, and stress recovery through medical supervision, therapeutic fasting, and comprehensive treatments.',
        durationDays: 10,
        price: 12000,
        currency: 'EUR',
        focusAreas: ['DETOX', 'WEIGHT_METABOLIC', 'STRESS_BURNOUT'],
        inclusions: [
          'Medical consultation',
          'Mayr therapy',
          'Daily treatments',
          'Accommodation',
          'Mayr cuisine',
          'Use of facilities',
        ],
        exclusions: ['Additional specialist consultations', 'Some advanced treatments'],
        typicalSchedule:
          'Daily: Morning consultation, Mayr meals, afternoon treatments, evening relaxation. Weekly: Medical review and protocol adjustment.',
        published: true,
      },
    }),

    prisma.program.create({
      data: {
        propertyId: chivaSom.id,
        name: 'Optimal Performance',
        description:
          'Comprehensive program for executives and high-performers seeking to optimize physical and mental performance. Combines fitness assessment, nutrition analysis, stress management, and targeted treatments.',
        durationDays: 7,
        price: 8500,
        currency: 'USD',
        focusAreas: ['FITNESS_PERFORMANCE', 'STRESS_BURNOUT', 'SLEEP'],
        inclusions: [
          'Health consultation',
          'Fitness assessment',
          'Daily treatments',
          'Personal training sessions',
          'Nutrition consultation',
          'Accommodation',
          'Healthy cuisine',
        ],
        exclusions: ['Airport transfers', 'Additional treatments'],
        typicalSchedule:
          'Morning: Exercise and movement. Midday: Spa treatments. Afternoon: Wellness activities. Evening: Relaxation and healthy dining.',
        published: true,
      },
    }),
  ]);

  console.log('Created programs');

  // ============================================
  // LINK TREATMENTS TO PROPERTIES
  // ============================================
  console.log('🔗 Linking treatments to properties...');

  const treatmentMap = new Map(treatments.map((t) => [t.slug, t]));

  await Promise.all([
    // Clinique La Prairie treatments
    prisma.propertyTreatment.create({
      data: {
        propertyId: cliniqueLP.id,
        treatmentId: treatmentMap.get('nad-iv-therapy')!.id,
        priceAtProperty: 800,
        notes: 'Part of cellular therapy protocols',
      },
    }),
    prisma.propertyTreatment.create({
      data: {
        propertyId: cliniqueLP.id,
        treatmentId: treatmentMap.get('stem-cell-therapy')!.id,
        priceAtProperty: 25000,
        notes: 'Signature CLP cellular therapy',
      },
    }),
    prisma.propertyTreatment.create({
      data: {
        propertyId: cliniqueLP.id,
        treatmentId: treatmentMap.get('iv-vitamin-therapy')!.id,
        priceAtProperty: 400,
      },
    }),
    prisma.propertyTreatment.create({
      data: {
        propertyId: cliniqueLP.id,
        treatmentId: treatmentMap.get('hormone-optimization')!.id,
        priceAtProperty: 2500,
      },
    }),

    // Lanserhof treatments
    prisma.propertyTreatment.create({
      data: {
        propertyId: lanserhof.id,
        treatmentId: treatmentMap.get('colon-hydrotherapy')!.id,
        priceAtProperty: 120,
        notes: 'Integral to Mayr protocol',
      },
    }),
    prisma.propertyTreatment.create({
      data: {
        propertyId: lanserhof.id,
        treatmentId: treatmentMap.get('iv-vitamin-therapy')!.id,
        priceAtProperty: 250,
      },
    }),
    prisma.propertyTreatment.create({
      data: {
        propertyId: lanserhof.id,
        treatmentId: treatmentMap.get('hyperbaric-oxygen-therapy')!.id,
        priceAtProperty: 180,
      },
    }),

    // Chiva-Som treatments
    prisma.propertyTreatment.create({
      data: {
        propertyId: chivaSom.id,
        treatmentId: treatmentMap.get('colon-hydrotherapy')!.id,
        priceAtProperty: 90,
      },
    }),
    prisma.propertyTreatment.create({
      data: {
        propertyId: chivaSom.id,
        treatmentId: treatmentMap.get('whole-body-cryotherapy')!.id,
        priceAtProperty: 80,
      },
    }),
    prisma.propertyTreatment.create({
      data: {
        propertyId: chivaSom.id,
        treatmentId: treatmentMap.get('iv-vitamin-therapy')!.id,
        priceAtProperty: 200,
      },
    }),
    prisma.propertyTreatment.create({
      data: {
        propertyId: chivaSom.id,
        treatmentId: treatmentMap.get('neurofeedback')!.id,
        priceAtProperty: 180,
      },
    }),

    // Kamalaya treatments
    prisma.propertyTreatment.create({
      data: {
        propertyId: kamalaya.id,
        treatmentId: treatmentMap.get('ayurvedic-panchakarma')!.id,
        priceAtProperty: 350,
        notes: 'Signature treatment, highly recommended',
      },
    }),
    prisma.propertyTreatment.create({
      data: {
        propertyId: kamalaya.id,
        treatmentId: treatmentMap.get('colon-hydrotherapy')!.id,
        priceAtProperty: 85,
      },
    }),

    // Amanpuri treatments
    prisma.propertyTreatment.create({
      data: {
        propertyId: amanpuri.id,
        treatmentId: treatmentMap.get('iv-vitamin-therapy')!.id,
        priceAtProperty: 350,
      },
    }),
  ]);

  console.log('Linked treatments to properties');

  // ============================================
  // LINK DIAGNOSTICS TO PROPERTIES
  // ============================================
  console.log('🔗 Linking diagnostics to properties...');

  const diagnosticMap = new Map(diagnostics.map((d) => [d.slug, d]));

  await Promise.all([
    prisma.propertyDiagnostic.create({
      data: {
        propertyId: cliniqueLP.id,
        diagnosticId: diagnosticMap.get('full-body-mri')!.id,
        notes: 'Part of comprehensive assessment',
      },
    }),
    prisma.propertyDiagnostic.create({
      data: {
        propertyId: cliniqueLP.id,
        diagnosticId: diagnosticMap.get('comprehensive-blood-panel')!.id,
      },
    }),
    prisma.propertyDiagnostic.create({
      data: {
        propertyId: cliniqueLP.id,
        diagnosticId: diagnosticMap.get('genetic-testing')!.id,
      },
    }),
    prisma.propertyDiagnostic.create({
      data: {
        propertyId: cliniqueLP.id,
        diagnosticId: diagnosticMap.get('coronary-calcium-score')!.id,
      },
    }),
    prisma.propertyDiagnostic.create({
      data: {
        propertyId: lanserhof.id,
        diagnosticId: diagnosticMap.get('comprehensive-blood-panel')!.id,
      },
    }),
    prisma.propertyDiagnostic.create({
      data: {
        propertyId: lanserhof.id,
        diagnosticId: diagnosticMap.get('gut-microbiome-analysis')!.id,
        notes: 'Core to Mayr approach',
      },
    }),
    prisma.propertyDiagnostic.create({
      data: {
        propertyId: chivaSom.id,
        diagnosticId: diagnosticMap.get('comprehensive-blood-panel')!.id,
      },
    }),
  ]);

  console.log('Linked diagnostics to properties');

  // ============================================
  // LINK EQUIPMENT TO TREATMENTS & PROPERTIES
  // ============================================
  console.log('🔗 Linking equipment...');

  const equipmentMap = new Map(equipment.map((e) => [e.slug, e]));

  await Promise.all([
    // Treatment-Equipment links
    prisma.treatmentEquipment.create({
      data: {
        treatmentId: treatmentMap.get('hyperbaric-oxygen-therapy')!.id,
        equipmentId: equipmentMap.get('hyperbaric-multiplace')!.id,
      },
    }),
    prisma.treatmentEquipment.create({
      data: {
        treatmentId: treatmentMap.get('whole-body-cryotherapy')!.id,
        equipmentId: equipmentMap.get('cryotherapy-chamber')!.id,
      },
    }),

    // Property-Equipment links
    prisma.propertyEquipment.create({
      data: {
        propertyId: cliniqueLP.id,
        equipmentId: equipmentMap.get('prenuvo-mri')!.id,
        installationYear: 2022,
      },
    }),
    prisma.propertyEquipment.create({
      data: {
        propertyId: lanserhof.id,
        equipmentId: equipmentMap.get('hyperbaric-multiplace')!.id,
        installationYear: 2018,
      },
    }),
    prisma.propertyEquipment.create({
      data: {
        propertyId: chivaSom.id,
        equipmentId: equipmentMap.get('cryotherapy-chamber')!.id,
        installationYear: 2020,
      },
    }),
  ]);

  console.log('Linked equipment');

  // ============================================
  // CLARUS INDEX SCORES
  // ============================================
  console.log('📊 Creating Clarus Index scores...');

  await Promise.all([
    prisma.clarusIndexScore.create({
      data: {
        propertyId: cliniqueLP.id,
        overallScore: 94,
        tier: 'EXCEPTIONAL',
        dimensions: {
          clinicalRigor: 96,
          outcomeEvidence: 92,
          programDepth: 95,
          experienceQuality: 93,
          valueAlignment: 88,
        },
        assessmentDate: new Date('2024-09-15'),
        assessedBy: 'Dr. Sarah Chen',
        methodology: 'v1.0',
      },
    }),
    prisma.clarusIndexScore.create({
      data: {
        propertyId: lanserhof.id,
        overallScore: 92,
        tier: 'EXCEPTIONAL',
        dimensions: {
          clinicalRigor: 94,
          outcomeEvidence: 90,
          programDepth: 93,
          experienceQuality: 91,
          valueAlignment: 90,
        },
        assessmentDate: new Date('2024-08-20'),
        assessedBy: 'James Worthington',
        methodology: 'v1.0',
      },
    }),
    prisma.clarusIndexScore.create({
      data: {
        propertyId: chivaSom.id,
        overallScore: 89,
        tier: 'DISTINGUISHED',
        dimensions: {
          programEffectiveness: 86,
          holisticIntegration: 88,
          practitionerQuality: 87,
          experienceQuality: 92,
          valueAlignment: 87,
        },
        assessmentDate: new Date('2024-07-10'),
        assessedBy: 'James Worthington',
        methodology: 'v1.0',
      },
    }),
    prisma.clarusIndexScore.create({
      data: {
        propertyId: kamalaya.id,
        overallScore: 87,
        tier: 'DISTINGUISHED',
        dimensions: {
          programEffectiveness: 83,
          holisticIntegration: 90,
          practitionerQuality: 86,
          experienceQuality: 90,
          valueAlignment: 89,
        },
        assessmentDate: new Date('2024-06-25'),
        assessedBy: 'Dr. Sarah Chen',
        methodology: 'v1.0',
      },
    }),
    prisma.clarusIndexScore.create({
      data: {
        propertyId: amanpuri.id,
        overallScore: 85,
        tier: 'DISTINGUISHED',
        dimensions: {
          experienceQuality: 95,
          wellnessOfferingDepth: 82,
          transformativePotential: 80,
          settingEnvironment: 94,
          valueAlignment: 82,
        },
        assessmentDate: new Date('2024-05-15'),
        assessedBy: 'James Worthington',
        methodology: 'v1.0',
      },
    }),
  ]);

  console.log('Created Clarus Index scores');

  // ============================================
  // SAMPLE REVIEW
  // ============================================
  console.log('⭐ Creating sample review...');

  await prisma.review.create({
    data: {
      propertyId: cliniqueLP.id,
      isTeamReview: true,
      teamMemberId: drSarahChen.id,
      reviewerName: 'Dr. Sarah Chen',
      visitDate: new Date('2024-06-15'),
      programType: 'Revitalisation Program',
      stayLengthDays: 7,
      statedGoals: ['Comprehensive health assessment', 'Cellular rejuvenation', 'Longevity optimization'],
      overallRating: 5,
      serviceRating: 5,
      facilitiesRating: 5,
      diningRating: 4,
      valueRating: 4,
      goalAchievement: 'FULLY',
      protocolQualityRating: 5,
      followupQualityRating: 5,
      physicianEndorsement: 'YES',
      bioAgeChange: -3,
      energyImprovement: 8,
      sleepImprovement: 7,
      specificOutcomes:
        'Comprehensive biomarker panel showed significant improvements in inflammatory markers, lipid profile, and hormone levels at 90-day follow-up.',
      reviewText:
        'Clinique La Prairie delivers on its reputation as the gold standard in medical longevity. The depth of diagnostic assessment rivals any academic medical center, while the integration of cellular therapy protocols is unmatched. The medical team demonstrated exceptional expertise, with my dedicated physician available throughout the stay. The facility itself is understated luxury—not flashy, but every detail considered. The 64% return guest rate makes sense: this is the kind of experience that creates lifelong relationships.',
      pros: [
        'Unparalleled diagnostic depth',
        'World-class medical team',
        'Exceptional personalization',
        'Robust follow-up program',
        'Complete discretion',
      ],
      cons: [
        'Premium pricing limits accessibility',
        'Some treatments feel dated despite proven efficacy',
        'Lake Geneva weather can be variable',
      ],
      verified: true,
      verificationMethod: 'team_visit',
      status: 'APPROVED',
      helpfulCount: 47,
    },
  });

  console.log('Created sample review');

  // Update team member property visits
  await prisma.teamMember.update({
    where: { id: drSarahChen.id },
    data: {
      propertiesVisited: [cliniqueLP.id, lanserhof.id, kamalaya.id],
    },
  });

  await prisma.teamMember.update({
    where: { id: jamesWorthington.id },
    data: {
      propertiesVisited: [cliniqueLP.id, lanserhof.id, chivaSom.id, amanpuri.id],
    },
  });

  // ============================================
  // ADDITIONAL SEED DATA
  // ============================================
  console.log('📦 Adding extended seed data...');

  const additionalTreatments = await seedAdditionalTreatments();
  const additionalDiagnostics = await seedAdditionalDiagnostics();
  const additionalEquipment = await seedAdditionalEquipment();

  const totalTreatments = treatments.length + additionalTreatments.length;
  const totalDiagnostics = diagnostics.length + additionalDiagnostics.length;
  const totalEquipment = equipment.length + additionalEquipment.length;

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('Summary:');
  console.log(`  - ${properties.length} properties (Tier 1: 2, Tier 2: 2, Tier 3: 1)`);
  console.log(`  - ${totalTreatments} treatments`);
  console.log(`  - ${totalDiagnostics} diagnostics`);
  console.log(`  - ${totalEquipment} equipment items`);
  console.log('  - 2 team members');
  console.log('  - 3 programs');
  console.log('  - 5 Clarus Index scores');
  console.log('  - 1 verified team review');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
