"use client"

import { useState, useRef, type KeyboardEvent } from "react"
import { X } from "lucide-react"

interface ChipInputProps {
  value: string[]
  onChange: (value: string[]) => void
  suggestions?: string[]
  placeholder?: string
  label?: string
  singleValue?: boolean
  chipColor?: "primary" | "secondary"
}

export function ChipInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "Type and press Enter...",
  label,
  singleValue = false,
  chipColor = "secondary",
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s),
  )

  const addChip = (chip: string) => {
    const trimmed = chip.trim()
    if (!trimmed) return

    if (singleValue) {
      onChange([trimmed])
    } else if (!value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInputValue("")
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const removeChip = (chip: string) => {
    onChange(value.filter((v) => v !== chip))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      addChip(inputValue)
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeChip(value[value.length - 1])
    }
  }

  const chipBgClass = chipColor === "primary" ? "bg-[#2563EB] text-white" : "bg-[#e36363] text-white"

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-foreground">{label}</label>}

      <div
        className="flex flex-wrap items-center gap-2 min-h-[48px] px-3 py-2 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-[#2563EB] focus-within:border-[#2563EB] transition-all cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Chips inside the input */}
        {value.map((chip) => (
          <span
            key={chip}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm ${chipBgClass}`}
          >
            {singleValue ? chip : `#${chip}`}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeChip(chip)
              }}
              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}

        {/* Input field */}
        {(!singleValue || value.length === 0) && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(true)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] outline-none text-sm bg-transparent text-gray-900 placeholder:text-gray-400"
          />
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="relative">
          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addChip(suggestion)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                {singleValue ? suggestion : `#${suggestion}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
