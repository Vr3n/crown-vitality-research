import { Header } from "@/components/header"
import { NoteEditorWrapper } from "@/components/note-editor-wrapper"
import { getUserTags, getUserCategories } from "@/lib/actions/tags-categories"

export default async function AddNotePage() {
  const [allTags, allCategories] = await Promise.all([getUserTags(), getUserCategories()])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">Create New Note</h2>
            <p className="text-muted-foreground mt-2">Add tags and categories on the fly</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <NoteEditorWrapper
              mode="add"
              availableTags={allTags.map((t) => t.name)}
              availableCategories={allCategories.map((c) => c.name)}
            />
          </div>
        </div>
      </main>
    </>
  )
}
