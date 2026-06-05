'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Item, Route } from '../lib/types'

type Ctx = {
  items: Item[]
  hideDone: boolean
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addItem: (title: string) => void
  toggleItem: (id: number) => void
  toggleHideDone: () => void
  toggleTheme: () => void
  resetChecklist: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Item[] = [
  { id: 1, title: 'Write unit tests', done: false },
  { id: 2, title: 'Update README', done: false },
  { id: 3, title: 'Tag release', done: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(SEED)
  const [hideDone, setHideDone] = useState(false)
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

  const value: Ctx = {
    items,
    hideDone,
    theme,
    route,
    navigate: setRoute,
    addItem,
    toggleItem,
    toggleHideDone: () => setHideDone((s) => !s),
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    resetChecklist: () => setItems([]),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
