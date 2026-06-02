'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Invoice, Route } from '../lib/types'

type Ctx = {
  invoices: Invoice[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addInvoice: (client: string, amount: number) => void
  markPaid: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Invoice[] = [
  { id: 1, client: 'Acme Corp', amount: 1500.00, status: 'unpaid' },
  { id: 2, client: 'Globex', amount: 250.50, status: 'paid' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('invoices')
  const [nextId, setNextId] = useState(3)

  function addInvoice(client: string, amount: number) {
    const c = client.trim()
    if (!c || amount <= 0 || isNaN(amount)) return
    setInvoices((prev) => [...prev, { id: nextId, client: c, amount, status: 'unpaid' }])
    setNextId((n) => n + 1)
  }

  function markPaid(id: number) {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'paid' } : inv))
    )
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
