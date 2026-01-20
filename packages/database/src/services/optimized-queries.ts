/**
 * Optimized Database Queries
 *
 * Performance-optimized queries for common operations.
 * Uses selective field fetching to minimize data transfer.
 */

import { db } from '../client';

/**
 * Get properties for listing pages (minimal fields for cards)
 */
export async function getPropertiesForListing(options?: {
  tier?: string;
  country?: string;
  focusArea?: string;
  limit?: number;
  offset?: number;
}) {
  const { tier, country, focusArea, limit = 50, offset = 0 } = options || {};

  const where: Record<string, unknown> = {
    published: true,
  };

  if (tier) {
    where.tier = tier;
  }

  if (country) {
    where.country = country;
  }

  if (focusArea) {
    where.focusAreas = {
      has: focusArea,
    };
  }

  return db.property.findMany({
    where,
    select: {
      id: true,
      slug: true,
      name: true,
      tier: true,
      country: true,
      city: true,
      priceMin: true,
      priceMax: true,
      currency: true,
      editorChoice: true,
      verifiedExcellence: true,
      risingStar: true,
      overallScore: true,
      images: {
        where: { isFeatured: true },
        select: {
          url: true,
          alt: true,
        },
        take: 1,
      },
    },
    orderBy: [
      { overallScore: 'desc' },
      { name: 'asc' },
    ],
    skip: offset,
    take: limit,
  });
}

/**
 * Get property count by various filters
 */
export async function getPropertyCount(options?: {
  tier?: string;
  country?: string;
  focusArea?: string;
}) {
  const { tier, country, focusArea } = options || {};

  const where: Record<string, unknown> = {
    published: true,
  };

  if (tier) {
    where.tier = tier;
  }

  if (country) {
    where.country = country;
  }

  if (focusArea) {
    where.focusAreas = {
      has: focusArea,
    };
  }

  return db.property.count({ where });
}

/**
 * Get full property by slug (for detail pages)
 */
export async function getPropertyBySlug(slug: string) {
  return db.property.findUnique({
    where: { slug },
    include: {
      indexScores: {
        orderBy: { assessmentDate: 'desc' },
        take: 1,
      },
      tierOneDetails: true,
      treatments: {
        where: {
          treatment: {
            published: true,
          },
        },
        include: {
          treatment: {
            select: {
              id: true,
              slug: true,
              name: true,
              category: true,
              evidenceLevel: true,
            },
          },
        },
      },
      diagnostics: {
        where: {
          diagnostic: {
            published: true,
          },
        },
        include: {
          diagnostic: {
            select: {
              id: true,
              slug: true,
              name: true,
              category: true,
            },
          },
        },
      },
      equipment: {
        include: {
          equipment: {
            select: {
              id: true,
              slug: true,
              name: true,
              brand: true,
              model: true,
            },
          },
        },
      },
      programs: {
        where: { published: true },
        orderBy: { price: 'asc' },
      },
      images: {
        orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
      },
      reviews: {
        where: { status: 'APPROVED' },
        orderBy: { visitDate: 'desc' },
        take: 10,
        include: {
          teamMember: {
            select: {
              id: true,
              slug: true,
              name: true,
              title: true,
              photoUrl: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Get treatments for listing pages
 */
export async function getTreatmentsForListing(options?: {
  category?: string;
  evidenceLevel?: string;
  limit?: number;
  offset?: number;
}) {
  const { category, evidenceLevel, limit = 50, offset = 0 } = options || {};

  const where: Record<string, unknown> = {
    published: true,
  };

  if (category) {
    where.category = category;
  }

  if (evidenceLevel) {
    where.evidenceLevel = evidenceLevel;
  }

  return db.treatment.findMany({
    where,
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      evidenceLevel: true,
      description: true,
      _count: {
        select: {
          properties: true,
        },
      },
    },
    orderBy: [
      { name: 'asc' },
    ],
    skip: offset,
    take: limit,
  });
}

/**
 * Get treatment by slug with properties offering it
 */
export async function getTreatmentBySlug(slug: string) {
  return db.treatment.findUnique({
    where: { slug },
    include: {
      properties: {
        where: {
          property: {
            published: true,
          },
        },
        include: {
          property: {
            select: {
              id: true,
              slug: true,
              name: true,
              tier: true,
              country: true,
              city: true,
              overallScore: true,
              images: {
                where: { isFeatured: true },
                select: {
                  url: true,
                  alt: true,
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
}

/**
 * Get team members for listing
 */
export async function getTeamMembersForListing() {
  return db.teamMember.findMany({
    where: { published: true },
    select: {
      id: true,
      slug: true,
      name: true,
      title: true,
      photoUrl: true,
      specializations: true,
      propertiesVisited: true,
      programsCompleted: true,
    },
    orderBy: { name: 'asc' },
  });
}

/**
 * Get team member by slug with authored content
 */
export async function getTeamMemberBySlug(slug: string) {
  return db.teamMember.findUnique({
    where: { slug },
    include: {
      reviews: {
        where: { status: 'APPROVED' },
        orderBy: { visitDate: 'desc' },
        take: 10,
        include: {
          property: {
            select: {
              id: true,
              slug: true,
              name: true,
              tier: true,
              country: true,
            },
          },
        },
      },
      articles: {
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
        take: 10,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          publishedAt: true,
          category: true,
        },
      },
    },
  });
}

/**
 * Get articles for listing
 */
export async function getArticlesForListing(options?: {
  category?: string;
  authorSlug?: string;
  limit?: number;
  offset?: number;
}) {
  const { category, authorSlug, limit = 20, offset = 0 } = options || {};

  const where: Record<string, unknown> = {
    published: true,
  };

  if (category) {
    where.category = category;
  }

  if (authorSlug) {
    where.author = {
      slug: authorSlug,
    };
  }

  return db.article.findMany({
    where,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      publishedAt: true,
      featuredImage: true,
      author: {
        select: {
          id: true,
          slug: true,
          name: true,
          photoUrl: true,
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
    skip: offset,
    take: limit,
  });
}

/**
 * Get article by slug
 */
export async function getArticleBySlug(slug: string) {
  return db.article.findUnique({
    where: { slug },
    include: {
      author: true,
    },
  });
}

/**
 * Get reviews for a property with pagination
 * Note: Named differently to avoid conflict with review-service.ts
 */
export async function getReviewsForProperty(
  propertyId: string,
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: 'date' | 'rating' | 'helpful';
  }
) {
  const { limit = 10, offset = 0, sortBy = 'date' } = options || {};

  const orderBy: Record<string, string>[] = [];

  switch (sortBy) {
    case 'rating':
      orderBy.push({ overallRating: 'desc' });
      break;
    case 'helpful':
      orderBy.push({ helpfulCount: 'desc' });
      break;
    case 'date':
    default:
      orderBy.push({ visitDate: 'desc' });
  }

  return db.review.findMany({
    where: {
      propertyId,
      status: 'APPROVED',
    },
    select: {
      id: true,
      reviewText: true,
      overallRating: true,
      serviceRating: true,
      facilitiesRating: true,
      valueRating: true,
      goalAchievement: true,
      visitDate: true,
      stayLengthDays: true,
      verified: true,
      isTeamReview: true,
      helpfulCount: true,
      pros: true,
      cons: true,
      teamMember: {
        select: {
          id: true,
          slug: true,
          name: true,
          title: true,
          photoUrl: true,
        },
      },
      bioAgeChange: true,
      weightChange: true,
      energyImprovement: true,
      sleepImprovement: true,
    },
    orderBy,
    skip: offset,
    take: limit,
  });
}

/**
 * Get unique countries with property counts (for destination pages)
 */
export async function getDestinationsWithCounts() {
  const countries = await db.property.groupBy({
    by: ['country'],
    where: { published: true },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  });

  return countries.map((c) => ({
    name: c.country,
    slug: c.country.toLowerCase().replace(/\s+/g, '-'),
    propertyCount: c._count.id,
  }));
}

/**
 * Get properties for comparison (minimal fields)
 */
export async function getPropertiesForComparison(slugs: string[]) {
  return db.property.findMany({
    where: {
      slug: { in: slugs },
      published: true,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      tier: true,
      country: true,
      city: true,
      priceMin: true,
      priceMax: true,
      currency: true,
      website: true,
      overallScore: true,
      clinicalRigorScore: true,
      outcomeEvidenceScore: true,
      programDepthScore: true,
      experienceQualityScore: true,
      valueAlignmentScore: true,
      physicianPatientRatio: true,
      avgBookingLeadTime: true,
      returnGuestPercentage: true,
      staffTenure: true,
      focusAreas: true,
      treatments: {
        include: {
          treatment: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
      programs: {
        where: { published: true },
        select: {
          name: true,
          durationDays: true,
          price: true,
        },
        take: 5,
      },
      images: {
        where: { isFeatured: true },
        select: {
          url: true,
          alt: true,
        },
        take: 1,
      },
    },
  });
}
