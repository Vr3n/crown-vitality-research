"use client"

import { useSession } from "@/lib/auth-client"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Sign-in Page
 * Displays OAuth sign-in options
 * Redirects authenticated users to home page
 */
export default function SignInPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (session && !isPending) {
      router.push("/")
    }
  }, [session, isPending, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Nutritionist Notes</CardTitle>
          <CardDescription className="mt-2">
            Sign in to access your notes and research
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ) : (
            <div className="space-y-4">
              <GoogleSignInButton />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Secure authentication</span>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-4">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
