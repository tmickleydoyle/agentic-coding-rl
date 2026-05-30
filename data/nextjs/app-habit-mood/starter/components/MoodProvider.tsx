'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { MoodEntry, Route, Theme } from '../lib/types'
import { TODAY } from '../lib/types'

type MoodApi = {
  entries: MoodEntry[]
  theme: Theme
  route: Route
  today: string
  logMood: (input: { date: string; score: number; triggers?: string[] }) => void
  removeEntry: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const MoodContext = createContext<MoodApi | null>(null)

const STUB: MoodApi = {
  entries: [],
  theme: 'light',
  route: 'today',
  today: TODAY,
  logMood: () => {},
  removeEntry: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function MoodProvider({ children }: { children: ReactNode }) {
  // TODO: hold entries/theme/route/today in state (seed 3 entries), implement logMood
  // (upsert by date, ids m4, …), removeEntry, and navigate. The STUB makes the app mount
  // but does nothing.
  return <MoodContext.Provider value={STUB}>{children}</MoodContext.Provider>
}

export function useMood(): MoodApi {
  const v = useContext(MoodContext)
  if (!v) throw new Error('useMood must be used within a MoodProvider')
  return v
}
