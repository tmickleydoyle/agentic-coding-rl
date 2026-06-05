'use client'
import { useApp } from '../hooks/useApp'
import type { Category } from '../lib/types'

const CATEGORIES: Category[] = ['Food', 'Travel', 'Software', 'Office', 'Other']

function fmt(n: number): string {
  return `$${n.toFixed(2)}`
}

export function Summary() {
  const { expenses } = useApp()
  const total = expenses.length
  const monthlyTotal = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total Expenses: ${total}`}</p>
      <p>{`Monthly Total: ${fmt(monthlyTotal)}`}</p>
      {CATEGORIES.map((cat) => {
        const catTotal = expenses
          .filter((e) => e.category === cat)
          .reduce((sum, e) => sum + e.amount, 0)
        return <p key={cat}>{`${cat}: ${fmt(catTotal)}`}</p>
      })}
    </section>
  )
}
