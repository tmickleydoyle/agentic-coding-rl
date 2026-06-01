'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Client, Invoice, InvoiceStatus, Route, StatusFilter, Theme } from '../lib/types'

type NewInvoiceInput = {
  clientId: string
  amount: number
  dueDate: string
  status?: InvoiceStatus
}

type AppApi = {
  invoices: Invoice[]
  clients: Client[]
  theme: Theme
  route: Route
  statusFilter: StatusFilter
  addInvoice: (input: NewInvoiceInput) => void
  markPaid: (id: string) => void
  setStatus: (id: string, status: InvoiceStatus) => void
  removeInvoice: (id: string) => void
  setStatusFilter: (filter: StatusFilter) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_CLIENTS: Client[] = [
  { id: 'c1', name: 'Acme Co', email: 'billing@acme.test' },
  { id: 'c2', name: 'Globex', email: 'ap@globex.test' },
  { id: 'c3', name: 'Initech', email: 'finance@initech.test' },
]

const SEED_INVOICES: Invoice[] = [
  { id: 'i1', clientId: 'c1', amount: 1200, status: 'sent', dueDate: '2026-06-15' },
  { id: 'i2', clientId: 'c2', amount: 800, status: 'paid', dueDate: '2026-05-01' },
  { id: 'i3', clientId: 'c3', amount: 450, status: 'overdue', dueDate: '2026-04-10' },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(SEED_INVOICES)
  const [clients] = useState<Client[]>(SEED_CLIENTS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('dashboard')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const addInvoice = (input: NewInvoiceInput) => {
      const id = `i${nextId}`
      setNextId((n) => n + 1)
      setInvoices((prev) => [
        ...prev,
        {
          id,
          clientId: input.clientId,
          amount: input.amount,
          status: input.status ?? 'draft',
          dueDate: input.dueDate,
        },
      ])
    }

    const markPaid = (id: string) => {
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: 'paid' } : inv)))
    }

    const setStatus = (id: string, status: InvoiceStatus) => {
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)))
    }

    const removeInvoice = (id: string) => {
      setInvoices((prev) => prev.filter((inv) => inv.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      invoices,
      clients,
      theme,
      route,
      statusFilter,
      addInvoice,
      markPaid,
      setStatus,
      removeInvoice,
      setStatusFilter,
      setTheme,
      navigate,
    }
  }, [invoices, clients, theme, route, statusFilter, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useInvoices(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useInvoices must be used within an AppStateProvider')
  return v
}
