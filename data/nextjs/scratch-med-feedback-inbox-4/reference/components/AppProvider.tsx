'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { FeedbackItem, Route, Theme } from '../lib/types'

type SortOrder = 'newest' | 'upvotes'

type Ctx = {
  items: FeedbackItem[]
  route: Route
  theme: 'light' | 'dark'
  sortOrder: SortOrder
  navigate: (r: Route) => void
  addItem: (note: string, theme: Theme) => void
  upvote: (id: number) => void
  setSortOrder: (s: SortOrder) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [route, setRoute] = useState<Route>('inbox')
  const [uiTheme, setUiTheme] = useState<'light' | 'dark'>('light')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [nextId, setNextId] = useState(1)

  function addItem(note: string, theme: Theme) {
    const n = note.trim()
    if (!n) return
    setItems((prev) => [...prev, { id: nextId, note: n, theme, upvotes: 0 }])
    setNextId((x) => x + 1)
  }

  function upvote(id: number) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item)),
    )
  }

  const value: Ctx = {
    items,
    route,
    theme: uiTheme,
    sortOrder,
    navigate: setRoute,
    addItem,
    upvote,
    setSortOrder,
    toggleTheme: () => setUiTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
