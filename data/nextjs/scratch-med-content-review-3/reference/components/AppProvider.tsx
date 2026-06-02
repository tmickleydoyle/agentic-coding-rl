'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { ReviewItem, Route, ReviewStatus } from '../lib/types'

const SEED: ReviewItem[] = [
  { id: 1, title: 'Homepage copy', reviewer: 'Alice', status: 'draft' },
  { id: 2, title: 'Pricing page', reviewer: 'Bob', status: 'approved' },
  { id: 3, title: 'About us', reviewer: 'Alice', status: 'changes' },
]

type Ctx = {
  items: ReviewItem[]
  filter: ReviewStatus | 'all'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (title: string, reviewer: string) => void
  setStatus: (id: number, status: ReviewStatus) => void
  deleteItem: (id: number) => void
  setFilter: (f: ReviewStatus | 'all') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ReviewItem[]>(SEED)
  const [filter, setFilter] = useState<ReviewStatus | 'all'>('all')
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

  function deleteItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const value: Ctx = {
    items,
    filter,
    theme,
    route,
    navigate: setRoute,
    addItem,
    setStatus,
    deleteItem,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
