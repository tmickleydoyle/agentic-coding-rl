'use client'
import { useApp } from '../hooks/useApp'
import type { Stage } from '../lib/types'

export function Pipeline() {
  const { leads } = useApp()
  const total = leads.length
  const count = (s: Stage) => leads.filter((l) => l.stage === s).length
  const totalValue = leads.reduce((sum, l) => sum + l.dealValue, 0)
  const wonValue = leads.filter((l) => l.stage === 'won').reduce((sum, l) => sum + l.dealValue, 0)
  return (
    <section aria-label="Pipeline view">
      <h1>Pipeline</h1>
      <p>{`Total leads: ${total}`}</p>
      <p>{`New: ${count('new')}`}</p>
      <p>{`Demo: ${count('demo')}`}</p>
      <p>{`Won: ${count('won')}`}</p>
      <p>{`Total value: $${totalValue.toFixed(2)}`}</p>
      <p>{`Won value: $${wonValue.toFixed(2)}`}</p>
    </section>
  )
}
