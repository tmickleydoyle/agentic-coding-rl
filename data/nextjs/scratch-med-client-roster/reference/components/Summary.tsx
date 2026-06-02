'use client'
import { useApp } from '../hooks/useApp'

function fmt(v: number) {
  return `$${v.toFixed(2)}`
}

export function Summary() {
  const { clients } = useApp()
  const total = clients.length
  const active = clients.filter((c) => c.status === 'active')
  const leads = clients.filter((c) => c.status === 'lead')
  const churned = clients.filter((c) => c.status === 'churned')
  const totalValue = clients.reduce((s, c) => s + c.value, 0)
  const activeValue = active.reduce((s, c) => s + c.value, 0)
  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total clients: ${total}`}</p>
      <p>{`Active: ${active.length}`}</p>
      <p>{`Leads: ${leads.length}`}</p>
      <p>{`Churned: ${churned.length}`}</p>
      <p>{`Total value: ${fmt(totalValue)}`}</p>
      <p>{`Active value: ${fmt(activeValue)}`}</p>
    </section>
  )
}
