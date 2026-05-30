'use client'
import { useApp } from '../../components/AppStateProvider'
import { useCohorts } from '../../hooks/useCohorts'
import CohortRow from '../../components/CohortRow'
import type { SizeFilter } from '../../lib/types'

export default function CohortsPage() {
  const { sizeFilter, setSizeFilter, selectCohort } = useApp()
  const { cohorts } = useCohorts()
  return (
    <section data-testid="page-cohorts">
      <h1>Cohorts</h1>
      <select
        data-testid="size-filter"
        value={sizeFilter}
        onChange={(e) => setSizeFilter(e.target.value as SizeFilter)}
      >
        <option value="all">All</option>
        <option value="large">Large</option>
      </select>
      <ul data-testid="cohort-list">
        {cohorts.map((c) => (
          <CohortRow key={c.id} cohort={c} onSelect={selectCohort} />
        ))}
      </ul>
    </section>
  )
}
