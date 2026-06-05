'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Item, Quarter, Route, Status } from '../lib/types'

const SEED: Item[] = [
  { id: 1, title: 'Launch billing', quarter: 'Q1', status: 'shipped' },
  { id: 2, title: 'API v2', quarter: 'Q2', status: 'in-progress' },
  { id: 3, title: 'Mobile app', quarter: 'Q3', status: 'planned' },
]

type Ctx = {
  items: Item[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (title: string, quarter: Quarter) => void
  markInProgress: (id: number) => void
  markShipped: (id: number) => void
  deleteItem: (id: number) => void
  resetItems: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('roadmap')
  const [nextId, setNextId] = useState(4)

  function addItem(title: string, quarter: Quarter) {
    const t = title.trim()
    if (!t) return
    setItems((prev) => [...prev, { id: nextId, title: t, quarter, status: 'planned' }])
    setNextId((n) => n + 1)
  }

  function markInProgress(id: number) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'in-progress' } : item))
    )
  }

  function markShipped(id: number) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'shipped' } : item))
    )
  }

  function deleteItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function resetItems() {
    setItems([])
  }

  const value: Ctx = {
    items,
    theme,
    route,
    navigate: setRoute,
    addItem,
    markInProgress,
    markShipped,
    deleteItem,
    resetItems,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
