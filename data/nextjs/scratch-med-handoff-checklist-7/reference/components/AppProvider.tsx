'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { CheckItem, Route } from '../lib/types'

type Ctx = {
  items: CheckItem[]
  theme: 'light' | 'dark'
  showDone: boolean
  route: Route
  navigate: (r: Route) => void
  addItem: (title: string) => void
  toggleItem: (id: number) => void
  removeItem: (id: number) => void
  toggleTheme: () => void
  toggleShowDone: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: CheckItem[] = [
  { id: 1, title: 'Write documentation', done: false },
  { id: 2, title: 'Record demo video', done: false },
  { id: 3, title: 'Hand off credentials', done: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CheckItem[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showDone, setShowDone] = useState(true)
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

  function removeItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const value: Ctx = {
    items,
    theme,
    showDone,
    route,
    navigate: setRoute,
    addItem,
    toggleItem,
    removeItem,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleShowDone: () => setShowDone((s) => !s),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
