Environment variables

Recommended environment variable names (match production):

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key used by browser clients
- `SUPABASE_URL` — (optional) Supabase URL for server code (can reuse `NEXT_PUBLIC_SUPABASE_URL`)
- `SUPABASE_SERVICE_ROLE_KEY` — Service role (admin) key. MUST be server-only.
- `POSTGRES_URL` — Postgres connection string used by Drizzle (`lib/db/index.ts` uses `POSTGRES_URL`)

Local development

- Create a `.env.local` at project root and do NOT commit it.

Example `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...anon...
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...service_role...
POSTGRES_URL=postgres://user:pass@host:port/dbname
```

CI / Deployment

- Configure these variables in your hosting provider's secret store (Vercel, Netlify, Fly, etc.).
- Mark admin keys as server-only (do not prefix with `NEXT_PUBLIC_`).

Git

- Ensure `.env.local` and any files containing secrets are listed in `.gitignore`.

Rotation

- Have a documented key-rotation process: add new key, update envs, deploy, verify, revoke old key.