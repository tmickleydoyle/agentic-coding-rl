'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { FeedbackItem, Route } from '../lib/types'

type Ctx = {
  items: FeedbackItem[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (note: string, screen: string) => void
  toggleStatus: (id: number) => void
  deleteItem: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('feedback')
  const [nextId, setNextId] = useState(1)

  function addItem(note: string, screen: string) {
    const n = note.trim()
    const s = screen.trim()
    if (!n || !s) return
    setItems((prev) => [...prev, { id: nextId, note: n, screen: s, status: 'open' }])
    setNextId((id) => id + 1)
  }

  function toggleStatus(id: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'open' ? 'addressed' : 'open' }
          : item
      )
    )
  }

  function deleteItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const value: Ctx = {
    items,
    theme,
    route,
    navigate: setRoute,
    addItem,
    toggleStatus,
    deleteItem,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
