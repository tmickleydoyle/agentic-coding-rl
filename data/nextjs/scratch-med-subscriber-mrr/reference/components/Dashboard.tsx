'use client'
import { useApp } from '../hooks/useApp'
import { PLAN_PRICE } from '../lib/plans'

export function Dashboard() {
  const { subscribers } = useApp()
  const total = subscribers.length
  const active = subscribers.filter((s) => s.active).length
  const inactive = total - active
  const mrr = subscribers
    .filter((s) => s.active)
    .reduce((sum, s) => sum + PLAN_PRICE[s.plan], 0)
  const activeRate = total === 0 ? 0 : Math.round((active / total) * 100)

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total subscribers: ${total}`}</p>
      <p>{`Active subscribers: ${active}`}</p>
      <p>{`Inactive subscribers: ${inactive}`}</p>
      <p>{`Monthly Recurring Revenue: $${mrr}`}</p>
      <p>{`Active rate: ${activeRate}%`}</p>
    </section>
  )
}
