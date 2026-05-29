'use client'
import { useSearch, Fetcher } from '../hooks/useSearch'

interface SearchBoxProps {
  fetcher: Fetcher
}

export default function SearchBox({ fetcher }: SearchBoxProps) {
  const { query, setQuery, results, loading } = useSearch(fetcher)

  return (
    <div>
      <input
        data-testid="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <span data-testid="loading">{loading ? 'loading' : ''}</span>
      <ul>
        {results.map((r, i) => (
          <li key={i} data-testid={`result-${i}`}>
            {r}
          </li>
        ))}
      </ul>
    </div>
  )
}
