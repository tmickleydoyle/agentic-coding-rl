'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Invoice, Route } from '../lib/types'

type Ctx = {
  invoices: Invoice[]
  route: Route
  theme: 'light' | 'dark'
  showUnpaidOnly: boolean
  navigate: (r: Route) => void
  addInvoice: (client: string, amount: string) => void
  markPaid: (id: number) => void
  toggleShowUnpaidOnly: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [route, setRoute] = useState<Route>('invoices')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false)
  const [nextId, setNextId] = useState(1)

  function addInvoice(client: string, amount: string) {
    const c = client.trim()
    const a = parseFloat(amount)
    if (!c || isNaN(a) || a <= 0) return
    setInvoices((inv) => [...inv, { id: nextId, client: c, amount: a, status: 'unpaid' }])
    setNextId((n) => n + 1)
  }

  function markPaid(id: number) {
    setInvoices((inv) => inv.map((i) => (i.id === id ? { ...i, status: 'paid' } : i)))
  }

  const value: Ctx = {
    invoices,
    route,
    theme,
    showUnpaidOnly,
    navigate: setRoute,
    addInvoice,
    markPaid,
    toggleShowUnpaidOnly: () => setShowUnpaidOnly((s) => !s),
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
