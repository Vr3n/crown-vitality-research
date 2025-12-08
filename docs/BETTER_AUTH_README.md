# Better Auth Integration - Complete Setup Guide

## 📋 Summary

Better-auth has been successfully integrated into your crown-vitality-research application with:
- ✅ **Schema updates** - better-auth tables + userId on notes
- ✅ **Server configuration** - lib/auth.ts
- ✅ **Client configuration** - lib/auth-client.ts  
- ✅ **API routes** - /api/auth/[route]
- ✅ **Middleware** - Route protection
- ✅ **UI components** - Sign-in, sign-out, user menu
- ✅ **Documentation** - Complete setup guides

**Status**: Ready for final configuration and testing

---

## 📚 Documentation Structure

| Document | Purpose |
|----------|---------|
| **QUICK_REFERENCE.md** | ⭐ Start here! Quick setup steps |
| **IMPLEMENTATION_CHECKLIST.md** | Step-by-step next steps with code examples |
| **ENVIRONMENT.md** | Environment variable setup guide |
| **BETTER_AUTH_INTEGRATION.md** | Comprehensive integration plan (phases 1-6) |
| **PROJECT_OVERVIEW.md** | Updated project documentation |
| **INTEGRATION_SUMMARY.md** | What was implemented |
| **BETTER_AUTH_README.md** | This file - your roadmap |

---

## 🚀 Quick Start (5 Minutes)

### 1. Generate Secret
```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))
```

### 2. Create `.env.local`
```env
BETTER_AUTH_SECRET=<your_generated_secret>
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<get_from_google_console>
GOOGLE_CLIENT_SECRET=<get_from_google_console>
DATABASE_URL=<your_postgres_url>
```

### 3. Google OAuth (5 min setup)
1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create project or select existing
3. Enable "Google+ API"
4. Create OAuth credentials (Web application)
5. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID & Secret to `.env.local`

### 4. Database
```bash
pnpm run drizzle:generate
pnpm run drizzle:push
```

### 5. Update Route Handlers
Edit `lib/actions/notes.ts` - add session filtering:
```typescript
import { auth } from "@/lib/auth"
import { eq } from "drizzle-orm"

export async function getNotes(search: string, tag: string, category: string) {
  const session = await auth.api.getSession({
    headers: { /* your headers here */ }
  })
  
  if (!session) return []
  
  return db.select().from(notes)
    .where(eq(notes.userId, session.user.id))
}
```

### 6. Update Header
```typescript
// components/header.tsx
import { UserMenu } from "@/components/auth/user-menu"

export function Header() {
  return (
    <header>
      {/* existing code */}
      <UserMenu />
    </header>
  )
}
```

### 7. Test
```bash
pnpm dev
# Visit http://localhost:3000 → should redirect to sign-in
```

---

## 📁 Files Created

### Core Authentication
```
lib/
├── auth.ts ..................... Server auth config (better-auth)
└── auth-client.ts .............. Browser client (useSession hook)
```

### API & Middleware
```
app/
├── api/auth/[route]/route.ts ... All auth endpoints
└── middleware.ts ............... Route protection
```

### UI Components
```
components/auth/
├── google-signin-button.tsx .... OAuth sign-in button
├── signout-button.tsx ......... Sign-out functionality
└── user-menu.tsx .............. User profile dropdown

app/auth/signin/
└── page.tsx ................... Sign-in page
```

### Database Schema (Updated)
```
lib/db/schema.ts
├── user table (NEW)
├── session table (NEW)
├── account table (NEW)
├── verification table (NEW)
└── notes.userId (UPDATED)
```

### Documentation
```
docs/
├── QUICK_REFERENCE.md ............. Quick setup
├── IMPLEMENTATION_CHECKLIST.md .... Step-by-step guide
├── ENVIRONMENT.md ................ Env var setup
├── BETTER_AUTH_INTEGRATION.md .... Full integration plan
├── PROJECT_OVERVIEW.md ........... Updated project docs
├── INTEGRATION_SUMMARY.md ........ What was done
└── BETTER_AUTH_README.md ......... This file
```

---

## 🔧 Implementation Phases

### ✅ Phase 1: Schema & Database
- Added better-auth tables to schema
- Added userId to notes table
- Created Drizzle migration

### ✅ Phase 2: Dependencies & Configuration  
- Installed better-auth
- Created server config (lib/auth.ts)
- Created browser client (lib/auth-client.ts)

### ✅ Phase 3: API & Middleware
- Created API route handler
- Implemented route protection middleware

### ✅ Phase 4: UI Components & Pages
- Built sign-in/sign-out components
- Created user menu
- Built sign-in page

### ⏳ Phase 5: Route Protection & Integration (YOUR TASK)
- Update route handlers to filter by userId
- Update header component with UserMenu
- Test authentication flow

### ⏳ Phase 6: Migration & Cleanup (AFTER TESTING)
- Remove old Supabase auth (if any)
- Update environment documentation
- Test in production

---

## 🎯 What You Need to Do Now

### Priority 1: Environment Setup
- [ ] Generate `BETTER_AUTH_SECRET`
- [ ] Set up Google OAuth credentials
- [ ] Create `.env.local` file
- [ ] Verify `DATABASE_URL` is correct

### Priority 2: Database
- [ ] Run `pnpm run drizzle:generate`
- [ ] Review migration in `drizzle/migrations/`
- [ ] Run `pnpm run drizzle:push`

### Priority 3: Route Handler Updates
- [ ] Update `lib/actions/notes.ts` to filter by userId
- [ ] Update `lib/actions/tags-categories.ts` if needed
- [ ] Test that notes are user-scoped

### Priority 4: UI Integration
- [ ] Update `components/header.tsx` with UserMenu
- [ ] Update `app/page.tsx` to show proper auth state
- [ ] Update `app/add/page.tsx` to associate notes with user
- [ ] Update `app/edit/[slug]/page.tsx` to verify ownership

### Priority 5: Testing
- [ ] Start dev server (`pnpm dev`)
- [ ] Test sign-in flow with Google
- [ ] Test sign-out
- [ ] Verify notes are filtered by user
- [ ] Test that unauthenticated access redirects

### Priority 6: Production Prep
- [ ] Deploy database migrations
- [ ] Set environment variables in hosting
- [ ] Test in staging
- [ ] Deploy to production

---

## 🔑 Key Concepts

### Session Management
- Sessions are stored in database and cookies
- Cookies are httpOnly and secure
- Automatic expiration after 7 days
- Updated daily when user is active

### User Scoping
- Notes must be filtered by `userId` in queries
- Users can only see/edit their own notes
- `userId` is required on notes table

### OAuth Flow
```
User clicks "Sign in with Google"
    ↓
Redirects to Google consent screen
    ↓
User authorizes app
    ↓
Google redirects to /api/auth/callback/google
    ↓
better-auth creates user & session
    ↓
Redirects to home page (authenticated)
```

### Route Protection
```
User visits /add (protected)
    ↓
Middleware checks session
    ↓
No session? Redirect to /auth/signin
    ↓
Has session? Allow access
```

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid redirect URI"
**Solution**: Ensure `BETTER_AUTH_URL` matches exactly in Google Console (no trailing slashes)

### Issue: "Database connection failed"
**Solution**: Verify `DATABASE_URL` is correct and database is accessible

### Issue: "Session not found"
**Solution**: Check that migration was applied and `.env.local` has `BETTER_AUTH_SECRET`

### Issue: "Notes show no data"
**Solution**: Update `lib/actions/notes.ts` to filter by userId

### Issue: "Google sign-in button not working"
**Solution**: Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set

---

## 📖 Learning Resources

- [Better Auth Docs](https://www.better-auth.com/docs) - Official documentation
- [Next.js Integration](https://www.better-auth.com/docs/integrations/next) - Next.js specific
- [Drizzle Adapter](https://www.better-auth.com/docs/adapters/drizzle) - Database integration
- [Google OAuth](https://www.better-auth.com/docs/authentication/google) - OAuth setup
- [Drizzle ORM](https://orm.drizzle.team) - Database ORM

---

## 🎓 Code Examples

### Get Current User (Server-side)
```typescript
import { auth } from "@/lib/auth"

const session = await auth.api.getSession({
  headers: request.headers
})

if (!session) {
  throw new Error("Unauthorized")
}

console.log(session.user.email) // user@example.com
```

### Get Current User (Client-side)
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

### Filter Notes by User
```typescript
import { eq } from "drizzle-orm"
import { notes } from "@/lib/db"

const userNotes = await db
  .select()
  .from(notes)
  .where(eq(notes.userId, session.user.id))
```

### Sign Out
```typescript
import { signOut } from "@/lib/auth-client"

await signOut({
  fetchOptions: {
    onSuccess: () => {
      window.location.href = "/auth/signin"
    }
  }
})
```

---

## 🚢 Deployment Checklist

- [ ] Environment variables configured in hosting
- [ ] Database migrations applied
- [ ] `BETTER_AUTH_SECRET` is secure and unique
- [ ] Google OAuth credentials updated for production domain
- [ ] HTTPS enabled (required for cookies)
- [ ] Rate limiting added to `/api/auth` endpoints
- [ ] Database backups configured
- [ ] Monitoring/logging set up
- [ ] Staging tested before production deploy

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────┐
│       Next.js 16 Application             │
├─────────────────────────────────────────┤
│                                          │
│  Client Components                       │
│  ├─ useSession() hook                   │
│  ├─ GoogleSignInButton                  │
│  ├─ UserMenu dropdown                   │
│  └─ SignOutButton                       │
│                                          │
│  ↓ (Fetch Requests)                    │
│                                          │
│  /api/auth/[route] (API Routes)        │
│  ├─ /signin (POST)                     │
│  ├─ /signout (POST)                    │
│  ├─ /callback/google (GET)             │
│  └─ /session (GET)                     │
│                                          │
│  ↓ (better-auth)                       │
│                                          │
│  lib/auth.ts (Server Config)           │
│  ├─ Drizzle adapter                    │
│  ├─ Google OAuth provider              │
│  └─ Session management                 │
│                                          │
│  ↓ (Database Queries)                  │
│                                          │
│  PostgreSQL Database                    │
│  ├─ user table                         │
│  ├─ session table                      │
│  ├─ account table (OAuth)              │
│  ├─ verification table                 │
│  └─ notes table (with userId)          │
│                                          │
└─────────────────────────────────────────┘
```

---

## ✨ Next Steps

1. **Read** `QUICK_REFERENCE.md` for setup steps
2. **Follow** `IMPLEMENTATION_CHECKLIST.md` for detailed guide
3. **Configure** environment variables
4. **Generate** database migration
5. **Update** route handlers
6. **Test** sign-in flow
7. **Deploy** to production

---

## 💡 Tips

- Keep `.env.local` out of git (it's ignored)
- Use strong secrets for `BETTER_AUTH_SECRET`
- Test OAuth flow in development first
- Monitor session/database performance
- Add rate limiting to auth endpoints for production
- Keep better-auth updated

---

## 🆘 Need Help?

1. Check `QUICK_REFERENCE.md` for common issues
2. Review `IMPLEMENTATION_CHECKLIST.md` for step-by-step guide
3. Read `ENVIRONMENT.md` for configuration help
4. See `BETTER_AUTH_INTEGRATION.md` for detailed architecture
5. Visit [Better Auth Docs](https://www.better-auth.com/docs)

---

**Status**: ✅ Integration Complete - Ready for Configuration

**Last Updated**: December 8, 2025
