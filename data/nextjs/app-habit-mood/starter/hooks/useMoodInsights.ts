'use client'
import { useMood } from '../components/MoodProvider'
import type { MoodEntry } from '../lib/types'

export function sortedDesc(entries: MoodEntry[]): MoodEntry[] {
  // TODO: most-recent-first by date.
  return entries.slice()
}

export function averageScore(_entries: MoodEntry[]): number {
  // TODO: mean score rounded to 1 decimal.
  return 0
}

export function bestEntry(_entries: MoodEntry[]): MoodEntry | null {
  // TODO: highest-scoring entry (ties: earliest date).
  return null
}

export function triggerCounts(_entries: MoodEntry[]): Record<string, number> {
  // TODO: trigger -> count.
  return {}
}

export function topTrigger(_entries: MoodEntry[]): string | null {
  // TODO: most frequent trigger (ties: alphabetical).
  return null
}

export function trend(_entries: MoodEntry[]): 'up' | 'down' | 'flat' {
  // TODO: compare recent-half average to earlier-half average.
  return 'flat'
}

export function useMoodInsights() {
  const { entries } = useMood()
  return {
    average: averageScore(entries),
    best: bestEntry(entries),
    top: topTrigger(entries),
    trend: trend(entries),
    sorted: sortedDesc(entries),
    count: entries.length,
  }
}
