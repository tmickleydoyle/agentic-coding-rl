'use client'
import { useEffect, useRef, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'

export default function DebouncedSearch() {
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 500)
  const [commits, setCommits] = useState(0)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setCommits((c) => c + 1)
  }, [debounced])

  return (
    <div>
      <input
        data-testid="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <span data-testid="debounced">{debounced}</span>
      <span data-testid="commits">{commits}</span>
    </div>
  )
}
