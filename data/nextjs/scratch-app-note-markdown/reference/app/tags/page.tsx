'use client'
import { useApp } from '../../components/AppStateProvider'
import { useNotesView } from '../../hooks/useNotesView'

export default function TagsPage() {
  const { setTagFilter, navigate } = useApp()
  const { allTags } = useNotesView()

  const applyFilter = (tag: string) => {
    setTagFilter(tag)
    navigate('list')
  }

  return (
    <section data-testid="page-tags">
      <h1>Tags</h1>
      <button data-testid="clear-filter" onClick={() => setTagFilter(null)}>
        Clear filter
      </button>
      <ul data-testid="tag-list">
        {allTags.map((t) => (
          <li key={t.tag} data-testid={`tag-${t.tag}`}>
            <span data-testid={`tag-${t.tag}-count`}>{t.count}</span>
            <button data-testid={`filter-${t.tag}`} onClick={() => applyFilter(t.tag)}>
              {t.tag}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
