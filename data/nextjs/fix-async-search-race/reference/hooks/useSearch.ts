'use client'
import { useCallback, useRef, useState } from 'react'

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
  const seqRef = useRef(0)

  const setQuery = useCallback(
    (q: string) => {
      setQueryState(q)
      const seq = ++seqRef.current
      setLoading(true)
      fetcher(q).then((res) => {
        // Ignore any response that is no longer the latest request.
        if (seq !== seqRef.current) return
        setResults(res)
        setLoading(false)
      })
    },
    [fetcher]
  )

  return { query, setQuery, results, loading }
}
