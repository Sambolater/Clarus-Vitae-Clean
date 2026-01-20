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
  focusAreaSlug?: string;
  limit?: number;
  offset?: number;
}) {
  const { tier, country, focusAreaSlug, limit = 50, offset = 0 } = options || {};

  const where: Record<string, unknown> = {
    status: 'PUBLISHED',
  };

  if (tier) {
    where.tier = tier;
  }

  if (country) {
    where.country = country;
  }

  if (focusAreaSlug) {
    where.focusAreas = {
      some: {
        focusArea: {
          slug: focusAreaSlug,
        },
      },
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
      isEditorsChoice: true,
      isVerifiedExcellence: true,
      isRisingStar: true,
      clarusIndex: {
        select: {
          overallScore: true,
          tier: true,
        },
      },
      images: {
        where: { isPrimary: true },
        select: {
          url: true,
          altText: true,
        },
        take: 1,
      },
    },
    orderBy: [
      { clarusIndex: { overallScore: 'desc' } },
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
  focusAreaSlug?: string;
}) {
  const { tier, country, focusAreaSlug } = options || {};

  const where: Record<string, unknown> = {
    status: 'PUBLISHED',
  };

  if (tier) {
    where.tier = tier;
  }

  if (country) {
    where.country = country;
  }

  if (focusAreaSlug) {
    where.focusAreas = {
      some: {
        focusArea: {
          slug: focusAreaSlug,
        },
      },
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
      clarusIndex: true,
      darkData: true,
      culturalData: true,
      focusAreas: {
        include: {
          focusArea: true,
        },
      },
      treatments: {
        where: {
          treatment: {
            status: 'PUBLISHED',
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
            status: 'PUBLISHED',
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
        where: {
          equipment: {
            status: 'PUBLISHED',
          },
        },
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
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      },
      images: {
        orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
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
              headshotUrl: true,
            },
          },
        },
      },
      partnership: {
        select: {
          status: true,
          commissionPercentage: true,
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
    status: 'PUBLISHED',
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
      imageUrl: true,
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
            status: 'PUBLISHED',
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
              clarusIndex: {
                select: {
                  overallScore: true,
                  tier: true,
                },
              },
              images: {
                where: { isPrimary: true },
                select: {
                  url: true,
                  altText: true,
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
    where: { isActive: true },
    select: {
      id: true,
      slug: true,
      name: true,
      title: true,
      headshotUrl: true,
      specializations: true,
      propertiesVisited: true,
      yearsExperience: true,
    },
    orderBy: { displayOrder: 'asc' },
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
        where: { status: 'PUBLISHED' },
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
    status: 'PUBLISHED',
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
      heroImageUrl: true,
      author: {
        select: {
          id: true,
          slug: true,
          name: true,
          headshotUrl: true,
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
      properties: {
        include: {
          property: {
            select: {
              id: true,
              slug: true,
              name: true,
              tier: true,
              country: true,
              clarusIndex: {
                select: {
                  overallScore: true,
                  tier: true,
                },
              },
            },
          },
        },
      },
      treatments: {
        include: {
          treatment: {
            select: {
              id: true,
              slug: true,
              name: true,
              category: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Get reviews for a property with pagination
 */
export async function getPropertyReviews(
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
      orderBy.push({ ratingOverall: 'desc' });
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
      reviewTitle: true,
      reviewText: true,
      ratingOverall: true,
      ratingGoalAchievement: true,
      ratingProtocolQuality: true,
      ratingFollowUpQuality: true,
      goalAchievement: true,
      visitDate: true,
      stayDuration: true,
      isVerifiedStay: true,
      isTeamReview: true,
      helpfulCount: true,
      teamMember: {
        select: {
          id: true,
          slug: true,
          name: true,
          title: true,
          headshotUrl: true,
        },
      },
      measurableOutcomes: true,
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
    where: { status: 'PUBLISHED' },
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
 * Get focus areas with property counts
 */
export async function getFocusAreasWithCounts() {
  return db.focusArea.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      _count: {
        select: {
          properties: {
            where: {
              property: {
                status: 'PUBLISHED',
              },
            },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });
}

/**
 * Get properties for comparison (minimal fields)
 */
export async function getPropertiesForComparison(slugs: string[]) {
  return db.property.findMany({
    where: {
      slug: { in: slugs },
      status: 'PUBLISHED',
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
      clarusIndex: true,
      darkData: {
        select: {
          physicianRatio: true,
          averageBookingLeadDays: true,
          returnGuestPercentage: true,
          staffTenureYears: true,
        },
      },
      focusAreas: {
        include: {
          focusArea: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
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
        where: { isActive: true },
        select: {
          name: true,
          durationDays: true,
          priceFrom: true,
        },
        take: 5,
      },
      images: {
        where: { isPrimary: true },
        select: {
          url: true,
          altText: true,
        },
        take: 1,
      },
    },
  });
}
