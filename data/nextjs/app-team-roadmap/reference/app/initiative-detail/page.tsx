'use client'
import { useApp } from '../../components/AppStateProvider'
import type { Status } from '../../lib/types'

const STATUSES: Status[] = ['planned', 'in-progress', 'done']

export default function InitiativeDetailPage() {
  const { initiatives, quarters, selectedId, setStatus, moveInitiative } = useApp()
  const initiative = initiatives.find((i) => i.id === selectedId)

  if (!initiative) {
    return (
      <section data-testid="page-initiative-detail">
        <p data-testid="no-initiative">No initiative selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-initiative-detail">
      <h1 data-testid="detail-title">{initiative.title}</h1>
      <span data-testid="detail-status">{initiative.status}</span>
      <select
        data-testid="status-select"
        value={initiative.status}
        onChange={(e) => setStatus(initiative.id, e.target.value as Status)}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        data-testid="quarter-select"
        value={initiative.quarterId}
        onChange={(e) => moveInitiative(initiative.id, e.target.value)}
      >
        {quarters.map((q) => (
          <option key={q.id} value={q.id}>
            {q.label}
          </option>
        ))}
      </select>
    </section>
  )
}
