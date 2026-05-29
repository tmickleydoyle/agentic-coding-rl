'use client'
import type { SortEntry, SortKey } from './types'

// TODO: render <th aria-sort=ascending|descending|none> with a <button data-testid={`head-${sortKey}`}>
// (label, onClick -> onSort(sortKey)). When the key is active, also render
// <span data-testid={`badge-${sortKey}`}>{priority}</span> (1-based position within sorts).
export default function HeaderCell({
  label,
  sortKey,
  sorts,
  onSort,
}: {
  label: string
  sortKey: SortKey
  sorts: SortEntry[]
  onSort: (k: SortKey) => void
}) {
  return (
    <th>
      <button data-testid={`head-${sortKey}`}>{label}</button>
    </th>
  )
}
