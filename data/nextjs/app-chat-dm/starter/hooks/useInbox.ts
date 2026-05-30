'use client'
import { useApp } from '../components/AppStateProvider'
import type { DM, Person, Thread } from '../lib/types'

export type InboxStats = {
  totalThreads: number
  unreadThreads: number
  totalMessages: number
}

export function dmsFor(_dms: DM[], _threadId: string): DM[] {
  // TODO: return DMs for the given thread
  return []
}

export function searchPeople(_people: Person[], _query: string, _currentUserId: string): Person[] {
  // TODO: people whose name/handle matches the query (case-insensitive), excluding self
  return []
}

export function computeStats(_threads: Thread[], _dms: DM[]): InboxStats {
  // TODO: total threads, unread thread count, total messages
  return { totalThreads: 0, unreadThreads: 0, totalMessages: 0 }
}

export function useInbox() {
  const { people, threads, dms, query, currentUserId } = useApp()
  const threadDMs = (threadId: string) => dmsFor(dms, threadId)
  const matchedPeople = searchPeople(people, query, currentUserId)
  const stats = computeStats(threads, dms)
  return { threadDMs, matchedPeople, stats }
}
