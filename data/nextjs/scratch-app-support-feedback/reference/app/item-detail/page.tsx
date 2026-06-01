'use client'
import { useApp } from '../../components/AppStateProvider'
import type { FeedbackStatus } from '../../lib/types'

const STATUSES: FeedbackStatus[] = ['new', 'reviewed', 'resolved']

export default function ItemDetailPage() {
  const { items, selectedId, setStatus } = useApp()
  const item = items.find((f) => f.id === selectedId) ?? null
  if (!item) {
    return (
      <section data-testid="page-item-detail">
        <p data-testid="no-selection">No item selected.</p>
      </section>
    )
  }
  return (
    <section data-testid="page-item-detail">
      <h1 data-testid="detail-author">{item.author}</h1>
      <p data-testid="detail-message">{item.message}</p>
      <p data-testid="detail-category">{item.category}</p>
      <p data-testid="detail-sentiment">{item.sentiment}</p>
      <p data-testid="detail-status">{item.status}</p>
      <div data-testid="status-actions">
        {STATUSES.map((s) => (
          <button
            key={s}
            data-testid={`set-status-${s}`}
            aria-current={item.status === s ? 'true' : undefined}
            onClick={() => setStatus(item.id, s)}
          >
            {s}
          </button>
        ))}
      </div>
    </section>
  )
}
