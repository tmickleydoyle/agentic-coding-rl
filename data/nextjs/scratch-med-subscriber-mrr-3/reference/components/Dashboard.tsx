'use client'
import { useApp } from '../hooks/useApp'
import { PLAN_PRICE } from '../lib/plans'

export function Dashboard() {
  const { subscribers } = useApp()
  const total = subscribers.length
  const active = subscribers.filter((s) => s.active)
  const inactive = subscribers.filter((s) => !s.active)
  const mrr = active.reduce((sum, s) => sum + PLAN_PRICE[s.plan], 0)
  const starter = subscribers.filter((s) => s.plan === 'Starter').length
  const pro = subscribers.filter((s) => s.plan === 'Pro').length
  const enterprise = subscribers.filter((s) => s.plan === 'Enterprise').length
  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total subscribers: ${total}`}</p>
      <p>{`Active subscribers: ${active.length}`}</p>
      <p>{`Inactive subscribers: ${inactive.length}`}</p>
      <p>{`MRR: $${mrr}`}</p>
      <p>{`Starter subscribers: ${starter}`}</p>
      <p>{`Pro subscribers: ${pro}`}</p>
      <p>{`Enterprise subscribers: ${enterprise}`}</p>
    </section>
  )
}
