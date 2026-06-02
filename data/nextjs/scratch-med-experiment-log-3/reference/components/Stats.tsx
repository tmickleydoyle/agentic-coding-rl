'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { experiments } = useApp()
  const total = experiments.length
  const running = experiments.filter((e) => e.status === 'running').length
  const done = experiments.filter((e) => e.status === 'done').length
  const aWins = experiments.filter((e) => e.status === 'done' && e.winner === 'A').length
  const bWins = experiments.filter((e) => e.status === 'done' && e.winner === 'B').length
  const winRate = done === 0 ? 0 : Math.round((done / done) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Running: ${running}`}</p>
      <p>{`Done: ${done}`}</p>
      <p>{`Win rate: ${winRate}%`}</p>
      <p>{`A wins: ${aWins}`}</p>
      <p>{`B wins: ${bWins}`}</p>
    </section>
  )
}
