'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { FeedbackItem, Route, Theme } from '../lib/types'

type SortOrder = 'newest' | 'upvoted'

type Ctx = {
  items: FeedbackItem[]
  sortOrder: SortOrder
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addFeedback: (note: string, feedbackTheme: Theme) => void
  upvote: (id: number) => void
  setSortOrder: (s: SortOrder) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('inbox')
  const [nextId, setNextId] = useState(1)

  function addFeedback(note: string, feedbackTheme: Theme) {
    const n = note.trim()
    if (!n) return
    setItems((prev) => [...prev, { id: nextId, note: n, theme: feedbackTheme, upvotes: 0 }])
    setNextId((x) => x + 1)
  }

  function upvote(id: number) {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item))
  }

  const value: Ctx = {
    items,
    sortOrder,
    theme,
    route,
    navigate: setRoute,
    addFeedback,
    upvote,
    setSortOrder,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
