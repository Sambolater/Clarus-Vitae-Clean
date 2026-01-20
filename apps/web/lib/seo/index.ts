/**
 * SEO Module
 *
 * Centralized exports for all SEO-related utilities.
 */

// Metadata generators
export {
  siteConfig,
  generateMetadata,
  propertyMetadata,
  treatmentMetadata,
  articleMetadata,
  teamMemberMetadata,
  destinationMetadata,
  focusAreaMetadata,
  comparisonMetadata,
  searchMetadata,
  staticPageMetadata,
} from './metadata';

// Structured data generators (re-exported from lib)
export {
  generatePropertyStructuredData,
  generateOrganizationStructuredData,
  generateBreadcrumbStructuredData,
  generateReviewStructuredData,
  generateWebsiteStructuredData,
  generatePropertyListStructuredData,
  generateTreatmentStructuredData,
  generateArticleStructuredData,
  generateFAQStructuredData,
  generateTeamMemberStructuredData,
  combineStructuredData,
} from '../structured-data';
