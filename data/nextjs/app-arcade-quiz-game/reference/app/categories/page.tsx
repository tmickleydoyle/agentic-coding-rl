'use client'
import { useApp } from '../../components/AppStateProvider'
import { categories, questionsByCategory } from '../../lib/quiz'

export default function CategoriesPage() {
  const { start } = useApp()
  const cats = categories()
  return (
    <section data-testid="page-categories">
      <h1>Categories</h1>
      <button data-testid="cat-all" onClick={() => start(null)}>
        All ({questionsByCategory(null).length})
      </button>
      <ul>
        {cats.map((c) => (
          <li key={c}>
            <button data-testid={`cat-${c}`} onClick={() => start(c)}>
              {c}
            </button>
            <span data-testid={`cat-count-${c}`}>
              {questionsByCategory(c).length}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
