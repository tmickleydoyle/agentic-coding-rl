'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { FeedbackItem, Route } from '../lib/types'

type Ctx = {
  items: FeedbackItem[]
  route: Route
  theme: 'light' | 'dark'
  showOpenOnly: boolean
  navigate: (r: Route) => void
  addFeedback: (note: string, screen: string) => void
  markAddressed: (id: number) => void
  toggleTheme: () => void
  toggleShowOpenOnly: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [route, setRoute] = useState<Route>('feedback')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showOpenOnly, setShowOpenOnly] = useState(false)
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
      prev.map((item) => (item.id === id ? { ...item, status: 'addressed' } : item))
    )
  }

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }

  function toggleShowOpenOnly() {
    setShowOpenOnly((v) => !v)
  }

  const value: Ctx = {
    items,
    route,
    theme,
    showOpenOnly,
    navigate: setRoute,
    addFeedback,
    markAddressed,
    toggleTheme,
    toggleShowOpenOnly,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
