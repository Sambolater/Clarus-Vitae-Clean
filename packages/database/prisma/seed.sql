-- Clarus Vitae Database Seed Data
-- Run this AFTER init.sql to populate the database

-- ============================================
-- TEAM MEMBERS
-- ============================================

INSERT INTO "TeamMember" ("id", "slug", "name", "title", "bio", "credentials", "specializations", "languages", "propertiesVisited", "programsCompleted", "photoUrl", "linkedinUrl", "published", "createdAt", "updatedAt") VALUES
('tm_sarah_chen', 'dr-sarah-chen', 'Dr. Sarah Chen', 'Chief Medical Advisor',
 'Dr. Sarah Chen is a board-certified physician specializing in integrative medicine and longevity science. With over 15 years of experience evaluating wellness facilities worldwide, she brings clinical rigor to every assessment. Dr. Chen has personally completed programs at over 50 medical wellness properties across Europe, Asia, and North America.',
 ARRAY['MD, Stanford University School of Medicine', 'Board Certified Internal Medicine', 'Fellowship in Integrative Medicine, University of Arizona', 'Certified Functional Medicine Practitioner'],
 ARRAY['Medical longevity protocols', 'Regenerative medicine', 'Metabolic optimization', 'Executive health assessments'],
 ARRAY['English', 'Mandarin', 'French'],
 ARRAY[]::TEXT[], 52, '/team/dr-sarah-chen.jpg', 'https://linkedin.com/in/drsarahchen', true, NOW(), NOW()),

('tm_james_worthington', 'james-worthington', 'James Worthington', 'Senior Wellness Analyst',
 'James Worthington has spent over a decade advising family offices and high-net-worth individuals on wellness investments. His background in hospitality consulting provides unique insight into operational excellence and guest experience. He has evaluated properties across 40 countries and specializes in the intersection of luxury hospitality and evidence-based wellness.',
 ARRAY['MBA, INSEAD', 'Certified Hospitality Industry Analyst', 'Former Director, Luxury Portfolio, Four Seasons'],
 ARRAY['Luxury wellness operations', 'Guest experience assessment', 'Value analysis', 'Property partnerships'],
 ARRAY['English', 'German', 'Spanish'],
 ARRAY[]::TEXT[], 78, '/team/james-worthington.jpg', 'https://linkedin.com/in/jamesworthington', true, NOW(), NOW());

-- ============================================
-- TREATMENTS (Core)
-- ============================================

INSERT INTO "Treatment" ("id", "slug", "name", "aliases", "category", "description", "howItWorks", "whatItAddresses", "evidenceLevel", "evidenceSummary", "typicalProtocol", "priceRangeMin", "priceRangeMax", "potentialRisks", "contraindications", "published", "createdAt", "updatedAt") VALUES
('trt_nad', 'nad-iv-therapy', 'NAD+ IV Therapy', ARRAY['NAD infusion', 'Nicotinamide adenine dinucleotide therapy'], 'IV_THERAPIES',
 'NAD+ (Nicotinamide Adenine Dinucleotide) IV therapy delivers this essential coenzyme directly into the bloodstream, bypassing the digestive system for maximum absorption. NAD+ plays a critical role in cellular energy production, DNA repair, and the activation of sirtuins, proteins associated with longevity.',
 'NAD+ is administered through an IV drip over 2-4 hours. The coenzyme enters cells directly, supporting mitochondrial function and activating cellular repair mechanisms. Treatment protocols typically involve multiple sessions over several days.',
 ARRAY['Cellular aging', 'Chronic fatigue', 'Cognitive decline', 'Addiction recovery', 'Athletic recovery'],
 'EMERGING',
 'Preclinical studies show promising results for cellular health and longevity. Human clinical trials are ongoing, with observational data suggesting improvements in energy, cognition, and recovery. More rigorous controlled trials are needed.',
 'Initial protocol typically involves 4-6 sessions over 7-10 days, with maintenance infusions monthly or quarterly. Dosage ranges from 250mg to 1000mg per session depending on individual assessment.',
 500, 1500,
 'Generally well-tolerated. Some patients experience flushing, nausea, or chest tightness during infusion. Rarely, headache or fatigue may occur post-treatment.',
 ARRAY['Active cancer', 'Pregnancy or nursing', 'Severe cardiac conditions'],
 true, NOW(), NOW()),

('trt_hbot', 'hyperbaric-oxygen-therapy', 'Hyperbaric Oxygen Therapy (HBOT)', ARRAY['HBOT', 'Hyperbaric chamber', 'Oxygen therapy'], 'HYPERBARIC',
 'Hyperbaric Oxygen Therapy involves breathing pure oxygen in a pressurized chamber at 1.5 to 3 times normal atmospheric pressure. This dramatically increases oxygen delivery to tissues, promoting healing, reducing inflammation, and supporting cellular regeneration.',
 'At increased pressure, oxygen dissolves more readily into blood plasma, reaching tissues that may have compromised blood flow. This triggers release of growth factors, stem cells, and supports collagen production and wound healing.',
 ARRAY['Wound healing', 'Sports recovery', 'Cognitive enhancement', 'Anti-aging', 'Post-surgical recovery', 'Chronic inflammation'],
 'MODERATE',
 'FDA-approved for 14 conditions including decompression sickness, wound healing, and carbon monoxide poisoning. Growing evidence for cognitive benefits and anti-aging applications, though more research is needed for wellness indications.',
 'Sessions last 60-90 minutes at 1.5-2.4 ATA pressure. Protocols range from 20-40 sessions depending on indication. Wellness applications typically use milder pressures (1.3-1.5 ATA) with 10-20 session protocols.',
 150, 400,
 'Ear and sinus discomfort during pressure changes. Rare risks include temporary vision changes, oxygen toxicity seizures (extremely rare at wellness protocols), and claustrophobia.',
 ARRAY['Untreated pneumothorax', 'Certain chemotherapy drugs', 'Severe COPD', 'Recent ear surgery'],
 true, NOW(), NOW()),

('trt_cryo', 'whole-body-cryotherapy', 'Whole Body Cryotherapy', ARRAY['WBC', 'Cryo', 'Cryosauna'], 'CRYOTHERAPY',
 'Whole Body Cryotherapy exposes the body to extremely cold temperatures (-110C to -140C) for 2-4 minutes in a specialized chamber. The extreme cold triggers a systemic response that reduces inflammation, releases endorphins, and may support recovery and metabolism.',
 'The sudden cold triggers vasoconstriction followed by vasodilation, flushing tissues with oxygenated blood. The body releases norepinephrine (reducing inflammation) and endorphins. Cold shock proteins may support cellular health.',
 ARRAY['Muscle recovery', 'Inflammation', 'Pain management', 'Mood enhancement', 'Skin health', 'Metabolic boost'],
 'EMERGING',
 'Studies show benefits for exercise recovery and inflammation reduction. Evidence for other claims (weight loss, anti-aging) is limited. Well-tolerated when properly administered, but long-term benefits need more research.',
 'Sessions last 2-4 minutes at temperatures between -110C and -140C. Wellness protocols typically involve daily or every-other-day sessions over 1-2 weeks, with maintenance sessions weekly or monthly.',
 50, 150,
 'Skin irritation or frostbite if not properly supervised. Rare cases of cold-related injuries. Not recommended for those with cold sensitivity or certain cardiovascular conditions.',
 ARRAY['Raynauds disease', 'Cold urticaria', 'Uncontrolled hypertension', 'Pregnancy', 'Severe cardiovascular disease'],
 true, NOW(), NOW()),

('trt_iv_vit', 'iv-vitamin-therapy', 'IV Vitamin Therapy', ARRAY['Myers Cocktail', 'Vitamin drip', 'IV nutrient therapy'], 'IV_THERAPIES',
 'IV Vitamin Therapy delivers vitamins, minerals, and antioxidants directly into the bloodstream, bypassing digestive absorption limitations. Formulations can be customized to address specific health goals from energy enhancement to immune support.',
 'Intravenous administration achieves 100% bioavailability compared to 20-50% with oral supplements. High-dose nutrients reach cells immediately, supporting enzymatic functions, energy production, and antioxidant defenses.',
 ARRAY['Energy enhancement', 'Immune support', 'Hangover recovery', 'Athletic performance', 'Skin health', 'Nutrient deficiencies'],
 'MODERATE',
 'Evidence supports IV therapy for documented deficiencies and certain medical conditions. Wellness applications have less rigorous evidence, though many patients report subjective improvements in energy and wellbeing.',
 'Sessions last 30-60 minutes. Protocols vary from single "boost" sessions to weekly treatments over several weeks. Formulations customized based on blood work and health assessment.',
 150, 500,
 'Vein irritation, bruising at injection site. Rare allergic reactions. Electrolyte imbalances with improper formulation. Should only be administered by trained medical personnel.',
 ARRAY['Kidney disease', 'Congestive heart failure', 'Certain genetic conditions affecting mineral metabolism'],
 true, NOW(), NOW()),

('trt_stem', 'stem-cell-therapy', 'Stem Cell Therapy', ARRAY['Regenerative cell therapy', 'MSC therapy'], 'REGENERATIVE',
 'Stem Cell Therapy harnesses the bodys natural regenerative potential by introducing stem cells to damaged or aging tissues. Treatments may use autologous cells (from the patient) or allogeneic cells (from donors), targeting tissue repair and regeneration.',
 'Stem cells can differentiate into various cell types and release growth factors that promote tissue repair. They modulate immune responses and reduce inflammation. Cells may be injected locally or administered systemically depending on the target.',
 ARRAY['Joint degeneration', 'Soft tissue injuries', 'Aging skin', 'Neurological conditions', 'Cardiovascular health', 'Systemic aging'],
 'EXPERIMENTAL',
 'Promising preclinical and early clinical results for orthopedic applications. Anti-aging and systemic applications are largely experimental. Regulatory status varies significantly by country. Long-term outcomes data is limited.',
 'Protocols vary widely based on cell source, target condition, and facility. May involve harvesting cells from fat or bone marrow, processing, and reinjection. Some facilities use banked allogeneic cells.',
 5000, 50000,
 'Injection site reactions, infection risk, theoretical concerns about uncontrolled cell growth. Quality control varies significantly between providers. Important to verify cell sourcing and processing standards.',
 ARRAY['Active cancer', 'Active infections', 'Blood disorders', 'Immunocompromised states'],
 true, NOW(), NOW()),

('trt_hormone', 'hormone-optimization', 'Hormone Optimization Therapy', ARRAY['HRT', 'Bioidentical hormones', 'BHRT'], 'HORMONE',
 'Hormone Optimization Therapy involves comprehensive hormone testing followed by personalized protocols to restore hormonal balance. May include bioidentical hormones, peptides, and lifestyle modifications to address age-related hormonal decline.',
 'Detailed blood panels assess hormone levels including testosterone, estrogen, progesterone, thyroid, DHEA, cortisol, and growth hormone markers. Protocols may include bioidentical hormone replacement, peptide therapy, and supporting supplements.',
 ARRAY['Fatigue', 'Weight gain', 'Mood changes', 'Decreased libido', 'Cognitive decline', 'Sleep issues', 'Muscle loss'],
 'MODERATE',
 'Hormone replacement for documented deficiencies is well-established medically. Optimization for "anti-aging" purposes has more limited evidence. Benefits and risks must be weighed individually. Requires ongoing medical supervision.',
 'Initial comprehensive testing, followed by customized protocol. May involve testosterone, estrogen/progesterone, thyroid hormones, DHEA, or peptides. Regular monitoring every 3-6 months with protocol adjustments.',
 500, 3000,
 'Depends on specific hormones used. May include cardiovascular risks, mood changes, acne, hair changes. Requires careful medical supervision and regular monitoring.',
 ARRAY['Hormone-sensitive cancers', 'Uncontrolled cardiovascular disease', 'Liver disease', 'Blood clotting disorders'],
 true, NOW(), NOW()),

('trt_neuro', 'neurofeedback', 'Neurofeedback Training', ARRAY['EEG biofeedback', 'Brain training', 'Neurotherapy'], 'MIND_NEURO',
 'Neurofeedback is a non-invasive brain training technique that uses real-time displays of brain activity to teach self-regulation of brain function. Through repeated sessions, individuals can learn to optimize brainwave patterns associated with focus, calm, and performance.',
 'EEG sensors monitor brainwave activity while the patient engages with visual or auditory feedback. When brain activity moves toward desired patterns, positive feedback is given. Over time, the brain learns to self-regulate more efficiently.',
 ARRAY['Stress and anxiety', 'Focus and concentration', 'Sleep quality', 'Peak performance', 'ADHD symptoms', 'Trauma recovery'],
 'MODERATE',
 'Good evidence for ADHD and epilepsy. Growing evidence for anxiety, depression, and trauma. Used by elite athletes and executives for performance optimization. Requires multiple sessions for lasting benefits.',
 'Initial brain mapping (qEEG) to identify patterns. Training sessions last 30-45 minutes, typically 20-40 sessions for lasting change. Some facilities offer intensive protocols with multiple daily sessions.',
 150, 400,
 'Generally very safe. Some patients report temporary headache or fatigue after sessions. Rarely, incorrect protocols may worsen symptoms temporarily.',
 ARRAY['Active seizure disorder without medical supervision'],
 true, NOW(), NOW()),

('trt_ayurveda', 'ayurvedic-panchakarma', 'Ayurvedic Panchakarma', ARRAY['Panchakarma', 'Ayurvedic detox'], 'TRADITIONAL',
 'Panchakarma is a comprehensive Ayurvedic cleansing and rejuvenation program involving five therapeutic procedures. This ancient system aims to remove toxins (ama) from the body and restore balance to the doshas (constitutional types).',
 'The program includes preparatory treatments (oil massage, steam therapy) followed by cleansing procedures including therapeutic vomiting, purgation, enema, nasal treatment, and blood purification. Treatment is customized based on individual constitution.',
 ARRAY['Digestive issues', 'Chronic stress', 'Skin conditions', 'Joint problems', 'General detoxification', 'Constitutional imbalance'],
 'TRADITIONAL',
 'Based on 5,000+ years of Ayurvedic tradition. Limited modern clinical research, though some studies show benefits for specific conditions. Widely practiced in India with significant experiential evidence. Quality varies significantly between practitioners.',
 'Minimum 7 days, traditionally 21-28 days for full protocol. Begins with consultation and constitution assessment. Includes daily treatments, specific diet, herbal preparations, and lifestyle guidance.',
 200, 800,
 'Some procedures can be intense or uncomfortable. Dehydration risk with purification therapies. Should only be done under qualified Ayurvedic supervision. Some herbal preparations may interact with medications.',
 ARRAY['Pregnancy', 'Severe weakness', 'Acute fever or infection', 'Certain chronic conditions'],
 true, NOW(), NOW()),

('trt_colon', 'colon-hydrotherapy', 'Colon Hydrotherapy', ARRAY['Colonic', 'Colonic irrigation', 'Colon cleansing'], 'DETOXIFICATION',
 'Colon Hydrotherapy involves gentle flushing of the colon with purified water to remove accumulated waste. Often used as part of detoxification programs, it aims to support digestive health and overall wellbeing.',
 'Warm, filtered water is introduced into the colon through a rectal tube, softening and removing waste material. The process is repeated multiple times during a session. Practitioners may add herbs or probiotics to the water.',
 ARRAY['Digestive issues', 'Constipation', 'Detoxification', 'Bloating', 'Preparation for other treatments'],
 'TRADITIONAL',
 'Limited scientific evidence for wellness benefits. Used traditionally in many cultures and as part of naturopathic practice. Some evidence for preparation before medical procedures. Not recommended as a regular practice by mainstream medicine.',
 'Sessions last 45-60 minutes. Often performed at the start of detox programs, sometimes in a series of 2-3 sessions. Should be performed by certified colon hydrotherapists using proper equipment.',
 80, 200,
 'Cramping, nausea, electrolyte imbalance with excessive use. Risk of perforation with improper technique. Should not be used frequently or as a weight loss method.',
 ARRAY['Inflammatory bowel disease', 'Recent colon surgery', 'Severe hemorrhoids', 'Heart or kidney disease'],
 true, NOW(), NOW());

-- ============================================
-- DIAGNOSTICS
-- ============================================

INSERT INTO "Diagnostic" ("id", "slug", "name", "category", "description", "whatItMeasures", "published", "createdAt", "updatedAt") VALUES
('diag_mri', 'full-body-mri', 'Full Body MRI Screening', 'IMAGING',
 'Comprehensive magnetic resonance imaging scan of the entire body to detect abnormalities, tumors, aneurysms, and other conditions at early stages before symptoms appear.',
 'Evaluates all major organs, blood vessels, joints, and soft tissues. Can detect tumors as small as a few millimeters, aneurysms, inflammation, and structural abnormalities throughout the body.',
 true, NOW(), NOW()),

('diag_blood', 'comprehensive-blood-panel', 'Comprehensive Metabolic & Biomarker Panel', 'BIOMARKERS',
 'Extensive blood testing covering metabolic function, organ health, hormones, inflammation markers, vitamins, minerals, and advanced biomarkers associated with aging and disease risk.',
 'Complete blood count, comprehensive metabolic panel, lipid panel, thyroid function, hormone levels (testosterone, estrogen, cortisol, DHEA), inflammation markers (CRP, homocysteine), vitamins (D, B12), HbA1c, insulin, and advanced markers.',
 true, NOW(), NOW()),

('diag_genetic', 'genetic-testing', 'Whole Genome Sequencing & Analysis', 'GENETIC',
 'Complete sequencing of the genome with analysis of disease risk variants, drug metabolism genes, and actionable genetic factors that can inform personalized health strategies.',
 'Disease risk variants, pharmacogenomic markers affecting drug response, carrier status for hereditary conditions, ancestry information, and traits. Analysis focuses on clinically actionable findings.',
 true, NOW(), NOW()),

('diag_micro', 'gut-microbiome-analysis', 'Comprehensive Gut Microbiome Analysis', 'MICROBIOME',
 'Advanced metagenomic sequencing of the gut microbiome to assess bacterial diversity, beneficial and pathogenic species, metabolic functions, and correlations with health conditions.',
 'Bacterial species diversity and abundance, presence of pathogens, beneficial bacteria levels, short-chain fatty acid producers, and functional pathways. Includes personalized diet and probiotic recommendations.',
 true, NOW(), NOW()),

('diag_cac', 'coronary-calcium-score', 'Coronary Artery Calcium Scoring (CT)', 'CARDIOVASCULAR',
 'CT scan of the heart measuring calcium deposits in coronary arteries, providing a direct measure of atherosclerosis and cardiovascular disease risk.',
 'Agatston score quantifying calcium buildup in coronary arteries. Higher scores correlate with increased risk of heart attack and cardiovascular events over 10 years.',
 true, NOW(), NOW());

-- ============================================
-- EQUIPMENT
-- ============================================

INSERT INTO "Equipment" ("id", "slug", "name", "brand", "model", "category", "description", "capabilities", "createdAt", "updatedAt") VALUES
('eq_mri', 'prenuvo-mri', 'Prenuvo Full Body MRI System', 'Prenuvo', 'Advanced 3T', 'MRI',
 'Advanced 3 Tesla MRI system optimized for preventive full-body screening with proprietary protocols designed to detect early-stage cancer, aneurysms, and other conditions.',
 ARRAY['Full body scan in under 60 minutes', 'Detection of tumors as small as 2mm', 'Aneurysm screening', 'Organ assessment', 'Spine and joint imaging'],
 NOW(), NOW()),

('eq_hbot', 'hyperbaric-multiplace', 'Multi-Place Hyperbaric Chamber', 'Sechrist', '3600H', 'HYPERBARIC',
 'Medical-grade multi-place hyperbaric chamber capable of treating multiple patients simultaneously at pressures up to 3 ATA with precise oxygen delivery.',
 ARRAY['Pressures up to 3 ATA', 'Multiple patient capacity', 'Medical-grade oxygen delivery', 'Emergency protocols', 'Full physician supervision'],
 NOW(), NOW()),

('eq_cryo', 'cryotherapy-chamber', 'Whole Body Cryotherapy Chamber', 'JUKA', 'Arctic Pro', 'CRYOTHERAPY',
 'Electric whole body cryotherapy chamber reaching temperatures of -140C for systemic cold exposure therapy without liquid nitrogen.',
 ARRAY['Temperatures to -140C', 'Nitrogen-free electric cooling', 'Full body exposure', 'Precise temperature control', 'Safety monitoring systems'],
 NOW(), NOW());

-- ============================================
-- PROPERTIES
-- ============================================

-- TIER 1: Clinique La Prairie
INSERT INTO "Property" ("id", "slug", "name", "description", "city", "country", "region", "latitude", "longitude", "nearestAirport", "transferTime", "tier", "approach", "focusAreas", "priceMin", "priceMax", "currency", "website", "foundedYear", "capacity", "accommodationType", "setting", "overallScore", "clinicalRigorScore", "outcomeEvidenceScore", "programDepthScore", "experienceQualityScore", "valueAlignmentScore", "physicianPatientRatio", "avgBookingLeadTime", "returnGuestPercentage", "staffTenure", "actualCustomization", "postVisitFollowup", "discretionLevel", "genderSeparatedFacilities", "religiousDietaryOptions", "privacyArchitecture", "prayerFacilities", "languagesMedical", "languagesService", "soloTravelerFriendly", "lgbtqWelcoming", "partnershipStatus", "published", "featured", "editorChoice", "verifiedExcellence", "createdAt", "updatedAt") VALUES
('prop_clp', 'clinique-la-prairie', 'Clinique La Prairie',
 'Founded in 1931, Clinique La Prairie is the birthplace of cellular therapy and remains at the forefront of longevity medicine. The Swiss medical clinic combines cutting-edge diagnostics with regenerative treatments, offering comprehensive programs that address aging at the cellular level. Their signature Revitalisation program has attracted royalty, business leaders, and celebrities for nearly a century.',
 'Montreux', 'Switzerland', 'Vaud', 46.4312, 6.9107, 'Geneva International Airport (GVA)', '1 hour by car',
 'TIER_1', 'CLINICAL', ARRAY['LONGEVITY', 'MEDICAL_ASSESSMENT', 'COGNITIVE_BRAIN', 'BEAUTY_AESTHETIC']::"FocusArea"[],
 25000, 150000, 'CHF', 'https://www.cliniquelaprairie.com', 1931, 38, 'Private suites with lake views', 'Lakeside',
 94, 96, 92, 95, 93, 88, '1:3', '8-12 weeks', 72, 'Average 12 years',
 'Programs are highly individualized based on comprehensive initial assessment. Each guest has a dedicated medical team that adjusts protocols based on daily monitoring and feedback.',
 'Dedicated follow-up consultations at 30, 90, and 180 days. Annual biomarker tracking. 24/7 access to medical concierge for ongoing questions.',
 'ULTRA_HIGH', 'PARTIAL', ARRAY['Halal available', 'Kosher available', 'Vegan', 'Gluten-free'],
 'Private suites with dedicated entrances', 'Quiet meditation rooms available',
 ARRAY['English', 'French', 'German', 'Italian', 'Russian', 'Arabic', 'Mandarin'],
 ARRAY['English', 'French', 'German', 'Italian', 'Russian', 'Arabic', 'Mandarin', 'Japanese'],
 'OPTIMIZED', 'EXPLICITLY_WELCOMING', 'AFFILIATE', true, true, 'Best for Comprehensive Longevity Assessment', true, NOW(), NOW());

-- TIER 1: Lanserhof Tegernsee
INSERT INTO "Property" ("id", "slug", "name", "description", "city", "country", "region", "latitude", "longitude", "nearestAirport", "transferTime", "tier", "approach", "focusAreas", "priceMin", "priceMax", "currency", "website", "foundedYear", "capacity", "accommodationType", "setting", "overallScore", "clinicalRigorScore", "outcomeEvidenceScore", "programDepthScore", "experienceQualityScore", "valueAlignmentScore", "physicianPatientRatio", "avgBookingLeadTime", "returnGuestPercentage", "staffTenure", "actualCustomization", "postVisitFollowup", "discretionLevel", "genderSeparatedFacilities", "religiousDietaryOptions", "privacyArchitecture", "prayerFacilities", "languagesMedical", "languagesService", "soloTravelerFriendly", "lgbtqWelcoming", "partnershipStatus", "published", "featured", "verifiedExcellence", "createdAt", "updatedAt") VALUES
('prop_lanserhof', 'lanserhof-tegernsee', 'Lanserhof Tegernsee',
 'Lanserhof Tegernsee represents the pinnacle of German medical wellness, combining the LANS Med Concept with state-of-the-art diagnostics in a stunning architectural setting. The facility is renowned for its comprehensive approach to gut health, metabolic optimization, and stress recovery, utilizing both modern medicine and traditional Mayr therapy principles.',
 'Tegernsee', 'Germany', 'Bavaria', 47.7031, 11.7437, 'Munich International Airport (MUC)', '1 hour by car',
 'TIER_1', 'INTEGRATIVE', ARRAY['DETOX', 'WEIGHT_METABOLIC', 'STRESS_BURNOUT', 'MEDICAL_ASSESSMENT']::"FocusArea"[],
 8000, 35000, 'EUR', 'https://www.lanserhof.com', 2013, 70, 'Luxury suites with Alpine views', 'Alpine lakeside',
 92, 94, 90, 93, 91, 90, '1:4', '4-6 weeks', 64, 'Average 8 years',
 'Initial comprehensive assessment determines personalized protocol. Daily doctor consultations adjust treatments based on progress. Nutrition plan created by dedicated team.',
 'Detailed report with ongoing recommendations. Follow-up consultation at 6 weeks. Annual program discount for returning guests.',
 'HIGH', 'PARTIAL', ARRAY['Vegetarian', 'Vegan', 'Gluten-free', 'Lactose-free'],
 'Private suites with separate entrance options', 'Quiet spaces for meditation',
 ARRAY['German', 'English'], ARRAY['German', 'English', 'French', 'Italian'],
 'OPTIMIZED', 'EXPLICITLY_WELCOMING', 'LEAD_GEN', true, true, true, NOW(), NOW());

-- TIER 2: Chiva-Som
INSERT INTO "Property" ("id", "slug", "name", "description", "city", "country", "region", "latitude", "longitude", "nearestAirport", "transferTime", "tier", "approach", "focusAreas", "priceMin", "priceMax", "currency", "website", "foundedYear", "capacity", "accommodationType", "setting", "overallScore", "outcomeEvidenceScore", "programDepthScore", "experienceQualityScore", "valueAlignmentScore", "physicianPatientRatio", "avgBookingLeadTime", "returnGuestPercentage", "staffTenure", "actualCustomization", "postVisitFollowup", "discretionLevel", "genderSeparatedFacilities", "religiousDietaryOptions", "privacyArchitecture", "prayerFacilities", "languagesMedical", "languagesService", "soloTravelerFriendly", "lgbtqWelcoming", "partnershipStatus", "published", "featured", "createdAt", "updatedAt") VALUES
('prop_chiva', 'chiva-som', 'Chiva-Som International Health Resort',
 'A pioneer in destination wellness since 1995, Chiva-Som seamlessly blends Eastern healing traditions with Western medical science. Set on the Gulf of Thailand, the resort offers over 200 treatments and seven wellness modalities, from physiotherapy to holistic healing, all supported by comprehensive health assessments.',
 'Hua Hin', 'Thailand', 'Prachuap Khiri Khan', 12.5684, 99.9577, 'Suvarnabhumi Airport Bangkok (BKK)', '3 hours by car or 30 minutes by helicopter',
 'TIER_2', 'INTEGRATIVE', ARRAY['STRESS_BURNOUT', 'WEIGHT_METABOLIC', 'FITNESS_PERFORMANCE', 'HOLISTIC_SPIRITUAL', 'SLEEP']::"FocusArea"[],
 5000, 25000, 'USD', 'https://www.chivasom.com', 1995, 57, 'Thai-style pavilions and suites', 'Beachfront',
 89, 86, 91, 92, 87, '1:8', '6-8 weeks', 58, 'Average 10 years',
 'Health consultation determines retreat focus. Treatments selected from menu to address specific goals. Adjustments made throughout stay based on feedback.',
 'Wellness report with recommendations. Optional remote consultations available. Alumni newsletter with health tips.',
 'HIGH', 'PARTIAL', ARRAY['Vegetarian', 'Vegan', 'Halal available', 'Gluten-free'],
 'Private pavilions throughout resort', 'Buddhist meditation temple on grounds',
 ARRAY['English', 'Thai'], ARRAY['English', 'Thai', 'German', 'French', 'Japanese', 'Mandarin'],
 'OPTIMIZED', 'WELCOMING', 'AFFILIATE', true, true, NOW(), NOW());

-- TIER 2: Kamalaya
INSERT INTO "Property" ("id", "slug", "name", "description", "city", "country", "region", "latitude", "longitude", "nearestAirport", "transferTime", "tier", "approach", "focusAreas", "priceMin", "priceMax", "currency", "website", "foundedYear", "capacity", "accommodationType", "setting", "overallScore", "outcomeEvidenceScore", "programDepthScore", "experienceQualityScore", "valueAlignmentScore", "physicianPatientRatio", "avgBookingLeadTime", "returnGuestPercentage", "staffTenure", "actualCustomization", "postVisitFollowup", "discretionLevel", "genderSeparatedFacilities", "religiousDietaryOptions", "privacyArchitecture", "prayerFacilities", "languagesMedical", "languagesService", "soloTravelerFriendly", "lgbtqWelcoming", "partnershipStatus", "published", "createdAt", "updatedAt") VALUES
('prop_kamalaya', 'kamalaya-koh-samui', 'Kamalaya Koh Samui',
 'Set around a cave once used by Buddhist monks for meditation, Kamalaya is an award-winning wellness sanctuary combining ancient healing traditions with modern science. The holistic approach integrates Asian healing arts, detox therapies, and life-enhancement programs in a serene tropical setting.',
 'Koh Samui', 'Thailand', 'Surat Thani', 9.4286, 100.0414, 'Samui International Airport (USM)', '25 minutes by car',
 'TIER_2', 'HOLISTIC', ARRAY['STRESS_BURNOUT', 'DETOX', 'HOLISTIC_SPIRITUAL', 'SLEEP', 'GENERAL_REJUVENATION']::"FocusArea"[],
 3500, 15000, 'USD', 'https://www.kamalaya.com', 2005, 75, 'Hillside suites and villas', 'Tropical hillside with sea views',
 87, 83, 88, 90, 89, '1:10', '4-6 weeks', 52, 'Average 7 years',
 'Wellness consultation shapes program focus. Treatment schedule built around personal goals. Regular check-ins to adjust approach.',
 'Post-retreat recommendations. Online wellness resources for alumni. Special return guest rates.',
 'STANDARD', 'NONE', ARRAY['Vegetarian', 'Vegan', 'Gluten-free', 'Raw food options'],
 'Secluded hillside villas', 'Buddhist cave shrine, meditation sala',
 ARRAY['English', 'Thai'], ARRAY['English', 'Thai', 'German', 'French'],
 'OPTIMIZED', 'WELCOMING', 'LEAD_GEN', true, NOW(), NOW());

-- TIER 3: Amanpuri
INSERT INTO "Property" ("id", "slug", "name", "description", "city", "country", "region", "latitude", "longitude", "nearestAirport", "transferTime", "tier", "approach", "focusAreas", "priceMin", "priceMax", "currency", "website", "foundedYear", "capacity", "accommodationType", "setting", "overallScore", "experienceQualityScore", "programDepthScore", "valueAlignmentScore", "avgBookingLeadTime", "returnGuestPercentage", "staffTenure", "actualCustomization", "postVisitFollowup", "discretionLevel", "genderSeparatedFacilities", "religiousDietaryOptions", "privacyArchitecture", "prayerFacilities", "languagesMedical", "languagesService", "soloTravelerFriendly", "lgbtqWelcoming", "partnershipStatus", "published", "createdAt", "updatedAt") VALUES
('prop_aman', 'amanpuri-phuket', 'Amanpuri',
 'The original Aman resort, Amanpuri set the standard for luxury wellness hospitality when it opened in 1988. Set on a private coconut plantation overlooking the Andaman Sea, the resort offers comprehensive Aman Wellness programs combining Thai healing traditions with modern wellness science in an atmosphere of refined tranquility.',
 'Phuket', 'Thailand', 'Phuket', 7.9756, 98.2796, 'Phuket International Airport (HKT)', '25 minutes by car',
 'TIER_3', 'LIFESTYLE', ARRAY['GENERAL_REJUVENATION', 'STRESS_BURNOUT', 'FITNESS_PERFORMANCE', 'BEAUTY_AESTHETIC']::"FocusArea"[],
 3000, 12000, 'USD', 'https://www.aman.com/resorts/amanpuri', 1988, 40, 'Private pavilions and villas', 'Beachfront on private peninsula',
 85, 95, 80, 82, '4-8 weeks', 68, 'Average 9 years',
 'Wellness consultation available. Treatments a la carte or in program packages. Personal preferences noted and remembered for returning guests.',
 'Aman guest recognition across all properties. Occasional wellness newsletters.',
 'ULTRA_HIGH', 'ON_REQUEST', ARRAY['Halal available', 'Kosher available', 'Vegetarian', 'Vegan'],
 'Completely private pavilions with dedicated staff', 'Arranged upon request',
 ARRAY['English', 'Thai'], ARRAY['English', 'Thai', 'German', 'French', 'Russian', 'Mandarin', 'Japanese', 'Arabic'],
 'GOOD', 'EXPLICITLY_WELCOMING', 'CONTACTED', true, NOW(), NOW());

-- ============================================
-- TIER ONE DETAILS
-- ============================================

INSERT INTO "TierOneDetails" ("id", "propertyId", "medicalDirector", "medicalDirectorCreds", "medicalTeamSize", "certifications", "hospitalAffiliations", "researchPublications", "createdAt", "updatedAt") VALUES
('tod_clp', 'prop_clp', 'Prof. Dr. med. Olivier Courtin-Clarins', 'MD, PhD in Cellular Biology, 25+ years in regenerative medicine', 18,
 ARRAY['Swiss Medical Facility License', 'ISO 9001:2015'],
 ARRAY['Centre Hospitalier Universitaire Vaudois'],
 ARRAY['Cellular therapy outcomes: A 20-year retrospective study', 'Biomarkers of aging: Predictive factors for longevity interventions'],
 NOW(), NOW()),

('tod_lan', 'prop_lanserhof', 'Dr. med. Jan Stritzke', 'MD, Specialist in Internal Medicine, Mayr Physician', 12,
 ARRAY['German Medical Facility License', 'TUV Certified'],
 ARRAY['Klinikum rechts der Isar'],
 ARRAY['Metabolic effects of Mayr therapy: A clinical study'],
 NOW(), NOW());

-- ============================================
-- PROGRAMS
-- ============================================

INSERT INTO "Program" ("id", "propertyId", "name", "description", "durationDays", "price", "currency", "focusAreas", "inclusions", "exclusions", "typicalSchedule", "published", "createdAt", "updatedAt") VALUES
('prog_clp_revit', 'prop_clp', 'Revitalisation Program',
 'The signature Clinique La Prairie experience, this comprehensive program combines advanced diagnostics, cellular therapy, and personalized wellness protocols to address aging at the cellular level. Includes full medical assessment, bespoke treatment plan, and ongoing follow-up.',
 7, 35000, 'CHF', ARRAY['LONGEVITY', 'MEDICAL_ASSESSMENT']::"FocusArea"[],
 ARRAY['Comprehensive medical assessment', 'Cellular therapy protocol', 'Daily treatments', 'Nutrition consultation', 'Accommodation in private suite', 'All meals', 'Airport transfers', '6-month follow-up'],
 ARRAY['International flights', 'Personal expenses'],
 'Day 1: Arrival, initial consultation. Days 2-3: Diagnostic testing. Days 4-6: Treatment protocols and wellness activities. Day 7: Results review and departure planning.',
 true, NOW(), NOW()),

('prog_lan_basic', 'prop_lanserhof', 'LANS Med Basic',
 'Foundation program combining Mayr therapy principles with modern diagnostics. Focuses on gut health restoration, metabolic optimization, and stress recovery through medical supervision, therapeutic fasting, and comprehensive treatments.',
 10, 12000, 'EUR', ARRAY['DETOX', 'WEIGHT_METABOLIC', 'STRESS_BURNOUT']::"FocusArea"[],
 ARRAY['Medical consultation', 'Mayr therapy', 'Daily treatments', 'Accommodation', 'Mayr cuisine', 'Use of facilities'],
 ARRAY['Additional specialist consultations', 'Some advanced treatments'],
 'Daily: Morning consultation, Mayr meals, afternoon treatments, evening relaxation. Weekly: Medical review and protocol adjustment.',
 true, NOW(), NOW()),

('prog_chiva_perf', 'prop_chiva', 'Optimal Performance',
 'Comprehensive program for executives and high-performers seeking to optimize physical and mental performance. Combines fitness assessment, nutrition analysis, stress management, and targeted treatments.',
 7, 8500, 'USD', ARRAY['FITNESS_PERFORMANCE', 'STRESS_BURNOUT', 'SLEEP']::"FocusArea"[],
 ARRAY['Health consultation', 'Fitness assessment', 'Daily treatments', 'Personal training sessions', 'Nutrition consultation', 'Accommodation', 'Healthy cuisine'],
 ARRAY['Airport transfers', 'Additional treatments'],
 'Morning: Exercise and movement. Midday: Spa treatments. Afternoon: Wellness activities. Evening: Relaxation and healthy dining.',
 true, NOW(), NOW());

-- ============================================
-- PROPERTY-TREATMENT LINKS
-- ============================================

INSERT INTO "PropertyTreatment" ("propertyId", "treatmentId", "notes", "priceAtProperty", "createdAt") VALUES
('prop_clp', 'trt_nad', 'Part of cellular therapy protocols', 800, NOW()),
('prop_clp', 'trt_stem', 'Signature CLP cellular therapy', 25000, NOW()),
('prop_clp', 'trt_iv_vit', NULL, 400, NOW()),
('prop_clp', 'trt_hormone', NULL, 2500, NOW()),
('prop_lanserhof', 'trt_colon', 'Integral to Mayr protocol', 120, NOW()),
('prop_lanserhof', 'trt_iv_vit', NULL, 250, NOW()),
('prop_lanserhof', 'trt_hbot', NULL, 180, NOW()),
('prop_chiva', 'trt_colon', NULL, 90, NOW()),
('prop_chiva', 'trt_cryo', NULL, 80, NOW()),
('prop_chiva', 'trt_iv_vit', NULL, 200, NOW()),
('prop_chiva', 'trt_neuro', NULL, 180, NOW()),
('prop_kamalaya', 'trt_ayurveda', 'Signature treatment, highly recommended', 350, NOW()),
('prop_kamalaya', 'trt_colon', NULL, 85, NOW()),
('prop_aman', 'trt_iv_vit', NULL, 350, NOW());

-- ============================================
-- PROPERTY-DIAGNOSTIC LINKS
-- ============================================

INSERT INTO "PropertyDiagnostic" ("propertyId", "diagnosticId", "notes", "createdAt") VALUES
('prop_clp', 'diag_mri', 'Part of comprehensive assessment', NOW()),
('prop_clp', 'diag_blood', NULL, NOW()),
('prop_clp', 'diag_genetic', NULL, NOW()),
('prop_clp', 'diag_cac', NULL, NOW()),
('prop_lanserhof', 'diag_blood', NULL, NOW()),
('prop_lanserhof', 'diag_micro', 'Core to Mayr approach', NOW()),
('prop_chiva', 'diag_blood', NULL, NOW());

-- ============================================
-- PROPERTY-EQUIPMENT LINKS
-- ============================================

INSERT INTO "PropertyEquipment" ("propertyId", "equipmentId", "installationYear", "notes", "createdAt") VALUES
('prop_clp', 'eq_mri', 2022, NULL, NOW()),
('prop_lanserhof', 'eq_hbot', 2018, NULL, NOW()),
('prop_chiva', 'eq_cryo', 2020, NULL, NOW());

-- ============================================
-- TREATMENT-EQUIPMENT LINKS
-- ============================================

INSERT INTO "TreatmentEquipment" ("treatmentId", "equipmentId", "createdAt") VALUES
('trt_hbot', 'eq_hbot', NOW()),
('trt_cryo', 'eq_cryo', NOW());

-- ============================================
-- CLARUS INDEX SCORES
-- ============================================

INSERT INTO "ClarusIndexScore" ("id", "propertyId", "overallScore", "tier", "dimensions", "assessmentDate", "assessedBy", "methodology", "createdAt") VALUES
('cis_clp', 'prop_clp', 94, 'EXCEPTIONAL',
 '{"clinicalRigor": 96, "outcomeEvidence": 92, "programDepth": 95, "experienceQuality": 93, "valueAlignment": 88}',
 '2024-09-15', 'Dr. Sarah Chen', 'v1.0', NOW()),

('cis_lan', 'prop_lanserhof', 92, 'EXCEPTIONAL',
 '{"clinicalRigor": 94, "outcomeEvidence": 90, "programDepth": 93, "experienceQuality": 91, "valueAlignment": 90}',
 '2024-08-20', 'James Worthington', 'v1.0', NOW()),

('cis_chi', 'prop_chiva', 89, 'DISTINGUISHED',
 '{"programEffectiveness": 86, "holisticIntegration": 88, "practitionerQuality": 87, "experienceQuality": 92, "valueAlignment": 87}',
 '2024-07-10', 'James Worthington', 'v1.0', NOW()),

('cis_kam', 'prop_kamalaya', 87, 'DISTINGUISHED',
 '{"programEffectiveness": 83, "holisticIntegration": 90, "practitionerQuality": 86, "experienceQuality": 90, "valueAlignment": 89}',
 '2024-06-25', 'Dr. Sarah Chen', 'v1.0', NOW()),

('cis_ama', 'prop_aman', 85, 'DISTINGUISHED',
 '{"experienceQuality": 95, "wellnessOfferingDepth": 82, "transformativePotential": 80, "settingEnvironment": 94, "valueAlignment": 82}',
 '2024-05-15', 'James Worthington', 'v1.0', NOW());

-- ============================================
-- SAMPLE REVIEW
-- ============================================

INSERT INTO "Review" ("id", "propertyId", "isTeamReview", "teamMemberId", "reviewerName", "visitDate", "programType", "stayLengthDays", "statedGoals", "overallRating", "serviceRating", "facilitiesRating", "diningRating", "valueRating", "goalAchievement", "protocolQualityRating", "followupQualityRating", "physicianEndorsement", "bioAgeChange", "energyImprovement", "sleepImprovement", "specificOutcomes", "reviewText", "pros", "cons", "verified", "verificationMethod", "status", "helpfulCount", "createdAt", "updatedAt") VALUES
('rev_clp_1', 'prop_clp', true, 'tm_sarah_chen', 'Dr. Sarah Chen',
 '2024-06-15', 'Revitalisation Program', 7,
 ARRAY['Comprehensive health assessment', 'Cellular rejuvenation', 'Longevity optimization'],
 5, 5, 5, 4, 4, 'FULLY', 5, 5, 'YES', -3, 8, 7,
 'Comprehensive biomarker panel showed significant improvements in inflammatory markers, lipid profile, and hormone levels at 90-day follow-up.',
 'Clinique La Prairie delivers on its reputation as the gold standard in medical longevity. The depth of diagnostic assessment rivals any academic medical center, while the integration of cellular therapy protocols is unmatched. The medical team demonstrated exceptional expertise, with my dedicated physician available throughout the stay. The facility itself is understated luxury - not flashy, but every detail considered. The 64% return guest rate makes sense: this is the kind of experience that creates lifelong relationships.',
 ARRAY['Unparalleled diagnostic depth', 'World-class medical team', 'Exceptional personalization', 'Robust follow-up program', 'Complete discretion'],
 ARRAY['Premium pricing limits accessibility', 'Some treatments feel dated despite proven efficacy', 'Lake Geneva weather can be variable'],
 true, 'team_visit', 'APPROVED', 47, NOW(), NOW());

-- ============================================
-- UPDATE TEAM MEMBER PROPERTY VISITS
-- ============================================

UPDATE "TeamMember" SET "propertiesVisited" = ARRAY['prop_clp', 'prop_lanserhof', 'prop_kamalaya'] WHERE "id" = 'tm_sarah_chen';
UPDATE "TeamMember" SET "propertiesVisited" = ARRAY['prop_clp', 'prop_lanserhof', 'prop_chiva', 'prop_aman'] WHERE "id" = 'tm_james_worthington';

-- Done!
SELECT 'Database seeded successfully!' AS status;
