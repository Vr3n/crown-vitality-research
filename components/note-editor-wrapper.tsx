"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createNote, updateNote } from "@/lib/actions/notes"
import type { NoteWithRelations } from "@/lib/actions/notes"
import { MarkdownPreview } from "./markdown-preview"
import { ChipInput } from "./chip-input"

interface NoteEditorWrapperProps {
  mode: "add" | "edit"
  initialNote?: NoteWithRelations
  availableTags: string[]
  availableCategories: string[]
}

export function NoteEditorWrapper({ mode, initialNote, availableTags, availableCategories }: NoteEditorWrapperProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialNote?.title || "")
  const [content, setContent] = useState(initialNote?.content || "")
  const [selectedTags, setSelectedTags] = useState<string[]>(initialNote?.tags.map((t) => t.name) || [])
  const [selectedCategory, setSelectedCategory] = useState<string[]>(
    initialNote?.categoryName ? [initialNote.categoryName] : [],
  )
  const [references, setReferences] = useState<{ id: string; type: "url" | "book"; value: string }[]>(
    initialNote?.references.map((r) => ({ id: r.id, type: r.type as "url" | "book", value: r.value })) || [],
  )
  const [newRefType, setNewRefType] = useState<"url" | "book">("url")
  const [newRefValue, setNewRefValue] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState("")

  const handleAddReference = () => {
    if (newRefValue) {
      const ref = {
        id: Date.now().toString(),
        type: newRefType,
        value: newRefValue,
      }
      setReferences([...references, ref])
      setNewRefValue("")
    }
  }

  const handleRemoveReference = (id: string) => {
    setReferences(references.filter((r) => r.id !== id))
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a note title")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const noteData = {
        title,
        content,
        categoryName: selectedCategory[0] || undefined,
        tagNames: selectedTags,
        references: references.map((r) => ({ type: r.type, value: r.value })),
      }

      if (mode === "add") {
        const result = await createNote(noteData)
        if (!result.success) {
          throw new Error(result.error)
        }
      } else if (initialNote) {
        const result = await updateNote(initialNote.id, initialNote.slug, noteData)
        if (!result.success) {
          throw new Error(result.error)
        }
      }

      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save note")
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Note Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Client meal plan for weight loss..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white transition-all"
        />
      </div>

      {/* Category */}
      <ChipInput
        label="Category"
        value={selectedCategory}
        onChange={setSelectedCategory}
        suggestions={availableCategories}
        placeholder="Type a category and press Enter..."
        singleValue={true}
        chipColor="primary"
      />

      {/* Tags */}
      <ChipInput
        label="Tags"
        value={selectedTags}
        onChange={setSelectedTags}
        suggestions={availableTags}
        placeholder="Add tags (e.g., Thyroid, High Blood Pressure)..."
        chipColor="secondary"
      />

      {/* References */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">References</label>
        <div className="flex gap-2 mb-3">
          <select
            value={newRefType}
            onChange={(e) => setNewRefType(e.target.value as "url" | "book")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-gray-900 transition-all"
          >
            <option value="url">URL</option>
            <option value="book">Book</option>
          </select>
          <input
            type="text"
            value={newRefValue}
            onChange={(e) => setNewRefValue(e.target.value)}
            placeholder={newRefType === "url" ? "https://..." : "Book name..."}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-gray-900 transition-all"
          />
          <button
            onClick={handleAddReference}
            className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg transition-all font-medium shadow-sm"
          >
            Add
          </button>
        </div>

        {/* References list */}
        {references.length > 0 && (
          <div className="space-y-2">
            {references.map((ref) => (
              <div
                key={ref.id}
                className="flex items-center justify-between bg-blue-50 border border-blue-200 p-3 rounded-lg"
              >
                <span className="text-sm text-foreground break-all">
                  {ref.type === "url" ? "🔗" : "📚"} {ref.value}
                </span>
                <button
                  onClick={() => handleRemoveReference(ref.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content Editor */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-foreground">Note Content (Markdown supported)</label>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-[#2563EB] hover:text-[#1d4ed8] font-medium transition-colors"
          >
            {showPreview ? "✏️ Edit" : "👁️ Preview"}
          </button>
        </div>

        {showPreview ? (
          <MarkdownPreview content={content} />
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here...&#10;&#10;Markdown tips:&#10;# Heading  |  **Bold**  |  *Italic*&#10;- List items  |  [Link](url)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-mono text-sm h-80 resize-none bg-white transition-all"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isSaving || !title.trim()}
          className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
        >
          {isSaving ? "Saving..." : mode === "add" ? "Create Note" : "Update Note"}
        </button>
        <button
          onClick={() => router.push("/")}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
