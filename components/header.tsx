"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserMenu } from "@/components/auth/user-menu"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-white rounded-lg p-2 font-bold text-lg">ℕ</div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Nutritionist Notes</h1>
              <p className="text-xs text-muted-foreground">Quick notes for professionals</p>
            </div>
          </Link>

          {pathname === "/" && (
            <Link
              href="/add"
              className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              + New Note
            </Link>
          )}

          {pathname !== "/" && (
            <div className="flex items-center gap-4">
              <Link href="/" className="text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors">
                ← Back
              </Link>
              <div className="border-l border-gray-200 pl-4">
                <UserMenu />
              </div>
            </div>
          )}

          {pathname === "/" && (
            <UserMenu />
          )}
        </div>
      </div>
    </header>
  )
}
