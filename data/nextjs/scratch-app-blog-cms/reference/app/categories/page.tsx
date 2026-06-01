'use client'
import { useApp } from '../../components/AppStateProvider'
import { usePosts } from '../../hooks/usePosts'
import StatCard from '../../components/StatCard'

export default function CategoriesPage() {
  const { categories } = useApp()
  const { counts } = usePosts()
  return (
    <section data-testid="page-categories">
      <h1>Categories</h1>
      <div data-testid="stats">
        <StatCard label="Total" value={counts.total} testid="total" />
        <StatCard label="Published" value={counts.published} testid="published" />
        <StatCard label="Draft" value={counts.draft} testid="draft" />
      </div>
      <ul data-testid="category-counts">
        {categories.map((c) => (
          <li key={c.id} data-testid={`category-count-${c.id}`}>
            <span data-testid={`category-count-${c.id}-name`}>{c.name}</span>
            <span data-testid={`category-count-${c.id}-value`}>
              {counts.byCategory[c.id] ?? 0}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
