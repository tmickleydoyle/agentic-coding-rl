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
  markPublished: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('calendar')
  const [nextId, setNextId] = useState(1)

  function addItem(title: string, platform: Platform, status: Status) {
    const t = title.trim()
    if (!t) return
    setItems((prev) => [...prev, { id: nextId, title: t, platform, status }])
    setNextId((n) => n + 1)
  }

  function deleteItem(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function markPublished(id: number) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Published' } : i))
    )
  }

  const value: Ctx = {
    items,
    theme,
    route,
    navigate: setRoute,
    addItem,
    deleteItem,
    markPublished,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
