'use client'
import type { SortKey } from '../lib/types'

export default function SortBar({
  sort,
  onSort,
}: {
  sort: SortKey
  onSort: (sort: SortKey) => void
}) {
  return (
    <div data-testid="sort-bar">
      <button
        data-testid="sort-views"
        aria-pressed={sort === 'views'}
        onClick={() => onSort('views')}
      >
        Views
      </button>
      <button
        data-testid="sort-recent"
        aria-pressed={sort === 'recent'}
        onClick={() => onSort('recent')}
      >
        Recent
      </button>
      <span data-testid="current-sort">{sort}</span>
    </div>
  )
}
