'use client'
import { useApp } from '../components/AppStateProvider'
import type { Thread } from '../lib/types'

export type ForumStats = {
  totalThreads: number
  totalReplies: number
  totalVotes: number
}

export function filterThreads(threads: Thread[], categoryFilter: string): Thread[] {
  if (categoryFilter === 'all') return threads.slice()
  return threads.filter((t) => t.categoryId === categoryFilter)
}

export function sortThreads(threads: Thread[], sort: 'votes' | 'recent'): Thread[] {
  const out = threads.slice()
  if (sort === 'votes') out.sort((a, b) => b.votes - a.votes)
  else out.sort((a, b) => b.createdAt - a.createdAt)
  return out
}

export function useThreads() {
  const { threads, replies, sort, categoryFilter } = useApp()
  const visibleThreads = sortThreads(filterThreads(threads, categoryFilter), sort)
  let totalVotes = 0
  threads.forEach((t) => {
    totalVotes += t.votes
  })
  const stats: ForumStats = {
    totalThreads: threads.length,
    totalReplies: replies.length,
    totalVotes,
  }
  return { visibleThreads, stats }
}
