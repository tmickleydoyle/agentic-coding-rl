'use client'
import { useCallback, useState } from 'react'

export type Fetcher = (query: string) => Promise<string[]>

export interface SearchState {
  query: string
  setQuery: (q: string) => void
  results: string[]
  loading: boolean
}

export function useSearch(fetcher: Fetcher): SearchState {
  const [query, setQueryState] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const setQuery = useCallback(
    (q: string) => {
      setQueryState(q)
      setLoading(true)
      // BUG: applies every response unconditionally in resolution order, so a slow
      // earlier request can clobber the newer request's results.
      fetcher(q).then((res) => {
        setResults(res)
        setLoading(false)
      })
    },
    [fetcher]
  )

  return { query, setQuery, results, loading }
}
