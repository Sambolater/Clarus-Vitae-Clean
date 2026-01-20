# Contributing to Clarus Vitae

Thank you for your interest in contributing to Clarus Vitae. This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and professional
- Focus on constructive feedback
- Maintain confidentiality of proprietary information

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Git

### Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env.local` and configure
4. Generate Prisma client: `pnpm db:generate`
5. Start development: `pnpm dev`

## Development Workflow

### Branch Naming

Use descriptive branch names:

- `feature/property-search` - New features
- `fix/inquiry-validation` - Bug fixes
- `chore/update-deps` - Maintenance tasks
- `docs/api-documentation` - Documentation updates

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat(properties): add filter by price range`
- `fix(ui): correct button hover state`
- `docs(api): document inquiry endpoints`

### Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all checks pass: `pnpm lint && pnpm type-check && pnpm build`
4. Submit a PR using the template
5. Address review feedback
6. Squash and merge when approved

## Code Standards

### TypeScript

- Strict mode enabled
- Explicit return types for functions
- Use type imports: `import type { Foo } from './foo'`
- No `any` types without justification

### React Components

- Use Server Components by default
- Mark Client Components explicitly with `'use client'`
- Props interfaces named `{Component}Props`
- Use forwardRef for components that need refs

### Styling

- Use Tailwind CSS utility classes
- Follow brand color palette from `@clarus-vitae/config/tailwind`
- Mobile-first responsive design
- Ensure WCAG AA accessibility compliance

### Testing

- Write tests for new features
- Maintain existing test coverage
- Use meaningful test descriptions
- Test edge cases and error states

## Project Structure

```
apps/web/
├── app/           # Next.js App Router pages
├── components/    # App-specific components
├── lib/           # App-specific utilities
└── styles/        # Global styles

packages/
├── config/        # Shared configurations
├── database/      # Prisma schema and client
├── types/         # Shared TypeScript types
├── ui/            # Shared UI components
├── utils/         # Shared utilities
└── analytics/     # Analytics package
```

## Adding New Features

### New Package

1. Create directory in `packages/`
2. Add `package.json` with `@clarus-vitae/` namespace
3. Add `tsconfig.json` extending base config
4. Export from `src/index.ts`
5. Add to consuming package dependencies

### New Component (UI Package)

1. Create component in `packages/ui/src/components/`
2. Follow existing component patterns
3. Export from `packages/ui/src/index.ts`
4. Document props with JSDoc comments

### New API Route

1. Create in `apps/web/app/api/`
2. Use proper HTTP methods
3. Validate input
4. Handle errors gracefully
5. Document in `docs/API.md`

## Database Changes

1. Modify `packages/database/prisma/schema.prisma`
2. Run `pnpm db:generate` to update client
3. Test changes locally
4. Create migration for production

## Questions?

- Check existing documentation
- Review related issues and PRs
- Ask in team discussions

Thank you for contributing to Clarus Vitae.
