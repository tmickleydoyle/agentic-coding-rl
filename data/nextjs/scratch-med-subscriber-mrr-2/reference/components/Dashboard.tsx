'use client'
import { useApp } from '../hooks/useApp'

export function Dashboard() {
  const { subscribers, mrr, activeCount } = useApp()
  const total = subscribers.length
  const inactive = total - activeCount
  const countPlan = (p: string) => subscribers.filter((s) => s.plan === p).length

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total subscribers: ${total}`}</p>
      <p>{`Active subscribers: ${activeCount}`}</p>
      <p>{`Inactive subscribers: ${inactive}`}</p>
      <p>{`MRR: $${mrr}`}</p>
      <p>{`Basic subscribers: ${countPlan('Basic')}`}</p>
      <p>{`Pro subscribers: ${countPlan('Pro')}`}</p>
      <p>{`Enterprise subscribers: ${countPlan('Enterprise')}`}</p>
    </section>
  )
}
