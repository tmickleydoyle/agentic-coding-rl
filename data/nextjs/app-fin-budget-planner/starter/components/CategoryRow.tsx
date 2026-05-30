'use client'
import type { CategorySummary } from '../hooks/useBudget'

export default function CategoryRow({ summary }: { summary: CategorySummary }) {
  // TODO: render <li data-testid="category-<id>" data-over> with name, planned, actual,
  // remaining values and a category-<id>-alert when over budget.
  return <li data-testid={`category-${summary.id}`} />
}
