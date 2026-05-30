'use client'
import { useApp } from '../../components/AppStateProvider'
import { useLibrary } from '../../hooks/useLibrary'

export default function SearchPage() {
  const { searchQuery, setSearchQuery, enqueue } = useApp()
  const { visibleSongs } = useLibrary()

  return (
    <section data-testid="page-search">
      <h1>Search</h1>
      <input
        data-testid="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {visibleSongs.length === 0 ? (
        <p data-testid="search-empty">No songs match.</p>
      ) : (
        <ul data-testid="search-results">
          {visibleSongs.map((s) => (
            <li key={s.id} data-testid={`result-${s.id}`}>
              <span data-testid={`result-${s.id}-title`}>{s.title}</span>
              <span data-testid={`result-${s.id}-artist`}>{s.artist}</span>
              <button data-testid={`enqueue-result-${s.id}`} onClick={() => enqueue(s.id)}>
                Enqueue
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
