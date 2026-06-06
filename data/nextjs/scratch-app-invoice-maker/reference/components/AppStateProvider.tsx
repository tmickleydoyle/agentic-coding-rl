'use client'
import React, { createContext, useContext, useState } from 'react'
import { Client, Invoice, Route } from '../lib/types'

interface AppState {
  route: Route
  clients: Client[]
  invoices: Invoice[]
  navigate: (r: Route) => void
  setClients: (c: Client[]) => void
  setInvoices: (i: Invoice[]) => void
}

const AppContext = createContext<AppState>({
  route: 'home', clients: [], invoices: [],
  navigate: () => {}, setClients: () => {}, setInvoices: () => {},
})

export function useApp() { return useContext(AppContext) }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home')
  const [clients, setClients] = useState<Client[]>([
    { id: 'c1', name: 'Acme Corp', email: 'billing@acme.com' },
    { id: 'c2', name: 'Globex Inc', email: 'pay@globex.com' },
  ])
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'i1', clientId: 'c1', status: 'paid', items: [{ description: 'Web Design', qty: 1, unitPrice: 5000 }, { description: 'Hosting', qty: 12, unitPrice: 50 }], taxRate: 10, createdAt: '2026-01-15' },
    { id: 'i2', clientId: 'c2', status: 'sent', items: [{ description: 'Consulting', qty: 8, unitPrice: 150 }], taxRate: 8, createdAt: '2026-02-01' },
    { id: 'i3', clientId: 'c1', status: 'draft', items: [{ description: 'Logo Design', qty: 1, unitPrice: 800 }], taxRate: 10, createdAt: '2026-03-01' },
  ])

  return (
    <AppContext.Provider value={{ route, clients, invoices, navigate: setRoute, setClients, setInvoices }}>
      {children}
    </AppContext.Provider>
  )
}
