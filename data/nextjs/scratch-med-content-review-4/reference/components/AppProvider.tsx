'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { ReviewItem, Route, ItemStatus } from '../lib/types'

type Ctx = {
  items: ReviewItem[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (title: string, reviewer: string) => void
  setStatus: (id: number, status: ItemStatus) => void
  resetAll: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ReviewItem[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('reviews')
  const [nextId, setNextId] = useState(1)

  function addItem(title: string, reviewer: string) {
    const t = title.trim()
    const r = reviewer.trim()
    if (!t || !r) return
    setItems((prev) => [...prev, { id: nextId, title: t, reviewer: r, status: 'draft' }])
    setNextId((n) => n + 1)
  }

  function setStatus(id: number, status: ItemStatus) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  function resetAll() {
    setItems([])
  }

  const value: Ctx = {
    items,
    theme,
    route,
    navigate: setRoute,
    addItem,
    setStatus,
    resetAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
