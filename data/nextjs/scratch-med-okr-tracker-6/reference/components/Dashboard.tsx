'use client'
import { useApp } from '../hooks/useApp'

export function Dashboard() {
  const { objectives } = useApp()
  const total = objectives.length
  const onTrack = objectives.filter((o) => o.progress >= 70).length
  const needsAttention = total - onTrack
  const avg = total === 0 ? 0 : Math.round(objectives.reduce((s, o) => s + o.progress, 0) / total)

  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total objectives: ${total}`}</p>
      <p>{`On track: ${onTrack}`}</p>
      <p>{`Needs attention: ${needsAttention}`}</p>
      <p>{`Average progress: ${avg}%`}</p>
    </section>
  )
}
