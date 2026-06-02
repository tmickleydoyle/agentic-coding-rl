'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { FeedbackItem, Route, Theme } from '../lib/types'

type Ctx = {
  items: FeedbackItem[]
  route: Route
  uiTheme: 'light' | 'dark'
  navigate: (r: Route) => void
  addFeedback: (note: string, theme: Theme) => void
  upvote: (id: number) => void
  sortByUpvotes: () => void
  clearAll: () => void
  toggleUiTheme: () => void
}

export const FeedbackContext = createContext<Ctx | null>(null)

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [route, setRoute] = useState<Route>('inbox')
  const [uiTheme, setUiTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(1)

  function addFeedback(note: string, theme: Theme) {
    const n = note.trim()
    if (!n) return
    setItems((prev) => [...prev, { id: nextId, note: n, theme, upvotes: 0 }])
    setNextId((x) => x + 1)
  }

  function upvote(id: number) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item)),
    )
  }

  function sortByUpvotes() {
    setItems((prev) => [...prev].sort((a, b) => b.upvotes - a.upvotes))
  }

  function clearAll() {
    setItems([])
  }

  function toggleUiTheme() {
    setUiTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }

  const value: Ctx = {
    items,
    route,
    uiTheme,
    navigate: setRoute,
    addFeedback,
    upvote,
    sortByUpvotes,
    clearAll,
    toggleUiTheme,
  }

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>
}
