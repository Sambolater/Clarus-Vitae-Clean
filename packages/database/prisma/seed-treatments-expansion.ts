/**
 * Clarus Vitae - Additional Treatments Expansion
 *
 * This seed file adds 20 additional treatments commonly found at wellness destinations.
 * Run AFTER the main seed.ts to preserve existing data.
 *
 * Categories covered:
 * - BODY_MANUAL: Thai massage, Shiatsu, Reflexology, Watsu, Hot stone
 * - TRADITIONAL: TCM consultation, Ayurvedic consultation, Moxibustion
 * - MIND_NEURO: EMDR, Sound healing, Meditation instruction
 * - AESTHETIC: Microneedling, LED therapy, Body contouring
 * - DETOXIFICATION: Juice fasting protocols, Liver flush
 * - REGENERATIVE: PRP therapy, Stem cell therapy
 *
 * Usage:
 *   cd packages/database
 *   npx tsx prisma/seed-treatments-expansion.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('💊 Starting Additional Treatments Expansion...\n');

  const treatments = [
    // ============================================
    // BODY_MANUAL TREATMENTS
    // ============================================
    {
      slug: 'thai-massage',
      name: 'Thai Massage',
      aliases: ['Traditional Thai massage', 'Thai yoga massage', 'Nuad Thai'],
      category: 'BODY_MANUAL',
      description:
        'An ancient healing system combining acupressure, Indian Ayurvedic principles, and assisted yoga postures. Performed on a floor mat with the recipient fully clothed.',
      howItWorks:
        'The practitioner uses thumbs, palms, forearms, elbows, knees, and feet to apply rhythmic pressure along energy lines (Sen) while guiding the body through passive yoga-like stretches.',
      whatItAddresses: ['Muscle tension', 'Flexibility', 'Energy flow', 'Stress relief', 'Joint mobility'],
      evidenceLevel: 'MODERATE',
      evidenceSummary:
        'Research supports benefits for back pain, flexibility, and stress reduction. Studies show improvements in range of motion and pain reduction comparable to other massage modalities.',
      typicalProtocol: '60-120 minute sessions. Can be done as standalone or series.',
      priceRangeMin: 80,
      priceRangeMax: 250,
      potentialRisks: 'Joint strain if overstretched. Not suitable for acute injuries, recent surgery, or certain cardiovascular conditions.',
      contraindications: ['Acute injuries', 'Recent surgery', 'Severe osteoporosis', 'Pregnancy (modified only)', 'Blood clots'],
    },
    {
      slug: 'shiatsu-massage',
      name: 'Shiatsu',
      aliases: ['Shiatsu massage', 'Japanese pressure therapy', 'Finger pressure massage'],
      category: 'BODY_MANUAL',
      description:
        'A Japanese form of bodywork based on Traditional Chinese Medicine concepts. Uses finger and palm pressure on specific points along meridians to balance energy flow.',
      howItWorks:
        'Practitioners apply pressure to specific points (tsubos) along meridian pathways to release blockages and restore the flow of Qi (vital energy). Includes stretching and joint mobilization.',
      whatItAddresses: ['Energy imbalances', 'Stress', 'Digestive issues', 'Headaches', 'Muscle tension'],
      evidenceLevel: 'MODERATE',
      evidenceSummary:
        'Studies indicate effectiveness for stress, anxiety, and certain pain conditions. Some evidence for benefits in fatigue and sleep quality.',
      typicalProtocol: '60-90 minute sessions. Often recommended as weekly series.',
      priceRangeMin: 90,
      priceRangeMax: 200,
      potentialRisks: 'Temporary soreness. Pressure should be avoided on inflamed areas.',
      contraindications: ['Acute inflammation', 'Fever', 'Skin conditions at treatment site', 'Recent fractures'],
    },
    {
      slug: 'reflexology',
      name: 'Reflexology',
      aliases: ['Foot reflexology', 'Zone therapy', 'Reflex zone therapy'],
      category: 'BODY_MANUAL',
      description:
        'A therapeutic method applying pressure to specific points on the feet, hands, or ears that correspond to different body organs and systems.',
      howItWorks:
        'Based on the theory that reflex points in the feet and hands correspond to specific organs and body parts. Pressure applied to these points is believed to promote healing in the corresponding area.',
      whatItAddresses: ['Stress relief', 'Pain management', 'Circulation', 'Relaxation', 'Energy balance'],
      evidenceLevel: 'EMERGING',
      evidenceSummary:
        'Limited clinical evidence for specific therapeutic claims. Studies show benefits for relaxation, stress reduction, and quality of life improvements in some populations.',
      typicalProtocol: '45-60 minute sessions. Often combined with other bodywork.',
      priceRangeMin: 60,
      priceRangeMax: 150,
      potentialRisks: 'Generally safe. Avoid on injured or infected feet.',
      contraindications: ['Foot injuries', 'Blood clots in legs', 'Pregnancy (first trimester)', 'Diabetic foot conditions'],
    },
    {
      slug: 'watsu',
      name: 'Watsu',
      aliases: ['Water shiatsu', 'Aquatic bodywork', 'Warm water therapy'],
      category: 'BODY_MANUAL',
      description:
        'A form of aquatic bodywork performed in warm water (35°C), combining elements of shiatsu massage with gentle stretching and flotation.',
      howItWorks:
        'The practitioner supports and moves the recipient through warm water while applying shiatsu pressure points and gentle stretches. The buoyancy allows for movements impossible on land.',
      whatItAddresses: ['Deep relaxation', 'Muscle tension', 'Emotional release', 'Joint mobility', 'Trauma recovery'],
      evidenceLevel: 'EMERGING',
      evidenceSummary:
        'Studies suggest benefits for chronic pain, fibromyalgia, PTSD, and anxiety. The combination of warm water and bodywork shows unique relaxation responses.',
      typicalProtocol: '50-60 minute sessions in 35°C water.',
      priceRangeMin: 120,
      priceRangeMax: 300,
      potentialRisks: 'Dizziness from warm water. Not suitable for those uncomfortable in water.',
      contraindications: ['Open wounds', 'Skin infections', 'Incontinence', 'Severe cardiovascular conditions', 'Chlorine sensitivity'],
    },
    {
      slug: 'hot-stone-massage',
      name: 'Hot Stone Massage',
      aliases: ['Stone therapy', 'LaStone therapy', 'Heated stone massage'],
      category: 'BODY_MANUAL',
      description:
        'A massage technique using smooth, heated basalt stones placed on key points of the body and used as massage tools to deliver deeper muscle relaxation.',
      howItWorks:
        'Heated stones (typically 50-60°C) are placed on specific points and used by the therapist to massage muscles. The heat penetrates tissues, allowing deeper work with less pressure.',
      whatItAddresses: ['Muscle tension', 'Poor circulation', 'Stress', 'Pain relief', 'Mental tension'],
      evidenceLevel: 'MODERATE',
      evidenceSummary:
        'Research supports effectiveness for relaxation and pain reduction. The heat element enhances blood flow and muscle relaxation compared to standard massage.',
      typicalProtocol: '75-90 minute sessions.',
      priceRangeMin: 100,
      priceRangeMax: 250,
      potentialRisks: 'Burns if stones too hot. Skin sensitivity.',
      contraindications: ['Diabetes (reduced sensation)', 'High blood pressure', 'Heart conditions', 'Skin conditions', 'Pregnancy'],
    },

    // ============================================
    // TRADITIONAL TREATMENTS
    // ============================================
    {
      slug: 'tcm-consultation',
      name: 'Traditional Chinese Medicine Consultation',
      aliases: ['TCM diagnosis', 'Chinese medicine assessment', 'TCM evaluation'],
      category: 'TRADITIONAL',
      description:
        'A comprehensive assessment using Traditional Chinese Medicine diagnostic methods including pulse reading, tongue diagnosis, and detailed health history to identify patterns of imbalance.',
      howItWorks:
        'The practitioner assesses health through observation (face, tongue, body), listening, questioning (detailed history), and palpation (pulse diagnosis) to identify patterns and recommend treatment.',
      whatItAddresses: ['Health assessment', 'Pattern identification', 'Treatment planning', 'Preventive health', 'Chronic conditions'],
      evidenceLevel: 'TRADITIONAL',
      evidenceSummary:
        'TCM diagnostic methods have been used for thousands of years. Modern research validates some diagnostic approaches, particularly pulse diagnosis reliability.',
      typicalProtocol: '60-90 minute initial consultation. Follow-ups 30-45 minutes.',
      priceRangeMin: 100,
      priceRangeMax: 300,
      potentialRisks: 'None from consultation itself.',
      contraindications: [],
    },
    {
      slug: 'ayurvedic-consultation',
      name: 'Ayurvedic Consultation',
      aliases: ['Prakriti assessment', 'Dosha analysis', 'Ayurvedic evaluation'],
      category: 'TRADITIONAL',
      description:
        'A comprehensive health assessment based on Ayurvedic principles, determining individual constitution (Prakriti), current imbalances (Vikriti), and personalized treatment recommendations.',
      howItWorks:
        'The Vaidya (Ayurvedic physician) assesses constitution through pulse diagnosis (Nadi Pariksha), observation of physical characteristics, detailed questioning about health history, lifestyle, and digestion.',
      whatItAddresses: ['Constitutional assessment', 'Digestive health', 'Lifestyle optimization', 'Preventive care', 'Chronic conditions'],
      evidenceLevel: 'TRADITIONAL',
      evidenceSummary:
        'Ayurveda has been practiced for over 5,000 years. Modern research increasingly validates individual approaches based on constitutional types.',
      typicalProtocol: '60-90 minute initial consultation. Treatment plans typically 2-4 weeks.',
      priceRangeMin: 80,
      priceRangeMax: 250,
      potentialRisks: 'None from consultation itself.',
      contraindications: [],
    },
    {
      slug: 'moxibustion',
      name: 'Moxibustion',
      aliases: ['Moxa therapy', 'Mugwort heat therapy'],
      category: 'TRADITIONAL',
      description:
        'A traditional Chinese medicine therapy involving the burning of dried mugwort (Artemisia vulgaris) near or on acupuncture points to stimulate circulation and promote healing.',
      howItWorks:
        'Dried mugwort is burned either directly on the skin, on acupuncture needles, or held close to acupuncture points. The heat stimulates Qi and blood circulation.',
      whatItAddresses: ['Cold conditions', 'Poor circulation', 'Digestive issues', 'Pain relief', 'Immune support'],
      evidenceLevel: 'MODERATE',
      evidenceSummary:
        'Research shows effectiveness for breech presentation in pregnancy, chronic fatigue, and certain pain conditions. Studies support immune-modulating effects.',
      typicalProtocol: '20-40 minutes, often combined with acupuncture.',
      priceRangeMin: 40,
      priceRangeMax: 120,
      potentialRisks: 'Burns if applied incorrectly. Smoke may irritate some people.',
      contraindications: ['Fever', 'Heat conditions in TCM terms', 'Near face/sensitive areas', 'Respiratory sensitivity to smoke'],
    },

    // ============================================
    // MIND_NEURO TREATMENTS
    // ============================================
    {
      slug: 'emdr-therapy',
      name: 'EMDR Therapy',
      aliases: ['Eye Movement Desensitization and Reprocessing', 'Trauma processing therapy'],
      category: 'MIND_NEURO',
      description:
        'A psychotherapy approach designed to alleviate distress associated with traumatic memories through bilateral stimulation, typically eye movements, while processing difficult experiences.',
      howItWorks:
        'The therapist guides the client through traumatic memories while performing bilateral stimulation (eye movements, taps, or tones). This is believed to help the brain reprocess traumatic memories.',
      whatItAddresses: ['PTSD', 'Trauma', 'Anxiety', 'Phobias', 'Disturbing memories'],
      evidenceLevel: 'STRONG',
      evidenceSummary:
        'Extensive research supports EMDR for PTSD, with efficacy comparable to trauma-focused CBT. Recognized by WHO and major psychiatric organizations.',
      typicalProtocol: '60-90 minute sessions. Treatment typically 6-12 sessions.',
      priceRangeMin: 150,
      priceRangeMax: 350,
      potentialRisks: 'Temporary increase in distress during processing. Should only be done by trained practitioners.',
      contraindications: ['Active psychosis', 'Certain dissociative disorders', 'Uncontrolled seizure disorders'],
    },
    {
      slug: 'sound-healing',
      name: 'Sound Healing',
      aliases: ['Sound therapy', 'Sound bath', 'Vibrational therapy', 'Singing bowl therapy'],
      category: 'MIND_NEURO',
      description:
        'Therapeutic use of sound frequencies produced by instruments like singing bowls, gongs, tuning forks, or voice to promote relaxation, reduce stress, and facilitate healing.',
      howItWorks:
        'Sound vibrations are believed to affect brainwave activity, promoting relaxation states. The body is literally bathed in sound waves that may affect cellular activity.',
      whatItAddresses: ['Stress', 'Anxiety', 'Sleep issues', 'Emotional release', 'Meditation enhancement'],
      evidenceLevel: 'EMERGING',
      evidenceSummary:
        'Limited but growing research base. Studies show effects on mood, tension, and physiological markers of relaxation. More rigorous research needed.',
      typicalProtocol: '45-60 minute sessions, individual or group.',
      priceRangeMin: 50,
      priceRangeMax: 150,
      potentialRisks: 'Emotional release. Some people find certain sounds uncomfortable.',
      contraindications: ['Sound-triggered epilepsy', 'Severe tinnitus', 'Recent ear surgery'],
    },
    {
      slug: 'meditation-instruction',
      name: 'Meditation Instruction',
      aliases: ['Meditation coaching', 'Mindfulness training', 'Meditation guidance'],
      category: 'MIND_NEURO',
      description:
        'Personalized instruction in various meditation techniques including mindfulness, concentration, loving-kindness, and transcendental approaches, tailored to individual needs and goals.',
      howItWorks:
        'A trained instructor assesses the individual\'s experience and goals, then teaches appropriate techniques with guidance on posture, breath, and mental focus.',
      whatItAddresses: ['Stress reduction', 'Anxiety', 'Focus and concentration', 'Emotional regulation', 'Self-awareness'],
      evidenceLevel: 'STRONG',
      evidenceSummary:
        'Extensive research supports meditation benefits for mental health, stress, anxiety, and some physical conditions. MBSR and similar programs have strong evidence base.',
      typicalProtocol: '30-60 minute individual sessions. Often part of longer programs.',
      priceRangeMin: 50,
      priceRangeMax: 200,
      potentialRisks: 'Rare: may surface difficult emotions. Generally very safe.',
      contraindications: ['Active psychosis', 'Severe PTSD (may need trauma-informed approach)'],
    },

    // ============================================
    // AESTHETIC TREATMENTS
    // ============================================
    {
      slug: 'microneedling',
      name: 'Microneedling',
      aliases: ['Collagen induction therapy', 'Dermarolling', 'Skin needling'],
      category: 'AESTHETIC',
      description:
        'A minimally invasive cosmetic procedure using fine needles to create controlled micro-injuries in the skin, stimulating collagen and elastin production for skin rejuvenation.',
      howItWorks:
        'A device with fine needles creates tiny punctures in the skin, triggering the body\'s wound healing response and stimulating new collagen and elastin production.',
      whatItAddresses: ['Fine lines and wrinkles', 'Acne scars', 'Skin texture', 'Pore size', 'Skin firmness'],
      evidenceLevel: 'STRONG',
      evidenceSummary:
        'Well-established evidence for acne scarring, skin rejuvenation, and collagen stimulation. Multiple controlled studies support efficacy.',
      typicalProtocol: '3-6 sessions spaced 4-6 weeks apart.',
      priceRangeMin: 200,
      priceRangeMax: 700,
      potentialRisks: 'Redness, swelling, possible infection if not performed properly.',
      contraindications: ['Active acne', 'Skin infections', 'Blood thinners', 'Keloid tendency', 'Active skin diseases'],
    },
    {
      slug: 'led-light-therapy',
      name: 'LED Light Therapy',
      aliases: ['Phototherapy', 'Light therapy', 'LED facial', 'Photobiomodulation'],
      category: 'AESTHETIC',
      description:
        'Non-invasive treatment using specific wavelengths of light (red, blue, near-infrared) to address various skin concerns and promote cellular healing.',
      howItWorks:
        'Different light wavelengths penetrate skin at different depths. Red light stimulates collagen, blue kills acne bacteria, and near-infrared reduces inflammation.',
      whatItAddresses: ['Acne', 'Anti-aging', 'Wound healing', 'Inflammation', 'Skin tone'],
      evidenceLevel: 'MODERATE',
      evidenceSummary:
        'Good evidence for acne treatment (blue light) and wound healing. Growing evidence for anti-aging benefits. Low-risk treatment.',
      typicalProtocol: '20-30 minute sessions, 2-3 times per week for 4-8 weeks.',
      priceRangeMin: 75,
      priceRangeMax: 250,
      potentialRisks: 'Very low risk. Temporary redness possible.',
      contraindications: ['Photosensitizing medications', 'Certain skin conditions', 'Eye conditions (without protection)'],
    },
    {
      slug: 'body-contouring',
      name: 'Non-Invasive Body Contouring',
      aliases: ['Body sculpting', 'Fat reduction', 'Cryolipolysis', 'RF body treatments'],
      category: 'AESTHETIC',
      description:
        'Various non-surgical technologies (cryolipolysis, radiofrequency, ultrasound) used to reduce localized fat deposits and improve body shape.',
      howItWorks:
        'Technologies target and destroy fat cells through controlled cooling (cryolipolysis), heat (RF), or ultrasound energy. Dead cells are naturally eliminated by the body.',
      whatItAddresses: ['Stubborn fat deposits', 'Body shape', 'Skin laxity', 'Cellulite'],
      evidenceLevel: 'MODERATE',
      evidenceSummary:
        'Cryolipolysis has good evidence for fat reduction. RF technologies show benefits for skin tightening. Results vary and are modest compared to surgery.',
      typicalProtocol: '1-4 sessions depending on area and technology. Results visible in 2-3 months.',
      priceRangeMin: 500,
      priceRangeMax: 3000,
      potentialRisks: 'Temporary numbness, bruising, swelling. Rare: paradoxical fat hyperplasia with cryolipolysis.',
      contraindications: ['Cryoglobulinemia', 'Cold urticaria', 'Hernia at treatment site', 'Pregnancy'],
    },

    // ============================================
    // DETOXIFICATION TREATMENTS
    // ============================================
    {
      slug: 'juice-fasting',
      name: 'Supervised Juice Fasting',
      aliases: ['Juice cleanse', 'Juice detox', 'Liquid fast'],
      category: 'DETOXIFICATION',
      description:
        'A structured fasting protocol consuming only fresh vegetable and fruit juices under professional supervision, designed to rest the digestive system and support detoxification.',
      howItWorks:
        'By consuming only fresh juices, the digestive system rests while nutrients are easily absorbed. The body shifts to using stored resources and may enhance cellular cleanup processes.',
      whatItAddresses: ['Digestive rest', 'Weight management', 'Mental clarity', 'Energy reset', 'Inflammation'],
      evidenceLevel: 'EMERGING',
      evidenceSummary:
        'Limited clinical research specifically on juice fasting. General fasting research shows benefits for metabolic health. Supervision important for safety.',
      typicalProtocol: '3-7 days typically. Includes preparation and breaking fast phases.',
      priceRangeMin: 300,
      priceRangeMax: 1500,
      potentialRisks: 'Hypoglycemia, electrolyte imbalances, fatigue. Should be supervised.',
      contraindications: ['Diabetes', 'Eating disorders', 'Pregnancy', 'Kidney disease', 'Severe conditions'],
    },
    {
      slug: 'liver-flush',
      name: 'Liver & Gallbladder Flush',
      aliases: ['Liver cleanse', 'Gallbladder flush', 'Liver detox'],
      category: 'DETOXIFICATION',
      description:
        'A protocol using specific combinations of olive oil, citrus juice, and sometimes herbs intended to flush the liver and gallbladder of accumulated waste.',
      howItWorks:
        'The protocol typically involves a preparation period, then consumption of olive oil and citrus to stimulate bile release. Claimed to expel gallstones and liver debris.',
      whatItAddresses: ['Liver function', 'Bile flow', 'Digestion', 'Energy'],
      evidenceLevel: 'EXPERIMENTAL',
      evidenceSummary:
        'No clinical evidence supports gallstone removal claims. "Stones" passed are likely saponified oil. May have mild digestive benefits. Medical caution advised.',
      typicalProtocol: '1-2 day protocol with preparation. Should only be done under supervision.',
      priceRangeMin: 150,
      priceRangeMax: 500,
      potentialRisks: 'Nausea, vomiting, diarrhea. Risk of gallbladder attack if stones present.',
      contraindications: ['Known gallstones', 'Liver disease', 'Pregnancy', 'Acute illness'],
    },

    // ============================================
    // REGENERATIVE TREATMENTS
    // ============================================
    {
      slug: 'prp-therapy',
      name: 'Platelet-Rich Plasma (PRP) Therapy',
      aliases: ['Vampire facial', 'PRP injections', 'Autologous platelet therapy'],
      category: 'REGENERATIVE',
      description:
        'A regenerative treatment using concentrated platelets from the patient\'s own blood to promote tissue healing and collagen production when injected or applied to target areas.',
      howItWorks:
        'Blood is drawn and centrifuged to concentrate platelets. This platelet-rich plasma containing growth factors is then injected into target tissue to stimulate healing and regeneration.',
      whatItAddresses: ['Joint pain', 'Skin rejuvenation', 'Hair loss', 'Tendon injuries', 'Wound healing'],
      evidenceLevel: 'MODERATE',
      evidenceSummary:
        'Evidence strongest for certain orthopedic conditions (knee osteoarthritis, tennis elbow). Growing evidence for hair loss. Skin rejuvenation evidence is emerging.',
      typicalProtocol: '1-3 treatments spaced 4-6 weeks apart depending on application.',
      priceRangeMin: 500,
      priceRangeMax: 2000,
      potentialRisks: 'Injection site pain, bruising, infection risk. Autologous so low rejection risk.',
      contraindications: ['Blood disorders', 'Active infection', 'Cancer', 'Blood thinners'],
    },
    {
      slug: 'stem-cell-therapy',
      name: 'Stem Cell Therapy',
      aliases: ['Regenerative cell therapy', 'Cellular medicine'],
      category: 'REGENERATIVE',
      description:
        'Advanced regenerative treatment using stem cells (typically adipose-derived or bone marrow) to potentially regenerate damaged tissue and support healing.',
      howItWorks:
        'Stem cells are harvested from the patient\'s fat tissue or bone marrow, processed, and reinjected into damaged areas where they may differentiate into needed tissue types.',
      whatItAddresses: ['Joint degeneration', 'Soft tissue injuries', 'Anti-aging', 'Autoimmune conditions'],
      evidenceLevel: 'EXPERIMENTAL',
      evidenceSummary:
        'Promising early research for certain orthopedic applications. Most applications still experimental. Regulatory status varies by country. Caution advised.',
      typicalProtocol: 'Single treatment with possible follow-ups. Protocol varies significantly.',
      priceRangeMin: 5000,
      priceRangeMax: 30000,
      potentialRisks: 'Infection, procedure risks, uncertain long-term effects. Should only be done at reputable clinics.',
      contraindications: ['Active cancer', 'Active infections', 'Blood disorders', 'Immunocompromised states'],
    },
  ];

  console.log(`Creating ${treatments.length} treatments...\n`);

  for (const treatment of treatments) {
    try {
      await prisma.treatment.create({
        data: treatment,
      });
      console.log(`  ✓ Created: ${treatment.name}`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`  - Skipped (exists): ${treatment.name}`);
      } else {
        throw error;
      }
    }
  }

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n✅ Treatments Expansion completed successfully!\n');
  console.log('Summary of treatments added:');
  console.log('\nBODY_MANUAL:');
  console.log('  - Thai Massage');
  console.log('  - Shiatsu');
  console.log('  - Reflexology');
  console.log('  - Watsu');
  console.log('  - Hot Stone Massage');
  console.log('\nTRADITIONAL:');
  console.log('  - TCM Consultation');
  console.log('  - Ayurvedic Consultation');
  console.log('  - Moxibustion');
  console.log('\nMIND_NEURO:');
  console.log('  - EMDR Therapy');
  console.log('  - Sound Healing');
  console.log('  - Meditation Instruction');
  console.log('\nAESTHETIC:');
  console.log('  - Microneedling');
  console.log('  - LED Light Therapy');
  console.log('  - Non-Invasive Body Contouring');
  console.log('\nDETOXIFICATION:');
  console.log('  - Supervised Juice Fasting');
  console.log('  - Liver & Gallbladder Flush');
  console.log('\nREGENERATIVE:');
  console.log('  - PRP Therapy');
  console.log('  - Stem Cell Therapy');
  console.log('\nTotal treatments added: ' + treatments.length);
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
