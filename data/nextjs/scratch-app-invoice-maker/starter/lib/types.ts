export interface Client { id: string; name: string; email: string }
export interface InvoiceItem { description: string; qty: number; unitPrice: number }
export interface Invoice { id: string; clientId: string; status: 'draft'|'sent'|'paid'; items: InvoiceItem[]; taxRate: number; createdAt: string }
export type Route = 'home' | 'invoices' | 'clients' | 'preview'
export function calcInvoice(invoice: Invoice): { subtotal: number; tax: number; total: number } {
  return { subtotal: 0, tax: 0, total: 0 }
}
