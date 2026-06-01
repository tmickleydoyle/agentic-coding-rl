'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Entry, Mood, Route, Theme } from '../lib/types'
import { TODAY } from '../lib/types'

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

const SEED_ENTRIES: Entry[] = [
  { id: 'e1', date: '2026-05-27', body: 'Shipped the build', mood: 'happy' },
  { id: 'e2', date: '2026-05-28', body: 'Quiet day', mood: 'neutral' },
  { id: 'e3', date: '2026-05-28', body: 'Long meetings', mood: 'sad' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>(SEED_ENTRIES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('today')
  const [moodFilter, setMoodFilter] = useState<Mood | 'all'>('all')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addEntry = (input: NewEntryInput): Entry => {
      const id = `e${nextId}`
      setNextId((n) => n + 1)
      const entry: Entry = {
        id,
        date: input.date && input.date.length > 0 ? input.date : TODAY,
        body: input.body,
        mood: input.mood,
      }
      setEntries((prev) => [...prev, entry])
      return entry
    }

    const updateEntry = (id: string, patch: EntryPatch) => {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, body: patch.body ?? e.body, mood: patch.mood ?? e.mood }
            : e,
        ),
      )
    }

    const removeEntry = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id))

    const navigate = (next: Route) => setRoute(next)

    return {
      entries,
      theme,
      route,
      moodFilter,
      addEntry,
      updateEntry,
      removeEntry,
      setMoodFilter,
      setTheme,
      navigate,
    }
  }, [entries, theme, route, moodFilter, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
