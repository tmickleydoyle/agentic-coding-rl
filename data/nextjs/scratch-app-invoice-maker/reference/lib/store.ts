import { Client, Invoice } from './types'

const SEED_CLIENTS: Client[] = [
  { id: 'c1', name: 'Acme Corp', email: 'billing@acme.com' },
  { id: 'c2', name: 'Globex Inc', email: 'pay@globex.com' },
]

const SEED_INVOICES: Invoice[] = [
  { id: 'i1', clientId: 'c1', status: 'paid', items: [{ description: 'Web Design', qty: 1, unitPrice: 5000 }, { description: 'Hosting', qty: 12, unitPrice: 50 }], taxRate: 10, createdAt: '2026-01-15' },
  { id: 'i2', clientId: 'c2', status: 'sent', items: [{ description: 'Consulting', qty: 8, unitPrice: 150 }], taxRate: 8, createdAt: '2026-02-01' },
  { id: 'i3', clientId: 'c1', status: 'draft', items: [{ description: 'Logo Design', qty: 1, unitPrice: 800 }], taxRate: 10, createdAt: '2026-03-01' },
]

let clients: Client[] = SEED_CLIENTS.map(c => ({ ...c }))
let invoices: Invoice[] = SEED_INVOICES.map(i => ({ ...i, items: i.items.map(it => ({ ...it })) }))

export function getClients(): Client[] { return [...clients] }
export function addClient(data: Omit<Client, 'id'>): Client {
  const c: Client = { id: `c${Date.now()}`, ...data }
  clients.push(c)
  return c
}

export function getInvoices(): Invoice[] { return [...invoices] }
export function addInvoice(data: Omit<Invoice, 'id'>): Invoice {
  const i: Invoice = { id: `i${Date.now()}`, ...data }
  invoices.push(i)
  return i
}

export function __reset(): void {
  clients = SEED_CLIENTS.map(c => ({ ...c }))
  invoices = SEED_INVOICES.map(i => ({ ...i, items: i.items.map(it => ({ ...it })) }))
}
