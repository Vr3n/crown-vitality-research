# Project Overview

## Project Information

- **Name**: Nutritionist Notes
- **Platform**: Node.js + Next.js 16 (App Router)
- **Purpose**: Minimal note-taking app for nutritionists and personal trainers
- **Features**: Quick notes, tags, categories, client information management

## Quick Start

### Installation

Install dependencies using pnpm:

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build for production:

```bash
pnpm build
pnpm start
```

## Technology Stack

### Frontend & Framework
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling with Tailwind v4
- **Radix UI** - Accessible component primitives
- **next-themes** - Dark mode support

### Authentication & Security
- **better-auth** - Lightweight auth framework with OAuth support
- **Google OAuth 2.0** - Social login provider
- Server-side session management with secure cookies

### Database & ORM
- **Drizzle ORM** - Type-safe SQL query builder
- **PostgreSQL** - Relational database via Neon
- **Migrations** - Managed with drizzle-kit

### UI Component Libraries
- Radix UI components (accordion, dialog, dropdown, etc.)
- Custom UI primitives in `components/ui/`
- Shadcn/ui inspired design system
- Icons via lucide-react

### Development Tools
- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **Tailwind CSS v4** - CSS framework
- **PostCSS** - CSS processing

### Utilities
- **react-hook-form** - Form state management
- **zod** - Schema validation
- **date-fns** - Date utilities
- **sonner** - Toast notifications
- **recharts** - Charting library

## Project Structure

```
root/
├── app/                 # Next.js app directory
│   ├── api/            # API routes (/api/auth/*)
│   ├── auth/           # Authentication pages
│   ├── add/            # Create note page
│   ├── edit/           # Edit note pages
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page (notes list)
│
├── components/          # React components
│   ├── auth/           # Authentication components
│   │   ├── google-signin-button.tsx
│   │   ├── signout-button.tsx
│   │   └── user-menu.tsx
│   ├── ui/             # Primitive UI components
│   └── *.tsx           # Feature components
│
├── lib/                 # Utilities & helpers
│   ├── auth.ts         # better-auth server config
│   ├── auth-client.ts  # better-auth browser client
│   ├── db/
│   │   ├── index.ts    # Database connection
│   │   └── schema.ts   # Drizzle schema (tables & relations)
│   ├── actions/        # Server actions
│   └── utils.ts        # Helper functions
│
├── docs/               # Documentation
│   ├── PROJECT_OVERVIEW.md
│   ├── ENVIRONMENT.md
│   ├── BETTER_AUTH_INTEGRATION.md
│   └── ...
│
├── public/             # Static assets
├── drizzle/            # Database migrations
├── middleware.ts       # Next.js middleware (auth protection)
├── tsconfig.json       # TypeScript config
├── next.config.mjs     # Next.js config
└── package.json        # Dependencies & scripts
```

## Key Features

### Authentication
- **Google OAuth Sign-in** - Secure, frictionless authentication
- **Session Management** - Automatic session validation with cookies
- **Protected Routes** - Middleware-based route protection
- **User Profiles** - Automatic user data from OAuth provider

### Note Management
- **Create Notes** - Rich text content with title and slug
- **Edit Notes** - Update existing notes
- **Organize** - Assign categories and tags
- **Search & Filter** - Find notes by title, tags, or categories
- **User-Scoped** - Each user only sees their own notes

### UI/UX
- **Responsive Design** - Mobile-friendly interface
- **Dark Mode** - Theme switcher (light/dark)
- **Toast Notifications** - User feedback via sonner
- **Loading States** - Spinners and skeletons for async operations
- **Accessible** - Keyboard navigation, ARIA labels

## Important Files & Their Roles

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, global providers |
| `middleware.ts` | Auth protection, session validation |
| `lib/auth.ts` | better-auth server configuration |
| `lib/auth-client.ts` | better-auth browser client & hooks |
| `lib/db/index.ts` | Drizzle database connection |
| `lib/db/schema.ts` | Database schema (all tables & relations) |
| `lib/actions/notes.ts` | Server actions for note CRUD |
| `components/auth/*` | Sign-in/sign-out components |
| `app/api/auth/[route]/route.ts` | Auth API endpoints |

## Environment Setup

See [ENVIRONMENT.md](./ENVIRONMENT.md) for detailed configuration.

**Minimum required environment variables**:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Session encryption secret
- `BETTER_AUTH_URL` - Application base URL
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (server-only)

## Development Workflow

### Creating a Note

1. User clicks "+ New Note" on home page
2. Navigates to `/add`
3. Submits form (title, content, category, tags)
4. Server action in `lib/actions/notes.ts` creates note with `userId`
5. Redirects to home page with new note in list

### Editing a Note

1. User clicks edit icon on note card
2. Navigates to `/edit/[slug]`
3. Form pre-fills with current note data
4. Submits updates
5. Server action validates ownership and updates
6. Redirects to home page

### Authentication Flow

1. Unauthenticated user tries to access protected route
2. Middleware checks session validity
3. No valid session → redirects to `/auth/signin`
4. User clicks "Sign in with Google"
5. Redirects to Google OAuth consent screen
6. User authorizes → redirects to `/api/auth/callback/google`
7. better-auth creates user & session
8. Redirects to home page (authenticated)

## Deployment

### Prerequisites
- PostgreSQL database (Neon, AWS RDS, etc.)
- Node.js 18+ runtime
- Hosting (Vercel, Netlify, Docker, etc.)

### Vercel (Recommended)

1. Push code to GitHub/GitLab
2. Connect repo to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

1. Build: `pnpm build`
2. Run: `pnpm start`
3. Set environment variables in hosting provider's secret manager
4. Run migrations if needed

## Documentation

- [ENVIRONMENT.md](./ENVIRONMENT.md) - Environment variables and setup
- [BETTER_AUTH_INTEGRATION.md](./BETTER_AUTH_INTEGRATION.md) - Authentication integration details
- [SECURITY.md](./SECURITY.md) - Security best practices

## Troubleshooting

### Development Server Won't Start
- Ensure `DATABASE_URL` is set and database is accessible
- Check Node.js version (18+)
- Delete `node_modules` and run `pnpm install`

### Sign-in Not Working
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check that redirect URI is configured in Google Console
- Ensure `BETTER_AUTH_URL` matches your dev domain

### Database Errors
- Check PostgreSQL connection string in `DATABASE_URL`
- Run migrations: `pnpm run drizzle:push`
- Check Drizzle migrations in `drizzle/migrations/`

## Next Steps

- [ ] Configure Google OAuth credentials
- [ ] Set up `.env.local` with required variables
- [ ] Run `pnpm dev` to start development server
- [ ] Test authentication flow
- [ ] Create sample notes
- [ ] Deploy to production

## License

Proprietary - Viren's Nutritionist Notes App

## Contact

For questions or issues, contact the development team.
