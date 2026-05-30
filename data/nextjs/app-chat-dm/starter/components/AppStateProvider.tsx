'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: AppApi = {
  people: [],
  threads: [],
  dms: [],
  theme: 'light',
  route: 'inbox',
  currentUserId: 'u1',
  selectedThreadId: null,
  query: '',
  openThread: () => {},
  sendDM: () => {},
  markRead: () => {},
  markUnread: () => {},
  setQuery: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold people/threads/dms/theme/route/selectedThreadId/query in state (seed 4
  // people + 3 threads + 4 DMs), implement the actions, and provide them through
  // AppContext. The STUB below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
