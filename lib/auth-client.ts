import { createAuthClient } from "better-auth/react"
import type { Session } from "./auth"

/**
 * Browser-side auth client
 * Used in React components and client-side operations
 */
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
})

// Export commonly used hooks and methods
export const { useSession, signIn, signOut, signUp } = authClient

export type { Session }
