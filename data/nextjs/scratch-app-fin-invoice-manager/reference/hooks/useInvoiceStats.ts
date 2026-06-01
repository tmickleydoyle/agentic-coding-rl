'use client'
import { useInvoices } from '../components/AppStateProvider'
import type { Invoice, InvoiceStatus, StatusFilter } from '../lib/types'

export type InvoiceStats = {
  total: number
  outstanding: number
  paid: number
  overdue: number
  byStatus: Record<InvoiceStatus, number>
}

export function computeStats(invoices: Invoice[]): InvoiceStats {
  const byStatus: Record<InvoiceStatus, number> = { draft: 0, sent: 0, paid: 0, overdue: 0 }
  let outstanding = 0
  let paid = 0
  let overdue = 0
  invoices.forEach((inv) => {
    byStatus[inv.status] += 1
    if (inv.status === 'paid') paid += inv.amount
    else outstanding += inv.amount
    if (inv.status === 'overdue') overdue += 1
  })
  return { total: invoices.length, outstanding, paid, overdue, byStatus }
}

export function filterInvoices(invoices: Invoice[], statusFilter: StatusFilter): Invoice[] {
  return invoices.filter((inv) => statusFilter === 'all' || inv.status === statusFilter)
}

export function outstandingForClient(invoices: Invoice[], clientId: string): number {
  return invoices
    .filter((inv) => inv.clientId === clientId && inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0)
}

export function useInvoiceStats() {
  const { invoices, statusFilter } = useInvoices()
  const stats = computeStats(invoices)
  const filtered = filterInvoices(invoices, statusFilter)
  return { stats, filtered }
}
