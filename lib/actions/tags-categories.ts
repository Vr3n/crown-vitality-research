"use server"

import { db, tags, categories } from "@/lib/db"
import { desc } from "drizzle-orm"

// Get all tags
export async function getAllTags(): Promise<{ id: string; name: string }[]> {
  const allTags = await db.query.tags.findMany({
    orderBy: [desc(tags.createdAt)],
  })
  return allTags.map((tag) => ({ id: tag.id, name: tag.name }))
}

// Get all categories
export async function getAllCategories(): Promise<{ id: string; name: string }[]> {
  const allCategories = await db.query.categories.findMany({
    orderBy: [desc(categories.createdAt)],
  })
  return allCategories.map((cat) => ({ id: cat.id, name: cat.name }))
}
