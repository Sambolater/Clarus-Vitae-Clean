# Architecture

This document describes the technical architecture of the Clarus Vitae platform.

## Overview

Clarus Vitae is built as a monorepo using Turborepo, with a Next.js 14 frontend and PostgreSQL database. The architecture prioritizes:

- **Privacy**: No third-party trackers, cookie-free analytics
- **Performance**: Sub-2-second page loads globally
- **Maintainability**: Shared packages for consistency
- **Type Safety**: End-to-end TypeScript

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel Edge                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Next.js    │    │   Plausible  │    │    Sanity    │      │
│  │   App (SSR)  │    │   Analytics  │    │     CMS      │      │
│  └──────┬───────┘    └──────────────┘    └──────┬───────┘      │
│         │                                        │              │
│         ▼                                        ▼              │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                    API Routes                         │      │
│  │  ├── /api/health                                     │      │
│  │  ├── /api/properties                                 │      │
│  │  ├── /api/treatments                                 │      │
│  │  ├── /api/inquiries                                  │      │
│  │  └── /api/search                                     │      │
│  └──────────────────────┬───────────────────────────────┘      │
│                         │                                       │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Supabase                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  PostgreSQL  │    │   Storage    │    │     Auth     │      │
│  │   Database   │    │   (Images)   │    │   (Future)   │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## Monorepo Structure

### Apps

- **`apps/web`**: Next.js 14 application with App Router
  - Server Components for SEO and performance
  - Client Components for interactivity
  - API routes for backend functionality

### Packages

- **`packages/config`**: Shared configuration
  - ESLint presets
  - TypeScript base configurations
  - Tailwind CSS preset with brand colors

- **`packages/database`**: Database layer
  - Prisma schema and client
  - Type-safe database queries

- **`packages/types`**: Shared TypeScript types
  - Property, Treatment, Review types
  - Clarus Index types
  - Ensures type consistency across packages

- **`packages/ui`**: Component library
  - Brand-compliant UI components
  - Accessible by default
  - Built with React and Tailwind

- **`packages/utils`**: Shared utilities
  - Formatting functions
  - Validation helpers
  - Class name utilities

- **`packages/analytics`**: Privacy-first analytics
  - Plausible integration
  - Respects Do Not Track
  - Research Mode support

## Data Flow

### Property Discovery Flow

```
User visits /properties
        │
        ▼
Server Component fetches properties from database
        │
        ▼
Properties rendered with Clarus Index scores
        │
        ▼
User applies filters (Client Component)
        │
        ▼
API route returns filtered results
        │
        ▼
Results updated in UI
```

### Inquiry Flow

```
User visits property profile
        │
        ▼
Clicks "Make Inquiry"
        │
        ▼
Form rendered (secure option available)
        │
        ▼
Form submitted to API route
        │
        ▼
Data encrypted and stored
        │
        ▼
Notification sent to property
        │
        ▼
Confirmation shown to user
```

## Database Schema

The database is designed around these core entities:

- **Property**: Wellness facilities with Clarus Index scores
- **Treatment**: Wellness treatments and modalities
- **Review**: Outcome-focused guest reviews
- **Inquiry**: Lead capture with privacy options
- **ClarusIndexScore**: Historical scoring data
- **AdvisoryTeamMember**: Expert profiles

See `packages/database/prisma/schema.prisma` for the full schema.

## Security Considerations

### Privacy Architecture

- No third-party cookies or tracking pixels
- Plausible analytics (privacy-first, cookieless)
- Research Mode: browse without any data capture
- Data minimization: collect only what's necessary
- Encrypted lead handling

### Application Security

- HTTPS enforced via Vercel
- Security headers configured in Next.js
- Input validation on all forms
- SQL injection prevention via Prisma
- XSS prevention via React

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.0s |
| Time to Interactive | < 2.5s |
| Cumulative Layout Shift | < 0.1 |

## Caching Strategy

- **Static pages**: ISR with 1-hour revalidation
- **Property data**: Cached at edge, revalidated on update
- **Images**: Optimized via Next.js Image with CDN caching
- **API responses**: Cache-Control headers based on data volatility

## Future Considerations

- **Search**: Meilisearch for full-text search
- **CMS**: Sanity for editorial content
- **Authentication**: For premium features (Phase 2)
- **API**: Public API for partners (Phase 3)
