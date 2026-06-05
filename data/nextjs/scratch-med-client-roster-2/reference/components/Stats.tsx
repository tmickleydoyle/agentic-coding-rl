'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { clients } = useApp()
  const total = clients.length
  const active = clients.filter((c) => c.status === 'active').length
  const leads = clients.filter((c) => c.status === 'lead').length
  const churned = clients.filter((c) => c.status === 'churned').length
  const activeValue = clients.filter((c) => c.status === 'active').reduce((s, c) => s + c.value, 0)
  const totalValue = clients.reduce((s, c) => s + c.value, 0)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total clients: ${total}`}</p>
      <p>{`Active: ${active}`}</p>
      <p>{`Leads: ${leads}`}</p>
      <p>{`Churned: ${churned}`}</p>
      <p>{`Active value: $${activeValue}`}</p>
      <p>{`Total value: $${totalValue}`}</p>
    </section>
  )
}
