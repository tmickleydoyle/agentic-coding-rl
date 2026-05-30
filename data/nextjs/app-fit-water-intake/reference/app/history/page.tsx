'use client'
import { useWater } from '../../components/WaterProvider'
import { useIntake } from '../../hooks/useIntake'

export default function HistoryPage() {
  const { goal } = useWater()
  const { totals } = useIntake()
  return (
    <section data-testid="page-history">
      <h1>History</h1>
      {totals.length === 0 ? (
        <p data-testid="empty-state">No history yet.</p>
      ) : (
        <ul data-testid="day-list">
          {totals.map((d) => (
            <li
              key={d.date}
              data-testid={`day-${d.date}`}
              data-met={d.total >= goal ? 'true' : 'false'}
            >
              <span data-testid={`day-${d.date}-date`}>{d.date}</span>
              <span data-testid={`day-${d.date}-total`}>{d.total}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
