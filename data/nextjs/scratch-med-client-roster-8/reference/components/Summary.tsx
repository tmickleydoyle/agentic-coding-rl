'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { clients } = useApp()
  const total = clients.length
  const active = clients.filter((c) => c.status === 'active').length
  const leads = clients.filter((c) => c.status === 'lead').length
  const churned = clients.filter((c) => c.status === 'churned').length
  const totalValue = clients.reduce((sum, c) => sum + c.lifetimeValue, 0)
  const activeValue = clients.filter((c) => c.status === 'active').reduce((sum, c) => sum + c.lifetimeValue, 0)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total clients: ${total}`}</p>
      <p>{`Active: ${active}`}</p>
      <p>{`Leads: ${leads}`}</p>
      <p>{`Churned: ${churned}`}</p>
      <p>{`Total value: $${totalValue.toFixed(2)}`}</p>
      <p>{`Active value: $${activeValue.toFixed(2)}`}</p>
    </section>
  )
}
