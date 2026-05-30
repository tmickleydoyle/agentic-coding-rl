'use client'
import type { Quote } from '../lib/types'

export default function QuoteRow({
  quote,
  total,
  onOpen,
}: {
  quote: Quote
  total: number
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`quote-${quote.id}`} data-status={quote.status}>
      <span data-testid={`quote-${quote.id}-client`}>{quote.client}</span>
      <span data-testid={`quote-${quote.id}-status`}>{quote.status}</span>
      <span data-testid={`quote-${quote.id}-total`}>{total}</span>
      <button data-testid={`open-${quote.id}`} onClick={() => onOpen(quote.id)}>
        Open
      </button>
    </li>
  )
}
