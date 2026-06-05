'use client'
import type { CategorySummary } from '../hooks/useBudget'

export default function CategoryRow({ summary }: { summary: CategorySummary }) {
  return (
    <li
      data-testid={`category-${summary.id}`}
      data-over={summary.overBudget ? 'true' : 'false'}
    >
      <span data-testid={`category-${summary.id}-name`}>{summary.name}</span>
      <span data-testid={`category-${summary.id}-planned`}>{summary.planned}</span>
      <span data-testid={`category-${summary.id}-actual`}>{summary.actual}</span>
      <span data-testid={`category-${summary.id}-remaining`}>{summary.remaining}</span>
      {summary.overBudget ? (
        <span data-testid={`category-${summary.id}-alert`}>Over budget</span>
      ) : null}
    </li>
  )
}
