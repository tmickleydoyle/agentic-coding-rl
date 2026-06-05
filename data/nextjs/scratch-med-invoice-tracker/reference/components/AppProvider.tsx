'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Invoice, Route } from '../lib/types'

type Filter = 'all' | 'unpaid' | 'paid'

type Ctx = {
  invoices: Invoice[]
  filter: Filter
  route: Route
  theme: 'light' | 'dark'
  navigate: (r: Route) => void
  addInvoice: (client: string, amount: number) => void
  markPaid: (id: number) => void
  setFilter: (f: Filter) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Invoice[] = [
  { id: 1, client: 'Acme Corp', amount: 1200.00, paid: false },
  { id: 2, client: 'Bright Ideas', amount: 450.50, paid: true },
  { id: 3, client: 'Cloud Nine', amount: 875.00, paid: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(SEED)
  const [filter, setFilter] = useState<Filter>('all')
  const [route, setRoute] = useState<Route>('invoices')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [nextId, setNextId] = useState(4)

  function addInvoice(client: string, amount: number) {
    const c = client.trim()
    if (!c || amount <= 0 || isNaN(amount)) return
    setInvoices((inv) => [...inv, { id: nextId, client: c, amount, paid: false }])
    setNextId((n) => n + 1)
  }

  function markPaid(id: number) {
    setInvoices((inv) => inv.map((i) => i.id === id ? { ...i, paid: true } : i))
  }

  const value: Ctx = {
    invoices,
    filter,
    route,
    theme,
    navigate: setRoute,
    addInvoice,
    markPaid,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
