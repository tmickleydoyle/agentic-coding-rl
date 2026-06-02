'use client'
import { useApp } from '../hooks/useApp'
import { PLAN_PRICE } from '../lib/types'
import type { Plan } from '../lib/types'

const PLANS: Plan[] = ['Basic', 'Pro', 'Enterprise']

export function Dashboard() {
  const { subscribers } = useApp()
  const total = subscribers.length
  const active = subscribers.filter((s) => s.active).length
  const mrr = subscribers
    .filter((s) => s.active)
    .reduce((sum, s) => sum + PLAN_PRICE[s.plan], 0)
  const countByPlan = (plan: Plan) => subscribers.filter((s) => s.plan === plan).length

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total subscribers: ${total}`}</p>
      <p>{`Active subscribers: ${active}`}</p>
      <p>{`Monthly Recurring Revenue: $${mrr}`}</p>
      <p>{`Basic subscribers: ${countByPlan('Basic')}`}</p>
      <p>{`Pro subscribers: ${countByPlan('Pro')}`}</p>
      <p>{`Enterprise subscribers: ${countByPlan('Enterprise')}`}</p>
    </section>
  )
}
