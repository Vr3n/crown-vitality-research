"use client"

import { signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SignOutButtonProps {
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

/**
 * Sign-Out Button
 * Clears user session and redirects to sign-in
 */
export function SignOutButton({
  variant = "outline",
  size = "default",
  className,
}: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/auth/signin"
          },
        },
      })
    } catch (error) {
      console.error("Sign-out failed:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSignOut}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? "Signing out..." : "Sign out"}
    </Button>
  )
}
