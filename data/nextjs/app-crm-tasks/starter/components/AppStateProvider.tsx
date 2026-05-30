'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Contact, FollowUp, Route, Theme } from '../lib/types'

type NewFollowUp = {
  title: string
  contactId: string
  dueDate: string
}

type AppApi = {
  contacts: Contact[]
  followups: FollowUp[]
  theme: Theme
  route: Route
  addFollowUp: (input: NewFollowUp) => void
  toggleFollowUp: (id: string) => void
  removeFollowUp: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  contacts: [],
  followups: [],
  theme: 'light',
  route: 'today',
  addFollowUp: () => {},
  toggleFollowUp: () => {},
  removeFollowUp: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold contacts/followups/theme/route in state (seed 3 contacts + 4 follow-ups),
  // implement the actions, and provide them through AppContext. The STUB below makes the
  // app mount but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
