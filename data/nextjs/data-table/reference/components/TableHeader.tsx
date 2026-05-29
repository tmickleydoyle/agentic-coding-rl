'use client'
import type { SortKey } from './types'

export default function TableHeader({
  sortKey,
  onSort,
}: {
  sortKey: SortKey
  onSort: (key: SortKey) => void
}) {
  return (
    <thead data-testid="thead">
      <tr>
        <th
          data-testid="sort-name"
          aria-sort={sortKey === 'name' ? 'ascending' : undefined}
        >
          <button onClick={() => onSort('name')}>Name</button>
        </th>
        <th
          data-testid="sort-age"
          aria-sort={sortKey === 'age' ? 'ascending' : undefined}
        >
          <button onClick={() => onSort('age')}>Age</button>
        </th>
      </tr>
    </thead>
  )
}
