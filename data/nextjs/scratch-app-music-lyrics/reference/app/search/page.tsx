'use client'
import { useApp } from '../../components/AppStateProvider'
import { useLyrics } from '../../hooks/useLyrics'

export default function SearchPage() {
  const { searchQuery, setSearchQuery } = useApp()
  const { searchResults } = useLyrics()

  return (
    <section data-testid="page-search">
      <h1>Search lyrics</h1>
      <input
        data-testid="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchResults.length === 0 ? (
        <p data-testid="search-empty">No lines match.</p>
      ) : (
        <ul data-testid="search-results">
          {searchResults.map((r) => (
            <li key={`${r.song.id}-${r.lineIndex}`} data-testid={`sresult-${r.song.id}-${r.lineIndex}`}>
              <span data-testid={`sresult-${r.song.id}-${r.lineIndex}-line`}>{r.line}</span>
              <span data-testid={`sresult-${r.song.id}-${r.lineIndex}-title`}>{r.song.title}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
