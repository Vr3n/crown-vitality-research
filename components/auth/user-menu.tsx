"use client"

import { useSession } from "@/lib/auth-client"
import { SignOutButton } from "./signout-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

/**
 * User Menu Component
 * Displays authenticated user info and profile menu
 * Shows loading state during auth check
 */
export function UserMenu() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <Skeleton className="h-10 w-10 rounded-full" />
  }

  if (!session) {
    return (
      <Link href="/auth/signin">
        <button className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700">
          Sign in
        </button>
      </Link>
    )
  }

  const user = session.user
  const initials =
    (user.name?.split(" ").map((n) => n[0]).join("") || user.email?.substring(0, 2)).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
          <Avatar>
            {user.image && <AvatarImage src={user.image} alt={user.name || ""} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutButton className="w-full justify-start" size="sm" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
