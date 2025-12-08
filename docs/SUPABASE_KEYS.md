Supabase keys & usage guidance

Overview

- Supabase provides two common key types:
  - Anon (public) key — intended for client/browser use. Limited by Row Level Security (RLS) policies.
  - Service role (admin) key — full privileges; must never be exposed to clients.

Which keys go where

- Browser / client code: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - These are safe to expose only when you enforce RLS policies server-side in Supabase.

- Server-only / privileged operations: `SUPABASE_SERVICE_ROLE_KEY` (never expose to browser).
  - Use this in server code (API routes, server functions, Edge Functions) only.

Project examples (this repo)

- `lib/supabase/client.ts` (client-side) — uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `lib/supabase/server.ts` (server) — currently uses the anon key + cookie helpers to create a server client tied to request cookies. If you need admin-level operations, create a separate server-only admin client that uses `SUPABASE_SERVICE_ROLE_KEY`.

Example server-only admin client (create at `lib/supabase/admin.ts`):

```ts
import { createClient } from "@supabase/supabase-js"

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

Security checklist for keys

- Never commit `SUPABASE_SERVICE_ROLE_KEY` to version control.
- Store secrets in your hosting provider's secret manager (Vercel Environment Variables, GitHub Secrets, etc.).
- Rotate keys regularly and have a rollback plan.
- Limit usage of the service role key to server processes only.

When to use server-side vs client-side

- Client-side (anon key + RLS): Use for ordinary app flows where users read and write their own data and policies enforce access.
- Server-side (service role): Use for admin tasks (mass updates, importing/exporting data, running database migrations) or when executing operations that must bypass RLS.

Further reading

- Supabase docs: Row Level Security, service_role, and key management.
- Store service role keys in a secure vault and avoid using them in ephemeral client code.
