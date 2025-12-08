# Better Auth Architecture Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       User's Browser                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           React Components (Client-side)                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • GoogleSignInButton                                     │  │
│  │ • SignOutButton                                          │  │
│  │ • UserMenu                                               │  │
│  │ • Pages using useSession() hook                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│              │                                                   │
│              │ (Fetch requests)                                 │
│              ↓                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │     better-auth Browser Client (lib/auth-client.ts)     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • Creates auth API requests                             │  │
│  │ • Manages session state                                 │  │
│  │ • Handles OAuth redirects                               │  │
│  │ • Manages cookies                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│              │                                                   │
└──────────────┼───────────────────────────────────────────────────┘
               │ HTTPS/HTTP
               ↓
┌─────────────────────────────────────────────────────────────────┐
│              Next.js Server (Your App)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Routes & Middleware                                           │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ middleware.ts (Route Protection)                       │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │ Check session validity                                 │   │
│  │ ↓ No session → Redirect to /auth/signin               │   │
│  │ ↓ Has session → Continue                               │   │
│  └────────────────────────────────────────────────────────┘   │
│           │ (Protected) │ (Public)                               │
│           ↓             ↓                                        │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ /api/auth/[route]/*                                  │      │
│  ├──────────────────────────────────────────────────────┤      │
│  │ • /signin (POST)                                     │      │
│  │ • /signout (POST)                                    │      │
│  │ • /callback/google (GET) ← OAuth redirect            │      │
│  │ • /session (GET)                                     │      │
│  │ • /signup (POST)                                     │      │
│  └──────────────────────────────────────────────────────┘      │
│           │                                                     │
│           │ (Calls better-auth server)                         │
│           ↓                                                     │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ better-auth Server (lib/auth.ts)                      │      │
│  ├──────────────────────────────────────────────────────┤      │
│  │ • Processes auth requests                            │      │
│  │ • Manages OAuth flow                                 │      │
│  │ • Creates/validates sessions                         │      │
│  │ • Drizzle ORM adapter                                │      │
│  └──────────────────────────────────────────────────────┘      │
│           │                                                     │
│           │ (Database queries)                                 │
│           ↓                                                     │
└─────────────────────────────────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────────────────┐
│                 PostgreSQL Database                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tables (managed by better-auth):                              │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ user                                                 │     │
│  ├──────────────────────────────────────────────────────┤     │
│  │ id           | name    | email      | image | ...   │     │
│  │ "user_123"   | "John"  | "j@ex.com" | URL   | ...   │     │
│  └──────────────────────────────────────────────────────┘     │
│           │ (references)                                        │
│           ↓                                                     │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ session                                              │     │
│  ├──────────────────────────────────────────────────────┤     │
│  │ id      | user_id      | token | expiresAt | ...   │     │
│  │ "s_123" | "user_123"   | "..." | 2025-1-8  | ...   │     │
│  └──────────────────────────────────────────────────────┘     │
│           │                                                     │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ account (OAuth)                                      │     │
│  ├──────────────────────────────────────────────────────┤     │
│  │ id    | user_id    | provider | accessToken | ...  │     │
│  │ "a_1" | "user_123" | "google" | "abc..."    | ...  │     │
│  └──────────────────────────────────────────────────────┘     │
│           │ (references user.id)                                │
│           │                                                     │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ verification                                         │     │
│  ├──────────────────────────────────────────────────────┤     │
│  │ id    | identifier | value | expiresAt | ...       │     │
│  │ "v_1" | "user_123" | "..." | 2025-1-9 | ...        │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                  │
│  Your Tables:                                                  │
│  ┌──────────────────────────────────────────────────────┐     │
│  │ notes (user-scoped)                                  │     │
│  ├──────────────────────────────────────────────────────┤     │
│  │ id   | user_id    | slug | title | content | ...   │     │
│  │ "n1" | "user_123" | "..." | "..." | "..."  | ...   │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                  │
│  Other tables (categories, tags, etc.)                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow Diagram

```
START: User visits app
   │
   ├─→ Authenticated?
   │   ├─ YES → Continue to requested page
   │   └─ NO → Redirect to /auth/signin
   │
   └─→ /auth/signin Page
       │
       ├─→ User clicks "Sign in with Google"
       │   │
       │   └─→ GoogleSignInButton triggers signIn.social()
       │       │
       │       └─→ Redirects to Google OAuth:
       │           https://accounts.google.com/o/oauth2/v2/auth?
       │               client_id=...
       │               redirect_uri=http://localhost:3000/api/auth/callback/google
       │               scope=openid profile email
       │
       │
       └─→ User logs into Google (if needed)
           │
           └─→ User grants permissions
               │
               └─→ Google redirects to:
                   http://localhost:3000/api/auth/callback/google?
                       code=...
                       state=...
                   │
                   └─→ /api/auth/callback/google route
                       │
                       ├─→ better-auth receives code
                       │
                       ├─→ Exchanges code for token
                       │
                       ├─→ Fetches user info from Google
                       │
                       ├─→ Creates user in database (if new)
                       │   INSERT INTO user:
                       │   - id, email, name, image
                       │
                       ├─→ Creates account record (OAuth)
                       │   INSERT INTO account:
                       │   - user_id, provider=google, tokens...
                       │
                       ├─→ Creates session
                       │   INSERT INTO session:
                       │   - id, user_id, token, expiresAt
                       │
                       ├─→ Sets secure HTTP-only cookie
                       │   Cookie: sessionToken = "..."
                       │
                       └─→ Redirects to / (home page)
                           │
                           └─→ User is now AUTHENTICATED
                               │
                               ├─→ Middleware checks session ✅
                               ├─→ useSession() returns user data
                               ├─→ UserMenu displays user info
                               └─→ Notes filtered by userId
```

---

## Sign-Out Flow Diagram

```
START: User is authenticated
   │
   └─→ User clicks "Sign out" button
       │
       └─→ SignOutButton triggers signOut()
           │
           └─→ Sends POST to /api/auth/signout
               │
               ├─→ better-auth validates session token
               │
               ├─→ Deletes session from database
               │   DELETE FROM session WHERE id = ...
               │
               ├─→ Clears session cookie
               │   Set-Cookie: sessionToken=; expires=past
               │
               └─→ Returns success response
                   │
                   └─→ Client redirects to /auth/signin
                       │
                       └─→ User is now LOGGED OUT
                           │
                           └─→ Middleware redirects to signin
                               (if they try to access protected routes)
```

---

## User Session & Cookie Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    First Sign-in                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. OAuth callback creates session:                         │
│     ┌────────────────────────────────────────────┐         │
│     │ Session                                    │         │
│     ├────────────────────────────────────────────┤         │
│     │ id:        "s_abc123"                      │         │
│     │ user_id:   "user_123"                      │         │
│     │ token:     "encrypted_token"               │         │
│     │ expiresAt: 2025-01-15 (7 days)            │         │
│     │ createdAt: 2025-01-08                      │         │
│     └────────────────────────────────────────────┘         │
│                                                              │
│  2. Sets HTTP-only secure cookie:                          │
│     Set-Cookie: sessionToken=encrypted_token;              │
│                 Path=/;                                    │
│                 HttpOnly;                                  │
│                 Secure;                                    │
│                 SameSite=Lax;                              │
│                 Expires=2025-01-15                         │
│                                                              │
│  3. Cookie sent automatically with every request           │
│     Browser → Server:                                      │
│     Cookie: sessionToken=encrypted_token                   │
│                                                              │
│  4. better-auth decrypts & validates token                 │
│     ✅ Valid? → Proceed                                    │
│     ❌ Invalid/Expired? → Redirect to signin               │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              During Active Session                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  • Cookie automatically sent with every request            │
│  • Session validity checked via middleware                 │
│  • Session.updatedAt refreshed on user activity           │
│  • If inactive > 7 days → Session expires                  │
│  • If user signs out → Session deleted, cookie cleared    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Middleware Route Protection

```
Request arrives at Next.js
   │
   └─→ middleware.ts executes
       │
       ├─→ Check path:
       │   ├─ /api/auth/* → SKIP (public)
       │   ├─ /auth/signin → SKIP (public)
       │   ├─ /_next/* → SKIP (internal)
       │   ├─ /favicon.ico → SKIP (static)
       │   │
       │   └─ /, /add, /edit → PROTECTED
       │       │
       │       └─→ Check session:
       │           │
       │           ├─→ Get cookie from request
       │           │
       │           ├─→ Call auth.api.getSession(headers)
       │           │   │
       │           │   ├─ Query database for session
       │           │   ├─ Check expiration
       │           │   └─ Return session or null
       │           │
       │           ├─→ Session found?
       │           │   │
       │           │   ├─ YES ✅
       │           │   │  └─→ NextResponse.next()
       │           │   │      (Request proceeds)
       │           │   │
       │           │   └─ NO ❌
       │           │      └─→ NextResponse.redirect()
       │           │          (Redirect to /auth/signin?callbackUrl=/requested/path)
       │           │
       │           └─→ Proceed to route handler
       │
       └─→ Route executes (component or API handler)
```

---

## Data Flow During Sign-in

```
User Form
│
├─→ (Client) GoogleSignInButton
│   │
│   └─→ signIn.social({ provider: "google" })
│       │
│       └─→ Redirects to Google OAuth URL
│           │
│           └─→ (Browser Navigation)
│               │
│               └─→ Google OAuth Server
│                   │
│                   └─→ (After user approves)
│                       │
│                       └─→ Google redirects to:
│                           /api/auth/callback/google?code=...&state=...
│                           │
│                           └─→ (Server) API Route Handler
│                               │
│                               └─→ better-auth.handler.GET()
│                                   │
│                                   ├─→ Verifies state
│                                   │
│                                   ├─→ Exchanges code for token
│                                   │   (calls Google API)
│                                   │
│                                   ├─→ Fetches user info
│                                   │
│                                   ├─→ Checks if user exists
│                                   │   in database
│                                   │
│                                   ├─→ If new user:
│                                   │   │
│                                   │   ├─→ INSERT INTO user
│                                   │   │   (id, email, name, image)
│                                   │   │
│                                   │   └─→ INSERT INTO account
│                                   │       (user_id, provider, tokens)
│                                   │
│                                   ├─→ If existing user:
│                                   │   │
│                                   │   └─→ UPDATE account
│                                   │       (refresh tokens)
│                                   │
│                                   ├─→ Creates session:
│                                   │   │
│                                   │   └─→ INSERT INTO session
│                                   │       (id, user_id, token, expiresAt)
│                                   │
│                                   ├─→ Sets session cookie
│                                   │
│                                   └─→ Redirects to / (home page)
│                                       │
│                                       └─→ (Client) Receives redirect
│                                           │
│                                           └─→ Browser navigates to /
│                                               │
│                                               ├─→ middleware checks session ✅
│                                               ├─→ Route allowed
│                                               └─→ Page renders with user data
```

---

## Component Hierarchy

```
app/layout.tsx (Root)
│
├─→ Providers (Theme, etc.)
│
├─→ Header Component
│   │
│   └─→ <UserMenu />
│       │
│       ├─→ useSession() hook
│       │   (Checks if user logged in)
│       │
│       ├─→ Avatar (if authenticated)
│       │   └─→ Shows user initials
│       │
│       └─→ DropdownMenu
│           ├─→ Links to /settings
│           └─→ <SignOutButton />
│
├─→ Main Content
│   │
│   ├─→ / (Notes List Page)
│   │   ├─→ <NotesFilter />
│   │   └─→ <NoteCard /> × N
│   │
│   ├─→ /add (Create Note Page)
│   │   └─→ <NoteEditor />
│   │
│   ├─→ /edit/[slug] (Edit Note Page)
│   │   └─→ <NoteEditor />
│   │
│   └─→ /auth/signin (Sign-in Page)
│       └─→ <GoogleSignInButton />
│           └─→ Calls signIn.social("google")
│
└─→ Footer
```

---

## File Relationships

```
Request Flow:
Request → middleware.ts
   │
   ├─→ Checks session via auth.api.getSession()
   │   └─→ Uses lib/auth.ts configuration
   │
   └─→ Routes to:
       ├─→ /api/auth/[route]/route.ts
       │   │
       │   └─→ Exports better-auth handler
       │       └─→ Uses lib/auth.ts for processing
       │
       └─→ Page components
           │
           ├─→ app/page.tsx (Home)
           │   ├─→ Calls lib/actions/notes.ts
           │   └─→ Renders <Header /> with <UserMenu />
           │
           ├─→ app/add/page.tsx (Create)
           │   └─→ Calls lib/actions/notes.ts
           │
           ├─→ app/edit/[slug]/page.tsx (Edit)
           │   └─→ Calls lib/actions/notes.ts
           │
           └─→ app/auth/signin/page.tsx (Sign-in)
               └─→ Uses lib/auth-client.ts
                   └─→ Exports useSession(), signIn()

Client Components:
│
├─→ components/auth/google-signin-button.tsx
│   └─→ Uses lib/auth-client.ts (signIn.social)
│
├─→ components/auth/signout-button.tsx
│   └─→ Uses lib/auth-client.ts (signOut)
│
└─→ components/auth/user-menu.tsx
    └─→ Uses lib/auth-client.ts (useSession)

Database:
│
├─→ lib/db/schema.ts
│   ├─→ Defines user, session, account, verification tables
│   └─→ Drizzle ORM reads/writes from PostgreSQL
│
└─→ lib/auth.ts
    └─→ Uses Drizzle adapter
        └─→ Queries database tables
```

---

**Diagrams Last Updated**: December 8, 2025
