"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { deleteNote } from "@/lib/actions/notes"
import type { NoteWithRelations } from "@/lib/actions/notes"

interface NoteCardProps {
  note: NoteWithRelations
}

export function NoteCard({ note }: NoteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      setIsDeleting(true)
      await deleteNote(note.id)
    }
  }

  // Extract plain text from markdown content
  const getPreview = (content: string | null) => {
    if (!content) return ""
    return (
      content
        .replace(/[#*`_[\]]/g, "")
        .substring(0, 150)
        .trim() + (content.length > 150 ? "..." : "")
    )
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ""
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    })
  }

  return (
    <Link href={`/edit/${note.slug}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col h-full border border-gray-100 cursor-pointer hover:border-[#2563EB]/30">
        {/* Category Badge */}
        {note.categoryName && (
          <div className="mb-3">
            <span className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 text-[#2563EB] text-xs font-semibold px-3 py-1 rounded-full border border-[#2563EB]/20">
              {note.categoryName}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 leading-snug">{note.title}</h3>

        {/* Preview */}
        <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3 leading-relaxed">
          {getPreview(note.content) || "No content yet..."}
        </p>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.slice(0, 3).map((tag) => (
              <span key={tag.id} className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-medium">
                #{tag.name}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-xs text-muted-foreground px-2.5 py-1">+{note.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* References */}
        {note.references.length > 0 && (
          <div className="text-xs text-muted-foreground mb-4 flex gap-2">
            {note.references.slice(0, 2).map((ref) => (
              <span key={ref.id} className="flex items-center gap-1">
                {ref.type === "url" ? "🔗" : "📚"}
              </span>
            ))}
            {note.references.length > 2 && <span>+{note.references.length - 2}</span>}
          </div>
        )}

        {/* Date and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-muted-foreground font-medium">{formatDate(note.updatedAt)}</span>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs bg-[#e36363] hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-all hover:shadow-md disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
