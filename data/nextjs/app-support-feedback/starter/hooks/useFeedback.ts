'use client'
import { useApp } from '../components/AppStateProvider'
import type { Feedback } from '../lib/types'

export type SentimentCounts = {
  positive: number
  neutral: number
  negative: number
}

export function filterByCategory(_items: Feedback[], _categoryFilter: string): Feedback[] {
  // TODO: 'all' returns all; otherwise filter by category
  return []
}

export function categories(_items: Feedback[]): { category: string; count: number }[] {
  // TODO: count items per category, sorted by name
  return []
}

export function sentimentCounts(_items: Feedback[]): SentimentCounts {
  // TODO: count items by sentiment
  return { positive: 0, neutral: 0, negative: 0 }
}

export function statusCount(_items: Feedback[], _status: string): number {
  // TODO: count items with the given status
  return 0
}

export function useFeedback() {
  const { items, categoryFilter } = useApp()
  const filtered = filterByCategory(items, categoryFilter)
  const cats = categories(items)
  const sentiments = sentimentCounts(items)
  return { filtered, cats, sentiments }
}
