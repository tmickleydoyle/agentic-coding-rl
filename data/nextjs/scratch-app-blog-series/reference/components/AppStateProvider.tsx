'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Part, Route, Series, Theme } from '../lib/types'

type NewPartInput = {
  seriesId: string
  title: string
}

type AppApi = {
  series: Series[]
  parts: Part[]
  theme: Theme
  route: Route
  currentSeriesId: string | null
  addPart: (input: NewPartInput) => void
  markRead: (id: string) => void
  toggleRead: (id: string) => void
  selectSeries: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_SERIES: Series[] = [
  { id: 's1', title: 'Learning Rust', author: 'Ada' },
  { id: 's2', title: 'Async Patterns', author: 'Lin' },
]

const SEED_PARTS: Part[] = [
  { id: 'x1', seriesId: 's1', order: 1, title: 'Setup', read: true },
  { id: 'x2', seriesId: 's1', order: 2, title: 'Ownership', read: true },
  { id: 'x3', seriesId: 's1', order: 3, title: 'Lifetimes', read: false },
  { id: 'x4', seriesId: 's2', order: 1, title: 'Event loop', read: true },
  { id: 'x5', seriesId: 's2', order: 2, title: 'Promises', read: false },
  { id: 'x6', seriesId: 's2', order: 3, title: 'Async/await', read: false },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [series] = useState<Series[]>(SEED_SERIES)
  const [parts, setParts] = useState<Part[]>(SEED_PARTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('series')
  const [currentSeriesId, setCurrentSeriesId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(7)

  const value = useMemo<AppApi>(() => {
    const addPart = (input: NewPartInput) => {
      const id = `x${nextId}`
      setNextId((n) => n + 1)
      setParts((prev) => {
        const maxOrder = prev
          .filter((p) => p.seriesId === input.seriesId)
          .reduce((m, p) => (p.order > m ? p.order : m), 0)
        return [
          ...prev,
          {
            id,
            seriesId: input.seriesId,
            order: maxOrder + 1,
            title: input.title,
            read: false,
          },
        ]
      })
    }

    const markRead = (id: string) => {
      setParts((prev) => prev.map((p) => (p.id === id ? { ...p, read: true } : p)))
    }

    const toggleRead = (id: string) => {
      setParts((prev) => prev.map((p) => (p.id === id ? { ...p, read: !p.read } : p)))
    }

    const selectSeries = (id: string) => setCurrentSeriesId(id)
    const navigate = (next: Route) => setRoute(next)

    return {
      series,
      parts,
      theme,
      route,
      currentSeriesId,
      addPart,
      markRead,
      toggleRead,
      selectSeries,
      setTheme,
      navigate,
    }
  }, [series, parts, theme, route, currentSeriesId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
