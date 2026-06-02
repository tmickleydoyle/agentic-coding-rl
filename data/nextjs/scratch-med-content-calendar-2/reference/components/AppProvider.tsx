'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { ContentItem, Route, ItemStatus, Platform } from '../lib/types'

const STATUS_CYCLE: ItemStatus[] = ['draft', 'scheduled', 'published']

type Ctx = {
  items: ContentItem[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (title: string, platform: Platform, status: ItemStatus) => void
  deleteItem: (id: number) => void
  cycleStatus: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('content')
  const [nextId, setNextId] = useState(1)

  function addItem(title: string, platform: Platform, status: ItemStatus) {
    const t = title.trim()
    if (!t) return
    setItems((prev) => [...prev, { id: nextId, title: t, platform, status }])
    setNextId((n) => n + 1)
  }

  function deleteItem(id: number) {
    setItems((prev) => prev.filter((x) => x.id !== id))
  }

  function cycleStatus(id: number) {
    setItems((prev) =>
      prev.map((x) => {
        if (x.id !== id) return x
        const idx = STATUS_CYCLE.indexOf(x.status)
        const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
        return { ...x, status: next }
      }),
    )
  }

  const value: Ctx = {
    items,
    theme,
    route,
    navigate: setRoute,
    addItem,
    deleteItem,
    cycleStatus,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
