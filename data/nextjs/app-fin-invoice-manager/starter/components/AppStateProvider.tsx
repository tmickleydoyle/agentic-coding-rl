'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: AppApi = {
  invoices: [],
  clients: [],
  theme: 'light',
  route: 'dashboard',
  statusFilter: 'all',
  addInvoice: () => {},
  markPaid: () => {},
  setStatus: () => {},
  removeInvoice: () => {},
  setStatusFilter: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold invoices/clients/theme/route/filter in state (seed 3 clients + 3 invoices),
  // implement addInvoice/markPaid/setStatus/removeInvoice/navigate, and provide them through
  // AppContext. The STUB below makes the app mount but does nothing — replace it.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useInvoices(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useInvoices must be used within an AppStateProvider')
  return v
}
