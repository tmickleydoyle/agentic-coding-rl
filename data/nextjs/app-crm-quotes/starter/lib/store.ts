import type { LineItem, Quote, Status } from './types'
import { STATUSES } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `quotes` and an id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export type QuoteWithTotal = Quote & { total: number }

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function quoteTotal(_items: LineItem[]): number {
  // TODO: sum qty * price over items
  return 0
}

export function listQuotes(_status?: string | null): QuoteWithTotal[] {
  // TODO: return quotes (each with a computed total), optionally filtered by status
  return []
}

export function findQuote(_id: string): QuoteWithTotal | undefined {
  // TODO: look up a quote by id (with total)
  return undefined
}

export function createQuote(_input: { client: string; items?: LineItem[] }): QuoteWithTotal {
  // TODO: append a new draft quote with a fresh id; return it with a total
  return { id: '', client: '', status: 'draft', items: [], total: 0 }
}

export function setQuoteStatus(_id: string, _status: Status): QuoteWithTotal | undefined {
  // TODO: set the status and return the updated quote (with total), or undefined if absent
  return undefined
}

export function isStatus(value: unknown): value is Status {
  return typeof value === 'string' && (STATUSES as string[]).includes(value)
}
