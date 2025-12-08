Security best practices (high-level checklist)

- Authentication & Row Level Security (RLS):
  - Enable RLS on all tables and write minimal, testable policies.
  - Use `auth.uid()` or JWT claims for row ownership checks.

- Keys & Secrets:
  - Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code or public envs.
  - Keep `NEXT_PUBLIC_*` only for non-sensitive values intended for the browser.
  - Use deployment platform secret stores and avoid committing secrets to git.

- Privileged operations:
  - Place admin tasks behind server routes or Edge Functions. Use `supabaseAdmin` server client.
  - Do not use service role key for regular user flows.

- Sessions & cookies:
  - Use secure, httpOnly cookies for any server-stored tokens.
  - Validate tokens server-side for sensitive endpoints.

- Network & deployment:
  - Enforce TLS/HTTPS everywhere.
  - Configure CORS where appropriate; restrict allowed origins for server APIs.

- Monitoring & ops:
  - Enable logging/auditing and monitor for abnormal usage.
  - Add automated alerts for unusual data accesses or spikes.

- Team access & rotation:
  - Use MFA for dashboard access and restrict team permissions.
  - Rotate credentials regularly and maintain a documented rotation process.

- CI/CD:
  - Use masked secrets; never print secret values in logs.
  - Prefer short-lived tokens for automation where supported.
