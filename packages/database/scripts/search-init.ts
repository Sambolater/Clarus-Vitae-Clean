/**
 * Search Index Initialization Script
 *
 * Sets up Meilisearch indexes with proper configuration.
 * Run this once when setting up the environment.
 *
 * Usage: pnpm --filter @clarus-vitae/database search:init
 */

import { initializeSearchIndexes, getIndexStats } from '../src/search';

async function main() {
  console.log('='.repeat(60));
  console.log('Clarus Vitae - Search Index Initialization');
  console.log('='.repeat(60));
  console.log('');

  try {
    console.log('Initializing search indexes...');
    await initializeSearchIndexes();

    console.log('');
    console.log('Verifying indexes...');
    const stats = await getIndexStats();

    console.log('');
    console.log('Index Status:');
    console.log(`  Properties: ${stats.properties.numberOfDocuments} documents`);
    console.log(`  Treatments: ${stats.treatments.numberOfDocuments} documents`);
    console.log(`  Articles:   ${stats.articles.numberOfDocuments} documents`);

    console.log('');
    console.log('Search indexes initialized successfully.');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Run "pnpm --filter @clarus-vitae/database search:reindex" to index all content');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('Failed to initialize search indexes:');
    console.error(error instanceof Error ? error.message : error);

    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      console.error('');
      console.error('Meilisearch is not running. Start it with:');
      console.error('  docker-compose up -d meilisearch');
    }

    process.exit(1);
  }
}

main();
