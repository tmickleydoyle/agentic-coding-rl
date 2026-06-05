'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Quote, QuoteStatus, Route } from '../lib/types'

type Ctx = {
  quotes: Quote[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addQuote: (client: string, amount: number, status: QuoteStatus) => void
  deleteQuote: (id: number) => void
  updateStatus: (id: number, status: QuoteStatus) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('quotes')
  const [nextId, setNextId] = useState(1)

  function addQuote(client: string, amount: number, status: QuoteStatus) {
    const c = client.trim()
    if (!c || !(amount > 0)) return
    setQuotes((q) => [...q, { id: nextId, client: c, amount, status }])
    setNextId((n) => n + 1)
  }

  function deleteQuote(id: number) {
    setQuotes((q) => q.filter((x) => x.id !== id))
  }

  function updateStatus(id: number, status: QuoteStatus) {
    setQuotes((q) => q.map((x) => (x.id === id ? { ...x, status } : x)))
  }

  const value: Ctx = {
    quotes,
    theme,
    route,
    navigate: setRoute,
    addQuote,
    deleteQuote,
    updateStatus,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
