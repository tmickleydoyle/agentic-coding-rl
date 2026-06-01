'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Feedback, FeedbackStatus, Route, Sentiment, Theme } from '../lib/types'

type NewFeedbackInput = {
  author: string
  message: string
  category?: string
  sentiment?: Sentiment
}

type AppApi = {
  items: Feedback[]
  theme: Theme
  route: Route
  categoryFilter: string
  selectedId: string | null
  addFeedback: (input: NewFeedbackInput) => void
  setStatus: (id: string, status: FeedbackStatus) => void
  setCategoryFilter: (c: string) => void
  selectItem: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_ITEMS: Feedback[] = [
  { id: 'f1', author: 'Sam', message: 'Love the new dashboard', category: 'UI', sentiment: 'positive', status: 'new' },
  { id: 'f2', author: 'Rae', message: 'Export keeps failing', category: 'Bug', sentiment: 'negative', status: 'new' },
  { id: 'f3', author: 'Lou', message: 'Please add dark mode', category: 'Feature', sentiment: 'neutral', status: 'reviewed' },
  { id: 'f4', author: 'Kit', message: 'Search is much faster', category: 'UI', sentiment: 'positive', status: 'resolved' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Feedback[]>(SEED_ITEMS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('inbox')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(5)

  const value = useMemo<AppApi>(() => {
    const addFeedback = (input: NewFeedbackInput) => {
      const id = `f${nextId}`
      setNextId((n) => n + 1)
      setItems((prev) => [
        ...prev,
        {
          id,
          author: input.author,
          message: input.message,
          category: input.category ?? 'General',
          sentiment: input.sentiment ?? 'neutral',
          status: 'new',
        },
      ])
    }
    const setStatus = (id: string, status: FeedbackStatus) => {
      setItems((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)))
    }
    const navigate = (next: Route) => setRoute(next)
    const selectItem = (id: string) => {
      setSelectedId(id)
      setRoute('item-detail')
    }
    return {
      items,
      theme,
      route,
      categoryFilter,
      selectedId,
      addFeedback,
      setStatus,
      setCategoryFilter,
      selectItem,
      setTheme,
      navigate,
    }
  }, [items, theme, route, categoryFilter, selectedId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
