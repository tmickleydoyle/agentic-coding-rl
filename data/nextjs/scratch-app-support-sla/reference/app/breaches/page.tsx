'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSla } from '../../hooks/useSla'
import { remainingMinutes } from '../../lib/types'

export default function BreachesPage() {
  const { selectTicket } = useApp()
  const { breaches } = useSla()
  return (
    <section data-testid="page-breaches">
      <h1>Breaches</h1>
      {breaches.length === 0 ? (
        <p data-testid="no-breaches">No SLA breaches.</p>
      ) : (
        <ul data-testid="breach-list">
          {breaches.map((t) => (
            <li key={t.id} data-testid={`breach-${t.id}`} data-priority={t.priority}>
              <span data-testid={`breach-${t.id}-subject`}>{t.subject}</span>
              <span data-testid={`breach-${t.id}-remaining`}>{remainingMinutes(t)}</span>
              <button data-testid={`open-${t.id}`} onClick={() => selectTicket(t.id)}>
                Open
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
