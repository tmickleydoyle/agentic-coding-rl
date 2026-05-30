'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Group, Person, Route, Theme } from '../lib/types'

type AppApi = {
  people: Person[]
  groups: Group[]
  theme: Theme
  route: Route
  currentUserId: string
  selectedGroupId: string | null
  openGroup: (groupId: string) => void
  addMember: (groupId: string, personId: string) => void
  removeMember: (groupId: string, personId: string) => void
  leaveGroup: (groupId: string) => void
  createGroup: (name: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  people: [],
  groups: [],
  theme: 'light',
  route: 'chats',
  currentUserId: 'u1',
  selectedGroupId: null,
  openGroup: () => {},
  addMember: () => {},
  removeMember: () => {},
  leaveGroup: () => {},
  createGroup: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold people/groups/theme/route/selectedGroupId in state (seed 4 people + 3
  // groups), implement the actions, and provide them through AppContext. The STUB below
  // makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
