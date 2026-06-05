'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { experiments } = useApp()
  const total = experiments.length
  const running = experiments.filter((e) => e.status === 'running').length
  const finished = experiments.filter((e) => e.status === 'done').length
  const winnerA = experiments.filter((e) => e.status === 'done' && e.winner === 'A').length
  const winnerB = experiments.filter((e) => e.status === 'done' && e.winner === 'B').length
  const winRate = total === 0 ? 0 : Math.round((finished / total) * 100)

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Running: ${running}`}</p>
      <p>{`Finished: ${finished}`}</p>
      <p>{`Winner A: ${winnerA}`}</p>
      <p>{`Winner B: ${winnerB}`}</p>
      <p>{`Win rate: ${winRate}%`}</p>
    </section>
  )
}
