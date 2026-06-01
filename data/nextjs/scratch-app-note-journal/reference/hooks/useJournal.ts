'use client'
import { useApp } from '../components/AppStateProvider'
import type { Entry, Mood } from '../lib/types'
import { TODAY } from '../lib/types'

export function moodCounts(entries: Entry[]): {
  happy: number
  neutral: number
  sad: number
  total: number
} {
  const out = { happy: 0, neutral: 0, sad: 0, total: entries.length }
  entries.forEach((e) => {
    out[e.mood] += 1
  })
  return out
}

const MOOD_ORDER: Mood[] = ['happy', 'neutral', 'sad']

export function useJournal() {
  const { entries, moodFilter } = useApp()

  const sortedEntries = entries
    .map((e, i) => ({ e, i }))
    .sort((a, b) => {
      if (a.e.date < b.e.date) return 1
      if (a.e.date > b.e.date) return -1
      return a.i - b.i
    })
    .map((x) => x.e)

  const filteredEntries =
    moodFilter === 'all' ? sortedEntries : sortedEntries.filter((e) => e.mood === moodFilter)

  const todaysEntries = entries.filter((e) => e.date === TODAY)

  const counts = moodCounts(entries)

  let topMood: Mood | null = null
  if (entries.length > 0) {
    topMood = MOOD_ORDER.reduce((best, m) => (counts[m] > counts[best] ? m : best), MOOD_ORDER[0])
  }

  return { sortedEntries, filteredEntries, todaysEntries, counts, topMood }
}
