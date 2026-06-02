'use client'
import { useApp } from '../hooks/useApp'

export function Pipeline() {
  const { leads } = useApp()
  const total = leads.length
  const countStage = (s: string) => leads.filter((l) => l.stage === s).length
  const totalPipeline = leads.reduce((sum, l) => sum + l.value, 0)
  const wonPipeline = leads.filter((l) => l.stage === 'won').reduce((sum, l) => sum + l.value, 0)
  return (
    <section aria-label="Pipeline view">
      <h1>Pipeline</h1>
      <p>{`Total leads: ${total}`}</p>
      <p>{`New: ${countStage('new')}`}</p>
      <p>{`Demo: ${countStage('demo')}`}</p>
      <p>{`Won: ${countStage('won')}`}</p>
      <p>{`Total pipeline: $${totalPipeline}`}</p>
      <p>{`Won pipeline: $${wonPipeline}`}</p>
    </section>
  )
}
