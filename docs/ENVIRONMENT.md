# Environment Variables

## Better Auth Configuration

**Required for authentication to work:**

- `BETTER_AUTH_SECRET` — Random 32-character secret for session encryption
  - Generate with: `openssl rand -base64 32` or use a secure random generator
  - Keep this secret and never commit it
  
- `BETTER_AUTH_URL` — Base URL of your application
  - Development: `http://localhost:3000`
  - Production: `https://yourdomain.com`
  - Used for OAuth callbacks and session validation

## Google OAuth

**Required to enable Google Sign-in:**

- `GOOGLE_CLIENT_ID` — OAuth 2.0 Client ID from Google Cloud Console (public, can be `NEXT_PUBLIC_GOOGLE_CLIENT_ID`)
- `GOOGLE_CLIENT_SECRET` — OAuth 2.0 Client Secret from Google Cloud Console (MUST be server-only, not prefixed with `NEXT_PUBLIC_`)

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable the **Google+ API**
4. Navigate to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Choose **Web application**
6. Add **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy your **Client ID** and **Client Secret**

## Database

**For PostgreSQL via Drizzle ORM:**

- `DATABASE_URL` — PostgreSQL connection string
  - Format: `postgresql://username:password@host:port/dbname`
  - Recommended for Neon: Use the connection string from your Neon dashboard
  - Keep this secret, never commit it

## Local Development (.env.local)

Create a `.env.local` file in the project root with:

```env
# Better Auth
BETTER_AUTH_SECRET=your_random_32_char_secret_here
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

**DO NOT commit `.env.local` to version control.**

## Production / CI / Deployment

Configure these variables in your hosting provider's environment variable manager:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Build & Deploy → Environment
- **Docker**: Use `docker run -e VAR=value` or `.env` files mounted as secrets
- **Traditional VPS**: Use system environment variables or `.env` files (not in git)

Mark sensitive keys (`BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, `DATABASE_URL`) as **secret** in your hosting provider.

## Verification

After setting up environment variables:

1. Start development server: `pnpm dev`
2. Navigate to `http://localhost:3000`
3. Click "Sign in"
4. Verify Google OAuth button appears
5. Test sign-in flow (may fail if Google credentials incomplete, but should attempt redirect)
6. Check browser console for errors

## Common Issues

- **"Invalid redirect URI"**: Ensure your `BETTER_AUTH_URL` matches the OAuth callback URI configured in Google Console
- **"Missing BETTER_AUTH_SECRET"**: Check that `.env.local` exists and contains `BETTER_AUTH_SECRET`
- **Database connection fails**: Verify `DATABASE_URL` is correct and database is accessible
- **OAuth fails silently**: Check browser DevTools Network tab for failed API calls to `/api/auth/callback/google`
