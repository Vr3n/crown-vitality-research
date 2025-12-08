"use client"

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const parseMarkdown = (text: string) => {
    const html = text
      // Escape HTML
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Code blocks
      .replace(/```[\s\S]*?```/g, (match) => {
        const code = match.replace(/```/g, "").trim()
        return `<pre class="bg-gray-100 p-3 rounded-lg my-2 overflow-x-auto"><code>${code}</code></pre>`
      })
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Headings
      .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      // Links
      .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>')
      // Lists
      .replace(/^- (.*?)$/gm, '<li class="ml-4">$1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="my-3">')
      .replace(/\n/g, "<br>")
      .trim()

    return `<p class="my-3">${html}</p>`
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 prose prose-sm max-w-none">
      <div dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} />
    </div>
  )
}
