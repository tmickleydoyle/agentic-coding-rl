import { useState } from 'react'

export function useFilter<T>(
  items: T[],
  predicate: (item: T, query: string) => boolean
) {
  const [query, setQuery] = useState('')
  const filtered = items.filter((item) => predicate(item, query))
  return { query, setQuery, filtered }
}
