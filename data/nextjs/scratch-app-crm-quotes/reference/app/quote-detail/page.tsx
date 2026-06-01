'use client'
import { useApp } from '../../components/AppStateProvider'
import { useQuotes } from '../../hooks/useQuotes'
import { STATUSES } from '../../lib/types'

export default function QuoteDetailPage() {
  const { quotes, currentQuoteId, setStatus } = useApp()
  const { total } = useQuotes()
  const current = quotes.find((q) => q.id === currentQuoteId)
  if (!current) {
    return (
      <section data-testid="page-quote-detail">
        <p data-testid="no-quote">No quote selected.</p>
      </section>
    )
  }
  return (
    <section data-testid="page-quote-detail">
      <h1 data-testid="detail-client">{current.client}</h1>
      <p data-testid="detail-status">{current.status}</p>
      <p data-testid="detail-total">{total(current)}</p>
      <ul data-testid="item-list">
        {current.items.map((item, idx) => (
          <li key={idx} data-testid={`item-${idx}`}>
            <span data-testid={`item-${idx}-desc`}>{item.description}</span>
            <span data-testid={`item-${idx}-qty`}>{item.qty}</span>
            <span data-testid={`item-${idx}-price`}>{item.price}</span>
            <span data-testid={`item-${idx}-subtotal`}>{item.qty * item.price}</span>
          </li>
        ))}
      </ul>
      <div data-testid="status-actions">
        {STATUSES.map((s) => (
          <button
            key={s}
            data-testid={`set-${s}`}
            onClick={() => setStatus(current.id, s)}
          >
            {s}
          </button>
        ))}
      </div>
    </section>
  )
}
