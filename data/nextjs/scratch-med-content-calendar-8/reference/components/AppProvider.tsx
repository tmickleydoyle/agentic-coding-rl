'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { ContentItem, Route, Platform, ContentStatus } from '../lib/types'

const SEED: ContentItem[] = [
  { id: 1, title: 'Launch post', platform: 'Twitter', status: 'published' },
  { id: 2, title: 'Product update', platform: 'LinkedIn', status: 'scheduled' },
  { id: 3, title: 'Behind the scenes', platform: 'Instagram', status: 'draft' },
]

type Ctx = {
  items: ContentItem[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (title: string, platform: Platform) => void
  setStatus: (id: number, status: ContentStatus) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ContentItem[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('calendar')
  const [nextId, setNextId] = useState(4)

  function addItem(title: string, platform: Platform) {
    const t = title.trim()
    if (!t) return
    setItems((prev) => [...prev, { id: nextId, title: t, platform, status: 'draft' }])
    setNextId((n) => n + 1)
  }

  function setStatus(id: number, status: ContentStatus) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  const value: Ctx = {
    items,
    theme,
    route,
    navigate: setRoute,
    addItem,
    setStatus,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
