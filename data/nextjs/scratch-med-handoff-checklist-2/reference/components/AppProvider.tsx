'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { CheckItem, Route } from '../lib/types'

type Ctx = {
  items: CheckItem[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (title: string) => void
  toggleItem: (id: number) => void
  removeItem: (id: number) => void
  clearCompleted: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: CheckItem[] = [
  { id: 1, title: 'Write README', done: false },
  { id: 2, title: 'Update API docs', done: false },
  { id: 3, title: 'Record demo video', done: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CheckItem[]>(SEED)
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
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)))
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  function clearCompleted() {
    setItems((prev) => prev.filter((it) => !it.done))
  }

  const value: Ctx = {
    items,
    theme,
    route,
    navigate: setRoute,
    addItem,
    toggleItem,
    removeItem,
    clearCompleted,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
