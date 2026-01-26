/**
 * Gallery Images Seed Script
 * Adds 5 additional images per property (treatment, accommodation, pool, dining, spa)
 * Total: 28 properties × 5 images = 140 additional images
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Unsplash image collections by category (high-quality wellness/spa imagery)
const imageCategories = {
  treatment: [
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552693673-1bf958298935?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop&q=80',
  ],
  accommodation: [
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1920&h=1080&fit=crop&q=80',
  ],
  pool: [
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519449556851-5720b33024e7?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop&q=80',
  ],
  dining: [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop&q=80',
  ],
  spa: [
    'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&q=80',
  ],
} as const;

type CategoryKey = keyof typeof imageCategories;

function getImageForProperty(propertyIndex: number, category: CategoryKey): string {
  const images = imageCategories[category];
  return images[propertyIndex % images.length];
}

async function main() {
  console.log('Starting gallery images seed...');

  const properties = await prisma.property.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: 'asc' },
  });

  console.log(`Found ${properties.length} properties`);

  const categories: CategoryKey[] = ['treatment', 'accommodation', 'pool', 'dining', 'spa'];
  let createdCount = 0;

  for (let i = 0; i < properties.length; i++) {
    const property = properties[i]!;
    console.log(`Processing: ${property.name}`);

    for (let j = 0; j < categories.length; j++) {
      const category = categories[j]!;
      const url = getImageForProperty(i + j, category);
      
      const existing = await prisma.propertyImage.findFirst({
        where: {
          propertyId: property.id,
          category: category,
        },
      });

      if (!existing) {
        await prisma.propertyImage.create({
          data: {
            propertyId: property.id,
            url: url,
            alt: `${property.name} - ${category.charAt(0).toUpperCase() + category.slice(1)}`,
            width: 1920,
            height: 1080,
            aspectRatio: '16:9',
            category: category,
            isFeatured: false,
            sortOrder: j + 1,
          },
        });
        createdCount++;
      }
    }
  }

  console.log(`Created ${createdCount} gallery images`);
  console.log('Gallery images seed complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding gallery images:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
