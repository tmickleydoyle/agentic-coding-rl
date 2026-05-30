'use client'
import { useCalendar } from '../../hooks/useCalendar'

export default function CategoriesPage() {
  const { countByCategory, categories } = useCalendar()
  return (
    <section data-testid="page-categories">
      <h1>Categories</h1>
      <ul data-testid="categories-list">
        {categories.map((c) => (
          <li key={c} data-testid={`cat-${c}`}>
            <span>{c}</span>
            <span data-testid={`cat-${c}-count`}>{countByCategory[c] ?? 0}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
