/**
 * Clarus Vitae - Treatments Expansion Seed
 *
 * This seed file adds 18 additional treatments to expand the treatment catalog.
 * Run AFTER the main seed.ts and seed-treatments.ts to preserve existing data.
 *
 * Treatments added:
 *
 * Body Manual (5):
 * 1. Thai Massage
 * 2. Shiatsu
 * 3. Reflexology
 * 4. Watsu (Water Shiatsu)
 * 5. Hot Stone Massage
 *
 * Traditional (3):
 * 6. TCM Consultation
 * 7. Ayurvedic Consultation
 * 8. Moxibustion
 *
 * Mind/Neuro (3):
 * 9. EMDR Therapy
 * 10. Sound Healing
 * 11. Meditation Instruction
 *
 * Aesthetic (3):
 * 12. Microneedling
 * 13. LED Light Therapy (Face)
 * 14. Body Contouring
 *
 * Detox (2):
 * 15. Juice Fasting Protocol
 * 16. Liver Flush Program
 *
 * Regenerative (2):
 * 17. Stem Cell Therapy (if not exists)
 * 18. Growth Factor Therapy
 *
 * Usage:
 *   cd packages/database
 *   npx tsx prisma/seed-treatments-expansion.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('💊 Starting Treatments Expansion...\n');

  // Check for existing treatments to avoid duplicates
  const existingTreatments = await prisma.treatment.findMany({
    select: { slug: true },
  });
  const existingSlugs = new Set(existingTreatments.map((t) => t.slug));

  const treatmentsToCreate = [];

  // ============================================
  // BODY MANUAL TREATMENTS
  // ============================================

  if (!existingSlugs.has('thai-massage')) {
    treatmentsToCreate.push({
      slug: 'thai-massage',
      name: 'Traditional Thai Massage',
      aliases: ['Nuad Thai', 'Thai yoga massage', 'Ancient massage'],
      category: 'BODY_MANUAL',
      description:
        'Traditional Thai massage is an ancient healing practice combining acupressure, Indian Ayurvedic principles, and assisted yoga postures. Performed on a floor mat with the client fully clothed, it involves rhythmic pressing and stretching of the entire body.',
      howItWorks:
        'The practitioner uses hands, thumbs, elbows, knees, and feet to apply pressure along energy lines (sen) while moving the body into yoga-like stretches. This combination releases muscle tension, improves flexibility, and balances energy flow.',
      whatItAddresses: [
        'Muscle tension',
        'Joint stiffness',
        'Poor flexibility',
        'Energy blockages',
        'Stress',
        'Back pain',
      ],
      evidenceLevel: 'MODERATE',
      evidenceSummary:
        'Research supports benefits for reducing muscle tension, improving flexibility, and decreasing stress. Some studies show benefits for chronic low back pain. Considered generally safe when performed by trained practitioners.',
      typicalProtocol:
        'Sessions typically last 60-120 minutes. Client remains clothed in comfortable attire. Performed on a floor mat. Frequency depends on goals: weekly for therapeutic benefits, monthly for maintenance.',
      priceRangeMin: 80,
      priceRangeMax: 200,
      potentialRisks:
        'May cause temporary soreness. Avoid with recent injuries, osteoporosis, cardiovascular conditions, or during pregnancy.',
      contraindications: [
        'Recent injuries or surgeries',
        'Osteoporosis',
        'Cardiovascular disease',
        'Pregnancy',
        'Blood clots',
      ],
      published: true,
    });
  }

  if (!existingSlugs.has('shiatsu')) {
    treatmentsToCreate.push({
      slug: 'shiatsu',
      name: 'Shiatsu Massage',
      aliases: ['Japanese finger pressure', 'Shiatsu therapy'],
      category: 'BODY_MANUAL',
      description:
        'Shiatsu is a Japanese bodywork therapy that uses finger and palm pressure along meridians to correct energy imbalances and promote healing. It incorporates elements of traditional Chinese medicine with modern anatomical knowledge.',
      howItWorks:
        'Practitioners apply rhythmic pressure using fingers, thumbs, and palms to specific points along the body\'s meridians. This stimulates the body\'s self-healing abilities, releases tension, and restores energy balance.',
      whatItAddresses: [
        'Stress and anxiety',
        'Headaches',
        'Muscle tension',
        'Digestive issues',
        'Fatigue',
        'Sleep problems',
      ],
      evidenceLevel: 'EMERGING',
      evidenceSummary:
        'Limited but growing research suggests benefits for stress reduction, anxiety, and some musculoskeletal conditions. Traditional practice with centuries of use in Japan.',
      typicalProtocol:
        'Sessions last 60-90 minutes. Client remains clothed on a floor mat or massage table. Gentle to firm pressure applied. Weekly sessions initially, then as needed.',
      priceRangeMin: 90,
      priceRangeMax: 180,
      potentialRisks:
        'Generally very safe. Temporary soreness possible. Communicate pressure preferences to practitioner.',
      contraindications: [
        'Open wounds',
        'Recent fractures',
        'Severe osteoporosis',
        'Infectious skin conditions',
      ],
      published: true,
    });
  }

  if (!existingSlugs.has('reflexology')) {
    treatmentsToCreate.push({
      slug: 'reflexology',
      name: 'Reflexology',
      aliases: ['Foot reflexology', 'Zone therapy', 'Reflex zone massage'],
      category: 'BODY_MANUAL',
      description:
        'Reflexology is a therapeutic method based on the principle that points on the feet, hands, and ears correspond to different organs and systems in the body. Applying pressure to these reflex points promotes healing and relaxation.',
      howItWorks:
        'Pressure applied to specific reflex points sends signals through the nervous system to corresponding body areas, promoting relaxation, improving circulation, and supporting the body\'s natural healing processes.',
      whatItAddresses: [
        'Stress and anxiety',
        'Headaches',
        'Digestive issues',
        'Sleep problems',
        'General relaxation',
        'Circulation',
      ],
      evidenceLevel: 'EMERGING',
      evidenceSummary:
        'Some studies suggest benefits for anxiety, stress reduction, and quality of life. Evidence for specific organ effects is limited. Generally considered a relaxing, low-risk therapy.',
      typicalProtocol:
        'Sessions typically last 30-60 minutes. Focus is usually on the feet but may include hands or ears. Weekly sessions for specific issues, less frequently for maintenance.',
      priceRangeMin: 60,
      priceRangeMax: 120,
      potentialRisks:
        'Very safe. Avoid with foot injuries, gout, or thrombosis. Some experience temporary fatigue after sessions.',
      contraindications: [
        'Foot injuries or infections',
        'Gout',
        'Thrombosis or blood clots',
        'Pregnancy (first trimester)',
      ],
      published: true,
    });
  }

  if (!existingSlugs.has('watsu')) {
    treatmentsToCreate.push({
      slug: 'watsu',
      name: 'Watsu (Water Shiatsu)',
      aliases: ['Aquatic bodywork', 'Water massage', 'Aquatic shiatsu'],
      category: 'BODY_MANUAL',
      description:
        'Watsu combines elements of shiatsu, stretching, and joint mobilization performed in warm water (around 35°C). The buoyancy of water allows for deep relaxation and gentle movements not possible on land, creating a profoundly relaxing experience.',
      howItWorks:
        'In chest-deep warm water, the practitioner supports and moves the client through a series of flowing movements, stretches, and pressure point work. Water\'s buoyancy supports the body, allowing deeper relaxation and freer movement.',
      whatItAddresses: [
        'Deep relaxation',
        'Muscle tension',
        'Joint stiffness',
        'Chronic pain',
        'Stress and anxiety',
        'PTSD and trauma',
      ],
      evidenceLevel: 'EMERGING',
      evidenceSummary:
        'Limited research but consistently positive reports for relaxation, pain reduction, and emotional release. The unique aquatic environment enables movements and relaxation not achievable on land.',
      typicalProtocol:
        'Sessions last 45-90 minutes in a warm pool. One-on-one with practitioner. Client wears swimsuit. Deeply relaxing - allow rest time afterward.',
      priceRangeMin: 120,
      priceRangeMax: 250,
      potentialRisks:
        'Safe when performed by trained practitioners. Ensure pool water quality. Not suitable for those afraid of water.',
      contraindications: [
        'Fear of water',
        'Open wounds',
        'Active infections',
        'Uncontrolled epilepsy',
        'Severe cardiovascular disease',
      ],
      published: true,
    });
  }

  if (!existingSlugs.has('hot-stone-massage')) {
    treatmentsToCreate.push({
      slug: 'hot-stone-massage',
      name: 'Hot Stone Massage',
      aliases: ['Stone therapy', 'Heated stone massage', 'LaStone therapy'],
      category: 'BODY_MANUAL',
      description:
        'Hot stone massage uses smooth, heated basalt stones placed on key points of the body and used as massage tools. The heat penetrates muscles deeply, enhancing relaxation and enabling the therapist to work more effectively on tense areas.',
      howItWorks:
        'Stones heated to 50-54°C (122-130°F) are placed on specific body points and used to massage muscles. The heat increases blood flow, relaxes muscles, and allows deeper pressure without discomfort.',
      whatItAddresses: [
        'Muscle tension',
        'Stress',
        'Poor circulation',
        'Chronic pain',
        'Insomnia',
        'Joint stiffness',
      ],
      evidenceLevel: 'EMERGING',
      evidenceSummary:
        'Limited formal research but widely used and valued for relaxation. Heat therapy benefits are well-established; combination with massage enhances muscle relaxation.',
      typicalProtocol:
        'Sessions last 60-90 minutes. Stones are heated and placed on back, hands, feet, and other areas. Some therapists use cold stones for contrast. Monthly sessions for relaxation.',
      priceRangeMin: 100,
      priceRangeMax: 200,
      potentialRisks:
        'Risk of burns if stones too hot. Communicate temperature preferences. Avoid with heat-sensitive conditions.',
      contraindications: [
        'Pregnancy',
        'High blood pressure (severe)',
        'Diabetes with neuropathy',
        'Skin conditions',
        'Recent surgery',
      ],
      published: true,
    });
  }

  // ============================================
  // TRADITIONAL TREATMENTS
  // ============================================

  if (!existingSlugs.has('tcm-consultation')) {
    treatmentsToCreate.push({
      slug: 'tcm-consultation',
      name: 'Traditional Chinese Medicine Consultation',
      aliases: ['TCM diagnosis', 'Chinese medicine assessment', 'TCM evaluation'],
      category: 'TRADITIONAL',
      description:
        'A comprehensive TCM consultation involves assessment through the four pillars: observation (looking), auscultation/olfaction (listening/smelling), inquiry (asking), and palpation (pulse and tongue diagnosis). This creates a complete picture of health according to TCM principles.',
      howItWorks:
        'The practitioner evaluates tongue appearance, pulse qualities at both wrists, complexion, voice, and detailed health history to identify patterns of imbalance. Treatment recommendations may include acupuncture, herbs, dietary changes, and lifestyle modifications.',
      whatItAddresses: [
        'Chronic conditions',
        'Digestive issues',
        'Hormonal imbalances',
        'Sleep problems',
        'Stress and anxiety',
        'General wellness optimization',
      ],
      evidenceLevel: 'TRADITIONAL',
      evidenceSummary:
        'TCM diagnosis methods have been used for thousands of years. While diagnostic categories differ from Western medicine, they guide effective treatments within the TCM framework.',
      typicalProtocol:
        'Initial consultation lasts 60-90 minutes. Follow-up visits 30-45 minutes. May lead to ongoing treatment plan with herbs, acupuncture, and lifestyle recommendations.',
      priceRangeMin: 100,
      priceRangeMax: 250,
      potentialRisks:
        'Consultation itself has no risks. Important to disclose all medications due to potential herb-drug interactions.',
      contraindications: [],
      published: true,
    });
  }

  if (!existingSlugs.has('ayurvedic-consultation')) {
    treatmentsToCreate.push({
      slug: 'ayurvedic-consultation',
      name: 'Ayurvedic Consultation',
      aliases: ['Ayurveda assessment', 'Dosha diagnosis', 'Prakriti analysis'],
      category: 'TRADITIONAL',
      description:
        'An Ayurvedic consultation determines your unique constitution (prakriti) and current state of balance (vikriti) through pulse diagnosis, observation, and detailed health history. This guides personalized recommendations for diet, lifestyle, herbs, and treatments.',
      howItWorks:
        'The practitioner assesses your doshic constitution (Vata, Pitta, Kapha) through pulse diagnosis (nadi pariksha), physical examination, and comprehensive questioning. Imbalances are identified and addressed through tailored Ayurvedic interventions.',
      whatItAddresses: [
        'Digestive health',
        'Sleep issues',
        'Skin conditions',
        'Stress management',
        'Weight management',
        'Chronic conditions',
      ],
      evidenceLevel: 'TRADITIONAL',
      evidenceSummary:
        'Ayurveda has 5,000 years of documented use. Constitutional typing guides personalized medicine. Some Ayurvedic treatments have modern research support.',
      typicalProtocol:
        'Initial consultation 60-90 minutes. Detailed lifestyle and health history. Pulse and tongue diagnosis. Results in personalized diet, lifestyle, herb, and treatment recommendations.',
      priceRangeMin: 80,
      priceRangeMax: 200,
      potentialRisks:
        'Consultation itself is safe. Herbal recommendations should be disclosed to conventional physicians.',
      contraindications: [],
      published: true,
    });
  }

  if (!existingSlugs.has('moxibustion')) {
    treatmentsToCreate.push({
      slug: 'moxibustion',
      name: 'Moxibustion',
      aliases: ['Moxa therapy', 'Mugwort therapy', 'Heat therapy'],
      category: 'TRADITIONAL',
      description:
        'Moxibustion involves burning dried mugwort (Artemisia vulgaris) near acupuncture points to warm and stimulate them. Used in Traditional Chinese Medicine for thousands of years, it is often combined with acupuncture to enhance therapeutic effects.',
      howItWorks:
        'Heat from burning moxa stimulates acupuncture points, promoting circulation, warming the meridians, and strengthening the body\'s yang energy. Can be applied directly, indirectly, or using a moxa stick held near the skin.',
      whatItAddresses: [
        'Cold conditions',
        'Digestive weakness',
        'Fatigue',
        'Joint pain',
        'Menstrual issues',
        'Breech presentation in pregnancy',
      ],
      evidenceLevel: 'TRADITIONAL',
      evidenceSummary:
        'Long history in TCM. Some research supports use for breech presentation and certain pain conditions. Generally used as complementary treatment with acupuncture.',
      typicalProtocol:
        'Sessions last 15-30 minutes, often combined with acupuncture. Moxa is burned near skin until warmth is felt. Smoke-free moxa options available. Weekly sessions typical.',
      priceRangeMin: 50,
      priceRangeMax: 100,
      potentialRisks:
        'Risk of burns if not performed carefully. Smoke may irritate respiratory conditions. Smokeless options available.',
      contraindications: [
        'Heat conditions in TCM',
        'Fever',
        'Skin infections',
        'Respiratory sensitivity to smoke',
      ],
      published: true,
    });
  }

  // ============================================
  // MIND/NEURO TREATMENTS
  // ============================================

  if (!existingSlugs.has('emdr-therapy')) {
    treatmentsToCreate.push({
      slug: 'emdr-therapy',
      name: 'EMDR Therapy',
      aliases: ['Eye Movement Desensitization and Reprocessing', 'Trauma therapy'],
      category: 'MIND_NEURO',
      description:
        'EMDR is an evidence-based psychotherapy that helps process traumatic memories and reduce their emotional impact. Through bilateral stimulation (typically eye movements) while recalling distressing events, the brain can reprocess memories and reduce their emotional charge.',
      howItWorks:
        'While focusing on a traumatic memory, the client follows the therapist\'s fingers or other bilateral stimulation. This appears to engage the brain\'s natural healing processes, allowing traumatic memories to be reprocessed and integrated.',
      whatItAddresses: [
        'PTSD',
        'Trauma',
        'Anxiety',
        'Phobias',
        'Panic disorders',
        'Disturbing memories',
      ],
      evidenceLevel: 'STRONG',
      evidenceSummary:
        'Extensive research supports EMDR for PTSD. Recognized by WHO, APA, and other organizations as effective trauma treatment. Growing evidence for anxiety and other conditions.',
      typicalProtocol:
        'Sessions last 60-90 minutes. Treatment length varies: single traumas may resolve in 3-6 sessions; complex trauma requires longer. Must be performed by trained EMDR therapist.',
      priceRangeMin: 150,
      priceRangeMax: 300,
      potentialRisks:
        'Processing may bring up intense emotions temporarily. Should only be performed by trained professionals. Not suitable during acute crisis.',
      contraindications: [
        'Active psychosis',
        'Severe dissociative disorders (without preparation)',
        'Active substance abuse',
        'Certain eye conditions',
      ],
      published: true,
    });
  }

  if (!existingSlugs.has('sound-healing')) {
    treatmentsToCreate.push({
      slug: 'sound-healing',
      name: 'Sound Healing Therapy',
      aliases: ['Sound bath', 'Vibrational therapy', 'Sonic therapy', 'Singing bowl therapy'],
      category: 'MIND_NEURO',
      description:
        'Sound healing uses instruments like singing bowls, gongs, tuning forks, and voice to create vibrations that promote relaxation and healing. Participants lie down while immersed in sound, often entering meditative states.',
      howItWorks:
        'Sound vibrations affect brainwaves, potentially inducing alpha and theta states associated with relaxation and meditation. The physical vibrations may also affect cellular processes, though mechanisms are not fully understood.',
      whatItAddresses: [
        'Stress reduction',
        'Anxiety',
        'Sleep issues',
        'Meditation enhancement',
        'Emotional release',
        'General relaxation',
      ],
      evidenceLevel: 'EMERGING',
      evidenceSummary:
        'Growing research shows benefits for stress reduction and relaxation. Mechanisms are being studied. Safe and increasingly popular as wellness practice.',
      typicalProtocol:
        'Sessions (sound baths) last 45-90 minutes. Participants lie comfortably while practitioner plays instruments. Can be individual or group setting. Weekly or as desired.',
      priceRangeMin: 40,
      priceRangeMax: 150,
      potentialRisks:
        'Generally very safe. Some may experience emotional release. Those with sound sensitivity should use caution.',
      contraindications: [
        'Severe tinnitus',
        'Sound-triggered epilepsy',
        'Metal implants near instruments (for some modalities)',
      ],
      published: true,
    });
  }

  if (!existingSlugs.has('meditation-instruction')) {
    treatmentsToCreate.push({
      slug: 'meditation-instruction',
      name: 'Meditation Instruction',
      aliases: ['Mindfulness training', 'Meditation coaching', 'Contemplative practice instruction'],
      category: 'MIND_NEURO',
      description:
        'One-on-one or small group instruction in various meditation techniques including mindfulness, concentration, loving-kindness, and transcendental practices. Personalized guidance helps establish or deepen a sustainable meditation practice.',
      howItWorks:
        'An experienced teacher assesses your goals and experience level, then introduces appropriate techniques with hands-on guidance. Regular practice trains attention, reduces reactivity, and promotes neuroplasticity changes.',
      whatItAddresses: [
        'Stress and anxiety',
        'Focus and concentration',
        'Emotional regulation',
        'Sleep quality',
        'Self-awareness',
        'Overall wellbeing',
      ],
      evidenceLevel: 'STRONG',
      evidenceSummary:
        'Extensive research supports meditation benefits for stress, anxiety, attention, and wellbeing. Mindfulness-based interventions are evidence-based treatments for several conditions.',
      typicalProtocol:
        'Private sessions 60-90 minutes. May include assessment, technique instruction, practice, and Q&A. Series of sessions recommended to establish practice. Daily home practice encouraged.',
      priceRangeMin: 80,
      priceRangeMax: 200,
      potentialRisks:
        'Very safe. Some may experience temporary discomfort when beginning (restlessness, surfacing emotions). Guidance helps navigate challenges.',
      contraindications: [
        'Active psychosis (some techniques)',
        'Severe dissociation (some techniques)',
      ],
      published: true,
    });
  }

  // ============================================
  // AESTHETIC TREATMENTS
  // ============================================

  if (!existingSlugs.has('microneedling')) {
    treatmentsToCreate.push({
      slug: 'microneedling',
      name: 'Microneedling',
      aliases: ['Collagen induction therapy', 'Dermarolling', 'Skin needling'],
      category: 'AESTHETIC',
      description:
        'Microneedling uses tiny needles to create controlled micro-injuries in the skin, triggering the body\'s wound healing response and stimulating collagen and elastin production. This improves skin texture, reduces scars, and promotes overall skin rejuvenation.',
      howItWorks:
        'A device with fine needles creates thousands of micro-channels in the skin. This triggers the healing cascade, stimulating fibroblasts to produce new collagen and elastin. Serums applied during treatment penetrate more effectively.',
      whatItAddresses: [
        'Fine lines and wrinkles',
        'Acne scars',
        'Enlarged pores',
        'Uneven skin texture',
        'Stretch marks',
        'Hyperpigmentation',
      ],
      evidenceLevel: 'MODERATE',
      evidenceSummary:
        'Good evidence for acne scars, fine lines, and skin rejuvenation. Multiple studies support effectiveness. Results improve with series of treatments.',
      typicalProtocol:
        'Sessions last 30-60 minutes. Numbing cream applied first. Series of 3-6 treatments spaced 4-6 weeks apart. Mild redness for 24-48 hours post-treatment.',
      priceRangeMin: 200,
      priceRangeMax: 700,
      potentialRisks:
        'Temporary redness, swelling, mild discomfort. Risk of infection if not performed properly. Avoid sun exposure after treatment.',
      contraindications: [
        'Active acne or skin infections',
        'Eczema or psoriasis (active)',
        'Blood clotting disorders',
        'Keloid scarring tendency',
        'Pregnancy',
      ],
      published: true,
    });
  }

  if (!existingSlugs.has('led-facial-therapy')) {
    treatmentsToCreate.push({
      slug: 'led-facial-therapy',
      name: 'LED Facial Light Therapy',
      aliases: ['LED mask', 'Light therapy facial', 'Photofacial'],
      category: 'AESTHETIC',
      description:
        'LED facial therapy uses specific wavelengths of light to address various skin concerns. Red light stimulates collagen, blue light kills acne bacteria, and near-infrared penetrates deeper for healing. Non-invasive and painless.',
      howItWorks:
        'Different light wavelengths penetrate to different skin depths. Red (630-660nm) stimulates fibroblasts and collagen. Blue (415-445nm) kills P. acnes bacteria. Near-infrared (830nm) promotes deeper healing.',
      whatItAddresses: [
        'Acne',
        'Anti-aging',
        'Redness and inflammation',
        'Wound healing',
        'Sun damage',
        'Skin texture',
      ],
      evidenceLevel: 'MODERATE',
      evidenceSummary:
        'Good evidence for blue light treating acne. Growing evidence for red light and anti-aging. Safe, non-invasive treatment with minimal side effects.',
      typicalProtocol:
        'Sessions last 20-30 minutes. No downtime. Series of 8-12 treatments for best results. Can be done 2-3 times per week. Often combined with other facials.',
      priceRangeMin: 50,
      priceRangeMax: 150,
      potentialRisks:
        'Very safe. Eye protection needed during treatment. Avoid if taking photosensitizing medications.',
      contraindications: [
        'Photosensitivity disorders',
        'Photosensitizing medications',
        'Epilepsy (some devices)',
      ],
      published: true,
    });
  }

  if (!existingSlugs.has('body-contouring')) {
    treatmentsToCreate.push({
      slug: 'body-contouring',
      name: 'Non-Invasive Body Contouring',
      aliases: ['Body sculpting', 'Fat freezing', 'Cryolipolysis', 'RF body treatment'],
      category: 'AESTHETIC',
      description:
        'Non-invasive body contouring uses various technologies (cryolipolysis, radiofrequency, ultrasound, or laser) to reduce localized fat deposits and tighten skin without surgery. Results develop gradually as the body eliminates treated fat cells.',
      howItWorks:
        'Different technologies work differently: Cryolipolysis freezes fat cells causing them to die; RF heats tissue to stimulate collagen; Ultrasound disrupts fat cell membranes. Body naturally eliminates destroyed cells over weeks.',
      whatItAddresses: [
        'Localized fat deposits',
        'Body shaping',
        'Skin laxity',
        'Cellulite',
        'Post-weight loss refinement',
      ],
      evidenceLevel: 'MODERATE',
      evidenceSummary:
        'FDA-cleared technologies with clinical evidence for fat reduction. Results vary by technology and individual. Not a weight loss solution but body refinement.',
      typicalProtocol:
        'Sessions 35-60 minutes per area. Results appear over 2-3 months. May need 1-3 treatments per area. Best combined with healthy lifestyle.',
      priceRangeMin: 400,
      priceRangeMax: 1500,
      potentialRisks:
        'Temporary redness, swelling, bruising, or numbness at treatment site. Rare: paradoxical fat hyperplasia with cryolipolysis.',
      contraindications: [
        'Pregnancy',
        'Cryoglobulinemia (for cryolipolysis)',
        'Hernias in treatment area',
        'Metal implants in area (for some technologies)',
      ],
      published: true,
    });
  }

  // ============================================
  // DETOX TREATMENTS
  // ============================================

  if (!existingSlugs.has('juice-fasting')) {
    treatmentsToCreate.push({
      slug: 'juice-fasting',
      name: 'Juice Fasting Protocol',
      aliases: ['Juice cleanse', 'Liquid fast', 'Juice detox'],
      category: 'DETOXIFICATION',
      description:
        'A structured juice fasting program replaces solid food with fresh vegetable and fruit juices for a set period. Under proper supervision, this gives the digestive system a rest while providing nutrients, potentially supporting detoxification processes.',
      howItWorks:
        'Eliminating solid food reduces digestive workload. Fresh juices provide vitamins, minerals, and phytonutrients while significantly reducing caloric intake. The body may shift to using stored glycogen and fat for energy.',
      whatItAddresses: [
        'Digestive rest',
        'Weight loss initiation',
        'Mental clarity',
        'Breaking unhealthy eating patterns',
        'Reducing inflammation',
      ],
      evidenceLevel: 'EMERGING',
      evidenceSummary:
        'Limited scientific evidence for specific detox claims. Caloric restriction benefits are documented. Should be supervised, especially for extended fasts. Not suitable for everyone.',
      typicalProtocol:
        'Programs range from 3-14 days. Gradual preparation phase recommended. 4-6 juices per day plus water and herbal teas. Medical supervision for fasts over 3 days. Careful refeeding afterward.',
      priceRangeMin: 100,
      priceRangeMax: 300,
      potentialRisks:
        'Hunger, fatigue, headaches (especially initially). Blood sugar fluctuations. Not suitable for diabetics, eating disorder history, or certain medical conditions.',
      contraindications: [
        'Diabetes',
        'Eating disorders',
        'Pregnancy or breastfeeding',
        'Kidney disease',
        'Certain medications',
      ],
      published: true,
    });
  }

  if (!existingSlugs.has('liver-support-protocol')) {
    treatmentsToCreate.push({
      slug: 'liver-support-protocol',
      name: 'Liver Support Protocol',
      aliases: ['Liver detox', 'Hepatic support', 'Liver cleanse'],
      category: 'DETOXIFICATION',
      description:
        'A comprehensive liver support protocol combines dietary modifications, targeted supplements, and lifestyle practices to support the liver\'s natural detoxification pathways. Administered under medical supervision with monitoring.',
      howItWorks:
        'Supports the liver\'s Phase I and Phase II detoxification pathways through specific nutrients (B vitamins, glutathione precursors, methylation support) while reducing toxin exposure and supporting elimination.',
      whatItAddresses: [
        'Supporting liver function',
        'Environmental toxin exposure',
        'Sluggish digestion',
        'Skin issues',
        'Fatigue',
        'Hormone metabolism',
      ],
      evidenceLevel: 'EMERGING',
      evidenceSummary:
        'Liver detoxification pathways are well-documented. Nutritional support for these pathways has scientific basis. "Cleanse" claims often overstated; medical supervision recommended.',
      typicalProtocol:
        'Programs typically 2-4 weeks. Includes dietary changes (eliminating alcohol, processed foods), targeted supplements, and possibly supportive treatments. Medical assessment before and after.',
      priceRangeMin: 200,
      priceRangeMax: 600,
      potentialRisks:
        'Detox symptoms (headache, fatigue) possible. Supplement interactions with medications. Medical supervision essential.',
      contraindications: [
        'Liver disease (without medical supervision)',
        'Gallstones',
        'Pregnancy',
        'Certain medications',
      ],
      published: true,
    });
  }

  // ============================================
  // REGENERATIVE TREATMENTS
  // ============================================

  if (!existingSlugs.has('stem-cell-therapy')) {
    treatmentsToCreate.push({
      slug: 'stem-cell-therapy',
      name: 'Stem Cell Therapy',
      aliases: ['Regenerative cell therapy', 'MSC therapy', 'Cellular therapy'],
      category: 'REGENERATIVE',
      description:
        'Stem cell therapy uses undifferentiated cells capable of becoming various tissue types to support healing and regeneration. Sources include bone marrow, adipose tissue, or umbilical cord. Used for joint repair, anti-aging, and various conditions.',
      howItWorks:
        'Stem cells are harvested, processed, and reintroduced to target areas. These cells can differentiate into needed tissue types and secrete growth factors that promote healing and reduce inflammation.',
      whatItAddresses: [
        'Joint degeneration',
        'Tissue repair',
        'Anti-aging',
        'Autoimmune conditions',
        'Neurological conditions',
        'Cardiovascular repair',
      ],
      evidenceLevel: 'EXPERIMENTAL',
      evidenceSummary:
        'Rapidly evolving field. Some applications (certain blood cancers, skin grafts) are established. Many applications remain experimental. Regulation varies by country. Requires careful provider selection.',
      typicalProtocol:
        'Varies significantly by application. May involve harvesting (liposuction or bone marrow aspiration), processing, and injection. Often combined with other regenerative treatments.',
      priceRangeMin: 5000,
      priceRangeMax: 50000,
      potentialRisks:
        'Infection, tumor formation (rare), immune reactions. Unregulated clinics pose risks. Choose reputable providers with proper credentials.',
      contraindications: [
        'Active cancer',
        'Active infections',
        'Blood clotting disorders',
        'Certain immune conditions',
      ],
      published: true,
    });
  }

  if (!existingSlugs.has('growth-factor-therapy')) {
    treatmentsToCreate.push({
      slug: 'growth-factor-therapy',
      name: 'Growth Factor Therapy',
      aliases: ['GF therapy', 'Regenerative growth factors', 'PDGF therapy'],
      category: 'REGENERATIVE',
      description:
        'Growth factor therapy uses concentrated proteins that signal cellular growth, repair, and regeneration. May be derived from the patient\'s own blood (similar to PRP) or from other sources. Applied for tissue healing, skin rejuvenation, and hair restoration.',
      howItWorks:
        'Growth factors bind to cell receptors, triggering biological cascades that promote cell proliferation, tissue repair, collagen synthesis, and angiogenesis. Delivered via injection, topically after microneedling, or other methods.',
      whatItAddresses: [
        'Skin rejuvenation',
        'Hair restoration',
        'Wound healing',
        'Joint repair',
        'Tissue regeneration',
      ],
      evidenceLevel: 'EMERGING',
      evidenceSummary:
        'Growing body of research supports various applications. Overlaps with PRP therapy. Efficacy depends on source, concentration, and delivery method.',
      typicalProtocol:
        'Varies by application. Skin: often combined with microneedling. Hair: injected into scalp. Joints: injected directly. Series of treatments typically needed.',
      priceRangeMin: 300,
      priceRangeMax: 2000,
      potentialRisks:
        'Injection site reactions, rare allergic responses. Source quality important. Choose experienced providers.',
      contraindications: [
        'Active cancer',
        'Active skin infections',
        'Blood disorders',
        'Pregnancy',
      ],
      published: true,
    });
  }

  // ============================================
  // CREATE TREATMENTS
  // ============================================

  if (treatmentsToCreate.length > 0) {
    console.log(`Creating ${treatmentsToCreate.length} new treatments...\n`);

    for (const treatment of treatmentsToCreate) {
      await prisma.treatment.create({
        data: treatment as Parameters<typeof prisma.treatment.create>[0]['data'],
      });
      console.log(`  ✓ Created: ${treatment.name}`);
    }
  } else {
    console.log('All treatments already exist - no new treatments created.\n');
  }

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n✅ Treatments Expansion completed successfully!\n');
  console.log(`Summary: ${treatmentsToCreate.length} new treatments added`);
  console.log('\nCategories covered:');
  console.log('  - Body Manual: Thai Massage, Shiatsu, Reflexology, Watsu, Hot Stone');
  console.log('  - Traditional: TCM Consultation, Ayurvedic Consultation, Moxibustion');
  console.log('  - Mind/Neuro: EMDR, Sound Healing, Meditation Instruction');
  console.log('  - Aesthetic: Microneedling, LED Facial, Body Contouring');
  console.log('  - Detox: Juice Fasting, Liver Support Protocol');
  console.log('  - Regenerative: Stem Cell Therapy, Growth Factor Therapy');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding treatments expansion:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
