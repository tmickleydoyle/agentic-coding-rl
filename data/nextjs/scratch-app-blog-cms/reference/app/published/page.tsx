'use client'
import { useApp } from '../../components/AppStateProvider'

export default function PublishedPage() {
  const { posts, categories, theme, setTheme } = useApp()
  const published = posts.filter((p) => p.status === 'published')
  const categoryName = (id: string): string =>
    categories.find((c) => c.id === id)?.name ?? 'Uncategorized'

  return (
    <section data-testid="page-published">
      <h1>Published</h1>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      <p data-testid="published-count">{published.length}</p>
      {published.length === 0 ? (
        <p data-testid="published-empty">Nothing published yet.</p>
      ) : (
        <ul data-testid="published-list">
          {published.map((p) => (
            <li key={p.id} data-testid={`published-${p.id}`}>
              <span data-testid={`published-${p.id}-title`}>{p.title}</span>
              <span data-testid={`published-${p.id}-category`}>
                {categoryName(p.categoryId)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
