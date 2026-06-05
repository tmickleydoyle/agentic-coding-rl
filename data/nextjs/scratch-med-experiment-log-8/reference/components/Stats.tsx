'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { experiments } = useApp()
  const total = experiments.length
  const running = experiments.filter((e) => e.status === 'running').length
  const finished = experiments.filter((e) => e.status === 'done').length
  const winA = experiments.filter((e) => e.status === 'done' && e.winner === 'A').length
  const winB = experiments.filter((e) => e.status === 'done' && e.winner === 'B').length
  const pctA = finished === 0 ? 0 : Math.round((winA / finished) * 100)
  const pctB = finished === 0 ? 0 : Math.round((winB / finished) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`Running: ${running}`}</p>
      <p>{`Finished: ${finished}`}</p>
      <p>{`Win rate A: ${pctA}%`}</p>
      <p>{`Win rate B: ${pctB}%`}</p>
    </section>
  )
}
