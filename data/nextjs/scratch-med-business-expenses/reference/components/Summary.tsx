'use client'
import { useApp } from '../hooks/useApp'
import { fmt } from '../lib/fmt'

export function Summary() {
  const { expenses } = useApp()
  const total = expenses.reduce((s, e) => s + e.amount, 0)

  const categories: string[] = []
  expenses.forEach((e) => {
    if (!categories.includes(e.category)) categories.push(e.category)
  })

  const byCategory: Record<string, number> = {}
  expenses.forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount
  })

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total: ${fmt(total)}`}</p>
      <p>{`Expenses: ${expenses.length}`}</p>
      {categories.map((c) => (
        <p key={c}>{`${c}: ${fmt(byCategory[c])}`}</p>
      ))}
    </section>
  )
}
