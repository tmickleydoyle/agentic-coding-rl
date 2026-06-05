'use client'
import { useApp } from '../hooks/useApp'
import { PLANS } from '../lib/plans'

export function Dashboard() {
  const { subscribers } = useApp()
  const total = subscribers.length
  const active = subscribers.filter((s) => s.active)
  const activeCount = active.length
  const mrr = active.reduce((sum, s) => sum + PLANS[s.plan].price, 0)
  const avg = activeCount === 0 ? 0 : Math.round(mrr / activeCount)

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total subscribers: ${total}`}</p>
      <p>{`Active subscribers: ${activeCount}`}</p>
      <p>{`Monthly Recurring Revenue: $${mrr}`}</p>
      <p>{`Average MRR per active subscriber: $${avg}`}</p>
    </section>
  )
}
