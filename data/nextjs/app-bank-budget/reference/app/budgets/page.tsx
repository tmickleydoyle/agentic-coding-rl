'use client'
import { useState } from 'react'
import { useBudget } from '../../components/BudgetProvider'
import type { Category } from '../../lib/types'

function BudgetEditor({ category }: { category: Category }) {
  const { setLimit } = useBudget()
  const [value, setValue] = useState(String(category.limit))

  return (
    <div data-testid={`budget-${category.id}`}>
      <span data-testid={`budget-${category.id}-name`}>{category.name}</span>
      <input
        data-testid={`budget-${category.id}-limit-input`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        data-testid={`budget-${category.id}-save`}
        onClick={() => {
          const parsed = Number(value)
          if (!Number.isNaN(parsed) && parsed >= 0) setLimit(category.id, parsed)
        }}
      >
        Save
      </button>
    </div>
  )
}

export default function BudgetsPage() {
  const { categories } = useBudget()
  return (
    <section data-testid="page-budgets">
      <h1>Budgets</h1>
      {categories.map((c) => (
        <BudgetEditor key={c.id} category={c} />
      ))}
    </section>
  )
}
