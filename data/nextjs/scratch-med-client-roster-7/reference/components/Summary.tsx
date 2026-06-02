'use client'
import { useApp } from '../hooks/useApp'

const fmt = (n: number) => `$${n.toFixed(2)}`

export function Summary() {
  const { clients } = useApp()
  const total = clients.length
  const active = clients.filter((c) => c.status === 'active').length
  const leads = clients.filter((c) => c.status === 'lead').length
  const churned = clients.filter((c) => c.status === 'churned').length
  const totalValue = clients.reduce((s, c) => s + c.lifetimeValue, 0)
  const activeValue = clients.filter((c) => c.status === 'active').reduce((s, c) => s + c.lifetimeValue, 0)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total clients: ${total}`}</p>
      <p>{`Active: ${active}`}</p>
      <p>{`Leads: ${leads}`}</p>
      <p>{`Churned: ${churned}`}</p>
      <p>{`Total Lifetime Value: ${fmt(totalValue)}`}</p>
      <p>{`Active Value: ${fmt(activeValue)}`}</p>
    </section>
  )
}
