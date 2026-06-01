'use client'
import { useApp } from '../../components/AppStateProvider'
import { useQuotes } from '../../hooks/useQuotes'
import QuoteRow from '../../components/QuoteRow'
import { STATUSES } from '../../lib/types'

export default function QuotesPage() {
  const { statusFilter, setStatusFilter, selectQuote, navigate } = useApp()
  const { total, visibleQuotes } = useQuotes()

  const open = (id: string) => {
    selectQuote(id)
    navigate('quote-detail')
  }

  return (
    <section data-testid="page-quotes">
      <h1>Quotes</h1>
      <label htmlFor="status-filter">Status</label>
      <select
        id="status-filter"
        data-testid="status-filter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
      >
        <option value="all">All</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {visibleQuotes.length === 0 ? (
        <p data-testid="empty-state">No quotes match this status.</p>
      ) : (
        <ul data-testid="quote-list">
          {visibleQuotes.map((q) => (
            <QuoteRow key={q.id} quote={q} total={total(q)} onOpen={open} />
          ))}
        </ul>
      )}
    </section>
  )
}
