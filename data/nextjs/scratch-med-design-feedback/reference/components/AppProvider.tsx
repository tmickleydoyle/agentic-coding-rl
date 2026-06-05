'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { FeedbackItem, Route } from '../lib/types'

type Ctx = {
  items: FeedbackItem[]
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addItem: (note: string, screen: string) => void
  toggleStatus: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: FeedbackItem[] = [
  { id: 1, note: 'Button contrast too low', screen: 'Login', status: 'open' },
  { id: 2, note: 'Spacing inconsistent', screen: 'Dashboard', status: 'open' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FeedbackItem[]>(SEED)
  const [route, setRoute] = useState<Route>('feedback')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(3)

  function addItem(note: string, screen: string) {
    const n = note.trim()
    const s = screen.trim()
    if (!n || !s) return
    setItems((prev) => [...prev, { id: nextId, note: n, screen: s, status: 'open' }])
    setNextId((x) => x + 1)
  }

  function toggleStatus(id: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'open' ? 'addressed' : 'open' }
          : item,
      ),
    )
  }

  const value: Ctx = {
    items,
    route,
    theme,
    navigate: setRoute,
    addItem,
    toggleStatus,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
