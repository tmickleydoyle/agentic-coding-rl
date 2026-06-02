'use client'
import { useApp } from '../hooks/useApp'

export function Summary() {
  const { leads } = useApp()
  const total = leads.length
  const countNew = leads.filter((l) => l.stage === 'new').length
  const countDemo = leads.filter((l) => l.stage === 'demo').length
  const countWon = leads.filter((l) => l.stage === 'won').length
  const totalPipeline = leads.reduce((sum, l) => sum + l.dealValue, 0)
  const wonValue = leads.filter((l) => l.stage === 'won').reduce((sum, l) => sum + l.dealValue, 0)

  return (
    <section aria-label="Summary view">
      <h1>Summary</h1>
      <p>{`Total leads: ${total}`}</p>
      <p>{`New: ${countNew}`}</p>
      <p>{`Demo: ${countDemo}`}</p>
      <p>{`Won: ${countWon}`}</p>
      <p>{`Total pipeline: $${totalPipeline}`}</p>
      <p>{`Won value: $${wonValue}`}</p>
    </section>
  )
}
