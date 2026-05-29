'use client'
import type { SortEntry, SortKey } from './types'

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
  const idx = sorts.findIndex((s) => s.key === sortKey)
  const entry = idx === -1 ? undefined : sorts[idx]
  const ariaSort =
    entry === undefined ? 'none' : entry.dir === 'asc' ? 'ascending' : 'descending'

  return (
    <th aria-sort={ariaSort}>
      <button data-testid={`head-${sortKey}`} onClick={() => onSort(sortKey)}>
        {label}
      </button>
      {entry !== undefined && (
        <span data-testid={`badge-${sortKey}`}>{idx + 1}</span>
      )}
    </th>
  )
}
