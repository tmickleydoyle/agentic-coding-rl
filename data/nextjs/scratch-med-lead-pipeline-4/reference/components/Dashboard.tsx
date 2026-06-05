'use client'
import { useApp } from '../hooks/useApp'

function fmt(v: number) {
  return `$${v.toFixed(2)}`
}

export function Dashboard() {
  const { leads } = useApp()
  const total = leads.length
  const countNew = leads.filter((l) => l.stage === 'new').length
  const countDemo = leads.filter((l) => l.stage === 'demo').length
  const countWon = leads.filter((l) => l.stage === 'won').length
  const pipelineTotal = leads.reduce((s, l) => s + l.value, 0)
  const wonTotal = leads.filter((l) => l.stage === 'won').reduce((s, l) => s + l.value, 0)
  const winRate = total === 0 ? 0 : Math.round((countWon / total) * 100)
  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total Leads: ${total}`}</p>
      <p>{`New: ${countNew}`}</p>
      <p>{`Demo: ${countDemo}`}</p>
      <p>{`Won: ${countWon}`}</p>
      <p>{`Pipeline Total: ${fmt(pipelineTotal)}`}</p>
      <p>{`Won Total: ${fmt(wonTotal)}`}</p>
      <p>{`Win Rate: ${winRate}%`}</p>
    </section>
  )
}
