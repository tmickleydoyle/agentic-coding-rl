'use client'
import { useArticles } from '../../hooks/useArticles'

export default function CategoriesPage() {
  const { counts, categories } = useArticles()
  return (
    <section data-testid="page-categories">
      <h1>Categories</h1>
      <ul data-testid="category-counts">
        {categories.map((c) => (
          <li key={c} data-testid={`category-${c}`}>
            <span data-testid={`category-${c}-name`}>{c}</span>
            <span data-testid={`category-${c}-value`}>{counts[c]}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
