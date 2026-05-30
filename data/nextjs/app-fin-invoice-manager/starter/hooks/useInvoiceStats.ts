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

export function computeStats(_invoices: Invoice[]): InvoiceStats {
  // TODO: compute total/outstanding/paid/overdue and per-status counts
  return { total: 0, outstanding: 0, paid: 0, overdue: 0, byStatus: { draft: 0, sent: 0, paid: 0, overdue: 0 } }
}

export function filterInvoices(_invoices: Invoice[], _statusFilter: StatusFilter): Invoice[] {
  // TODO: apply the status filter
  return []
}

export function outstandingForClient(_invoices: Invoice[], _clientId: string): number {
  // TODO: sum unpaid invoice amounts for a client
  return 0
}

export function useInvoiceStats() {
  const { invoices, statusFilter } = useInvoices()
  const stats = computeStats(invoices)
  const filtered = filterInvoices(invoices, statusFilter)
  return { stats, filtered }
}
