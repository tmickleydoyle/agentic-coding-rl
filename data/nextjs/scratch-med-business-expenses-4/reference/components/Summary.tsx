'use client'
import { useApp } from '../hooks/useApp'
import { CATEGORIES, fmt } from '../lib/utils'

export function Summary() {
  const { expenses } = useApp()
  const total = expenses.length
  const grand = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total expenses: ${total}`}</p>
      <p>{`Grand total: ${fmt(grand)}`}</p>
      {CATEGORIES.map((cat) => {
        const items = expenses.filter((e) => e.category === cat)
        if (items.length === 0) return null
        const catTotal = items.reduce((s, e) => s + e.amount, 0)
        return <p key={cat}>{`${cat}: ${fmt(catTotal)}`}</p>
      })}
    </section>
  )
}
