# @clarus-vitae/database

Database package for Clarus Vitae using Prisma ORM with PostgreSQL (Supabase).

## Setup

1. Copy `.env.example` to `.env` in both project root and this package
2. Add your Supabase connection strings (see below)

## Commands

```bash
# From project root:
pnpm db:generate  # Generate Prisma client types
pnpm db:push      # Push schema to database
pnpm db:seed      # Seed sample data
pnpm db:studio    # Open visual database browser (localhost:5555)
```

## Environment Variables

Get these from Supabase Dashboard → Connect → ORMs:

```env
# Transaction pooler (port 6543) - for general queries
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Session pooler (port 5432) - for migrations
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

**Note:** If on IPv4 network, use pooler URLs for both (not direct connection).

## Schema

The schema is defined in `prisma/schema.prisma` and includes:

- **Property** - Wellness properties with Clarus Index scores
- **Treatment** - Treatments with evidence levels
- **Diagnostic** - Diagnostic tests
- **Equipment** - Medical equipment
- **Program** - Wellness programs
- **Review** - User and team reviews
- **Inquiry** - Lead capture
- **TeamMember** - Advisory team
- **Article** - Editorial content

## Usage

```typescript
import { db } from '@clarus-vitae/database';

// Query properties
const properties = await db.property.findMany({
  where: { published: true },
  include: { treatments: true }
});
```
