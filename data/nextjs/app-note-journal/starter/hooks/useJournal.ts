'use client'
import { useApp } from '../components/AppStateProvider'
import type { Entry, Mood } from '../lib/types'

export function moodCounts(_entries: Entry[]): {
  happy: number
  neutral: number
  sad: number
  total: number
} {
  // TODO: tally moods across the entries
  return { happy: 0, neutral: 0, sad: 0, total: 0 }
}

export function useJournal() {
  const { entries } = useApp()
  void entries
  // TODO: return sortedEntries (date desc), filteredEntries (moodFilter), todaysEntries,
  // counts, and topMood.
  return {
    sortedEntries: [] as Entry[],
    filteredEntries: [] as Entry[],
    todaysEntries: [] as Entry[],
    counts: { happy: 0, neutral: 0, sad: 0, total: 0 },
    topMood: null as Mood | null,
  }
}
