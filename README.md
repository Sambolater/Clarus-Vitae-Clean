# Clarus Vitae

**Clarity for Life's Most Important Decisions**

Clarus Vitae is a premium wellness research platform providing verified, independent intelligence for high-stakes wellness decisions. Our proprietary Clarus Index evaluates facilities across five dimensions with transparent methodology.

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/clarus-vitae.git
cd clarus-vitae

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Generate Prisma client
pnpm db:generate

# Start development server
pnpm dev
```

The web app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
clarus-vitae/
├── apps/
│   ├── web/                    # Next.js 14 frontend
│   └── cms/                    # Sanity Studio (content management)
├── packages/
│   ├── analytics/              # Privacy-first analytics (Plausible)
│   ├── config/                 # Shared ESLint, TypeScript, Tailwind configs
│   ├── database/               # Prisma schema, Sanity client, search
│   ├── types/                  # Shared TypeScript types
│   ├── ui/                     # Shared component library
│   └── utils/                  # Shared utilities
├── assets/                     # Brand assets (logo, mockups, etc.)
├── docs/                       # Documentation
└── prompts/                    # Build task prompts and brand guide
```

## Sanity CMS Setup

The project uses [Sanity](https://sanity.io) for editorial content (articles, guides, FAQs, glossary).

### First-time Setup

1. **Create environment files:**

```bash
# Root .env.local (for web app)
cat > .env.local << 'EOF'
NEXT_PUBLIC_SANITY_PROJECT_ID="vg9rqgoq"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your-token-here"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
EOF

# CMS .env.local (for Sanity Studio)
cat > apps/cms/.env.local << 'EOF'
SANITY_STUDIO_PROJECT_ID="vg9rqgoq"
SANITY_STUDIO_DATASET="production"
SANITY_STUDIO_PREVIEW_URL="http://localhost:3000"
EOF
```

2. **Get an API token:**
   - Go to [sanity.io/manage](https://sanity.io/manage) → Project → API → Tokens
   - Create a token with "Editor" permissions
   - Add it to `SANITY_API_TOKEN` in `.env.local`

3. **Start Sanity Studio:**

```bash
cd apps/cms && pnpm dev
```

Studio runs at [http://localhost:3333](http://localhost:3333)

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm lint:fix` | Fix ESLint issues |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm format` | Format code with Prettier |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema changes to database |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm clean` | Clean all build artifacts |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Package Manager**: pnpm
- **Monorepo**: Turborepo
- **Deployment**: Vercel
- **Analytics**: Plausible (privacy-first)

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - System architecture and design decisions
- [Contributing](./docs/CONTRIBUTING.md) - How to contribute to the project
- [API](./docs/API.md) - API documentation
- [Deployment](./docs/DEPLOYMENT.md) - Deployment guide

## Brand Resources

- Brand guide and visual identity: `prompts/CV_Brand_Guide.md`
- Logo assets: `assets/logo/`
- Component mockups: `assets/components/`
- Page mockups: `assets/mockups/`

## Key Principles

1. **Privacy First** - No tracking, no cookies, Research Mode for anonymous browsing
2. **Human Authority** - Named experts behind every assessment
3. **Evidence Over Adjectives** - Specific data points, not marketing speak
4. **Editorial Independence** - Properties cannot pay for favorable coverage
5. **Transparency** - Published methodology, acknowledged limitations

## License

Proprietary. All rights reserved.
