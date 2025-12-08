# Neon + Drizzle Migration Notes

Summary:
This document records the decisions and exact changes required to switch the project
to use Neon Postgres and Drizzle exclusively (no auth).

Decision:
- DB provider: Neon (serverless pooler)
- Env var to use: `DATABASE_URL` (already set in `.env.local`)
- Drizzle driver options: keep using `postgres` (postgres.js) or use Neon serverless adapter (`@neondatabase/serverless`) with `drizzle-orm/neon-http`.
- No authentication — all access is server-side via Drizzle.

Code edits applied in repo:
1. `lib/db/index.ts` — now reads `process.env.DATABASE_URL` and uses `postgres` with `prepare: false`.
2. `drizzle.config.ts` — added Drizzle Kit configuration pointing at `./lib/db/schema.ts`.
3. `drizzle/migrations/0001_initial.sql` — added initial SQL migration (creates extensions + tables to match schema).
4. `package.json` — added `drizzle:generate`, `drizzle:migrate`, and `drizzle:push` scripts.

Commands & workflow

- Install drizzle-kit (dev):
```pwsh
pnpm add -D drizzle-kit
```

- (Optional) If you want the Neon-specific serverless driver:
```pwsh
pnpm add @neondatabase/serverless
```

- Generate migrations (if you later modify schema):
```pwsh
npx drizzle-kit generate --out ./drizzle/migrations --schema ./lib/db/schema.ts
```

- Apply migrations to Neon (ensure `DATABASE_URL` env is set in your shell or CI):
```pwsh
npx drizzle-kit migrate --connection $env:DATABASE_URL --migrations ./drizzle/migrations
```

- Data migration from Supabase (example dump + restore):
Set source DB password in PowerShell and create a dump using `pg_dump`:
```pwsh
$env:PGPASSWORD = 'SUPABASE_DB_PASSWORD'
pg_dump -h SUPA_HOST -p SUPA_PORT -U SUPA_USER -Fc -f supabase_dump_full.dump SUPA_DB
```

Then set target (Neon) password and restore using `pg_restore`:
```pwsh
$env:PGPASSWORD = 'NEON_DB_PASSWORD'
pg_restore --host=NEON_HOST --port=NEON_PORT --username=NEON_USER --dbname=NEON_DB --no-owner --no-acl --verbose supabase_dump_full.dump
```

Notes & verification
- Ensure `CREATE EXTENSION pgcrypto;` is allowed on the Neon database or change `gen_random_uuid()` usage to `uuid_generate_v4()` and enable `uuid-ossp` if preferred.
- Verify row counts and referential integrity after restore.
- Run the app locally with `DATABASE_URL` set and exercise create/read/update/delete flows.

Rollback & backups
- Keep the Supabase dump safe until verification period elapses.
- To rollback, restore the dump or point the app back to the old DB connection string.

Operational notes
- Neon provides serverless pooling; for serverless apps prefer `@neondatabase/serverless` or `drizzle-orm/neon-http` if you want HTTP-based queries.
- If you stay with `postgres` (postgres.js) as the client, keep `prepare: false` where appropriate.
