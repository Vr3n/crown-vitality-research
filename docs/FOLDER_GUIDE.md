Folder guide — important folders to know

- `app/`
  - Next.js app router routes and layouts. Top-level layout is `app/layout.tsx`, top pages in `app/page.tsx` and sub-routes in `app/add`, `app/edit`.
  - Uses Server and Client Components per Next 16 patterns.

- `components/`
  - Reusable UI components and primitives. `components/ui/` contains many small ui primitives (button, input, dialog, etc.).
  - Domain components like `note-card.tsx`, `note-editor-wrapper.tsx` live beside UI primitives.

- `hooks/`
  - React hooks used across the app: `use-toast.ts`, `use-mobile.ts`.

- `lib/`
  - Backend helpers and business logic.
  - `lib/supabase/` — client + server helpers for Supabase.
  - `lib/db/` — database schema and Drizzle initialization; `lib/db/index.ts` reads `POSTGRES_URL`.
  - `lib/actions/` — code that contains higher-level actions used by pages (notes, tags-categories).

- `public/` — static assets (icons, images).
- `styles/` — global CSS (note also `app/globals.css`).

Tips

- Keep UI components small and pure; domain actions belong in `lib/actions/` and database handling in `lib/db/`.
- For server-only code, prefer files under `lib/` and ensure keys come from server-only env vars.
