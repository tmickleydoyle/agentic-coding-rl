'use client'
import { useApp } from '../../components/AppStateProvider'
import { useChannel } from '../../hooks/useChannel'
import ResultRow from '../../components/ResultRow'

export default function SearchPage() {
  const { query, setQuery, openThread } = useApp()
  const { matchedMessages } = useChannel()

  return (
    <section data-testid="page-search">
      <h1>Search</h1>
      <label htmlFor="message-search">Search</label>
      <input
        id="message-search"
        data-testid="message-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {matchedMessages.length === 0 ? (
        <p data-testid="no-results">No results.</p>
      ) : (
        <ul data-testid="search-list">
          {matchedMessages.map((m) => (
            <ResultRow key={m.id} message={m} onOpen={openThread} />
          ))}
        </ul>
      )}
    </section>
  )
}
