import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * Protected Routes Configuration
 * Define which routes require authentication
 */
const PROTECTED_ROUTES = ["/", "/add", "/edit"]
const PUBLIC_ROUTES = ["/auth/signin", "/api/auth"]

/**
 * Middleware for authentication
 * - Checks session validity for protected routes
 * - Redirects unauthenticated users to sign-in
 * - Allows public routes
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Allow public routes and auth endpoints
  if (PUBLIC_ROUTES.some((route) => path.startsWith(route))) {
    return NextResponse.next()
  }

  // Check if route is protected
  const isProtected = PROTECTED_ROUTES.some((route) => path.startsWith(route))

  if (!isProtected) {
    return NextResponse.next()
  }

  // Verify session
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      // Redirect to sign-in with return URL
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("callbackUrl", path)
      return NextResponse.redirect(signInUrl)
    }

    // Session is valid, continue
    return NextResponse.next()
  } catch (error) {
    // If session check fails, redirect to sign-in
    console.error("Session verification failed:", error)
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", path)
    return NextResponse.redirect(signInUrl)
  }
}

/**
 * Configure which routes should run middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
