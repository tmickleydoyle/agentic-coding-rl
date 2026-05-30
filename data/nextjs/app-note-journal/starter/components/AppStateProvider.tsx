'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Entry, Mood, Route, Theme } from '../lib/types'

type NewEntryInput = { date?: string; body: string; mood: Mood }
type EntryPatch = { body?: string; mood?: Mood }

type AppApi = {
  entries: Entry[]
  theme: Theme
  route: Route
  moodFilter: Mood | 'all'
  addEntry: (input: NewEntryInput) => Entry
  updateEntry: (id: string, patch: EntryPatch) => void
  removeEntry: (id: string) => void
  setMoodFilter: (mood: Mood | 'all') => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  entries: [],
  theme: 'light',
  route: 'today',
  moodFilter: 'all',
  addEntry: () => ({ id: '', date: '', body: '', mood: 'neutral' }),
  updateEntry: () => {},
  removeEntry: () => {},
  setMoodFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold entries/theme/route/moodFilter in state (seed 3 entries), implement the
  // actions, and provide them through AppContext. Replace the STUB.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
