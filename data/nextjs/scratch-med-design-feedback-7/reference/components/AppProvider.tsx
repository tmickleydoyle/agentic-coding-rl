'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { FeedbackItem, Route } from '../lib/types'

type Ctx = {
  items: FeedbackItem[]
  theme: 'light' | 'dark'
  showOpenOnly: boolean
  route: Route
  navigate: (r: Route) => void
  addFeedback: (note: string, screen: string) => void
  markAddressed: (id: number) => void
  toggleShowOpenOnly: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showOpenOnly, setShowOpenOnly] = useState(false)
  const [route, setRoute] = useState<Route>('feedback')
  const [nextId, setNextId] = useState(1)

  function addFeedback(note: string, screen: string) {
    const n = note.trim()
    const s = screen.trim()
    if (!n || !s) return
    setItems((prev) => [...prev, { id: nextId, note: n, screen: s, status: 'open' }])
    setNextId((id) => id + 1)
  }

  function markAddressed(id: number) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'addressed' } : item)),
    )
  }

  const value: Ctx = {
    items,
    theme,
    showOpenOnly,
    route,
    navigate: setRoute,
    addFeedback,
    markAddressed,
    toggleShowOpenOnly: () => setShowOpenOnly((v) => !v),
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
