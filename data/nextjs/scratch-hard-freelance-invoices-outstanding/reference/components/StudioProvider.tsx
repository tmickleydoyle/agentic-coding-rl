'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Invoice } from '../lib/types'
import { SEED_CLIENTS } from '../lib/types'

type Ctx = {
  invoices: Invoice[]
  clients: string[]
  route: Route
  navigate: (r: Route) => void
  addInvoice: (label: string, client: string, amount: string, daysOld: string) => void
  markPaid: (id: number) => void
  addClient: (name: string) => void
}

export const StudioContext = createContext<Ctx | null>(null)

export function StudioProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<string[]>([...SEED_CLIENTS])
  const [route, setRoute] = useState<Route>('invoices')
  const [nextId, setNextId] = useState(1)

  function addInvoice(label: string, client: string, amount: string, daysOld: string) {
    const amt = parseFloat(amount)
    const trimmed = label.trim()
    if (!trimmed || !isFinite(amt) || amt <= 0) return
    const days = Math.max(0, Math.floor(parseFloat(daysOld) || 0))
    setInvoices((xs) => [
      ...xs,
      { id: nextId, label: trimmed, client, amount: amt, daysOld: days, paid: false },
    ])
    setNextId((n) => n + 1)
  }

  function markPaid(id: number) {
    setInvoices((xs) => xs.map((iv) => (iv.id === id ? { ...iv, paid: true } : iv)))
  }

  function addClient(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    setClients((cs) => [...cs, trimmed])
  }

  const value: Ctx = {
    invoices,
    clients,
    route,
    navigate: setRoute,
    addInvoice,
    markPaid,
    addClient,
  }
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
}
