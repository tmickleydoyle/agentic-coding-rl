'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { ReviewItem, ReviewStatus, Route } from '../lib/types'

const SEED: ReviewItem[] = [
  { id: 1, title: 'Homepage copy', reviewer: 'Alice', status: 'approved' },
  { id: 2, title: 'Blog post', reviewer: 'Bob', status: 'draft' },
  { id: 3, title: 'Landing page', reviewer: 'Alice', status: 'changes' },
]

type Ctx = {
  items: ReviewItem[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (title: string, reviewer: string) => void
  setStatus: (id: number, status: ReviewStatus) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ReviewItem[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('reviews')
  const [nextId, setNextId] = useState(4)

  function addItem(title: string, reviewer: string) {
    const t = title.trim()
    const r = reviewer.trim()
    if (!t || !r) return
    setItems((prev) => [...prev, { id: nextId, title: t, reviewer: r, status: 'draft' }])
    setNextId((n) => n + 1)
  }

  function setStatus(id: number, status: ReviewStatus) {
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
