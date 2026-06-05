'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { LineItem, Quote, Route, Status, StatusFilter, Theme } from '../lib/types'

type NewQuoteInput = {
  client: string
  items: LineItem[]
}

type AppApi = {
  quotes: Quote[]
  theme: Theme
  route: Route
  currentQuoteId: string | null
  statusFilter: StatusFilter
  addQuote: (input: NewQuoteInput) => string
  setStatus: (id: string, status: Status) => void
  selectQuote: (id: string) => void
  setStatusFilter: (filter: StatusFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_QUOTES: Quote[] = [
  {
    id: 'q1',
    client: 'Acme',
    status: 'sent',
    items: [
      { description: 'Widget', qty: 2, price: 50 },
      { description: 'Setup', qty: 1, price: 100 },
    ],
  },
  {
    id: 'q2',
    client: 'Globex',
    status: 'accepted',
    items: [{ description: 'License', qty: 3, price: 200 }],
  },
  {
    id: 'q3',
    client: 'Initech',
    status: 'draft',
    items: [
      { description: 'Audit', qty: 1, price: 500 },
      { description: 'Report', qty: 2, price: 75 },
    ],
  },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>(SEED_QUOTES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('quotes')
  const [currentQuoteId, setCurrentQuoteId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addQuote = (input: NewQuoteInput): string => {
      const id = `q${nextId}`
      setNextId((n) => n + 1)
      setQuotes((prev) => [
        ...prev,
        { id, client: input.client, status: 'draft', items: input.items },
      ])
      return id
    }

    const setStatus = (id: string, status: Status) => {
      setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)))
    }

    const selectQuote = (id: string) => setCurrentQuoteId(id)
    const navigate = (next: Route) => setRoute(next)

    return {
      quotes,
      theme,
      route,
      currentQuoteId,
      statusFilter,
      addQuote,
      setStatus,
      selectQuote,
      setStatusFilter,
      setTheme,
      navigate,
    }
  }, [quotes, theme, route, currentQuoteId, statusFilter, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
