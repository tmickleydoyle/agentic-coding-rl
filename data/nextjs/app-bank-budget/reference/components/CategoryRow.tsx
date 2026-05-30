'use client'
import type { CategorySummary } from '../hooks/useBudget'

export default function CategoryRow({ summary }: { summary: CategorySummary }) {
  return (
    <li
      data-testid={`category-${summary.id}`}
      data-over={summary.overLimit ? 'true' : 'false'}
    >
      <span data-testid={`category-${summary.id}-name`}>{summary.name}</span>
      <span data-testid={`category-${summary.id}-limit`}>{summary.limit}</span>
      <span data-testid={`category-${summary.id}-spent`}>{summary.spent}</span>
      <span data-testid={`category-${summary.id}-remaining`}>{summary.remaining}</span>
      {summary.overLimit ? (
        <span data-testid={`category-${summary.id}-alert`}>Over limit</span>
      ) : null}
    </li>
  )
}
