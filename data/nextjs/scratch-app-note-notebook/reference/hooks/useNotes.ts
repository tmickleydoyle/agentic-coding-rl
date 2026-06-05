'use client'
import { useApp } from '../components/AppStateProvider'
import type { Note } from '../lib/types'

export function pinnedFirst(notes: Note[]): Note[] {
  const pinned = notes.filter((n) => n.pinned)
  const rest = notes.filter((n) => !n.pinned)
  return [...pinned, ...rest]
}

export function collectTags(notes: Note[]): string[] {
  const set = new Set<string>()
  notes.forEach((n) => n.tags.forEach((t) => set.add(t)))
  return Array.from(set).sort()
}

export function searchNotes(notes: Note[], query: string): Note[] {
  const q = query.trim().toLowerCase()
  if (q.length === 0) return []
  return notes.filter(
    (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q),
  )
}

export function useNotes() {
  const { notes, selectedNotebookId, tagFilter, searchQuery } = useApp()

  const inNotebook = notes.filter((n) => n.notebookId === selectedNotebookId)
  const tagsInNotebook = collectTags(inNotebook)

  let visible = pinnedFirst(inNotebook)
  if (tagFilter) visible = visible.filter((n) => n.tags.includes(tagFilter))

  const searchResults = searchNotes(notes, searchQuery)

  return { notesInNotebook: visible, tagsInNotebook, searchResults }
}
