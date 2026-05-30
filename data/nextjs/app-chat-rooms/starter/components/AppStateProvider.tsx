'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: AppApi = {
  rooms: [],
  members: [],
  messages: [],
  theme: 'light',
  route: 'rooms',
  currentUserId: 'u1',
  selectedRoomId: null,
  unread: {},
  openRoom: () => {},
  sendMessage: () => {},
  markRead: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold rooms/members/messages/theme/route/selectedRoomId/unread in state
  // (seed 3 members + 3 rooms + 5 messages, unread { r1:0, r2:2, r3:0 }), implement the
  // actions, and provide them through AppContext. The STUB below makes the app mount but
  // does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
