Project Overview

- Name: my-v0-project
- Platform: Node.js + Next.js 16 (app router)
- Purpose: Minimal note-taking app for nutritionists/personal trainers (tags, categories, quick notes)

Quick commands

- Install deps (using pnpm):

```pwsh
pnpm install
```

- Run in development:

```pwsh
pnpm dev
```

- Build for production:

```pwsh
pnpm build
pnpm start
```

Key tech

- Next 16 app-router and Server Components
- Supabase for auth and database (client and server helpers in `lib/supabase/`)
- Drizzle ORM + Postgres (see `lib/db/`)
- Tailwind + Radix UI + custom UI primitives in `components/ui/`

Important files

- `package.json` — scripts and deps
- `next.config.mjs` — Next config
- `app/` — top-level routes and layouts
- `lib/` — backend helpers, DB, API actions
- `components/` — UI components and primitives

Notes

- Keep `.env.local` and other env files out of version control. Use project secret stores in CI/CD/hosting (Vercel, Netlify, etc.).
- This repository intentionally ignores `node_modules` and `.venv`.