'use client'
import { useApp } from '../hooks/useApp'

function fmt(n: number) {
  return `$${n.toFixed(2)}`
}

export function Dashboard() {
  const { quotes } = useApp()
  const total = quotes.length
  const won = quotes.filter((q) => q.status === 'won').length
  const lost = quotes.filter((q) => q.status === 'lost').length
  const sent = quotes.filter((q) => q.status === 'sent').length
  const pendingValue = quotes
    .filter((q) => q.status === 'sent' || q.status === 'won')
    .reduce((s, q) => s + q.amount, 0)
  const winRate = won + lost === 0 ? 0 : Math.round((won / (won + lost)) * 100)
  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total quotes: ${total}`}</p>
      <p>{`Pending value: ${fmt(pendingValue)}`}</p>
      <p>{`Win rate: ${winRate}%`}</p>
      <p>{`Won: ${won}`}</p>
      <p>{`Lost: ${lost}`}</p>
      <p>{`Sent: ${sent}`}</p>
    </section>
  )
}
