'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { FeedbackEntry, Route, Theme } from '../lib/types'

type SortOrder = 'newest' | 'upvotes'

type Ctx = {
  entries: FeedbackEntry[]
  sort: SortOrder
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addEntry: (note: string, theme: Theme) => void
  upvote: (id: number) => void
  deleteEntry: (id: number) => void
  setSort: (s: SortOrder) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: FeedbackEntry[] = [
  { id: 1, note: 'Login page is broken', theme: 'Bug', upvotes: 5 },
  { id: 2, note: 'Add dark mode', theme: 'Feature', upvotes: 3 },
  { id: 3, note: 'Button too small', theme: 'UX', upvotes: 7 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<FeedbackEntry[]>(SEED)
  const [sort, setSort] = useState<SortOrder>('newest')
  const [route, setRoute] = useState<Route>('inbox')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(4)

  function addEntry(note: string, entryTheme: Theme) {
    const t = note.trim()
    if (!t) return
    setEntries((prev) => [...prev, { id: nextId, note: t, theme: entryTheme, upvotes: 0 }])
    setNextId((n) => n + 1)
  }

  function upvote(id: number) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, upvotes: e.upvotes + 1 } : e)))
  }

  function deleteEntry(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const value: Ctx = {
    entries,
    sort,
    route,
    theme,
    navigate: setRoute,
    addEntry,
    upvote,
    deleteEntry,
    setSort,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
