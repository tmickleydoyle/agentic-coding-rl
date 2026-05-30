'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Member, Message, Reply, Route, Theme } from '../lib/types'

type AppApi = {
  members: Member[]
  messages: Message[]
  replies: Reply[]
  theme: Theme
  route: Route
  currentUserId: string
  selectedMessageId: string | null
  query: string
  openThread: (messageId: string) => void
  postMessage: (text: string) => void
  addReply: (messageId: string, text: string) => void
  toggleResolved: (messageId: string) => void
  setQuery: (query: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  members: [],
  messages: [],
  replies: [],
  theme: 'light',
  route: 'channel',
  currentUserId: 'u1',
  selectedMessageId: null,
  query: '',
  openThread: () => {},
  postMessage: () => {},
  addReply: () => {},
  toggleResolved: () => {},
  setQuery: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold members/messages/replies/theme/route/selectedMessageId/query in state (seed
  // 3 members + 3 messages + 4 replies), implement the actions, and provide them through
  // AppContext. The STUB below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
