'use client'
import { useBudgetSummary } from '../../hooks/useBudget'
import CategoryRow from '../../components/CategoryRow'

export default function CategoriesPage() {
  const { summaries } = useBudgetSummary()
  return (
    <section data-testid="page-categories">
      <h1>Categories</h1>
      {summaries.length === 0 ? (
        <p data-testid="empty-categories">No categories yet.</p>
      ) : (
        <ul data-testid="category-list">
          {summaries.map((s) => (
            <CategoryRow key={s.id} summary={s} />
          ))}
        </ul>
      )}
    </section>
  )
}
