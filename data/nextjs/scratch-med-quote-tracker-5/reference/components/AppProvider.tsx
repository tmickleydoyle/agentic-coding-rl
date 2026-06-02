'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Quote, QuoteStatus, Route } from '../lib/types'

type Ctx = {
  quotes: Quote[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addQuote: (client: string, amount: string) => void
  markWon: (id: number) => void
  markLost: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('quotes')
  const [nextId, setNextId] = useState(1)

  function addQuote(client: string, amount: string) {
    const c = client.trim()
    const a = parseFloat(amount)
    if (!c || !amount.trim() || isNaN(a) || a <= 0) return
    setQuotes((q) => [...q, { id: nextId, client: c, amount: a, status: 'sent' }])
    setNextId((n) => n + 1)
  }

  function markWon(id: number) {
    setQuotes((q) => q.map((x) => (x.id === id ? { ...x, status: 'won' } : x)))
  }

  function markLost(id: number) {
    setQuotes((q) => q.map((x) => (x.id === id ? { ...x, status: 'lost' } : x)))
  }

  const value: Ctx = {
    quotes,
    theme,
    route,
    navigate: setRoute,
    addQuote,
    markWon,
    markLost,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
