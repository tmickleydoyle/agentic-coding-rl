'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { ChecklistItem, Route } from '../lib/types'

type Ctx = {
  items: ChecklistItem[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (title: string) => void
  toggleItem: (id: number) => void
  deleteItem: (id: number) => void
  clearAll: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: ChecklistItem[] = [
  { id: 1, title: 'Write release notes', done: false },
  { id: 2, title: 'Update README', done: false },
  { id: 3, title: 'Tag the release', done: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ChecklistItem[]>(SEED)
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

  function clearAll() {
    setItems([])
  }

  const value: Ctx = {
    items,
    theme,
    route,
    navigate: setRoute,
    addItem,
    toggleItem,
    deleteItem,
    clearAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
