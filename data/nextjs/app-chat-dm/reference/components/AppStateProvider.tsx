'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { DM, Person, Route, Theme, Thread } from '../lib/types'

type AppApi = {
  people: Person[]
  threads: Thread[]
  dms: DM[]
  theme: Theme
  route: Route
  currentUserId: string
  selectedThreadId: string | null
  query: string
  openThread: (threadId: string) => void
  sendDM: (threadId: string, text: string) => void
  markRead: (threadId: string) => void
  markUnread: (threadId: string) => void
  setQuery: (query: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_PEOPLE: Person[] = [
  { id: 'u1', name: 'You', handle: '@you' },
  { id: 'u2', name: 'Ada', handle: '@ada' },
  { id: 'u3', name: 'Linus', handle: '@linus' },
  { id: 'u4', name: 'Grace', handle: '@grace' },
]

const SEED_THREADS: Thread[] = [
  { id: 't1', personId: 'u2', unread: true },
  { id: 't2', personId: 'u3', unread: false },
  { id: 't3', personId: 'u4', unread: true },
]

const SEED_DMS: DM[] = [
  { id: 'd1', threadId: 't1', authorId: 'u2', text: 'Hey there' },
  { id: 'd2', threadId: 't1', authorId: 'u1', text: 'Hi Ada' },
  { id: 'd3', threadId: 't2', authorId: 'u3', text: 'Ship it' },
  { id: 'd4', threadId: 't3', authorId: 'u4', text: 'Coffee?' },
]

const CURRENT_USER_ID = 'u1'

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [people] = useState<Person[]>(SEED_PEOPLE)
  const [threads, setThreads] = useState<Thread[]>(SEED_THREADS)
  const [dms, setDMs] = useState<DM[]>(SEED_DMS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('inbox')
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [nextDMId, setNextDMId] = useState(5)

  const value = useMemo<AppApi>(() => {
    const setUnreadFor = (threadId: string, unread: boolean) => {
      setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, unread } : t)))
    }

    const openThread = (threadId: string) => {
      setSelectedThreadId(threadId)
      setUnreadFor(threadId, false)
      setRoute('thread')
    }

    const sendDM = (threadId: string, text: string) => {
      const trimmed = text.trim()
      if (trimmed.length === 0) return
      const id = `d${nextDMId}`
      setNextDMId((n) => n + 1)
      setDMs((prev) => [...prev, { id, threadId, authorId: CURRENT_USER_ID, text: trimmed }])
    }

    const markRead = (threadId: string) => setUnreadFor(threadId, false)
    const markUnread = (threadId: string) => setUnreadFor(threadId, true)
    const navigate = (next: Route) => setRoute(next)

    return {
      people,
      threads,
      dms,
      theme,
      route,
      currentUserId: CURRENT_USER_ID,
      selectedThreadId,
      query,
      openThread,
      sendDM,
      markRead,
      markUnread,
      setQuery,
      setTheme,
      navigate,
    }
  }, [people, threads, dms, theme, route, selectedThreadId, query, nextDMId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
