'use client'
import { useApp } from '../components/AppStateProvider'
import type { DM, Person, Thread } from '../lib/types'

export type InboxStats = {
  totalThreads: number
  unreadThreads: number
  totalMessages: number
}

export function dmsFor(dms: DM[], threadId: string): DM[] {
  return dms.filter((d) => d.threadId === threadId)
}

export function searchPeople(people: Person[], query: string, currentUserId: string): Person[] {
  const q = query.trim().toLowerCase()
  return people.filter((p) => {
    if (p.id === currentUserId) return false
    if (q.length === 0) return true
    return p.name.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q)
  })
}

export function computeStats(threads: Thread[], dms: DM[]): InboxStats {
  let unreadThreads = 0
  threads.forEach((t) => {
    if (t.unread) unreadThreads += 1
  })
  return {
    totalThreads: threads.length,
    unreadThreads,
    totalMessages: dms.length,
  }
}

export function useInbox() {
  const { people, threads, dms, query, currentUserId } = useApp()
  const threadDMs = (threadId: string) => dmsFor(dms, threadId)
  const matchedPeople = searchPeople(people, query, currentUserId)
  const stats = computeStats(threads, dms)
  return { threadDMs, matchedPeople, stats }
}
