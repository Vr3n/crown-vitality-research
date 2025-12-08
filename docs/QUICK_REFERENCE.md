# Better Auth - Quick Reference

## Installation Done ✅

better-auth is installed and configured. No more npm install needed.

---

## What You Need to Do

### Step 1: Generate Secret
```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))
```

### Step 2: Create `.env.local`
```env
BETTER_AUTH_SECRET=<paste_generated_secret>
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
DATABASE_URL=<your_postgres_url>
```

### Step 3: Google OAuth Setup
1. Go to https://console.cloud.google.com
2. Create/select project
3. Enable "Google+ API"
4. Credentials → OAuth 2.0 ID → Web application
5. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID & Secret to `.env.local`

### Step 4: Database Migration
```bash
pnpm run drizzle:generate
pnpm run drizzle:push
```

### Step 5: Update Notes Actions
In `lib/actions/notes.ts`, add session filtering:
```typescript
import { auth } from "@/lib/auth"

export async function getNotes(search: string, tag: string, category: string) {
  const session = await auth.api.getSession({
    headers: { /* ... */ }
  })
  
  if (!session) {
    return []
  }
  
  // Filter by userId
  return db.select().from(notes)
    .where(eq(notes.userId, session.user.id))
}
```

### Step 6: Update Header Component
```typescript
// In components/header.tsx
import { UserMenu } from "@/components/auth/user-menu"

export function Header() {
  return (
    <header>
      {/* existing code */}
      <UserMenu /> {/* Add this */}
    </header>
  )
}
```

### Step 7: Test
```bash
pnpm dev
```
- Visit http://localhost:3000
- Should see sign-in page
- Click "Sign in with Google"
- Complete auth flow

---

## Key Files

| File | Purpose |
|------|---------|
| `lib/auth.ts` | Server auth config |
| `lib/auth-client.ts` | Browser auth client |
| `app/api/auth/[route]/route.ts` | API endpoints |
| `middleware.ts` | Route protection |
| `app/auth/signin/page.tsx` | Sign-in page |
| `components/auth/` | Auth UI components |
| `lib/db/schema.ts` | Database schema (updated) |

---

## Common Imports

```typescript
// Server-side
import { auth } from "@/lib/auth"
import type { Session } from "@/lib/auth"

// Client-side
import { useSession, signIn, signOut } from "@/lib/auth-client"
import { UserMenu } from "@/components/auth/user-menu"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import { SignOutButton } from "@/components/auth/signout-button"
```

---

## API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/auth/signin` | Sign in (POST) |
| `/api/auth/signout` | Sign out (POST) |
| `/api/auth/signup` | Sign up (POST) |
| `/api/auth/session` | Get session (GET) |
| `/api/auth/callback/google` | OAuth callback |

---

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `BETTER_AUTH_SECRET` | Session encryption | Random 32 chars |
| `BETTER_AUTH_URL` | App base URL | http://localhost:3000 |
| `GOOGLE_CLIENT_ID` | OAuth client ID | abc123.apps.googleusercontent.com |
| `GOOGLE_CLIENT_SECRET` | OAuth secret (server-only) | xyzabc123... |
| `DATABASE_URL` | PostgreSQL connection | postgresql://user:pass@host/db |

---

## Database Tables Added

```
user
├── id (TEXT, PRIMARY KEY)
├── name (TEXT)
├── email (TEXT, UNIQUE)
├── emailVerified (BOOLEAN)
├── image (TEXT)
├── createdAt (TIMESTAMP)
└── updatedAt (TIMESTAMP)

session
├── id (TEXT, PRIMARY KEY)
├── expiresAt (TIMESTAMP)
├── token (TEXT, UNIQUE)
├── userId (TEXT, FK to user)
├── createdAt (TIMESTAMP)
├── updatedAt (TIMESTAMP)
├── ipAddress (TEXT)
└── userAgent (TEXT)

account (OAuth)
├── id (TEXT, PRIMARY KEY)
├── accountId (TEXT)
├── providerId (TEXT)
├── userId (TEXT, FK to user)
├── accessToken (TEXT)
├── refreshToken (TEXT)
└── ... (token expiry, scope, etc.)

verification
├── id (TEXT, PRIMARY KEY)
├── identifier (TEXT)
├── value (TEXT)
└── expiresAt (TIMESTAMP)

notes (UPDATED)
├── ... existing fields ...
└── userId (TEXT, FK to user) [NEW]
```

---

## Session Checking

### Server-side
```typescript
import { auth } from "@/lib/auth"

const session = await auth.api.getSession({
  headers: request.headers
})

if (!session) {
  throw new Error("Unauthorized")
}

console.log(session.user.email)
```

### Client-side
```typescript
"use client"

import { useSession } from "@/lib/auth-client"

export function MyComponent() {
  const { data: session, isPending } = useSession()
  
  if (isPending) return <div>Loading...</div>
  if (!session) return <div>Not signed in</div>
  
  return <div>Hello {session.user.name}</div>
}
```

---

## Troubleshooting

**"Session not found"**
- [ ] Check `.env.local` has `BETTER_AUTH_SECRET`
- [ ] Check database migration was applied
- [ ] Verify `DATABASE_URL` is correct

**"Invalid redirect URI"**
- [ ] Check `BETTER_AUTH_URL` matches exactly in Google Console
- [ ] Check no trailing slashes

**"Google sign-in not working"**
- [ ] Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- [ ] Check Google+ API is enabled
- [ ] Check redirect URI is correct in Google Console

**"Notes don't show data"**
- [ ] Check `lib/actions/notes.ts` filters by userId
- [ ] Check current user has created notes
- [ ] Check `userId` was added to notes table

---

## Next Steps After Setup

1. ✅ Database migration applied
2. ✅ Environment variables configured
3. ✅ Google OAuth credentials set up
4. ✅ Dev server running
5. **Update route handlers to filter by userId**
6. **Update UI components to use new auth**
7. **Test sign-in/sign-out flow**
8. **Deploy to production**

---

## Documentation

- Full guide: `docs/BETTER_AUTH_INTEGRATION.md`
- Setup details: `docs/ENVIRONMENT.md`
- Project overview: `docs/PROJECT_OVERVIEW.md`
- Next steps: `docs/IMPLEMENTATION_CHECKLIST.md`
- This summary: `docs/INTEGRATION_SUMMARY.md`

---

## Support Resources

- [Better Auth Docs](https://www.better-auth.com/docs)
- [Next.js Integration](https://www.better-auth.com/docs/integrations/next)
- [Google OAuth Guide](https://www.better-auth.com/docs/authentication/google)
