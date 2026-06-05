'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Item, Route } from '../lib/types'

type Ctx = {
  items: Item[]
  theme: 'light' | 'dark'
  showOnlyRemaining: boolean
  route: Route
  navigate: (r: Route) => void
  addItem: (title: string) => void
  toggleItem: (id: number) => void
  clearDone: () => void
  toggleTheme: () => void
  toggleShowOnlyRemaining: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Item[] = [
  { id: 1, title: 'Write README', done: false },
  { id: 2, title: 'Record demo video', done: false },
  { id: 3, title: 'Update staging env', done: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showOnlyRemaining, setShowOnlyRemaining] = useState(false)
  const [route, setRoute] = useState<Route>('checklist')
  const [nextId, setNextId] = useState(4)

  function addItem(title: string) {
    const t = title.trim()
    if (!t) return
    setItems((prev) => [...prev, { id: nextId, title: t, done: false }])
    setNextId((n) => n + 1)
  }

  function toggleItem(id: number) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)))
  }

  function clearDone() {
    setItems((prev) => prev.filter((it) => !it.done))
  }

  const value: Ctx = {
    items,
    theme,
    showOnlyRemaining,
    route,
    navigate: setRoute,
    addItem,
    toggleItem,
    clearDone,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleShowOnlyRemaining: () => setShowOnlyRemaining((s) => !s),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
