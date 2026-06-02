'use client'
import { useApp } from '../hooks/useApp'
import type { Category } from '../lib/types'

const CATEGORIES: Category[] = ['Meals', 'Travel', 'Software', 'Office', 'Other']

function fmt(n: number) {
  return `$${n.toFixed(2)}`
}

export function Summary() {
  const { expenses } = useApp()
  const grand = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      {CATEGORIES.map((cat) => {
        const items = expenses.filter((e) => e.category === cat)
        if (items.length === 0) return null
        const total = items.reduce((sum, e) => sum + e.amount, 0)
        return <p key={cat}>{`${cat}: ${fmt(total)}`}</p>
      })}
      <p>{`Grand Total: ${fmt(grand)}`}</p>
      <p>{`Expense Count: ${expenses.length}`}</p>
    </section>
  )
}
