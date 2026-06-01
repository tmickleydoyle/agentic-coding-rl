'use client'
import { useApp } from '../../components/AppStateProvider'
import { useArticles } from '../../hooks/useArticles'

export default function SearchPage() {
  const { query, setQuery, selectArticle } = useApp()
  const { results } = useArticles()
  return (
    <section data-testid="page-search">
      <h1>Search</h1>
      <input
        data-testid="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query.trim().length === 0 ? (
        <p data-testid="search-hint">Type to search articles.</p>
      ) : results.length === 0 ? (
        <p data-testid="no-results">No articles match your search.</p>
      ) : (
        <ul data-testid="search-results">
          {results.map((a) => (
            <li key={a.id} data-testid={`result-${a.id}`}>
              <span data-testid={`result-${a.id}-title`}>{a.title}</span>
              <button data-testid={`open-result-${a.id}`} onClick={() => selectArticle(a.id)}>
                Open
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
