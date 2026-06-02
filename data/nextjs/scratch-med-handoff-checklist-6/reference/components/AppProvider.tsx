'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { CheckItem, Filter, Route } from '../lib/types'

type Ctx = {
  items: CheckItem[]
  filter: Filter
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (title: string) => void
  toggleItem: (id: number) => void
  deleteItem: (id: number) => void
  setFilter: (f: Filter) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: CheckItem[] = [
  { id: 1, title: 'Write README', done: false },
  { id: 2, title: 'Record demo video', done: false },
  { id: 3, title: 'Deploy to staging', done: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CheckItem[]>(SEED)
  const [filter, setFilter] = useState<Filter>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('checklist')
  const [nextId, setNextId] = useState(4)

  function addItem(title: string) {
    const t = title.trim()
    if (!t) return
    setItems((prev) => [...prev, { id: nextId, title: t, done: false }])
    setNextId((n) => n + 1)
  }

  function toggleItem(id: number) {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, done: !item.done } : item))
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
    toggleItem,
    deleteItem,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
