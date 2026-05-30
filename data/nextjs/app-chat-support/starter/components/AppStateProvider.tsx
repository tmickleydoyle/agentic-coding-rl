'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Agent, Canned, Chat, Reply, Route, Theme } from '../lib/types'

type AppApi = {
  agents: Agent[]
  chats: Chat[]
  replies: Reply[]
  canned: Canned[]
  theme: Theme
  route: Route
  currentAgentId: string
  selectedChatId: string | null
  openChat: (chatId: string) => void
  sendReply: (chatId: string, text: string) => void
  closeChat: (chatId: string) => void
  reopenChat: (chatId: string) => void
  assignAgent: (chatId: string, agentId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  agents: [],
  chats: [],
  replies: [],
  canned: [],
  theme: 'light',
  route: 'queue',
  currentAgentId: 'a1',
  selectedChatId: null,
  openChat: () => {},
  sendReply: () => {},
  closeChat: () => {},
  reopenChat: () => {},
  assignAgent: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold agents/chats/replies/canned/theme/route/selectedChatId in state (seed 2
  // agents + 3 chats + 2 canned + 3 replies), implement the actions, and provide them
  // through AppContext. The STUB below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
