import type { Client, Invoice, InvoiceStatus } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `invoices`, `clients`, and id counters; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listInvoices(_filter?: { status?: string | null; clientId?: string | null }): Invoice[] {
  // TODO: return invoices, applying optional status + clientId filters
  return []
}

export function createInvoice(_input: {
  clientId?: string
  amount: number
  dueDate?: string
  status?: InvoiceStatus
}): Invoice {
  // TODO: append a new invoice with a fresh id and return it
  return { id: '', clientId: '', amount: 0, status: 'draft', dueDate: '' }
}

export function findInvoice(_id: string): Invoice | undefined {
  // TODO: look up an invoice by id
  return undefined
}

export function updateInvoice(_id: string, _patch: { status?: InvoiceStatus }): Invoice | undefined {
  // TODO: apply the patch and return the updated invoice, or undefined if absent
  return undefined
}

export function deleteInvoice(_id: string): boolean {
  // TODO: remove the invoice; return whether it existed
  return false
}

export function listClients(): Client[] {
  // TODO: return all clients
  return []
}

export function createClient(_input: { name: string; email?: string }): Client {
  // TODO: append a new client with a fresh id and return it
  return { id: '', name: '', email: '' }
}
