'use client'
import { useApp } from '../components/AppStateProvider'
import type { Thread } from '../lib/types'

export type ForumStats = {
  totalThreads: number
  totalReplies: number
  totalVotes: number
}

export function filterThreads(_threads: Thread[], _categoryFilter: string): Thread[] {
  // TODO: 'all' returns every thread; otherwise threads in that category
  return []
}

export function sortThreads(_threads: Thread[], _sort: 'votes' | 'recent'): Thread[] {
  // TODO: votes => by votes desc; recent => by createdAt desc
  return []
}

export function useThreads() {
  const { threads, replies, sort, categoryFilter } = useApp()
  const visibleThreads = sortThreads(filterThreads(threads, categoryFilter), sort)
  const stats: ForumStats = {
    totalThreads: threads.length,
    totalReplies: replies.length,
    totalVotes: 0,
  }
  return { visibleThreads, stats }
}
