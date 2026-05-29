'use client'
import type { SortKey } from './types'

// TODO: render <thead data-testid="thead"><tr> with two cells <th data-testid="sort-name">
// and <th data-testid="sort-age">. Each contains a <button> labeled "Name"/"Age" calling
// onSort. The active sortKey's <th> has aria-sort="ascending".
export default function TableHeader({
  sortKey,
  onSort,
}: {
  sortKey: SortKey
  onSort: (key: SortKey) => void
}) {
  return <thead />
}
