'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Invoice, Route } from '../lib/types'

const SEED: Invoice[] = [
  { id: 1, client: 'Acme Corp', amount: 1500.00, paid: false },
  { id: 2, client: 'Globex', amount: 200.50, paid: true },
  { id: 3, client: 'Initech', amount: 750.00, paid: false },
]

type Ctx = {
  invoices: Invoice[]
  theme: 'light' | 'dark'
  showUnpaidOnly: boolean
  route: Route
  navigate: (r: Route) => void
  addInvoice: (client: string, amount: number) => void
  markPaid: (id: number) => void
  toggleShowUnpaidOnly: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false)
  const [route, setRoute] = useState<Route>('invoices')
  const [nextId, setNextId] = useState(4)

  function addInvoice(client: string, amount: number) {
    const c = client.trim()
    if (!c || !amount) return
    setInvoices((prev) => [...prev, { id: nextId, client: c, amount, paid: false }])
    setNextId((n) => n + 1)
  }

  function markPaid(id: number) {
    setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, paid: true } : inv))
  }

  const value: Ctx = {
    invoices,
    theme,
    showUnpaidOnly,
    route,
    navigate: setRoute,
    addInvoice,
    markPaid,
    toggleShowUnpaidOnly: () => setShowUnpaidOnly((s) => !s),
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
