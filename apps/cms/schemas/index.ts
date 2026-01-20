// Document schemas
import article from './documents/article';
import guide from './documents/guide';
import page from './documents/page';
import faq from './documents/faq';
import glossaryTerm from './documents/glossaryTerm';

// Object schemas
import portableText from './objects/portableText';
import seo from './objects/seo';
import callToAction from './objects/callToAction';

/**
 * Sanity Schema Types
 *
 * Document Types:
 * - article: Editorial articles (longevity, wellness trends, interviews, etc.)
 * - guide: Long-form structured guides (destination, treatment, planning)
 * - page: Static pages (legal, about, landing)
 * - faq: Frequently asked questions
 * - glossaryTerm: Wellness terminology definitions
 *
 * Object Types:
 * - portableText: Rich text content with custom blocks
 * - seo: SEO metadata fields
 * - callToAction: CTA button/link configuration
 */
export const schemaTypes = [
  // Documents
  article,
  guide,
  page,
  faq,
  glossaryTerm,

  // Objects
  portableText,
  seo,
  callToAction,
];
