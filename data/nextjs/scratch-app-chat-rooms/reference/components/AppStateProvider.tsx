'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Member, Message, Room, Route, Theme } from '../lib/types'

type AppApi = {
  rooms: Room[]
  members: Member[]
  messages: Message[]
  theme: Theme
  route: Route
  currentUserId: string
  selectedRoomId: string | null
  unread: Record<string, number>
  openRoom: (roomId: string) => void
  sendMessage: (roomId: string, text: string) => void
  markRead: (roomId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_MEMBERS: Member[] = [
  { id: 'u1', name: 'You', handle: '@you' },
  { id: 'u2', name: 'Ada', handle: '@ada' },
  { id: 'u3', name: 'Linus', handle: '@linus' },
]

const SEED_ROOMS: Room[] = [
  { id: 'r1', name: 'General', topic: 'Company wide' },
  { id: 'r2', name: 'Random', topic: 'Off topic' },
  { id: 'r3', name: 'Dev', topic: 'Engineering' },
]

const SEED_MESSAGES: Message[] = [
  { id: 'm1', roomId: 'r1', authorId: 'u2', text: 'Morning all' },
  { id: 'm2', roomId: 'r1', authorId: 'u3', text: 'Hi there' },
  { id: 'm3', roomId: 'r2', authorId: 'u2', text: 'Lunch?' },
  { id: 'm4', roomId: 'r3', authorId: 'u3', text: 'Build is green' },
  { id: 'm5', roomId: 'r3', authorId: 'u1', text: 'Nice' },
]

const SEED_UNREAD: Record<string, number> = { r1: 0, r2: 2, r3: 0 }

const CURRENT_USER_ID = 'u1'

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [rooms] = useState<Room[]>(SEED_ROOMS)
  const [members] = useState<Member[]>(SEED_MEMBERS)
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('rooms')
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [unread, setUnread] = useState<Record<string, number>>(SEED_UNREAD)
  const [nextMessageId, setNextMessageId] = useState(6)

  const value = useMemo<AppApi>(() => {
    const openRoom = (roomId: string) => {
      setSelectedRoomId(roomId)
      setUnread((prev) => ({ ...prev, [roomId]: 0 }))
      setRoute('room')
    }

    const sendMessage = (roomId: string, text: string) => {
      const trimmed = text.trim()
      if (trimmed.length === 0) return
      const id = `m${nextMessageId}`
      setNextMessageId((n) => n + 1)
      setMessages((prev) => [...prev, { id, roomId, authorId: CURRENT_USER_ID, text: trimmed }])
      if (roomId !== selectedRoomId) {
        setUnread((prev) => ({ ...prev, [roomId]: (prev[roomId] ?? 0) + 1 }))
      }
    }

    const markRead = (roomId: string) => {
      setUnread((prev) => ({ ...prev, [roomId]: 0 }))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      rooms,
      members,
      messages,
      theme,
      route,
      currentUserId: CURRENT_USER_ID,
      selectedRoomId,
      unread,
      openRoom,
      sendMessage,
      markRead,
      setTheme,
      navigate,
    }
  }, [rooms, members, messages, theme, route, selectedRoomId, unread, nextMessageId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
