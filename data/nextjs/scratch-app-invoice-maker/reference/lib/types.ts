export interface Client {
  id: string
  name: string
  email: string
}

export interface InvoiceItem {
  description: string
  qty: number
  unitPrice: number
}

export interface Invoice {
  id: string
  clientId: string
  status: 'draft' | 'sent' | 'paid'
  items: InvoiceItem[]
  taxRate: number
  createdAt: string
}

export type Route = 'home' | 'invoices' | 'clients' | 'preview'

export function calcInvoice(invoice: Invoice): { subtotal: number; tax: number; total: number } {
  const subtotal = invoice.items.reduce((s, i) => s + i.qty * i.unitPrice, 0)
  const tax = subtotal * invoice.taxRate / 100
  return { subtotal, tax, total: subtotal + tax }
}
