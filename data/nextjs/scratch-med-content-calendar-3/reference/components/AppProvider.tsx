'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { ContentItem, Platform, Route, Status } from '../lib/types'

type Ctx = {
  items: ContentItem[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (title: string, platform: Platform, status: Status) => void
  deleteItem: (id: number) => void
  updateStatus: (id: number, status: Status) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('content')
  const [nextId, setNextId] = useState(1)

  function addItem(title: string, platform: Platform, status: Status) {
    const t = title.trim()
    if (!t) return
    setItems((prev) => [...prev, { id: nextId, title: t, platform, status }])
    setNextId((n) => n + 1)
  }

  function deleteItem(id: number) {
    setItems((prev) => prev.filter((x) => x.id !== id))
  }

  function updateStatus(id: number, status: Status) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)))
  }

  const value: Ctx = {
    items,
    theme,
    route,
    navigate: setRoute,
    addItem,
    deleteItem,
    updateStatus,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
