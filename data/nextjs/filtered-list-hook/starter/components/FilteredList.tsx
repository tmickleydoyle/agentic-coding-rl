'use client'
import { useFilter } from '../hooks/useFilter'

// TODO: use useFilter with a case-insensitive substring predicate. Render
// <input data-testid="filter-input">, <ul data-testid="filtered-list"> of <li>s,
// and <span data-testid="match-count">{filtered.length}</span>.
export default function FilteredList({ items }: { items: string[] }) {
  const { query, setQuery, filtered } = useFilter(items, (item, q) => true)
  return <div />
}
