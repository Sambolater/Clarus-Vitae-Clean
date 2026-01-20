/**
 * Search Reindex Script
 *
 * Clears and rebuilds all Meilisearch indexes from the database.
 * Use this after major data changes or to fix index issues.
 *
 * Usage: pnpm --filter @clarus-vitae/database search:reindex
 */

import { reindexAll, getIndexStats } from '../src/search';

async function main() {
  console.log('='.repeat(60));
  console.log('Clarus Vitae - Search Reindex');
  console.log('='.repeat(60));
  console.log('');

  try {
    console.log('Starting full reindex...');
    console.log('This will clear all existing search data and rebuild from the database.');
    console.log('');

    const startTime = Date.now();
    const results = await reindexAll();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('');
    console.log('Reindex complete.');
    console.log(`  Duration: ${duration}s`);
    console.log(`  Properties indexed: ${results.properties}`);
    console.log(`  Treatments indexed: ${results.treatments}`);
    console.log(`  Articles indexed:   ${results.articles}`);

    // Verify indexes
    console.log('');
    console.log('Verifying indexes...');

    // Wait a moment for indexing to complete
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const stats = await getIndexStats();

    console.log('');
    console.log('Index Status:');
    console.log(
      `  Properties: ${stats.properties.numberOfDocuments} documents ${stats.properties.isIndexing ? '(indexing...)' : '(ready)'}`
    );
    console.log(
      `  Treatments: ${stats.treatments.numberOfDocuments} documents ${stats.treatments.isIndexing ? '(indexing...)' : '(ready)'}`
    );
    console.log(
      `  Articles:   ${stats.articles.numberOfDocuments} documents ${stats.articles.isIndexing ? '(indexing...)' : '(ready)'}`
    );

    console.log('');
    console.log('Reindex completed successfully.');
  } catch (error) {
    console.error('');
    console.error('Reindex failed:');
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
