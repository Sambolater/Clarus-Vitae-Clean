import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { deskStructure } from './desk/deskStructure';

export default defineConfig({
  name: 'clarus-vitae',
  title: 'Clarus Vitae CMS',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Enable live preview for documents
    productionUrl: async (prev, context) => {
      const { document } = context;
      const baseUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000';

      if (document._type === 'article') {
        return `${baseUrl}/articles/${(document as any).slug?.current}`;
      }
      if (document._type === 'guide') {
        return `${baseUrl}/guides/${(document as any).slug?.current}`;
      }
      if (document._type === 'page') {
        return `${baseUrl}/${(document as any).slug?.current}`;
      }

      return prev;
    },
  },
});
