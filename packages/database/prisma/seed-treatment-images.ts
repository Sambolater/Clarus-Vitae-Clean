/**
 * Treatment Images Seed Script
 * Adds high-quality Unsplash images to treatments by category
 */

import { PrismaClient, TreatmentCategory } from '@prisma/client';

const prisma = new PrismaClient();

// Curated Unsplash images by treatment category
const categoryImages: Record<TreatmentCategory, string[]> = {
  // Regenerative medicine - stem cells, PRP, healing
  REGENERATIVE: [
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=600&fit=crop&q=80', // Lab/medical research
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop&q=80', // Medical technology
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=600&fit=crop&q=80', // Healthcare professional
  ],

  // Cellular therapies - NAD+, peptides
  CELLULAR: [
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop&q=80', // Medical lab
    'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=600&fit=crop&q=80', // Laboratory science
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop&q=80', // Lab test tubes
  ],

  // Detoxification - cleansing, IV drips
  DETOXIFICATION: [
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop&q=80', // Wellness spa treatment
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=600&fit=crop&q=80', // Clean/pure aesthetic
    'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&h=600&fit=crop&q=80', // Massage/therapy
  ],

  // Hyperbaric oxygen therapy
  HYPERBARIC: [
    'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&h=600&fit=crop&q=80', // Medical equipment
    'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=600&fit=crop&q=80', // Healthcare setting
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop&q=80', // Hospital/clinic
  ],

  // Cryotherapy - cold therapy, ice
  CRYOTHERAPY: [
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&h=600&fit=crop&q=80', // Cold/ice aesthetic
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80', // Medical/wellness
    'https://images.unsplash.com/photo-1517130038641-a774d04afb3c?w=800&h=600&fit=crop&q=80', // Athletic recovery
  ],

  // IV Therapies - drips, vitamins
  IV_THERAPIES: [
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop&q=80', // Medical IV
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600&fit=crop&q=80', // Healthcare setting
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=600&fit=crop&q=80', // Hospital care
  ],

  // Hormone therapy
  HORMONE: [
    'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&h=600&fit=crop&q=80', // Medical vials
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=600&fit=crop&q=80', // Pills/supplements
    'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&h=600&fit=crop&q=80', // Medical professional
  ],

  // Aesthetic treatments - beauty, skin
  AESTHETIC: [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop&q=80', // Facial treatment
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&h=600&fit=crop&q=80', // Skincare
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=600&fit=crop&q=80', // Beauty treatment
  ],

  // Body & Manual therapies - massage, physical
  BODY_MANUAL: [
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop&q=80', // Massage therapy
    'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&h=600&fit=crop&q=80', // Spa treatment
    'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&h=600&fit=crop&q=80', // Bodywork
  ],

  // Mind & Neuro - brain, mental wellness
  MIND_NEURO: [
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&q=80', // Meditation/mindfulness
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=600&fit=crop&q=80', // Zen/peaceful
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop&q=80', // Wellness yoga
  ],

  // Traditional medicine - acupuncture, Ayurveda
  TRADITIONAL: [
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&h=600&fit=crop&q=80', // Herbal/natural
    'https://images.unsplash.com/photo-1598901865264-4f18cface75b?w=800&h=600&fit=crop&q=80', // Traditional medicine
    'https://images.unsplash.com/photo-1611072337226-1c4c657b9373?w=800&h=600&fit=crop&q=80', // Acupuncture
  ],

  // Diagnostics - testing, imaging
  DIAGNOSTICS: [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop&q=80', // Medical testing
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop&q=80', // Lab work
    'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=600&fit=crop&q=80', // Healthcare
  ],
};

async function main() {
  console.log('🖼️  Starting treatment images seed...');

  const treatments = await prisma.treatment.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      imageUrl: true,
    },
    orderBy: { name: 'asc' },
  });

  console.log(`Found ${treatments.length} treatments`);

  let updatedCount = 0;
  const categoryCounters: Record<string, number> = {};

  for (const treatment of treatments) {
    // Skip if already has an image
    if (treatment.imageUrl) {
      console.log(`  ⏭️  ${treatment.name} - already has image`);
      continue;
    }

    const images = categoryImages[treatment.category];
    if (!images || images.length === 0) {
      console.log(`  ⚠️  ${treatment.name} - no images for category ${treatment.category}`);
      continue;
    }

    // Rotate through images for each category
    const counterKey = treatment.category;
    categoryCounters[counterKey] = categoryCounters[counterKey] ?? 0;
    const imageIndex = categoryCounters[counterKey] % images.length;
    const imageUrl = images[imageIndex];
    categoryCounters[counterKey]++;

    await prisma.treatment.update({
      where: { id: treatment.id },
      data: { imageUrl },
    });

    updatedCount++;
    console.log(`  ✅ ${treatment.name} (${treatment.category})`);
  }

  console.log(`\n🎉 Updated ${updatedCount} treatments with images`);
  console.log('Treatment images seed complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding treatment images:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
