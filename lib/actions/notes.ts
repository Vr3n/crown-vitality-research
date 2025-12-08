"use server"

import { db, notes, noteTags, noteReferences, tags, categories } from "@/lib/db"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 100)
}

export type NoteWithRelations = {
  id: string
  slug: string
  title: string
  content: string | null
  categoryId: string | null
  categoryName: string | null
  tags: { id: string; name: string }[]
  references: { id: string; type: string; value: string }[]
  createdAt: Date | null
  updatedAt: Date | null
}

// Get all notes with their relations
export async function getNotes(
  search?: string,
  tagFilter?: string,
  categoryFilter?: string,
): Promise<NoteWithRelations[]> {
  let notesResult = await db.query.notes.findMany({
    orderBy: [desc(notes.createdAt)],
    with: {
      category: true,
      noteTags: {
        with: {
          tag: true,
        },
      },
      references: true,
    },
  })

  // Apply search filter
  if (search && search.trim()) {
    const searchLower = search.toLowerCase()
    notesResult = notesResult.filter(
      (note) =>
        note.title.toLowerCase().includes(searchLower) ||
        (note.content && note.content.toLowerCase().includes(searchLower)),
    )
  }

  // Apply tag filter
  if (tagFilter && tagFilter.trim()) {
    notesResult = notesResult.filter((note) => note.noteTags.some((nt) => nt.tag.name === tagFilter))
  }

  // Apply category filter
  if (categoryFilter && categoryFilter.trim()) {
    notesResult = notesResult.filter((note) => note.category?.name === categoryFilter)
  }

  return notesResult.map((note) => ({
    id: note.id,
    slug: note.slug,
    title: note.title,
    content: note.content,
    categoryId: note.categoryId,
    categoryName: note.category?.name || null,
    tags: note.noteTags.map((nt) => ({ id: nt.tag.id, name: nt.tag.name })),
    references: note.references.map((ref) => ({
      id: ref.id,
      type: ref.type,
      value: ref.value,
    })),
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  }))
}

// Get a single note by ID
export async function getNoteById(id: string): Promise<NoteWithRelations | null> {
  const note = await db.query.notes.findFirst({
    where: eq(notes.id, id),
    with: {
      category: true,
      noteTags: {
        with: {
          tag: true,
        },
      },
      references: true,
    },
  })

  if (!note) return null

  return {
    id: note.id,
    slug: note.slug,
    title: note.title,
    content: note.content,
    categoryId: note.categoryId,
    categoryName: note.category?.name || null,
    tags: note.noteTags.map((nt) => ({ id: nt.tag.id, name: nt.tag.name })),
    references: note.references.map((ref) => ({
      id: ref.id,
      type: ref.type,
      value: ref.value,
    })),
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  }
}

// Get a single note by slug
export async function getNoteBySlug(slug: string): Promise<NoteWithRelations | null> {
  const note = await db.query.notes.findFirst({
    where: eq(notes.slug, slug),
    with: {
      category: true,
      noteTags: {
        with: {
          tag: true,
        },
      },
      references: true,
    },
  })

  if (!note) return null

  return {
    id: note.id,
    slug: note.slug,
    title: note.title,
    content: note.content,
    categoryId: note.categoryId,
    categoryName: note.category?.name || null,
    tags: note.noteTags.map((nt) => ({ id: nt.tag.id, name: nt.tag.name })),
    references: note.references.map((ref) => ({
      id: ref.id,
      type: ref.type,
      value: ref.value,
    })),
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  }
}

// Create a new note
export async function createNote(data: {
  title: string
  content: string
  categoryName?: string
  tagNames: string[]
  references: { type: "url" | "book"; value: string }[]
}): Promise<{ success: boolean; noteId?: string; error?: string }> {
  try {
    // Generate slug from title with uniqueness check
    let slug = generateSlug(data.title)
    let slugCounter = 1
    let finalSlug = slug
    while (true) {
      const existing = await db.query.notes.findFirst({
        where: eq(notes.slug, finalSlug),
      })
      if (!existing) break
      finalSlug = `${slug}-${slugCounter++}`
    }

    // Handle category - create if doesn't exist
    let categoryId: string | null = null
    if (data.categoryName) {
      const existingCategory = await db.query.categories.findFirst({
        where: eq(categories.name, data.categoryName),
      })
      if (existingCategory) {
        categoryId = existingCategory.id
      } else {
        const [newCategory] = await db.insert(categories).values({ name: data.categoryName }).returning()
        categoryId = newCategory.id
      }
    }

    // Create the note
    const [newNote] = await db
      .insert(notes)
      .values({
        slug: finalSlug,
        title: data.title,
        content: data.content,
        categoryId,
      })
      .returning()

    // Handle tags - create if they don't exist
    for (const tagName of data.tagNames) {
      let tagId: string
      const existingTag = await db.query.tags.findFirst({
        where: eq(tags.name, tagName),
      })
      if (existingTag) {
        tagId = existingTag.id
      } else {
        const [newTag] = await db.insert(tags).values({ name: tagName }).returning()
        tagId = newTag.id
      }
      // Create note-tag relation
      await db.insert(noteTags).values({ noteId: newNote.id, tagId })
    }

    // Handle references
    if (data.references.length > 0) {
      await db.insert(noteReferences).values(
        data.references.map((ref) => ({
          noteId: newNote.id,
          type: ref.type,
          value: ref.value,
        })),
      )
    }

    revalidatePath("/")
    return { success: true, noteId: newNote.id }
  } catch (error) {
    console.error("Error creating note:", error)
    return { success: false, error: "Failed to create note" }
  }
}

// Update an existing note
export async function updateNote(
  id: string,
  slug: string,
  data: {
    title: string
    content: string
    categoryName?: string
    tagNames: string[]
    references: { type: "url" | "book"; value: string }[]
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    // Handle category
    let categoryId: string | null = null
    if (data.categoryName) {
      const existingCategory = await db.query.categories.findFirst({
        where: eq(categories.name, data.categoryName),
      })
      if (existingCategory) {
        categoryId = existingCategory.id
      } else {
        const [newCategory] = await db.insert(categories).values({ name: data.categoryName }).returning()
        categoryId = newCategory.id
      }
    }

    // Update the note
    await db
      .update(notes)
      .set({
        title: data.title,
        content: data.content,
        categoryId,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, id))

    // Delete existing note-tag relations and recreate
    await db.delete(noteTags).where(eq(noteTags.noteId, id))
    for (const tagName of data.tagNames) {
      let tagId: string
      const existingTag = await db.query.tags.findFirst({
        where: eq(tags.name, tagName),
      })
      if (existingTag) {
        tagId = existingTag.id
      } else {
        const [newTag] = await db.insert(tags).values({ name: tagName }).returning()
        tagId = newTag.id
      }
      await db.insert(noteTags).values({ noteId: id, tagId })
    }

    // Delete existing references and recreate
    await db.delete(noteReferences).where(eq(noteReferences.noteId, id))
    if (data.references.length > 0) {
      await db.insert(noteReferences).values(
        data.references.map((ref) => ({
          noteId: id,
          type: ref.type,
          value: ref.value,
        })),
      )
    }

    revalidatePath("/")
    revalidatePath(`/edit/${slug}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating note:", error)
    return { success: false, error: "Failed to update note" }
  }
}

// Delete a note
export async function deleteNote(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(notes).where(eq(notes.id, id))
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting note:", error)
    return { success: false, error: "Failed to delete note" }
  }
}
