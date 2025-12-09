# Vercel Deployment Setup

## Environment Variables for Vercel

Add these environment variables to your Vercel project settings:

### Authentication
- `BETTER_AUTH_SECRET` — Random 32-character secret (generate with: `openssl rand -base64 32`)
- `BETTER_AUTH_URL` — Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
- `NEXT_PUBLIC_BETTER_AUTH_URL` — Same as `BETTER_AUTH_URL` (client-side, marked as public)

### Google OAuth
- `GOOGLE_CLIENT_ID` — Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` — Your Google OAuth Client Secret

### Database
- `DATABASE_URL` — Your PostgreSQL connection string (from Neon or other provider)

## Setting Up in Vercel

1. Go to your project on [vercel.com](https://vercel.com)
2. Click **Settings** → **Environment Variables**
3. Add all the variables above
4. For public variables (visible in browser), use the `NEXT_PUBLIC_` prefix:
   - `NEXT_PUBLIC_BETTER_AUTH_URL`

5. Deploy your project

## Important Notes

- `BETTER_AUTH_URL` must match the actual deployment URL in your Google OAuth redirect URIs
- Example: `https://your-app.vercel.app/api/auth/callback/google`
- Keep `BETTER_AUTH_SECRET` and `GOOGLE_CLIENT_SECRET` as private (no `NEXT_PUBLIC_` prefix)
- After adding environment variables, redeploy the project for changes to take effect

## Google OAuth Redirect URI Setup

In Google Cloud Console, add this redirect URI to your OAuth 2.0 application:

```
https://your-app.vercel.app/api/auth/callback/google
```

Replace `your-app` with your actual Vercel project name/domain.
