'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSnippets } from '../../hooks/useSnippets'

export default function DetailPage() {
  const { incrementCopy, toggleFavorite, removeSnippet, navigate } = useApp()
  const { selected } = useSnippets()

  if (!selected) {
    return (
      <section data-testid="page-detail">
        <h1>Detail</h1>
        <p data-testid="no-selection">Open a snippet first.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-detail">
      <h1>Detail</h1>
      <p data-testid="detail-title">{selected.title}</p>
      <p data-testid="detail-language">{selected.language}</p>
      <pre data-testid="detail-code">{selected.code}</pre>
      <p data-testid="detail-copies">{selected.copyCount}</p>
      <button data-testid="copy-snippet" onClick={() => incrementCopy(selected.id)}>
        Copy
      </button>
      <button data-testid="toggle-fav" onClick={() => toggleFavorite(selected.id)}>
        {selected.favorite ? 'Unfavorite' : 'Favorite'}
      </button>
      <button
        data-testid="delete-snippet"
        onClick={() => {
          removeSnippet(selected.id)
          navigate('snippets')
        }}
      >
        Delete
      </button>
    </section>
  )
}
