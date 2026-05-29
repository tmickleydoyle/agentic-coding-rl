'use client'
import { useState } from 'react'

const ITEMS = ['Apple', 'Banana', 'Grape', 'Pineapple', 'Orange']

export default function SearchFilter() {
  const [query, setQuery] = useState('')

  const results = ITEMS.filter((item) => item.includes(query))

  return (
    <div>
      <input
        data-testid="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul data-testid="results">
        {results.map((item) => (
          <li key={item} data-testid={`item-${item}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
