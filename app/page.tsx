import Link from "next/link"
import { NoteCard } from "@/components/note-card"
import { Header } from "@/components/header"
import { NotesFilter } from "@/components/notes-filter"
import { getNotes } from "@/lib/actions/notes"
import { getAllTags, getAllCategories } from "@/lib/actions/tags-categories"

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; tag?: string; category?: string }>
}) {
  const params = await searchParams
  const search = params.search || ""
  const tagFilter = params.tag || ""
  const categoryFilter = params.category || ""

  const [notes, allTags, allCategories] = await Promise.all([
    getNotes(search, tagFilter, categoryFilter),
    getAllTags(),
    getAllCategories(),
  ])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters Section */}
          <NotesFilter
            allTags={allTags.map((t) => t.name)}
            allCategories={allCategories.map((c) => c.name)}
            initialSearch={search}
            initialTag={tagFilter}
            initialCategory={categoryFilter}
          />

          {/* Notes Grid */}
          {notes.length === 0 ? (
            <div className="text-center py-16">
              {!search && !tagFilter && !categoryFilter ? (
                <>
                  <div className="mb-6">
                    <div className="text-6xl mb-4">📝</div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">No notes yet</h2>
                    <p className="text-muted-foreground mb-8">
                      Start by creating your first note about nutrition, workouts, or client info
                    </p>
                    <Link
                      href="/add"
                      className="inline-block bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md"
                    >
                      Create Your First Note
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">🔍</div>
                  <h2 className="text-xl font-bold text-foreground mb-2">No matching notes</h2>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-4">Showing {notes.length} notes</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
