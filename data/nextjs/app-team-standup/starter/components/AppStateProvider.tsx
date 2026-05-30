'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Entry, Member, Route, Theme } from '../lib/types'
import { TODAY } from '../lib/types'

type NewEntryInput = {
  memberId: string
  yesterday: string
  today: string
  blocker?: string | null
}

type AppApi = {
  members: Member[]
  entries: Entry[]
  theme: Theme
  route: Route
  selectedDate: string
  addEntry: (input: NewEntryInput) => void
  selectDate: (date: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  members: [],
  entries: [],
  theme: 'light',
  route: 'today',
  selectedDate: TODAY,
  addEntry: () => {},
  selectDate: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold members/entries/theme/route/selectedDate in state (seed 3 members + 3
  // entries), implement the actions, and provide them through AppContext. The STUB below
  // makes the app mount but does nothing.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
