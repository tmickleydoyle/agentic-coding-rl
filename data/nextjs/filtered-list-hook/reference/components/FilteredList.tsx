'use client'
import { useFilter } from '../hooks/useFilter'

export default function FilteredList({ items }: { items: string[] }) {
  const { query, setQuery, filtered } = useFilter(items, (item, q) =>
    q === '' ? true : item.toLowerCase().includes(q.toLowerCase())
  )
  return (
    <div>
      <input
        data-testid="filter-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul data-testid="filtered-list">
        {filtered.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <span data-testid="match-count">{filtered.length}</span>
    </div>
  )
}
