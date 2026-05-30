'use client'
import { useApp } from '../../components/AppStateProvider'
import { useFeedback } from '../../hooks/useFeedback'

export default function CategoriesPage() {
  const { setCategoryFilter, navigate } = useApp()
  const { cats } = useFeedback()
  const openCategory = (category: string) => {
    setCategoryFilter(category)
    navigate('inbox')
  }
  return (
    <section data-testid="page-categories">
      <h1>Categories</h1>
      <ul data-testid="category-list">
        {cats.map((c) => (
          <li key={c.category} data-testid={`cat-${c.category}`}>
            <span data-testid={`cat-${c.category}-name`}>{c.category}</span>
            <span data-testid={`cat-${c.category}-count`}>{c.count}</span>
            <button data-testid={`cat-${c.category}-open`} onClick={() => openCategory(c.category)}>
              Open
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
