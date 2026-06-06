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
  const [_query] = useState('')

  return (
    <div>
      <input
        data-testid="search-input"
        value=""
        onChange={() => {}}
        placeholder="Search..."
      />
      <ul>
        {items.map(item => (
          <li key={item.id} data-testid={`item-${item.id}`}>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
