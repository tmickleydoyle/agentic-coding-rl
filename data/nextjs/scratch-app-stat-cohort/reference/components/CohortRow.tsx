'use client'
import type { Cohort } from '../lib/types'

export default function CohortRow({
  cohort,
  onSelect,
}: {
  cohort: Cohort
  onSelect: (id: string) => void
}) {
  return (
    <li data-testid={`cohort-${cohort.id}`}>
      <span data-testid={`cohort-${cohort.id}-month`}>{cohort.month}</span>
      <span data-testid={`cohort-${cohort.id}-size`}>{cohort.size}</span>
      <span data-testid={`cohort-${cohort.id}-m3`}>{cohort.retention[3]}</span>
      <button data-testid={`select-${cohort.id}`} onClick={() => onSelect(cohort.id)}>
        Select
      </button>
    </li>
  )
}
