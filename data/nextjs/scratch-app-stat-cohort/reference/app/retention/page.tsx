'use client'
import { useApp } from '../../components/AppStateProvider'
import { retainedUsers } from '../../hooks/useCohorts'
import { PERIODS } from '../../lib/types'

export default function RetentionPage() {
  const { cohorts, selectedCohortId } = useApp()
  const cohort = cohorts.find((c) => c.id === selectedCohortId)

  if (!cohort) {
    return (
      <section data-testid="page-retention">
        <p data-testid="no-selection">No cohort selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-retention">
      <div data-testid="retention-detail">
        <span data-testid="detail-month">{cohort.month}</span>
      </div>
      <ul data-testid="period-list">
        {PERIODS.map((period, i) => (
          <li key={period} data-testid={`period-${period}`}>
            <span data-testid={`period-${period}-pct`}>{cohort.retention[i]}</span>
            <span data-testid={`period-${period}-users`}>{retainedUsers(cohort, i)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
