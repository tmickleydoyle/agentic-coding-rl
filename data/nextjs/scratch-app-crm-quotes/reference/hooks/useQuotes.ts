'use client'
import { useApp } from '../components/AppStateProvider'
import type { Quote, StatusFilter } from '../lib/types'

export function quoteTotal(quote: Quote): number {
  return quote.items.reduce((sum, i) => sum + i.qty * i.price, 0)
}

export function filterByStatus(quotes: Quote[], filter: StatusFilter): Quote[] {
  if (filter === 'all') return quotes.slice()
  return quotes.filter((q) => q.status === filter)
}

export function useQuotes() {
  const { quotes, statusFilter } = useApp()
  const total = (quote: Quote): number => quoteTotal(quote)
  const visibleQuotes = filterByStatus(quotes, statusFilter)
  const acceptedTotal = quotes
    .filter((q) => q.status === 'accepted')
    .reduce((sum, q) => sum + quoteTotal(q), 0)
  return { total, visibleQuotes, acceptedTotal }
}
