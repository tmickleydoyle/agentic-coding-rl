'use client'
import { useApp } from '../hooks/useApp'

export function StatsView() {
  const { objectives } = useApp()
  const total = objectives.length
  const avg =
    total === 0
      ? 0
      : Math.round(
          objectives.reduce((sum, o) => sum + o.progress, 0) / total
        )
  const onTrack = objectives.filter((o) => o.progress >= 70).length
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total objectives: ${total}`}</p>
      <p>{`Average progress: ${avg}%`}</p>
      <p>{`On-track (>=70%): ${onTrack}`}</p>
    </section>
  )
}
