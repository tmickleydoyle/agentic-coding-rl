'use client'
import { useApp } from '../components/AppStateProvider'
import type { Note } from '../lib/types'

export function pinnedFirst(_notes: Note[]): Note[] {
  // TODO: return notes with pinned ones first
  return []
}

export function collectTags(_notes: Note[]): string[] {
  // TODO: return sorted unique tags across the notes
  return []
}

export function searchNotes(_notes: Note[], _query: string): Note[] {
  // TODO: case-insensitive title/body match; empty when the query is blank
  return []
}

export function useNotes() {
  const { notes } = useApp()
  void notes
  return { notesInNotebook: [] as Note[], tagsInNotebook: [] as string[], searchResults: [] as Note[] }
}
