'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Invoice, Route } from '../lib/types'

type Ctx = {
  invoices: Invoice[]
  theme: 'light' | 'dark'
  route: Route
  showUnpaidOnly: boolean
  navigate: (r: Route) => void
  addInvoice: (client: string, amount: number) => void
  markPaid: (id: number) => void
  toggleShowUnpaidOnly: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('invoices')
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false)
  const [nextId, setNextId] = useState(1)

  function addInvoice(client: string, amount: number) {
    const c = client.trim()
    if (!c || !(amount > 0)) return
    setInvoices((prev) => [...prev, { id: nextId, client: c, amount, paid: false }])
    setNextId((n) => n + 1)
  }

  function markPaid(id: number) {
    setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, paid: true } : inv))
  }

  const value: Ctx = {
    invoices,
    theme,
    route,
    showUnpaidOnly,
    navigate: setRoute,
    addInvoice,
    markPaid,
    toggleShowUnpaidOnly: () => setShowUnpaidOnly((s) => !s),
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
