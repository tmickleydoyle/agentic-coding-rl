import { useState } from 'react'

// TODO: track `query` (string, initial ""). Compute `filtered` = items.filter(item =>
// predicate(item, query)). Return { query, setQuery, filtered }.
export function useFilter<T>(
  items: T[],
  predicate: (item: T, query: string) => boolean
) {
  const [query, setQuery] = useState('')
  return { query, setQuery, filtered: items }
}
