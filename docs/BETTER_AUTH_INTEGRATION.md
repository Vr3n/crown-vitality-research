# Better Auth Integration Plan

## Overview

This document outlines the integration of **better-auth** for secure, Google OAuth authentication in the crown-vitality-research application.

**Current Status**: Supabase-based auth → **Migrating to better-auth** with Drizzle ORM + PostgreSQL + Google OAuth

---

## Architecture

### Technology Stack
- **Auth Framework**: [better-auth](https://www.better-auth.com)
- **ORM**: Drizzle ORM (already in use)
- **Database**: PostgreSQL (via Neon)
- **Framework**: Next.js 16+ (app router)
- **OAuth Provider**: Google

### Key Features to Implement
1. **User Sessions** - Session management with secure cookies
2. **OAuth Authentication** - Google sign-in
3. **User Profiles** - Store user metadata
4. **Protected Routes** - Middleware for authentication
5. **Server Actions** - Secure API endpoints with auth

---

## Implementation Plan

### Phase 1: Schema & Database
**Goal**: Add better-auth tables to existing Drizzle schema

#### Tasks:
1. Add better-auth user tables to `lib/db/schema.ts`:
   - `user` table (id, email, name, image, createdAt)
   - `session` table (id, userId, expiresAt, token)
   - `account` table (id, userId, accountId, provider, accessToken, refreshToken)
   - `verification` table (id, identifier, value, expiresAt)

2. Create a new Drizzle migration:
   ```
   pnpm run drizzle:generate
   pnpm run drizzle:push
   ```

### Phase 2: Dependencies & Configuration
**Goal**: Install better-auth and set up server config

#### Tasks:
1. Install dependencies:
   ```bash
   pnpm add better-auth
   ```

2. Create `lib/auth.ts` - Core auth configuration:
   - Initialize `betterAuth()` with Drizzle adapter
   - Configure Google OAuth provider
   - Set secure cookie options
   - Export auth client & server plugins

3. Update `.env.local` with:
   - `BETTER_AUTH_SECRET` - Random 32-char string
   - `BETTER_AUTH_URL` - `http://localhost:3000` (dev), production URL (prod)
   - `GOOGLE_CLIENT_ID` - From Google Console
   - `GOOGLE_CLIENT_SECRET` - From Google Console (server-only)

### Phase 3: API Route & Middleware
**Goal**: Create auth API and request middleware

#### Tasks:
1. Create `app/api/auth/[route]/route.ts`:
   - Export all better-auth route handlers
   - Handles `/api/auth/sign-in`, `/api/auth/sign-out`, etc.

2. Create `lib/auth-client.ts`:
   - Initialize browser-side auth client
   - Provides `useSession()` and auth methods

3. Create `lib/middleware.ts`:
   - Auth middleware for protected routes
   - Checks session validity
   - Redirects unauthenticated users

### Phase 4: UI Components & Pages
**Goal**: Build authentication UI

#### Tasks:
1. Create `components/auth/sign-in-button.tsx`:
   - Google sign-in button
   - Handle OAuth redirect

2. Create `components/auth/sign-out-button.tsx`:
   - Sign-out functionality with session cleanup

3. Create `components/auth/user-menu.tsx`:
   - Display logged-in user info
   - Profile/settings menu

4. Create `app/auth/signin/page.tsx`:
   - Sign-in page with Google button
   - Redirect logic for authenticated users

### Phase 5: Protected Routes & Integrations
**Goal**: Secure existing routes and integrate auth

#### Tasks:
1. Update `app/layout.tsx`:
   - Add `ThemeProvider` wrapper if needed
   - Include user session in context

2. Update `app/page.tsx` (notes listing):
   - Require authentication
   - Filter notes by current user (add `userId` field to notes table)
   - Show user info in header

3. Update `app/add/page.tsx`:
   - Require authentication
   - Associate created notes with user

4. Update `app/edit/[slug]/page.tsx`:
   - Require authentication
   - Verify user owns the note before allowing edit

5. Update `lib/actions/notes.ts`:
   - Add authentication checks
   - Filter notes by `userId`
   - Associate CRUD operations with current user

### Phase 6: Migration & Cleanup
**Goal**: Remove old Supabase auth references

#### Tasks:
1. Remove/deprecate Supabase auth utilities:
   - `lib/supabase/` (if still present)
   - Environment variables (keep only for data access if needed)

2. Update environment documentation:
   - Replace Supabase auth vars with better-auth vars
   - Update `docs/ENVIRONMENT.md`

3. Update project overview:
   - Update `docs/PROJECT_OVERVIEW.md` to reference better-auth

---

## Implementation Order (Recommended)

1. ✅ **Phase 1**: Schema modifications + migration
2. ✅ **Phase 2**: Install & configure better-auth
3. ✅ **Phase 3**: Create API route & middleware
4. ✅ **Phase 4**: Build sign-in UI
5. ✅ **Phase 5**: Protect existing routes
6. ✅ **Phase 6**: Clean up old auth code

---

## Environment Setup

### Required Environment Variables

```env
# Better Auth Core
BETTER_AUTH_SECRET=your_random_32_char_secret_here
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# Database (existing)
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

### Google OAuth Setup Steps

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI:
   - Dev: `http://localhost:3000/api/auth/callback/google`
   - Prod: `https://yourdomain.com/api/auth/callback/google`
6. Copy Client ID & Client Secret

---

## Testing Checklist

- [ ] Schema migrations apply cleanly
- [ ] Auth API routes respond correctly
- [ ] Google OAuth flow completes
- [ ] Sessions persist across requests
- [ ] Sign-out clears session
- [ ] Unauthenticated users redirect to login
- [ ] Notes filtered by authenticated user
- [ ] User info displays in UI
- [ ] Production build succeeds

---

## References

- [Better Auth Docs - Next.js 16+](https://www.better-auth.com/docs/integrations/next)
- [Better Auth - Drizzle Adapter](https://www.better-auth.com/docs/adapters/drizzle)
- [Better Auth - Google OAuth](https://www.better-auth.com/docs/authentication/google)
- [Drizzle ORM Docs](https://orm.drizzle.team)

---

## Notes

- Keep `.env.local` out of version control
- Use secure, random secret for `BETTER_AUTH_SECRET`
- Test Google OAuth in development first
- Plan database migration timing for production
- Consider rate limiting on auth endpoints
