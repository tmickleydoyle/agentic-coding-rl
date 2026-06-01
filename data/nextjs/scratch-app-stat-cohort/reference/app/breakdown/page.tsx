'use client'
import { useCohorts } from '../../hooks/useCohorts'
import { PERIODS } from '../../lib/types'

export default function BreakdownPage() {
  const { cohorts, averages, bestAtM3 } = useCohorts()
  return (
    <section data-testid="page-breakdown">
      <h1>Breakdown</h1>
      <ul data-testid="avg-list">
        {PERIODS.map((period, i) => (
          <li key={period} data-testid={`avg-${period}`}>
            <span data-testid={`avg-${period}-value`}>{averages[i]}</span>
          </li>
        ))}
      </ul>
      <span data-testid="cohort-count">{cohorts.length}</span>
      <span data-testid="best-m3">{bestAtM3}</span>
    </section>
  )
}
