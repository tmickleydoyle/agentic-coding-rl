'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_MEMBERS: Member[] = [
  { id: 'u1', name: 'You', handle: '@you' },
  { id: 'u2', name: 'Ada', handle: '@ada' },
  { id: 'u3', name: 'Linus', handle: '@linus' },
]

const SEED_MESSAGES: Message[] = [
  { id: 'm1', authorId: 'u2', text: 'Deploy failing', resolved: false },
  { id: 'm2', authorId: 'u3', text: 'Lunch spot ideas', resolved: false },
  { id: 'm3', authorId: 'u1', text: 'Docs updated', resolved: true },
]

const SEED_REPLIES: Reply[] = [
  { id: 'r1', messageId: 'm1', authorId: 'u1', text: 'Looking now' },
  { id: 'r2', messageId: 'm1', authorId: 'u3', text: 'Same here' },
  { id: 'r3', messageId: 'm1', authorId: 'u2', text: 'Fixed it' },
  { id: 'r4', messageId: 'm2', authorId: 'u1', text: 'Tacos' },
]

const CURRENT_USER_ID = 'u1'

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [members] = useState<Member[]>(SEED_MEMBERS)
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES)
  const [replies, setReplies] = useState<Reply[]>(SEED_REPLIES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('channel')
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [nextMessageId, setNextMessageId] = useState(4)
  const [nextReplyId, setNextReplyId] = useState(5)

  const value = useMemo<AppApi>(() => {
    const openThread = (messageId: string) => {
      setSelectedMessageId(messageId)
      setRoute('thread')
    }

    const postMessage = (text: string) => {
      const trimmed = text.trim()
      if (trimmed.length === 0) return
      const id = `m${nextMessageId}`
      setNextMessageId((n) => n + 1)
      setMessages((prev) => [
        ...prev,
        { id, authorId: CURRENT_USER_ID, text: trimmed, resolved: false },
      ])
    }

    const addReply = (messageId: string, text: string) => {
      const trimmed = text.trim()
      if (trimmed.length === 0) return
      const id = `r${nextReplyId}`
      setNextReplyId((n) => n + 1)
      setReplies((prev) => [...prev, { id, messageId, authorId: CURRENT_USER_ID, text: trimmed }])
    }

    const toggleResolved = (messageId: string) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, resolved: !m.resolved } : m)),
      )
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      members,
      messages,
      replies,
      theme,
      route,
      currentUserId: CURRENT_USER_ID,
      selectedMessageId,
      query,
      openThread,
      postMessage,
      addReply,
      toggleResolved,
      setQuery,
      setTheme,
      navigate,
    }
  }, [members, messages, replies, theme, route, selectedMessageId, query, nextMessageId, nextReplyId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
