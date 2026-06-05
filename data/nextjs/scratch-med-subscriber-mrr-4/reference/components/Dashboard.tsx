'use client'
import { useApp } from '../hooks/useApp'
import { PLANS } from '../lib/plans'

export function Dashboard() {
  const { subscribers } = useApp()
  const total = subscribers.length
  const active = subscribers.filter((s) => s.active)
  const activeCount = active.length
  const inactiveCount = total - activeCount
  const mrr = active.reduce((sum, s) => {
    const plan = PLANS.find((p) => p.key === s.plan)
    return sum + (plan ? plan.price : 0)
  }, 0)
  const arpu = activeCount === 0 ? 0 : Math.round(mrr / activeCount)
  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total Subscribers: ${total}`}</p>
      <p>{`Active Subscribers: ${activeCount}`}</p>
      <p>{`Inactive Subscribers: ${inactiveCount}`}</p>
      <p>{`Monthly Recurring Revenue (MRR): $${mrr}`}</p>
      <p>{`Average Revenue per User (ARPU): $${arpu}`}</p>
    </section>
  )
}
