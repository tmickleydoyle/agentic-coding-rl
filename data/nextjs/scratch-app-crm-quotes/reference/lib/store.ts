import type { LineItem, Quote, Status } from './types'
import { STATUSES } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let quotes: Quote[] = []
let nextQuoteId = 1

function seed(): void {
  quotes = [
    {
      id: 'q1',
      client: 'Acme',
      status: 'sent',
      items: [
        { description: 'Widget', qty: 2, price: 50 },
        { description: 'Setup', qty: 1, price: 100 },
      ],
    },
    {
      id: 'q2',
      client: 'Globex',
      status: 'accepted',
      items: [{ description: 'License', qty: 3, price: 200 }],
    },
    {
      id: 'q3',
      client: 'Initech',
      status: 'draft',
      items: [
        { description: 'Audit', qty: 1, price: 500 },
        { description: 'Report', qty: 2, price: 75 },
      ],
    },
  ]
  nextQuoteId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function quoteTotal(items: LineItem[]): number {
  return items.reduce((sum, i) => sum + i.qty * i.price, 0)
}

export type QuoteWithTotal = Quote & { total: number }

function withTotal(q: Quote): QuoteWithTotal {
  return { ...q, total: quoteTotal(q.items) }
}

export function listQuotes(status?: string | null): QuoteWithTotal[] {
  let out = quotes.slice()
  if (status) out = out.filter((q) => q.status === status)
  return out.map(withTotal)
}

export function findQuote(id: string): QuoteWithTotal | undefined {
  const q = quotes.find((x) => x.id === id)
  return q ? withTotal(q) : undefined
}

export function createQuote(input: { client: string; items?: LineItem[] }): QuoteWithTotal {
  const quote: Quote = {
    id: `q${nextQuoteId++}`,
    client: input.client,
    status: 'draft',
    items: input.items ?? [],
  }
  quotes.push(quote)
  return withTotal(quote)
}

export function setQuoteStatus(id: string, status: Status): QuoteWithTotal | undefined {
  const quote = quotes.find((q) => q.id === id)
  if (!quote) return undefined
  quote.status = status
  return withTotal(quote)
}

export function isStatus(value: unknown): value is Status {
  return typeof value === 'string' && (STATUSES as string[]).includes(value)
}
