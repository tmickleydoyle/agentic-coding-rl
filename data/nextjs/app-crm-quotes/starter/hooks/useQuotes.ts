'use client'
import { useApp } from '../components/AppStateProvider'
import type { Quote, StatusFilter } from '../lib/types'

export function quoteTotal(_quote: Quote): number {
  // TODO: sum qty * price over the quote's items
  return 0
}

export function filterByStatus(_quotes: Quote[], _filter: StatusFilter): Quote[] {
  // TODO: 'all' => all; otherwise quotes whose status matches
  return []
}

export function useQuotes() {
  const { quotes, statusFilter } = useApp()
  const total = (quote: Quote): number => quoteTotal(quote)
  const visibleQuotes = filterByStatus(quotes, statusFilter)
  const acceptedTotal = 0
  return { total, visibleQuotes, acceptedTotal }
}
