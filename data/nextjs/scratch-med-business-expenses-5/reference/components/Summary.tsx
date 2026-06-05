'use client'
import { useApp } from '../hooks/useApp'
import { CATEGORIES } from '../lib/types'
import { formatAmount } from '../lib/format'

export function Summary() {
  const { expenses } = useApp()

  if (expenses.length === 0) {
    return (
      <section aria-label="Summary view">
        <h1>Summary</h1>
        <p>No expenses yet</p>
      </section>
    )
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      {CATEGORIES.map((cat) => {
        const catExpenses = expenses.filter((e) => e.category === cat)
        if (catExpenses.length === 0) return null
        const catTotal = catExpenses.reduce((sum, e) => sum + e.amount, 0)
        return <p key={cat}>{`${cat}: ${formatAmount(catTotal)}`}</p>
      })}
      <p>{`Total: ${formatAmount(total)}`}</p>
      <p>{`Expenses: ${expenses.length}`}</p>
    </section>
  )
}
