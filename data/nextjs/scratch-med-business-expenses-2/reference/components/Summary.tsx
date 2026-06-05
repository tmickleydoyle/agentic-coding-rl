'use client'
import { useApp } from '../hooks/useApp'
import { CATEGORIES } from '../lib/types'

function fmt(n: number) {
  return `$${n.toFixed(2)}`
}

export function Summary() {
  const { expenses } = useApp()
  const total = expenses.reduce((s, e) => s + e.amount, 0)
  const count = expenses.length

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Monthly Total: ${fmt(total)}`}</p>
      <p>{`Total Expenses: ${count}`}</p>
      {CATEGORIES.map((cat) => {
        const sum = expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0)
        if (sum === 0) return null
        return <p key={cat}>{`${cat}: ${fmt(sum)}`}</p>
      })}
    </section>
  )
}
