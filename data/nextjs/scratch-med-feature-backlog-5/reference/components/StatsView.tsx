'use client'
import { useApp } from '../hooks/useApp'

export function StatsView() {
  const { features } = useApp()
  const total = features.length
  const countP = (p: string) => features.filter((f) => f.priority === p).length
  const countS = (s: string) => features.filter((f) => f.status === s).length
  const shippedRate = total === 0 ? 0 : Math.round((countS('shipped') / total) * 100)
  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total: ${total}`}</p>
      <p>{`P0: ${countP('P0')}`}</p>
      <p>{`P1: ${countP('P1')}`}</p>
      <p>{`P2: ${countP('P2')}`}</p>
      <p>{`Idea: ${countS('idea')}`}</p>
      <p>{`Building: ${countS('building')}`}</p>
      <p>{`Shipped: ${countS('shipped')}`}</p>
      <p>{`Shipped rate: ${shippedRate}%`}</p>
    </section>
  )
}
