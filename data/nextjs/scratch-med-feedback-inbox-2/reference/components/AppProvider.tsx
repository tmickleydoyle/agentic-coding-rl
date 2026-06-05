'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { FeedbackItem, Route, Theme } from '../lib/types'

type Ctx = {
  items: FeedbackItem[]
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addFeedback: (note: string, theme: Theme) => void
  upvote: (id: number) => void
  sortByUpvotes: () => void
  toggleTheme: () => void
  clearAll: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: FeedbackItem[] = [
  { id: 1, note: 'Login page broken', theme: 'Bug', upvotes: 3 },
  { id: 2, note: 'Add dark mode', theme: 'Feature', upvotes: 5 },
  { id: 3, note: 'Button too small', theme: 'UX', upvotes: 1 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FeedbackItem[]>(SEED)
  const [route, setRoute] = useState<Route>('inbox')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(4)

  function addFeedback(note: string, feedbackTheme: Theme) {
    const n = note.trim()
    if (!n) return
    setItems((prev) => [...prev, { id: nextId, note: n, theme: feedbackTheme, upvotes: 0 }])
    setNextId((x) => x + 1)
  }

  function upvote(id: number) {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item))
  }

  function sortByUpvotes() {
    setItems((prev) => [...prev].sort((a, b) => b.upvotes - a.upvotes))
  }

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }

  function clearAll() {
    setItems([])
  }

  const value: Ctx = {
    items,
    route,
    theme,
    navigate: setRoute,
    addFeedback,
    upvote,
    sortByUpvotes,
    toggleTheme,
    clearAll,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
