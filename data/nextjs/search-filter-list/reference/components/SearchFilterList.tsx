'use client'
import { useState } from 'react'

interface Item {
  id: string
  label: string
}

interface SearchFilterListProps {
  items: Item[]
}

export default function SearchFilterList({ items }: SearchFilterListProps) {
  const [query, setQuery] = useState('')

  const filtered = items.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <input
        data-testid="search-input"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {filtered.length === 0 ? (
          <li data-testid="no-results">No results</li>
        ) : (
          filtered.map(item => (
            <li key={item.id} data-testid={`item-${item.id}`}>
              {item.label}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
