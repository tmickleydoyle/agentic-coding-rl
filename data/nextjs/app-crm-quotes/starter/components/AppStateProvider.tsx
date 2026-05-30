'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: AppApi = {
  quotes: [],
  theme: 'light',
  route: 'quotes',
  currentQuoteId: null,
  statusFilter: 'all',
  addQuote: () => '',
  setStatus: () => {},
  selectQuote: () => {},
  setStatusFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold quotes/theme/route/currentQuoteId/statusFilter in state (seed 3 quotes),
  // implement the actions, and provide them through AppContext. The STUB below makes the
  // app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
