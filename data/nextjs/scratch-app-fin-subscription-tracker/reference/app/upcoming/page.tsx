'use client'
import { useSubsSummary } from '../../hooks/useSubs'
import { daysUntil } from '../../hooks/useSubs'

export default function UpcomingPage() {
  const { upcoming } = useSubsSummary()
  return (
    <section data-testid="page-upcoming">
      <h1>Upcoming renewals</h1>
      {upcoming.length === 0 ? (
        <p data-testid="empty-upcoming">No renewals due soon.</p>
      ) : (
        <ul data-testid="upcoming-list">
          {upcoming.map((s) => (
            <li key={s.id} data-testid={`upcoming-${s.id}`}>
              <span data-testid={`upcoming-${s.id}-name`}>{s.name}</span>
              <span data-testid={`upcoming-${s.id}-renewal`}>{s.nextRenewal}</span>
              <span data-testid={`upcoming-${s.id}-days`}>{daysUntil(s.nextRenewal)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
