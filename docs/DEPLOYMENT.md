# Deployment Guide

This document describes how to deploy the Clarus Vitae platform.

## Environments

| Environment | URL | Branch | Auto-deploy |
|-------------|-----|--------|-------------|
| Development | localhost:3000 | - | - |
| Preview | *.vercel.app | PR branches | Yes |
| Production | clarusvitae.com | main | Yes |

## Prerequisites

### Services

1. **Vercel Account** - For hosting
2. **Supabase Project** - For PostgreSQL database
3. **Plausible Account** - For analytics (optional)
4. **Sanity Project** - For CMS (future)

### Secrets

Configure these in Vercel project settings:

| Secret | Description |
|--------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `DIRECT_URL` | Supabase direct connection (for migrations) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `VERCEL_TOKEN` | Vercel deployment token |

## Initial Setup

### 1. Create Vercel Project

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link
```

### 2. Configure Environment Variables

In Vercel dashboard:

1. Go to Project Settings > Environment Variables
2. Add all required secrets for each environment
3. Ensure `NEXT_PUBLIC_*` variables are available at build time

### 3. Set Up Database

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to Supabase
pnpm db:push
```

### 4. Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

## CI/CD Pipeline

### Pull Request Flow

1. PR opened against `main`
2. CI workflow runs:
   - Lint
   - Type check
   - Build
3. Preview deployment created
4. PR commented with preview URL

### Production Flow

1. PR merged to `main`
2. CI workflow runs
3. Production deployment triggered
4. Vercel deploys to production

## GitHub Actions

### Required Secrets

Add to GitHub repository settings:

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel deployment token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

### Workflow Files

- `.github/workflows/ci.yml` - Lint, type-check, build
- `.github/workflows/preview.yml` - Preview deployments
- `.github/workflows/production.yml` - Production deployments

## Manual Deployment

### Preview

```bash
# Build for preview
vercel build

# Deploy preview
vercel deploy --prebuilt
```

### Production

```bash
# Build for production
vercel build --prod

# Deploy to production
vercel deploy --prebuilt --prod
```

## Database Migrations

### Development

```bash
# Create and apply migration
pnpm db:migrate
```

### Production

1. Test migrations locally
2. Run `pnpm db:push` against production database
3. For complex migrations, use `prisma migrate deploy`

## Monitoring

### Vercel Analytics

- Enable in Vercel dashboard
- Web Vitals tracking
- Error tracking

### Plausible Analytics

- Privacy-first analytics
- No cookie banner required
- Configure `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

## Rollback

### Via Vercel Dashboard

1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Via CLI

```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote <deployment-url>
```

## Troubleshooting

### Build Failures

1. Check build logs in Vercel dashboard
2. Ensure all environment variables are set
3. Verify dependencies are installed: `pnpm install --frozen-lockfile`
4. Test build locally: `pnpm build`

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check Supabase connection pooler settings
3. Ensure IP restrictions allow Vercel

### Performance Issues

1. Check Vercel Analytics for slow pages
2. Review bundle size with `@next/bundle-analyzer`
3. Verify images are optimized
4. Check database query performance

## Security Checklist

- [ ] All secrets in Vercel environment variables
- [ ] No secrets in repository code
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Database connections encrypted
- [ ] Rate limiting enabled

## Contacts

- **DevOps Issues**: devops@clarusvitae.com
- **Emergency**: [Vercel Status Page](https://vercel.statuspage.io)
