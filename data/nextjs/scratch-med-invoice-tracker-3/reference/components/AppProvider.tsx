'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Invoice, Route } from '../lib/types'

type Ctx = {
  invoices: Invoice[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addInvoice: (client: string, amount: string) => void
  markPaid: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Invoice[] = [
  { id: 1, client: 'Acme Corp', amount: 500.0, paid: false },
  { id: 2, client: 'Globex', amount: 250.0, paid: true },
  { id: 3, client: 'Initech', amount: 750.0, paid: false },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('invoices')
  const [nextId, setNextId] = useState(4)

  function addInvoice(client: string, amount: string) {
    const c = client.trim()
    const a = parseFloat(amount)
    if (!c || isNaN(a) || a <= 0) return
    setInvoices((prev) => [...prev, { id: nextId, client: c, amount: a, paid: false }])
    setNextId((n) => n + 1)
  }

  function markPaid(id: number) {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, paid: true } : inv)))
  }

  const value: Ctx = {
    invoices,
    theme,
    route,
    navigate: setRoute,
    addInvoice,
    markPaid,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
