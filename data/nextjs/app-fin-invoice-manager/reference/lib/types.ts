export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'

export type Invoice = {
  id: string
  clientId: string
  amount: number
  status: InvoiceStatus
  dueDate: string
}

export type Client = {
  id: string
  name: string
  email: string
}

export type StatusFilter = 'all' | InvoiceStatus

export type Route = 'dashboard' | 'invoices' | 'clients' | 'new-invoice'
export type Theme = 'light' | 'dark'

export const STATUSES: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue']
