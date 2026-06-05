'use client'
import { useMood } from '../components/MoodProvider'
import type { MoodEntry } from '../lib/types'

export function sortedDesc(entries: MoodEntry[]): MoodEntry[] {
  return entries.slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

function sortedAsc(entries: MoodEntry[]): MoodEntry[] {
  return entries.slice().sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}

export function averageScore(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0
  let sum = 0
  entries.forEach((e) => {
    sum += e.score
  })
  return Math.round((sum / entries.length) * 10) / 10
}

export function bestEntry(entries: MoodEntry[]): MoodEntry | null {
  if (entries.length === 0) return null
  const asc = sortedAsc(entries)
  let best = asc[0]
  asc.forEach((e) => {
    if (e.score > best.score) best = e
  })
  return best
}

export function triggerCounts(entries: MoodEntry[]): Record<string, number> {
  const counts: Record<string, number> = {}
  entries.forEach((e) => {
    e.triggers.forEach((t) => {
      counts[t] = (counts[t] ?? 0) + 1
    })
  })
  return counts
}

export function topTrigger(entries: MoodEntry[]): string | null {
  const counts = triggerCounts(entries)
  const keys = Object.keys(counts).sort()
  if (keys.length === 0) return null
  let top = keys[0]
  keys.forEach((k) => {
    if (counts[k] > counts[top]) top = k
  })
  return top
}

export function trend(entries: MoodEntry[]): 'up' | 'down' | 'flat' {
  if (entries.length < 2) return 'flat'
  const asc = sortedAsc(entries)
  const mid = Math.floor(asc.length / 2)
  const earlier = asc.slice(0, asc.length - mid)
  const recent = asc.slice(asc.length - mid)
  const a = averageScore(earlier)
  const b = averageScore(recent)
  if (b > a) return 'up'
  if (b < a) return 'down'
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
