import type { Client, Invoice, InvoiceStatus } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let invoices: Invoice[] = []
let clients: Client[] = []
let nextInvoiceId = 1
let nextClientId = 1

function seed(): void {
  clients = [
    { id: 'c1', name: 'Acme Co', email: 'billing@acme.test' },
    { id: 'c2', name: 'Globex', email: 'ap@globex.test' },
    { id: 'c3', name: 'Initech', email: 'finance@initech.test' },
  ]
  invoices = [
    { id: 'i1', clientId: 'c1', amount: 1200, status: 'sent', dueDate: '2026-06-15' },
    { id: 'i2', clientId: 'c2', amount: 800, status: 'paid', dueDate: '2026-05-01' },
    { id: 'i3', clientId: 'c3', amount: 450, status: 'overdue', dueDate: '2026-04-10' },
  ]
  nextInvoiceId = 4
  nextClientId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listInvoices(filter?: { status?: string | null; clientId?: string | null }): Invoice[] {
  let out = invoices.slice()
  const status = filter?.status
  if (status) out = out.filter((inv) => inv.status === status)
  const clientId = filter?.clientId
  if (clientId) out = out.filter((inv) => inv.clientId === clientId)
  return out
}

export function createInvoice(input: {
  clientId?: string
  amount: number
  dueDate?: string
  status?: InvoiceStatus
}): Invoice {
  const invoice: Invoice = {
    id: `i${nextInvoiceId++}`,
    clientId: input.clientId ?? 'c1',
    amount: input.amount,
    status: input.status ?? 'draft',
    dueDate: input.dueDate ?? '',
  }
  invoices.push(invoice)
  return invoice
}

export function findInvoice(id: string): Invoice | undefined {
  return invoices.find((inv) => inv.id === id)
}

export function updateInvoice(id: string, patch: { status?: InvoiceStatus }): Invoice | undefined {
  const invoice = invoices.find((inv) => inv.id === id)
  if (!invoice) return undefined
  if (patch.status) invoice.status = patch.status
  return invoice
}

export function deleteInvoice(id: string): boolean {
  const idx = invoices.findIndex((inv) => inv.id === id)
  if (idx === -1) return false
  invoices.splice(idx, 1)
  return true
}

export function listClients(): Client[] {
  return clients.slice()
}

export function createClient(input: { name: string; email?: string }): Client {
  const client: Client = { id: `c${nextClientId++}`, name: input.name, email: input.email ?? '' }
  clients.push(client)
  return client
}
