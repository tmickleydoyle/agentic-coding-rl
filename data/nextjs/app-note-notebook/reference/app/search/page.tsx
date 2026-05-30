'use client'
import { useApp } from '../../components/AppStateProvider'
import { useNotes } from '../../hooks/useNotes'

export default function SearchPage() {
  const { searchQuery, setSearchQuery } = useApp()
  const { searchResults } = useNotes()
  const blank = searchQuery.trim().length === 0

  return (
    <section data-testid="page-search">
      <h1>Search</h1>
      <input
        data-testid="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {blank ? (
        <p data-testid="search-empty">Type to search your notes.</p>
      ) : (
        <ul data-testid="search-results">
          {searchResults.map((n) => (
            <li key={n.id} data-testid={`result-${n.id}`}>
              <span data-testid={`result-${n.id}-title`}>{n.title}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
