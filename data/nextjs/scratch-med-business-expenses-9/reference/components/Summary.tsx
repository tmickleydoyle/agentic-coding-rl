'use client'
import { useApp } from '../hooks/useApp'
import { fmt } from '../lib/fmt'

export function Summary() {
  const { expenses } = useApp()

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const count = expenses.length

  // per-category totals in order of first appearance
  const categoryOrder: string[] = []
  const categoryTotals: Record<string, number> = {}
  expenses.forEach((e) => {
    if (!(e.category in categoryTotals)) {
      categoryOrder.push(e.category)
      categoryTotals[e.category] = 0
    }
    categoryTotals[e.category] += e.amount
  })

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total: ${fmt(total)}`}</p>
      <p>{`Expenses: ${count}`}</p>
      <ul>
        {categoryOrder.map((cat) => (
          <li key={cat}>{`${cat}: ${fmt(categoryTotals[cat])}`}</li>
        ))}
      </ul>
    </section>
  )
}
