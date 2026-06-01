'use client'
import { useApp } from '../components/AppStateProvider'
import { wordCount } from '../lib/markdown'

export function useNotesView() {
  const { notes, tagFilter } = useApp()

  const visibleNotes = tagFilter
    ? notes.filter((n) => n.tags.includes(tagFilter))
    : notes.slice()

  const counts: Record<string, number> = {}
  notes.forEach((n) => {
    n.tags.forEach((t) => {
      counts[t] = (counts[t] ?? 0) + 1
    })
  })
  const allTags = Object.keys(counts)
    .sort()
    .map((tag) => ({ tag, count: counts[tag] }))

  let totalWords = 0
  notes.forEach((n) => {
    totalWords += wordCount(n.body)
  })

  return { visibleNotes, allTags, totalWords }
}
