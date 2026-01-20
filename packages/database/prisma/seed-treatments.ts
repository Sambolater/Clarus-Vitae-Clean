/**
 * Extended Seed Data for Treatments, Diagnostics, and Equipment
 *
 * This module exports additional seed data to supplement the main seed.
 * Run with: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedAdditionalTreatments() {
  console.log('💉 Adding additional treatments...');

  const additionalTreatments = await Promise.all([
    // PRP Therapy
    prisma.treatment.create({
      data: {
        slug: 'prp-therapy',
        name: 'Platelet-Rich Plasma (PRP) Therapy',
        aliases: ['PRP injection', 'Platelet therapy', 'Autologous blood therapy'],
        category: 'REGENERATIVE',
        description:
          'PRP therapy uses concentrated platelets from the patient\'s own blood to accelerate healing and tissue regeneration. The growth factors released by platelets stimulate cell repair, making it popular for joint issues, hair restoration, and skin rejuvenation.',
        howItWorks:
          'Blood is drawn and centrifuged to separate platelets, which are then concentrated to 3-5x normal levels. This platelet-rich plasma is injected into the target area, releasing growth factors that stimulate tissue repair and regeneration.',
        whatItAddresses: [
          'Joint pain',
          'Tendon injuries',
          'Hair loss',
          'Skin rejuvenation',
          'Sports injuries',
          'Osteoarthritis',
        ],
        evidenceLevel: 'MODERATE',
        evidenceSummary:
          'Strong evidence for tendon injuries and some joint conditions. Growing evidence for hair loss. Skin rejuvenation evidence is more limited. Results vary based on condition treated and preparation method.',
        typicalProtocol:
          'Blood draw, processing (30-60 minutes), and injection. May require 3-6 sessions spaced 4-6 weeks apart for optimal results. Maintenance sessions every 6-12 months.',
        priceRangeMin: 500,
        priceRangeMax: 2500,
        potentialRisks:
          'Minimal since using own blood. Injection site pain, swelling, or bruising. Small infection risk at injection site.',
        contraindications: [
          'Blood disorders',
          'Active infection',
          'Cancer',
          'Anticoagulant therapy',
        ],
        published: true,
      },
    }),

    // Exosome Therapy
    prisma.treatment.create({
      data: {
        slug: 'exosome-therapy',
        name: 'Exosome Therapy',
        aliases: ['Extracellular vesicle therapy', 'Cell-free regenerative therapy'],
        category: 'REGENERATIVE',
        description:
          'Exosome therapy uses tiny vesicles derived from stem cells that carry proteins, growth factors, and genetic material. These cell-to-cell messengers may promote healing and regeneration without the regulatory complexities of live cell therapies.',
        howItWorks:
          'Exosomes are isolated from mesenchymal stem cells cultured in laboratory conditions. When administered, they deliver regenerative signals to target cells, potentially promoting tissue repair, reducing inflammation, and supporting cellular health.',
        whatItAddresses: [
          'Skin aging',
          'Hair restoration',
          'Joint degeneration',
          'General anti-aging',
          'Tissue repair',
        ],
        evidenceLevel: 'EXPERIMENTAL',
        evidenceSummary:
          'Promising preclinical results. Human clinical trials are in early stages. The mechanism of action is scientifically plausible but clinical evidence for specific applications is still developing.',
        typicalProtocol:
          'Administration varies: IV infusion, local injection, or topical application for skin. Protocols typically involve 1-3 sessions with effects monitored over weeks to months.',
        priceRangeMin: 2000,
        priceRangeMax: 10000,
        potentialRisks:
          'Generally well-tolerated. Injection site reactions possible. Quality control varies significantly between providers. Long-term effects unknown.',
        contraindications: [
          'Active cancer',
          'Active infections',
          'Immunocompromised states',
        ],
        published: true,
      },
    }),

    // Peptide Therapy
    prisma.treatment.create({
      data: {
        slug: 'peptide-therapy',
        name: 'Peptide Therapy',
        aliases: ['Peptide injections', 'Growth hormone peptides'],
        category: 'CELLULAR',
        description:
          'Peptide therapy uses short chains of amino acids that signal specific cellular functions. Different peptides target growth hormone release, tissue repair, fat metabolism, immune function, and cognitive enhancement.',
        howItWorks:
          'Peptides bind to specific cell receptors, triggering biological responses. For example, growth hormone secretagogues stimulate natural GH release from the pituitary. Other peptides enhance healing, improve sleep, or support immune function.',
        whatItAddresses: [
          'Growth hormone deficiency',
          'Fat loss',
          'Muscle building',
          'Healing and recovery',
          'Sleep quality',
          'Cognitive function',
        ],
        evidenceLevel: 'EMERGING',
        evidenceSummary:
          'Some peptides (like BPC-157) have substantial research in animal models. Human clinical data is limited for many applications. Regulatory status varies by peptide and jurisdiction.',
        typicalProtocol:
          'Most peptides are self-administered via subcutaneous injection. Protocols vary by peptide: some are daily, others cycled. Typically used for 3-6 months with monitoring.',
        priceRangeMin: 300,
        priceRangeMax: 1500,
        potentialRisks:
          'Injection site reactions, water retention, joint pain with some peptides. Long-term effects of many peptides not fully established.',
        contraindications: [
          'Cancer or cancer history',
          'Pregnancy',
          'Certain hormonal conditions',
        ],
        published: true,
      },
    }),

    // EBOO
    prisma.treatment.create({
      data: {
        slug: 'eboo-therapy',
        name: 'EBOO (Extracorporeal Blood Oxygenation/Ozonation)',
        aliases: ['Ozone dialysis', 'RHP (Recirculatory Hemoperfusion)'],
        category: 'DETOXIFICATION',
        description:
          'EBOO is an advanced blood treatment that filters blood through a dialysis-like machine while exposing it to ozone and oxygen. Proponents claim it removes toxins, improves oxygenation, and has antimicrobial properties.',
        howItWorks:
          'Blood is drawn through one IV line, passed through a filter that exposes it to medical-grade ozone, then returned through another IV. The process takes 45-60 minutes and treats the entire blood volume.',
        whatItAddresses: [
          'Chronic infections',
          'Toxin removal',
          'Chronic fatigue',
          'Autoimmune conditions',
          'Cardiovascular support',
        ],
        evidenceLevel: 'EXPERIMENTAL',
        evidenceSummary:
          'Limited published research. Based on principles of ozone therapy which has longer research history in Europe. Not FDA approved. Benefits and mechanisms not conclusively established.',
        typicalProtocol:
          'Sessions last 45-60 minutes. Initial protocols often involve 6-10 sessions. May be combined with other integrative treatments.',
        priceRangeMin: 800,
        priceRangeMax: 2500,
        potentialRisks:
          'Air embolism risk (rare with proper technique), vein irritation, temporary fatigue. Should only be performed by trained practitioners with proper equipment.',
        contraindications: [
          'G6PD deficiency',
          'Pregnancy',
          'Acute cardiovascular instability',
          'Bleeding disorders',
        ],
        published: true,
      },
    }),

    // Chelation Therapy
    prisma.treatment.create({
      data: {
        slug: 'chelation-therapy',
        name: 'Chelation Therapy',
        aliases: ['IV chelation', 'Heavy metal detox', 'EDTA chelation'],
        category: 'DETOXIFICATION',
        description:
          'Chelation therapy uses binding agents (chelators) to remove heavy metals and minerals from the body. While established for heavy metal poisoning, its use for cardiovascular disease and general wellness is more controversial.',
        howItWorks:
          'Chelating agents like EDTA are administered intravenously. They bind to metals like lead, mercury, and calcium, forming complexes that are excreted through the kidneys. Treatment removes both toxic and essential minerals.',
        whatItAddresses: [
          'Heavy metal toxicity',
          'Cardiovascular disease (controversial)',
          'Cognitive decline',
          'General detoxification',
        ],
        evidenceLevel: 'MODERATE',
        evidenceSummary:
          'FDA approved for heavy metal poisoning. The TACT trial showed modest benefits for diabetic patients with prior heart attack. Evidence for general wellness applications is limited.',
        typicalProtocol:
          'IV infusions last 1-3 hours, given weekly or biweekly. Full courses range from 20-50+ treatments depending on indication. Mineral supplementation required.',
        priceRangeMin: 100,
        priceRangeMax: 300,
        potentialRisks:
          'Kidney damage with improper dosing, electrolyte imbalances, hypocalcemia. Requires monitoring of kidney function and mineral levels.',
        contraindications: [
          'Kidney disease',
          'Liver failure',
          'Pregnancy',
          'Allergies to chelating agents',
        ],
        published: true,
      },
    }),

    // Senolytic Therapy
    prisma.treatment.create({
      data: {
        slug: 'senolytic-therapy',
        name: 'Senolytic Therapy',
        aliases: ['Senescent cell clearance', 'Zombie cell therapy'],
        category: 'CELLULAR',
        description:
          'Senolytic therapy aims to selectively eliminate senescent (aged, dysfunctional) cells that accumulate with age and contribute to inflammation and tissue dysfunction. This emerging longevity intervention targets a fundamental mechanism of aging.',
        howItWorks:
          'Senolytic agents (like dasatinib + quercetin, fisetin, or navitoclax) trigger apoptosis in senescent cells while sparing healthy cells. Clearing these cells may reduce the inflammatory "SASP" (senescence-associated secretory phenotype).',
        whatItAddresses: [
          'Biological aging',
          'Chronic inflammation',
          'Frailty',
          'Age-related diseases',
          'Tissue dysfunction',
        ],
        evidenceLevel: 'EXPERIMENTAL',
        evidenceSummary:
          'Exciting preclinical results in mice showing lifespan extension and improved healthspan. Human trials are in early stages. The Mayo Clinic and others are conducting clinical research.',
        typicalProtocol:
          'Often administered in "hit-and-run" fashion: intensive treatment for a few days, repeated every few weeks to months. Specific protocols vary by clinic and agents used.',
        priceRangeMin: 1000,
        priceRangeMax: 5000,
        potentialRisks:
          'Potential drug interactions, effects on wound healing, possible platelet reduction. Long-term effects in humans unknown.',
        contraindications: [
          'Active cancer treatment',
          'Bleeding disorders',
          'Upcoming surgeries',
          'Pregnancy',
        ],
        published: true,
      },
    }),

    // Infrared Sauna
    prisma.treatment.create({
      data: {
        slug: 'infrared-sauna',
        name: 'Infrared Sauna Therapy',
        aliases: ['Far infrared sauna', 'Heat therapy'],
        category: 'DETOXIFICATION',
        description:
          'Infrared saunas use infrared light to heat the body directly rather than heating the air. This allows for lower ambient temperatures while still inducing sweating, making it more tolerable than traditional saunas while potentially offering similar benefits.',
        howItWorks:
          'Infrared wavelengths penetrate the skin, heating tissue directly and raising core body temperature. This induces sweating, increases heart rate (similar to moderate exercise), and may promote circulation and cellular responses.',
        whatItAddresses: [
          'Detoxification',
          'Pain relief',
          'Muscle recovery',
          'Cardiovascular conditioning',
          'Relaxation',
          'Skin health',
        ],
        evidenceLevel: 'EMERGING',
        evidenceSummary:
          'Some studies show cardiovascular benefits similar to exercise. Evidence for detoxification claims is limited. Generally considered safe with proper hydration and duration limits.',
        typicalProtocol:
          'Sessions of 15-45 minutes at temperatures of 45-65°C (110-150°F). Can be used daily or several times per week. Hydration before, during, and after is essential.',
        priceRangeMin: 30,
        priceRangeMax: 100,
        potentialRisks:
          'Dehydration, overheating, low blood pressure. Avoid alcohol before sessions. Start with shorter durations.',
        contraindications: [
          'Cardiovascular disease (consult doctor)',
          'Pregnancy',
          'Recent alcohol use',
          'Certain medications',
        ],
        published: true,
      },
    }),

    // Acupuncture
    prisma.treatment.create({
      data: {
        slug: 'acupuncture',
        name: 'Acupuncture',
        aliases: ['Traditional Chinese acupuncture', 'Needling therapy'],
        category: 'TRADITIONAL',
        description:
          'Acupuncture is a key component of Traditional Chinese Medicine involving the insertion of thin needles at specific points on the body. It is believed to balance the flow of energy (qi) and is used for pain, stress, and various health conditions.',
        howItWorks:
          'From a TCM perspective, needles unblock and balance qi flow along meridians. Modern research suggests acupuncture may work through neuromodulation, releasing endorphins and affecting neural pathways involved in pain and stress.',
        whatItAddresses: [
          'Chronic pain',
          'Headaches/migraines',
          'Stress and anxiety',
          'Nausea',
          'Sleep disorders',
          'Digestive issues',
        ],
        evidenceLevel: 'MODERATE',
        evidenceSummary:
          'Good evidence for certain pain conditions, especially chronic low back pain, neck pain, and osteoarthritis knee pain. Evidence for other conditions is mixed. Response varies between individuals.',
        typicalProtocol:
          'Sessions last 20-60 minutes with needles retained for 15-30 minutes. Initial courses often involve weekly sessions for 4-8 weeks, then maintenance as needed.',
        priceRangeMin: 80,
        priceRangeMax: 250,
        potentialRisks:
          'Minor bleeding or bruising at needle sites. Rare: infection (with unsterile needles), fainting, nerve damage.',
        contraindications: [
          'Bleeding disorders',
          'Pacemaker (for electroacupuncture)',
          'Pregnancy (certain points)',
        ],
        published: true,
      },
    }),

    // TCM Herbal Medicine
    prisma.treatment.create({
      data: {
        slug: 'tcm-herbal-medicine',
        name: 'Traditional Chinese Herbal Medicine',
        aliases: ['Chinese herbs', 'TCM formulas'],
        category: 'TRADITIONAL',
        description:
          'TCM herbal medicine uses combinations of herbs, minerals, and animal products prescribed according to traditional diagnostic principles. Formulas are individualized based on the patient\'s constitution and pattern of disharmony.',
        howItWorks:
          'Herbs are combined into formulas that address the root cause of imbalance according to TCM theory. Modern research identifies various active compounds with anti-inflammatory, antioxidant, and other pharmacological effects.',
        whatItAddresses: [
          'Digestive disorders',
          'Respiratory conditions',
          'Skin conditions',
          'Hormonal imbalances',
          'Stress and anxiety',
          'Chronic conditions',
        ],
        evidenceLevel: 'TRADITIONAL',
        evidenceSummary:
          'Some individual herbs have strong research support (e.g., Artemisia for malaria). Many traditional formulas lack rigorous clinical trials. Quality and standardization are significant concerns.',
        typicalProtocol:
          'Formulas are prescribed after TCM diagnosis. May be taken as teas, powders, pills, or tinctures. Formulas are often adjusted over time based on response.',
        priceRangeMin: 50,
        priceRangeMax: 300,
        potentialRisks:
          'Drug interactions, contamination/adulteration concerns, liver toxicity with some herbs. Only use from reputable practitioners with quality-tested products.',
        contraindications: [
          'Pregnancy (many herbs)',
          'Liver or kidney disease',
          'Certain medications (interactions)',
        ],
        published: true,
      },
    }),

    // Flotation Therapy
    prisma.treatment.create({
      data: {
        slug: 'flotation-therapy',
        name: 'Flotation Therapy',
        aliases: ['Sensory deprivation tank', 'Float tank', 'REST therapy'],
        category: 'MIND_NEURO',
        description:
          'Flotation therapy involves floating in a tank filled with highly saturated Epsom salt water, which allows effortless floating. In darkness and silence, the therapy reduces sensory input, promoting deep relaxation, meditation, and stress relief.',
        howItWorks:
          'The high magnesium sulfate concentration creates buoyancy. Reduced sensory input (light, sound, gravity, temperature differential) allows the nervous system to enter a deeply relaxed state, reducing cortisol and promoting theta brainwaves.',
        whatItAddresses: [
          'Stress and anxiety',
          'Chronic pain',
          'Muscle tension',
          'Sleep disorders',
          'Creativity enhancement',
          'Meditation deepening',
        ],
        evidenceLevel: 'EMERGING',
        evidenceSummary:
          'Studies show reductions in stress hormones, pain, and anxiety. Benefits for fibromyalgia and generalized anxiety disorder documented. Long-term benefits require regular sessions.',
        typicalProtocol:
          'Sessions typically last 60-90 minutes. Benefits are cumulative; regular floating (weekly or biweekly) provides more sustained results. First-time floaters may need 2-3 sessions to fully relax.',
        priceRangeMin: 60,
        priceRangeMax: 120,
        potentialRisks:
          'Claustrophobia (most tanks can be opened from inside), skin irritation from salt, minor disorientation initially.',
        contraindications: [
          'Open wounds',
          'Severe claustrophobia',
          'Epilepsy (without medical approval)',
          'Ear infections',
        ],
        published: true,
      },
    }),

    // Red Light Therapy
    prisma.treatment.create({
      data: {
        slug: 'red-light-therapy',
        name: 'Red Light Therapy (Photobiomodulation)',
        aliases: ['Low-level laser therapy', 'LLLT', 'LED light therapy'],
        category: 'CELLULAR',
        description:
          'Red and near-infrared light therapy uses specific wavelengths of light to stimulate cellular function. The light penetrates tissues and is absorbed by mitochondria, potentially enhancing energy production and cellular repair processes.',
        howItWorks:
          'Light in the 600-1000nm range is absorbed by cytochrome c oxidase in mitochondria, potentially enhancing ATP production. This may support cellular repair, reduce inflammation, and improve circulation.',
        whatItAddresses: [
          'Skin health and aging',
          'Wound healing',
          'Hair growth',
          'Joint pain',
          'Muscle recovery',
          'Cognitive function',
        ],
        evidenceLevel: 'MODERATE',
        evidenceSummary:
          'Good evidence for wound healing, some joint conditions, and certain skin applications. Evidence for anti-aging and cognitive benefits is growing but less established. Device quality and protocols vary significantly.',
        typicalProtocol:
          'Sessions of 10-20 minutes, 3-5 times per week. Treatment area held close to the light source. Benefits are cumulative over weeks of consistent use.',
        priceRangeMin: 30,
        priceRangeMax: 150,
        potentialRisks:
          'Generally very safe. Eye protection recommended. Avoid if taking photosensitizing medications.',
        contraindications: [
          'Photosensitive conditions',
          'Active cancer (avoid treating tumor areas)',
          'Pregnancy (abdominal area)',
        ],
        published: true,
      },
    }),

    // Pulsed Electromagnetic Field Therapy
    prisma.treatment.create({
      data: {
        slug: 'pemf-therapy',
        name: 'Pulsed Electromagnetic Field Therapy (PEMF)',
        aliases: ['PEMF', 'Magnetic therapy', 'Electromagnetic therapy'],
        category: 'BODY_MANUAL',
        description:
          'PEMF therapy uses electromagnetic fields pulsed at various frequencies to stimulate cellular function. It is FDA approved for bone healing and has been explored for pain relief, inflammation, and overall cellular support.',
        howItWorks:
          'Pulsed electromagnetic fields induce small electrical currents in tissues, which may stimulate cellular metabolism, improve circulation, and support the body\'s natural healing processes.',
        whatItAddresses: [
          'Bone healing',
          'Chronic pain',
          'Inflammation',
          'Sleep quality',
          'Athletic recovery',
          'General cellular health',
        ],
        evidenceLevel: 'MODERATE',
        evidenceSummary:
          'FDA approved for bone healing and depression (specific devices). Evidence for pain and inflammation is moderate. Wellness applications have less rigorous evidence.',
        typicalProtocol:
          'Sessions range from 8 minutes to several hours depending on device and application. Can be used daily. Some devices are for home use, others are clinical.',
        priceRangeMin: 50,
        priceRangeMax: 200,
        potentialRisks:
          'Generally very safe. Should not be used with implanted electronic devices. Avoid directly over tumors.',
        contraindications: [
          'Pacemakers or implanted devices',
          'Pregnancy',
          'Active cancer',
        ],
        published: true,
      },
    }),

    // Lymphatic Drainage
    prisma.treatment.create({
      data: {
        slug: 'lymphatic-drainage',
        name: 'Manual Lymphatic Drainage',
        aliases: ['MLD', 'Lymph massage', 'Vodder technique'],
        category: 'BODY_MANUAL',
        description:
          'Manual lymphatic drainage is a gentle massage technique that stimulates the lymphatic system to remove waste products and excess fluid from tissues. It supports immune function and is used for various conditions including post-surgical recovery.',
        howItWorks:
          'Light, rhythmic strokes follow the direction of lymph flow, encouraging fluid movement through lymph vessels and nodes. This helps clear cellular waste, reduces swelling, and supports immune function.',
        whatItAddresses: [
          'Lymphedema',
          'Post-surgical swelling',
          'Detoxification',
          'Immune support',
          'Chronic fatigue',
          'Skin health',
        ],
        evidenceLevel: 'MODERATE',
        evidenceSummary:
          'Well-established for lymphedema management. Evidence for general wellness benefits is more limited but supportive for edema reduction and possibly immune function.',
        typicalProtocol:
          'Sessions last 45-60 minutes. For therapeutic purposes, multiple sessions may be needed initially (2-3 per week), then maintenance as needed.',
        priceRangeMin: 100,
        priceRangeMax: 200,
        potentialRisks:
          'Very safe when performed by trained therapists. Contraindicated in active infections, blood clots, or heart failure.',
        contraindications: [
          'Acute infections',
          'Blood clots',
          'Congestive heart failure',
          'Active cancer in treatment area',
        ],
        published: true,
      },
    }),

    // Craniosacral Therapy
    prisma.treatment.create({
      data: {
        slug: 'craniosacral-therapy',
        name: 'Craniosacral Therapy',
        aliases: ['CST', 'Cranial osteopathy', 'Cranial sacral'],
        category: 'BODY_MANUAL',
        description:
          'Craniosacral therapy is a gentle, hands-on technique that uses light touch to evaluate and enhance the functioning of the craniosacral system—the membranes and fluid surrounding the brain and spinal cord.',
        howItWorks:
          'Practitioners use very light pressure (5 grams) to detect subtle rhythms in the craniosacral system and release restrictions in the fascia and meninges. This is believed to optimize central nervous system function.',
        whatItAddresses: [
          'Headaches and migraines',
          'Chronic pain',
          'Stress and tension',
          'TMJ dysfunction',
          'Post-concussion symptoms',
          'Nervous system regulation',
        ],
        evidenceLevel: 'EMERGING',
        evidenceSummary:
          'Limited controlled research. Some studies suggest benefits for certain conditions. The underlying mechanism (craniosacral rhythm) is debated in the scientific community.',
        typicalProtocol:
          'Sessions last 45-60 minutes. Clients remain clothed. Often recommended weekly initially, then spacing out as improvement occurs.',
        priceRangeMin: 80,
        priceRangeMax: 200,
        potentialRisks:
          'Very low risk given the gentle nature. Not recommended for recent skull fractures or certain brain conditions.',
        contraindications: [
          'Recent skull fractures',
          'Intracranial hemorrhage',
          'Severe osteoporosis',
          'Aneurysm',
        ],
        published: true,
      },
    }),

    // Breathwork
    prisma.treatment.create({
      data: {
        slug: 'breathwork',
        name: 'Breathwork Therapy',
        aliases: ['Holotropic breathwork', 'Conscious breathing', 'Pranayama'],
        category: 'MIND_NEURO',
        description:
          'Breathwork encompasses various techniques using conscious control of breathing to influence mental, emotional, and physical states. From gentle practices to intensive sessions, breathwork can shift the nervous system and access altered states of consciousness.',
        howItWorks:
          'Different breathing patterns affect the autonomic nervous system. Slow breathing activates the parasympathetic response; rapid breathing can induce altered states through changes in blood chemistry and nervous system activation.',
        whatItAddresses: [
          'Stress and anxiety',
          'Emotional release',
          'Trauma processing',
          'Meditation enhancement',
          'Energy and focus',
          'Sleep quality',
        ],
        evidenceLevel: 'EMERGING',
        evidenceSummary:
          'Good evidence for slow breathing techniques reducing stress. Intensive breathwork has less research but significant experiential reports. Safety is generally good when properly facilitated.',
        typicalProtocol:
          'Sessions range from 15 minutes (daily practice) to 2-3 hours (intensive sessions). Intensive breathwork is often done in group settings with trained facilitators.',
        priceRangeMin: 30,
        priceRangeMax: 200,
        potentialRisks:
          'Hyperventilation symptoms (tingling, cramping), emotional release, lightheadedness. Intensive practices should be avoided with certain cardiovascular or psychiatric conditions.',
        contraindications: [
          'Severe cardiovascular disease',
          'Epilepsy',
          'Psychosis',
          'Pregnancy (intensive practices)',
        ],
        published: true,
      },
    }),

    // IV Glutathione
    prisma.treatment.create({
      data: {
        slug: 'iv-glutathione',
        name: 'IV Glutathione Therapy',
        aliases: ['Glutathione drip', 'Master antioxidant therapy'],
        category: 'IV_THERAPIES',
        description:
          'Glutathione is the body\'s master antioxidant, crucial for detoxification, immune function, and cellular protection. IV administration bypasses digestive breakdown, delivering this molecule directly to cells.',
        howItWorks:
          'Glutathione neutralizes free radicals, supports liver detoxification pathways, recycles other antioxidants like vitamins C and E, and is essential for immune cell function. IV delivery achieves much higher levels than oral supplementation.',
        whatItAddresses: [
          'Detoxification',
          'Skin brightening',
          'Immune support',
          'Liver health',
          'Anti-aging',
          'Athletic recovery',
        ],
        evidenceLevel: 'EMERGING',
        evidenceSummary:
          'Essential molecule with clear biological importance. IV delivery is more effective than oral. Clinical evidence for specific wellness applications (like skin brightening) is limited.',
        typicalProtocol:
          'IV push or drip of 1000-2000mg. Can be combined with vitamin C or other nutrients. Typically weekly or biweekly for courses of 4-10 sessions.',
        priceRangeMin: 150,
        priceRangeMax: 400,
        potentialRisks:
          'Generally well-tolerated. Rare allergic reactions. May interfere with certain chemotherapy drugs.',
        contraindications: [
          'Certain chemotherapy protocols',
          'Allergy to glutathione',
          'Asthma (caution)',
        ],
        published: true,
      },
    }),

    // High-Dose Vitamin C
    prisma.treatment.create({
      data: {
        slug: 'high-dose-vitamin-c',
        name: 'High-Dose IV Vitamin C',
        aliases: ['Ascorbic acid infusion', 'Mega-C therapy'],
        category: 'IV_THERAPIES',
        description:
          'High-dose IV vitamin C delivers gram quantities of ascorbic acid directly into the bloodstream. At high doses, vitamin C may have pro-oxidant effects on cancer cells while supporting immune function and collagen production.',
        howItWorks:
          'IV administration achieves plasma levels 100x higher than oral doses. At high concentrations, vitamin C generates hydrogen peroxide that may damage cancer cells while supporting healthy cell function and immune responses.',
        whatItAddresses: [
          'Immune support',
          'Cancer adjunctive therapy',
          'Wound healing',
          'Fatigue',
          'Chronic infections',
          'Collagen support',
        ],
        evidenceLevel: 'EMERGING',
        evidenceSummary:
          'Strong evidence for immune support and deficiency treatment. Research for cancer support is ongoing; some studies show quality of life benefits. Not a standalone cancer treatment.',
        typicalProtocol:
          'Doses range from 25g to 100g+ depending on indication. Requires G6PD screening before high doses. Sessions last 1-3 hours. Often given 1-3 times per week.',
        priceRangeMin: 150,
        priceRangeMax: 400,
        potentialRisks:
          'Hemolysis in G6PD deficiency (must screen). Kidney stones with prolonged use. May affect certain lab tests.',
        contraindications: [
          'G6PD deficiency',
          'Kidney stones or kidney disease',
          'Iron overload conditions',
        ],
        published: true,
      },
    }),

    // Ketamine Therapy
    prisma.treatment.create({
      data: {
        slug: 'ketamine-therapy',
        name: 'Ketamine-Assisted Therapy',
        aliases: ['Ketamine infusion', 'KAP'],
        category: 'MIND_NEURO',
        description:
          'Ketamine, originally an anesthetic, has emerged as a rapid-acting treatment for depression and PTSD. In controlled clinical settings, it can produce relief within hours and is often combined with psychotherapy for sustained benefits.',
        howItWorks:
          'Ketamine blocks NMDA receptors and promotes new neural connections (neuroplasticity). The altered state it produces may facilitate psychological insights and emotional processing, especially when combined with therapy.',
        whatItAddresses: [
          'Treatment-resistant depression',
          'PTSD',
          'Anxiety',
          'Suicidal ideation',
          'Chronic pain',
          'OCD',
        ],
        evidenceLevel: 'STRONG',
        evidenceSummary:
          'FDA-approved (as esketamine nasal spray) for treatment-resistant depression. Strong evidence for rapid antidepressant effects. Growing evidence for PTSD and anxiety.',
        typicalProtocol:
          'IV infusions last 40-60 minutes. Series of 6 treatments over 2-3 weeks common initially. Maintenance sessions as needed. Often combined with integration therapy.',
        priceRangeMin: 400,
        priceRangeMax: 1000,
        potentialRisks:
          'Dissociation, nausea, blood pressure elevation during infusion. Potential for psychological distress. Should only be administered in clinical settings.',
        contraindications: [
          'Uncontrolled hypertension',
          'History of psychosis',
          'Active substance abuse',
          'Pregnancy',
        ],
        published: true,
      },
    }),

    // Biofeedback
    prisma.treatment.create({
      data: {
        slug: 'biofeedback',
        name: 'Biofeedback Therapy',
        aliases: ['HRV biofeedback', 'Physiological feedback'],
        category: 'MIND_NEURO',
        description:
          'Biofeedback uses electronic monitoring to provide real-time information about physiological processes, teaching individuals to consciously influence functions like heart rate, muscle tension, and brainwaves.',
        howItWorks:
          'Sensors measure physiological parameters (heart rate variability, skin conductance, muscle tension, temperature). Real-time feedback helps individuals learn to consciously influence these typically automatic functions.',
        whatItAddresses: [
          'Stress management',
          'Anxiety',
          'Chronic pain',
          'Headaches',
          'High blood pressure',
          'Performance optimization',
        ],
        evidenceLevel: 'MODERATE',
        evidenceSummary:
          'Good evidence for headaches, anxiety, and some pain conditions. HRV biofeedback has strong research support for stress management and athletic performance.',
        typicalProtocol:
          'Sessions last 30-60 minutes. Skills are learned over 8-20 sessions, with home practice between sessions. Once learned, skills can be applied independently.',
        priceRangeMin: 80,
        priceRangeMax: 200,
        potentialRisks:
          'Very safe. Some may experience frustration during learning process.',
        contraindications: [],
        published: true,
      },
    }),

    // Aesthetic - Botox
    prisma.treatment.create({
      data: {
        slug: 'botulinum-toxin',
        name: 'Botulinum Toxin Injections',
        aliases: ['Botox', 'Dysport', 'Xeomin'],
        category: 'AESTHETIC',
        description:
          'Botulinum toxin injections temporarily paralyze targeted muscles to reduce wrinkles and fine lines. The most common cosmetic procedure worldwide, it can also treat excessive sweating, migraines, and muscle disorders.',
        howItWorks:
          'Botulinum toxin blocks nerve signals to muscles, preventing contraction. When injected into facial muscles, this softens dynamic wrinkles (those caused by expression). Effects are temporary and muscles function returns as the toxin wears off.',
        whatItAddresses: [
          'Forehead lines',
          'Crow\'s feet',
          'Frown lines',
          'Excessive sweating',
          'Migraines',
          'Jaw clenching',
        ],
        evidenceLevel: 'STRONG',
        evidenceSummary:
          'FDA approved for multiple cosmetic and medical indications. Extensive safety record when administered by qualified practitioners. One of the most-studied cosmetic treatments.',
        typicalProtocol:
          'Quick office procedure (15-30 minutes). Results appear in 3-7 days, last 3-4 months. Repeat treatments maintain results. Dosing customized to individual muscle strength and desired effect.',
        priceRangeMin: 200,
        priceRangeMax: 800,
        potentialRisks:
          'Bruising, temporary muscle weakness, rare allergic reactions. Unnatural look if overdone. Ptosis (drooping) if injected incorrectly.',
        contraindications: [
          'Neuromuscular disorders',
          'Pregnancy/breastfeeding',
          'Infection at injection site',
          'Allergy to botulinum toxin',
        ],
        published: true,
      },
    }),
  ]);

  console.log(`Created ${additionalTreatments.length} additional treatments`);
  return additionalTreatments;
}

export async function seedAdditionalDiagnostics() {
  console.log('🔬 Adding additional diagnostics...');

  const additionalDiagnostics = await Promise.all([
    prisma.diagnostic.create({
      data: {
        slug: 'dexa-body-composition',
        name: 'DEXA Body Composition Scan',
        category: 'IMAGING',
        description:
          'Dual-energy X-ray absorptiometry provides precise measurement of body composition including bone density, lean mass, and fat distribution with regional analysis.',
        whatItMeasures:
          'Total and regional body fat percentage, lean muscle mass, visceral fat, bone mineral density. Tracks changes over time with high precision.',
        published: true,
      },
    }),

    prisma.diagnostic.create({
      data: {
        slug: 'vo2-max-testing',
        name: 'VO2 Max Cardiopulmonary Testing',
        category: 'METABOLIC',
        description:
          'Gold-standard measurement of cardiovascular fitness and aerobic capacity, measuring oxygen consumption during incremental exercise to exhaustion.',
        whatItMeasures:
          'Maximum oxygen uptake (VO2 max), anaerobic threshold, heart rate zones, respiratory exchange ratio. Key predictor of longevity and athletic performance.',
        published: true,
      },
    }),

    prisma.diagnostic.create({
      data: {
        slug: 'continuous-glucose-monitor',
        name: 'Continuous Glucose Monitoring',
        category: 'METABOLIC',
        description:
          'Wearable sensor tracks blood glucose levels 24/7 for 14 days, revealing patterns related to food, exercise, stress, and sleep that affect metabolic health.',
        whatItMeasures:
          'Glucose levels every few minutes, glycemic variability, time in optimal range, response to specific foods and activities. Crucial for metabolic optimization.',
        published: true,
      },
    }),

    prisma.diagnostic.create({
      data: {
        slug: 'sleep-study',
        name: 'Polysomnography (Sleep Study)',
        category: 'COGNITIVE',
        description:
          'Comprehensive overnight sleep monitoring recording brain activity, eye movements, muscle activity, heart rhythm, and breathing to diagnose sleep disorders.',
        whatItMeasures:
          'Sleep stages (REM, deep, light), sleep apnea events, oxygen levels, leg movements, sleep efficiency. Essential for diagnosing sleep disorders.',
        published: true,
      },
    }),

    prisma.diagnostic.create({
      data: {
        slug: 'food-sensitivity-panel',
        name: 'Comprehensive Food Sensitivity Panel',
        category: 'BIOMARKERS',
        description:
          'IgG antibody testing for 150+ foods to identify potential food sensitivities that may contribute to inflammation, digestive issues, and other symptoms.',
        whatItMeasures:
          'IgG antibody reactions to foods including dairy, grains, vegetables, fruits, meats, spices. Results guide elimination diets and identify potential triggers.',
        published: true,
      },
    }),

    prisma.diagnostic.create({
      data: {
        slug: 'omega-3-index',
        name: 'Omega-3 Index',
        category: 'BIOMARKERS',
        description:
          'Measures EPA and DHA omega-3 fatty acids in red blood cell membranes, reflecting long-term omega-3 status and cardiovascular disease risk.',
        whatItMeasures:
          'Percentage of omega-3 fatty acids in red blood cells. Target is >8% for optimal cardiovascular protection. Guides supplementation decisions.',
        published: true,
      },
    }),

    prisma.diagnostic.create({
      data: {
        slug: 'telomere-testing',
        name: 'Telomere Length Testing',
        category: 'GENETIC',
        description:
          'Measures the length of telomeres, the protective caps on chromosomes that shorten with age. Provides a marker of biological aging distinct from chronological age.',
        whatItMeasures:
          'Average telomere length compared to age-matched population. Indicates biological age and may predict disease risk. Can track changes with interventions.',
        published: true,
      },
    }),

    prisma.diagnostic.create({
      data: {
        slug: 'biological-age-panel',
        name: 'Epigenetic Biological Age Panel',
        category: 'GENETIC',
        description:
          'DNA methylation-based testing that calculates biological age using validated algorithms like GrimAge or DunedinPACE, revealing how fast you are aging.',
        whatItMeasures:
          'Epigenetic age vs chronological age, pace of aging, organ-specific aging markers. Can track response to lifestyle and medical interventions.',
        published: true,
      },
    }),

    prisma.diagnostic.create({
      data: {
        slug: 'advanced-cardiovascular-panel',
        name: 'Advanced Cardiovascular Risk Panel',
        category: 'CARDIOVASCULAR',
        description:
          'Beyond standard cholesterol, this panel measures particle sizes, inflammatory markers, and metabolic factors for comprehensive cardiovascular risk assessment.',
        whatItMeasures:
          'LDL particle number and size, Lp(a), apoB, CRP-hs, homocysteine, insulin resistance markers. Provides nuanced understanding of cardiovascular risk.',
        published: true,
      },
    }),

    prisma.diagnostic.create({
      data: {
        slug: 'carotid-ultrasound',
        name: 'Carotid Intima-Media Thickness (CIMT)',
        category: 'CARDIOVASCULAR',
        description:
          'Ultrasound measurement of the arterial wall thickness in the carotid arteries, detecting early atherosclerosis before calcification or symptoms occur.',
        whatItMeasures:
          'Thickness of arterial walls, presence of plaque, arterial age compared to chronological age. Early detection of cardiovascular disease.',
        published: true,
      },
    }),

    prisma.diagnostic.create({
      data: {
        slug: 'cognitive-assessment',
        name: 'Comprehensive Cognitive Assessment',
        category: 'COGNITIVE',
        description:
          'Detailed neuropsychological testing battery assessing memory, attention, processing speed, executive function, and other cognitive domains.',
        whatItMeasures:
          'Multiple cognitive domains compared to age norms. Identifies strengths and weaknesses, tracks changes over time, guides cognitive optimization strategies.',
        published: true,
      },
    }),

    prisma.diagnostic.create({
      data: {
        slug: 'functional-movement-screen',
        name: 'Functional Movement Screen',
        category: 'METABOLIC',
        description:
          'Standardized assessment of movement quality, flexibility, and stability through seven fundamental movement patterns to identify injury risk and dysfunction.',
        whatItMeasures:
          'Mobility, stability, and movement pattern quality. Identifies asymmetries and limitations that increase injury risk or limit performance.',
        published: true,
      },
    }),
  ]);

  console.log(`Created ${additionalDiagnostics.length} additional diagnostics`);
  return additionalDiagnostics;
}

export async function seedAdditionalEquipment() {
  console.log('🏥 Adding additional equipment...');

  const additionalEquipment = await Promise.all([
    prisma.equipment.create({
      data: {
        slug: 'siemens-mri-3t',
        name: 'Siemens MAGNETOM Vida 3T MRI',
        brand: 'Siemens Healthineers',
        model: 'MAGNETOM Vida',
        category: 'MRI',
        description:
          'State-of-the-art 3 Tesla MRI system with BioMatrix technology for personalized, high-quality imaging with enhanced patient comfort.',
        capabilities: [
          '3T field strength for detailed imaging',
          'AI-powered image reconstruction',
          'Quiet technology for patient comfort',
          'Whole body imaging',
          'Advanced neuroimaging',
        ],
      },
    }),

    prisma.equipment.create({
      data: {
        slug: 'ge-ct-revolution',
        name: 'GE Revolution CT Scanner',
        brand: 'GE Healthcare',
        model: 'Revolution Apex',
        category: 'CT',
        description:
          'Advanced CT scanner with spectral imaging capability, low-dose technology, and AI-assisted analysis for comprehensive body scanning.',
        capabilities: [
          'Ultra-low dose scanning',
          'Spectral imaging',
          'Cardiac CT with single heartbeat acquisition',
          'Whole body scanning',
          'Virtual colonoscopy',
        ],
      },
    }),

    prisma.equipment.create({
      data: {
        slug: 'oxyhealth-hyperbaric',
        name: 'OxyHealth Fortius 420 Hyperbaric Chamber',
        brand: 'OxyHealth',
        model: 'Fortius 420',
        category: 'HYPERBARIC',
        description:
          'Medical-grade monoplace hyperbaric chamber reaching 2.0 ATA with oxygen concentrator integration for clinical HBOT protocols.',
        capabilities: [
          'Pressures up to 2.0 ATA',
          'Single patient capacity',
          'Integrated oxygen delivery',
          'Emergency rapid decompression',
          'Clear visibility throughout',
        ],
      },
    }),

    prisma.equipment.create({
      data: {
        slug: 'impact-cryotherapy',
        name: 'Impact Cryotherapy Chamber',
        brand: 'Impact Cryotherapy',
        model: 'Full Body Chamber',
        category: 'CRYOTHERAPY',
        description:
          'Walk-in whole body cryotherapy chamber using liquid nitrogen cooling, achieving temperatures down to -150°C for systemic cold exposure.',
        capabilities: [
          'Temperatures to -150°C',
          'Full body exposure including head',
          'Precise temperature control',
          'Multiple safety systems',
          'Session timing automation',
        ],
      },
    }),

    prisma.equipment.create({
      data: {
        slug: 'theralight-360',
        name: 'TheraLight 360 Red Light Bed',
        brand: 'TheraLight',
        model: '360',
        category: 'LASER',
        description:
          'Full-body photobiomodulation system combining red and near-infrared wavelengths for systemic cellular support and recovery.',
        capabilities: [
          'Red and near-infrared wavelengths',
          'Full body coverage',
          '20-minute protocols',
          'No UV exposure',
          'Pulsed and continuous modes',
        ],
      },
    }),

    prisma.equipment.create({
      data: {
        slug: 'bod-pod',
        name: 'COSMED BOD POD',
        brand: 'COSMED',
        model: 'BOD POD Gold Standard',
        category: 'OTHER',
        description:
          'Air displacement plethysmography system providing gold-standard body composition analysis in a comfortable 5-minute test.',
        capabilities: [
          'Body fat percentage',
          'Fat-free mass measurement',
          'Resting metabolic rate estimation',
          'Repeat measurements for tracking',
          'Non-invasive, no radiation',
        ],
      },
    }),

    prisma.equipment.create({
      data: {
        slug: 'halo-sport',
        name: 'Halo Sport Neurostimulation',
        brand: 'Halo',
        model: 'Sport 2',
        category: 'OTHER',
        description:
          'Transcranial direct current stimulation (tDCS) headset for neuropriming, enhancing neuroplasticity during physical and cognitive training.',
        capabilities: [
          'Transcranial DC stimulation',
          'Motor cortex targeting',
          '20-minute protocols',
          'App-controlled',
          'Training enhancement',
        ],
      },
    }),

    prisma.equipment.create({
      data: {
        slug: 'iv-infusion-pump',
        name: 'B. Braun Infusomat Space IV Pump',
        brand: 'B. Braun',
        model: 'Infusomat Space',
        category: 'IV_INFUSION',
        description:
          'Hospital-grade IV infusion pump with advanced safety features for precise delivery of IV therapies and medications.',
        capabilities: [
          'Precise flow rate control',
          'Drug library integration',
          'Air-in-line detection',
          'Occlusion monitoring',
          'Battery backup',
        ],
      },
    }),

    prisma.equipment.create({
      data: {
        slug: 'icare-tonometer',
        name: 'iCare Tonometer',
        brand: 'iCare',
        model: 'ic200',
        category: 'OTHER',
        description:
          'Rebound tonometer for painless, accurate intraocular pressure measurement without anesthesia or air puffs.',
        capabilities: [
          'Painless measurement',
          'No anesthesia needed',
          'Instant results',
          'Portable',
          'Self-screening capable',
        ],
      },
    }),
  ]);

  console.log(`Created ${additionalEquipment.length} additional equipment items`);
  return additionalEquipment;
}

// Main function if run directly
async function main() {
  console.log('🌱 Adding extended seed data...\n');

  await seedAdditionalTreatments();
  await seedAdditionalDiagnostics();
  await seedAdditionalEquipment();

  console.log('\n✅ Extended seed data added successfully!');
}

// Only run if executed directly
if (require.main === module) {
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error('Error seeding:', e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
