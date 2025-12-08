"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface NotesFilterProps {
  allTags: string[]
  allCategories: string[]
  initialSearch: string
  initialTag: string
  initialCategory: string
}

export function NotesFilter({ allTags, allCategories, initialSearch, initialTag, initialCategory }: NotesFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [selectedTag, setSelectedTag] = useState(initialTag)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/?${params.toString()}`)
  }

  const handleSearch = () => {
    updateFilters("search", searchTerm)
  }

  const clearFilters = () => {
    setSearchTerm("")
    router.push("/")
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="🔍 Search notes by title or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white shadow-sm"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          Search
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <select
          value={selectedTag}
          onChange={(e) => {
            setSelectedTag(e.target.value)
            updateFilters("tag", e.target.value)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white"
        >
          <option value="">All Tags ({allTags.length})</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value)
            updateFilters("category", e.target.value)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white"
        >
          <option value="">All Categories ({allCategories.length})</option>
          {allCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {(initialSearch || initialTag || initialCategory) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-foreground rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}
