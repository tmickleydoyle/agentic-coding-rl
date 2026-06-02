'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { experiments } = useApp()
  const total = experiments.length
  const running = experiments.filter((e) => e.status === 'running').length
  const done = experiments.filter((e) => e.status === 'done').length
  const doneExps = experiments.filter((e) => e.status === 'done')
  const winsA = doneExps.filter((e) => e.winner === 'A').length
  const winsB = doneExps.filter((e) => e.winner === 'B').length
  const winRateA = done === 0 ? 0 : Math.round((winsA / done) * 100)
  const winRateB = done === 0 ? 0 : Math.round((winsB / done) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total experiments: ${total}`}</p>
      <p>{`Running: ${running}`}</p>
      <p>{`Done: ${done}`}</p>
      <p>{`Win rate (A): ${winRateA}%`}</p>
      <p>{`Win rate (B): ${winRateB}%`}</p>
    </section>
  )
}
