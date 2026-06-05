'use client'
import { useApp } from '../hooks/useApp'

export function Pipeline() {
  const { leads } = useApp()
  const total = leads.length
  const countStage = (s: string) => leads.filter((l) => l.stage === s).length
  const sumAll = leads.reduce((acc, l) => acc + l.value, 0)
  const sumWon = leads.filter((l) => l.stage === 'won').reduce((acc, l) => acc + l.value, 0)
  const winRate = total === 0 ? 0 : Math.round((countStage('won') / total) * 100)
  return (
    <section aria-label="Pipeline view">
      <h1>Pipeline</h1>
      <p>{`Total Leads: ${total}`}</p>
      <p>{`New: ${countStage('new')}`}</p>
      <p>{`Demo: ${countStage('demo')}`}</p>
      <p>{`Won: ${countStage('won')}`}</p>
      <p>{`Total Pipeline: $${sumAll}`}</p>
      <p>{`Won Pipeline: $${sumWon}`}</p>
      <p>{`Win Rate: ${winRate}%`}</p>
    </section>
  )
}
