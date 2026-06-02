'use client'
import { useApp } from '../hooks/useApp'
import { PLANS } from '../lib/plans'

export function Dashboard() {
  const { subscribers } = useApp()
  const total = subscribers.length
  const active = subscribers.filter((s) => s.active)
  const inactive = subscribers.filter((s) => !s.active).length
  const mrr = active.reduce((sum, s) => {
    const plan = PLANS.find((p) => p.id === s.planId)
    return sum + (plan ? plan.price : 0)
  }, 0)
  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total subscribers: ${total}`}</p>
      <p>{`Active subscribers: ${active.length}`}</p>
      <p>{`MRR: $${mrr}`}</p>
      <p>{`Inactive: ${inactive}`}</p>
    </section>
  )
}
