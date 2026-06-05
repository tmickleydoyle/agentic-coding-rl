export type InvoiceStatus = 'paid' | 'unpaid'
export type Invoice = { id: number; client: string; amount: number; status: InvoiceStatus }
export type Route = 'invoices' | 'summary' | 'settings'
