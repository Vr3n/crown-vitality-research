"use server"

import { auth } from "@/lib/auth"
import { db, tags, categories } from "@/lib/db"
import { desc, eq } from "drizzle-orm"
import { headers } from "next/headers"

// Get user's tags
export async function getUserTags(): Promise<{ id: string; name: string }[]> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return []
  }

  const userTags = await db.query.tags.findMany({
    where: eq(tags.userId, session.user.id),
    orderBy: [desc(tags.createdAt)],
  })
  return userTags.map((tag) => ({ id: tag.id, name: tag.name }))
}

// Get user's categories
export async function getUserCategories(): Promise<{ id: string; name: string }[]> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return []
  }

  const userCategories = await db.query.categories.findMany({
    where: eq(categories.userId, session.user.id),
    orderBy: [desc(categories.createdAt)],
  })
  return userCategories.map((cat) => ({ id: cat.id, name: cat.name }))
}
