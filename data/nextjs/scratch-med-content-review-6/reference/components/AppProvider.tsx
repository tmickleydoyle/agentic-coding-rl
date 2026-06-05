'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { ReviewItem, Route, ReviewStatus } from '../lib/types'

const STATUS_ORDER: ReviewStatus[] = ['draft', 'approved', 'changes']

type Ctx = {
  items: ReviewItem[]
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addItem: (title: string, reviewer: string) => void
  advanceStatus: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ReviewItem[]>([])
  const [route, setRoute] = useState<Route>('reviews')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(1)

  function addItem(title: string, reviewer: string) {
    const t = title.trim()
    const r = reviewer.trim()
    if (!t || !r) return
    setItems((prev) => [...prev, { id: nextId, title: t, reviewer: r, status: 'draft' }])
    setNextId((n) => n + 1)
  }

  function advanceStatus(id: number) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const idx = STATUS_ORDER.indexOf(item.status)
        const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length]
        return { ...item, status: next }
      }),
    )
  }

  const value: Ctx = {
    items,
    route,
    theme,
    navigate: setRoute,
    addItem,
    advanceStatus,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
