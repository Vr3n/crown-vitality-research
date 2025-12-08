import { getNoteBySlug } from "@/lib/actions/notes"
import { getUserTags, getUserCategories } from "@/lib/actions/tags-categories"
import Link from "next/link"
import { EditPageContent } from "./edit-page-content"

export default async function EditNotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [note, allTags, allCategories] = await Promise.all([
    getNoteBySlug(slug),
    getUserTags(),
    getUserCategories(),
  ])

  if (!note) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Note not found</h1>
          <Link
            href="/"
            className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Back to Notes
          </Link>
        </div>
      </main>
    )
  }

  return <EditPageContent note={note} allTags={allTags} allCategories={allCategories} />
}
