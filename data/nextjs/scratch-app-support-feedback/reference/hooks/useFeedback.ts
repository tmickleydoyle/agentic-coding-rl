'use client'
import { useApp } from '../components/AppStateProvider'
import type { Feedback, Sentiment } from '../lib/types'

export type SentimentCounts = {
  positive: number
  neutral: number
  negative: number
}

export function filterByCategory(items: Feedback[], categoryFilter: string): Feedback[] {
  if (categoryFilter === 'all') return items.slice()
  return items.filter((f) => f.category === categoryFilter)
}

export function categories(items: Feedback[]): { category: string; count: number }[] {
  const map: Record<string, number> = {}
  items.forEach((f) => {
    map[f.category] = (map[f.category] ?? 0) + 1
  })
  const names = Object.keys(map).sort()
  return names.map((category) => ({ category, count: map[category] }))
}

export function sentimentCounts(items: Feedback[]): SentimentCounts {
  const counts: SentimentCounts = { positive: 0, neutral: 0, negative: 0 }
  items.forEach((f) => {
    counts[f.sentiment] += 1
  })
  return counts
}

export function statusCount(items: Feedback[], status: string): number {
  let n = 0
  items.forEach((f) => {
    if (f.status === status) n += 1
  })
  return n
}

export function useFeedback() {
  const { items, categoryFilter } = useApp()
  const filtered = filterByCategory(items, categoryFilter)
  const cats = categories(items)
  const sentiments = sentimentCounts(items)
  return { filtered, cats, sentiments }
}
