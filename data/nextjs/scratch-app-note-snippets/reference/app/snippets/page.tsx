'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSnippets } from '../../hooks/useSnippets'

export default function SnippetsPage() {
  const {
    languageFilter,
    searchQuery,
    setLanguageFilter,
    setSearchQuery,
    openSnippet,
    toggleFavorite,
  } = useApp()
  const { visibleSnippets, languages } = useSnippets()

  return (
    <section data-testid="page-snippets">
      <h1>Snippets</h1>
      <input
        data-testid="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <select
        data-testid="language-filter"
        value={languageFilter ?? 'all'}
        onChange={(e) => setLanguageFilter(e.target.value === 'all' ? null : e.target.value)}
      >
        <option value="all">All languages</option>
        {languages.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      {visibleSnippets.length === 0 ? (
        <p data-testid="snippets-empty">No snippets match.</p>
      ) : (
        <ul data-testid="snippet-list">
          {visibleSnippets.map((s) => (
            <li key={s.id} data-testid={`snippet-${s.id}`}>
              <span data-testid={`snippet-${s.id}-title`}>{s.title}</span>
              <span data-testid={`snippet-${s.id}-language`}>{s.language}</span>
              <button data-testid={`open-${s.id}`} onClick={() => openSnippet(s.id)}>
                Open
              </button>
              <button data-testid={`fav-${s.id}`} onClick={() => toggleFavorite(s.id)}>
                {s.favorite ? 'Unfavorite' : 'Favorite'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
