'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Agent, Canned, Chat, Reply, Route, Status, Theme } from '../lib/types'

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

const SEED_AGENTS: Agent[] = [
  { id: 'a1', name: 'You' },
  { id: 'a2', name: 'Sam' },
]

const SEED_CHATS: Chat[] = [
  { id: 'c1', customer: 'Alice', status: 'open', agentId: 'a1' },
  { id: 'c2', customer: 'Bob', status: 'open', agentId: null },
  { id: 'c3', customer: 'Cara', status: 'closed', agentId: 'a2' },
]

const SEED_CANNED: Canned[] = [
  { id: 'k1', label: 'Greeting', text: 'Hi, how can I help?' },
  { id: 'k2', label: 'Closing', text: 'Glad I could help!' },
]

const SEED_REPLIES: Reply[] = [
  { id: 'y1', chatId: 'c1', authorId: 'Alice', text: 'My order is late' },
  { id: 'y2', chatId: 'c1', authorId: 'a1', text: 'Let me check' },
  { id: 'y3', chatId: 'c3', authorId: 'a2', text: 'All sorted' },
]

const CURRENT_AGENT_ID = 'a1'

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [agents] = useState<Agent[]>(SEED_AGENTS)
  const [chats, setChats] = useState<Chat[]>(SEED_CHATS)
  const [replies, setReplies] = useState<Reply[]>(SEED_REPLIES)
  const [canned] = useState<Canned[]>(SEED_CANNED)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('queue')
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [nextReplyId, setNextReplyId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const setStatus = (chatId: string, status: Status) => {
      setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, status } : c)))
    }

    const openChat = (chatId: string) => {
      setSelectedChatId(chatId)
      setRoute('chat')
    }

    const sendReply = (chatId: string, text: string) => {
      const trimmed = text.trim()
      if (trimmed.length === 0) return
      const id = `y${nextReplyId}`
      setNextReplyId((n) => n + 1)
      setReplies((prev) => [...prev, { id, chatId, authorId: CURRENT_AGENT_ID, text: trimmed }])
    }

    const closeChat = (chatId: string) => setStatus(chatId, 'closed')
    const reopenChat = (chatId: string) => setStatus(chatId, 'open')

    const assignAgent = (chatId: string, agentId: string) => {
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, agentId: agentId === '' ? null : agentId } : c)),
      )
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      agents,
      chats,
      replies,
      canned,
      theme,
      route,
      currentAgentId: CURRENT_AGENT_ID,
      selectedChatId,
      openChat,
      sendReply,
      closeChat,
      reopenChat,
      assignAgent,
      setTheme,
      navigate,
    }
  }, [agents, chats, replies, canned, theme, route, selectedChatId, nextReplyId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
