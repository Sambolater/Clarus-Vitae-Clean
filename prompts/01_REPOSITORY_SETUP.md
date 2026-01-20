# 01 - REPOSITORY SETUP & PROJECT SCAFFOLDING
## Clarus Vitae Platform - Foundation Task

> **Estimated Time**: 2-3 hours
> **Dependencies**: None (this is the first task)
> **Blocks**: All other development tasks

---

## Objective

Initialize the GitHub repository with a Turborepo monorepo structure, configure all tooling, and create the foundational project scaffolding that all other tasks will build upon.

---

## Context

You are setting up the repository for Clarus Vitae, a premium wellness research platform. This is a privacy-first platform for UHNWI (ultra-high-net-worth individuals) researching wellness destinations costing $3,000-$150,000.

**Brand**: Clarus Vitae
**Domain**: clarusvitae.com
**Index Name**: The Clarus Index

---

## Requirements

### Repository Structure

Create a Turborepo monorepo with the following structure:

```
clarus-vitae/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # Lint, type-check, test on PR
│   │   ├── preview.yml            # Deploy preview to Vercel
│   │   └── production.yml         # Deploy to production
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
├── apps/
│   └── web/                       # Next.js 14 frontend
│       ├── app/
│       │   ├── (marketing)/       # Homepage, about, editorial
│       │   ├── properties/        # Property listings and profiles
│       │   ├── treatments/        # Treatment database
│       │   ├── compare/           # Comparison tool
│       │   ├── reviews/           # Review system
│       │   ├── inquire/           # Lead capture
│       │   ├── team/              # Advisory team
│       │   └── api/               # API routes
│       ├── components/
│       ├── lib/
│       ├── styles/
│       ├── public/
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   ├── database/                  # Prisma schema, migrations
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   └── client.ts
│   │   └── package.json
│   ├── ui/                        # Shared component library
│   │   ├── src/
│   │   │   ├── components/
│   │   │   └── index.ts
│   │   └── package.json
│   ├── utils/                     # Shared utilities
│   │   ├── src/
│   │   └── package.json
│   ├── types/                     # Shared TypeScript types
│   │   ├── src/
│   │   └── package.json
│   ├── analytics/                 # Privacy-preserving analytics
│   │   ├── src/
│   │   └── package.json
│   └── config/                    # Shared configs
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CONTRIBUTING.md
│   ├── API.md
│   └── DEPLOYMENT.md
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
├── .env.example
├── .gitignore
├── .prettierrc
├── .eslintrc.js
└── README.md
```

### Package Configuration

**Root package.json**:
- Use pnpm as package manager
- Configure Turborepo scripts
- Include all necessary dev dependencies

**Turborepo Configuration**:
- Define build pipeline with proper caching
- Configure task dependencies
- Set up remote caching (optional)

### Next.js Configuration

- Next.js 14 with App Router
- TypeScript strict mode
- Tailwind CSS with custom config
- Server components by default
- Proper SEO meta configuration
- Image optimization settings

### Database Package

- Prisma ORM configured for PostgreSQL
- Connection to Supabase
- Initial schema with placeholder tables
- Type generation configured

### Tooling Setup

**ESLint**:
- Next.js recommended rules
- TypeScript rules
- Import sorting
- Accessibility rules

**Prettier**:
- Consistent formatting
- Tailwind class sorting

**TypeScript**:
- Strict mode enabled
- Path aliases configured
- Shared base config

### GitHub Actions

**CI Workflow** (on PR):
```yaml
- Checkout
- Setup pnpm
- Install dependencies
- Run lint
- Run type-check
- Run tests
- Build
```

**Preview Workflow**:
- Deploy to Vercel preview URL
- Comment PR with preview link

### Environment Variables Template

Create `.env.example` with:
```env
# Database
DATABASE_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Analytics (Plausible)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=

# Email (Resend)
RESEND_API_KEY=

# Search (Meilisearch)
MEILISEARCH_HOST=
MEILISEARCH_API_KEY=

# CMS (Sanity)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=

# Feature Flags
NEXT_PUBLIC_ENABLE_RESEARCH_MODE=true
```

---

## Deliverables

1. **Initialized Repository**
   - All directories created
   - All config files in place
   - Dependencies installed and locked

2. **Working Development Environment**
   - `pnpm dev` starts Next.js dev server
   - `pnpm build` completes successfully
   - `pnpm lint` passes
   - `pnpm type-check` passes

3. **Documentation**
   - README.md with setup instructions
   - CONTRIBUTING.md with guidelines
   - ARCHITECTURE.md with system overview

4. **CI/CD**
   - GitHub Actions workflows configured
   - Vercel project connected (manual step documented)

---

## Verification Checklist

- [ ] `pnpm install` completes without errors
- [ ] `pnpm dev` starts development server
- [ ] `pnpm build` completes successfully
- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm type-check` passes with no errors
- [ ] GitHub Actions CI workflow passes
- [ ] All environment variables documented
- [ ] README contains clear setup instructions

---

## Notes

- Do NOT add any business logic yet - this is pure scaffolding
- Do NOT connect to real databases - use placeholder connection strings
- Focus on getting the structure right - other tasks will add functionality
- Ensure all TypeScript path aliases work across packages
- Test that imports between packages work correctly

---

## Next Task

Once complete, the following tasks can begin in parallel:
- Task 02: Database Schema
- Task 03: UI Component Library Foundation
- Task 07: Privacy Infrastructure
