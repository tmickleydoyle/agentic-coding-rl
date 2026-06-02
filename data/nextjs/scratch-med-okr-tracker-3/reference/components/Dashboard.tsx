'use client'
import { useApp } from '../hooks/useApp'

export function Dashboard() {
  const { objectives } = useApp()
  const total = objectives.length
  const avg = total === 0 ? 0 : Math.round(objectives.reduce((s, o) => s + o.progress, 0) / total)
  const onTrack = objectives.filter((o) => o.progress >= 70).length
  const offTrack = objectives.filter((o) => o.progress < 70).length
  return (
    <section aria-label="Dashboard view">
      <h1>Dashboard</h1>
      <p>{`Total objectives: ${total}`}</p>
      <p>{`Average progress: ${avg}%`}</p>
      <p>{`On track: ${onTrack}`}</p>
      <p>{`Off track: ${offTrack}`}</p>
    </section>
  )
}
