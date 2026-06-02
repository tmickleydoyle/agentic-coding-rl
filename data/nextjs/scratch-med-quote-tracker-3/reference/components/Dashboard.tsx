'use client'
import { useApp } from '../hooks/useApp'
import { formatAmount } from '../lib/format'

export function Dashboard() {
  const { quotes } = useApp()
  const total = quotes.length
  const pendingValue = quotes.filter((q) => q.status === 'sent').reduce((s, q) => s + q.amount, 0)
  const wonValue = quotes.filter((q) => q.status === 'won').reduce((s, q) => s + q.amount, 0)
  const wonCount = quotes.filter((q) => q.status === 'won').length
  const lostCount = quotes.filter((q) => q.status === 'lost').length
  const winRate = wonCount + lostCount === 0 ? 0 : Math.round((wonCount / (wonCount + lostCount)) * 100)
  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total quotes: ${total}`}</p>
      <p>{`Pending value: ${formatAmount(pendingValue)}`}</p>
      <p>{`Won value: ${formatAmount(wonValue)}`}</p>
      <p>{`Win rate: ${winRate}%`}</p>
    </section>
  )
}
