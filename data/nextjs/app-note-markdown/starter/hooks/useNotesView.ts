'use client'
import { useApp } from '../components/AppStateProvider'
import type { Note } from '../lib/types'

export function useNotesView() {
  const { notes } = useApp()
  void notes
  // TODO: compute visibleNotes (tagFilter applied), allTags ({ tag, count } sorted), and
  // totalWords (sum of wordCount across all notes).
  return {
    visibleNotes: [] as Note[],
    allTags: [] as { tag: string; count: number }[],
    totalWords: 0,
  }
}
