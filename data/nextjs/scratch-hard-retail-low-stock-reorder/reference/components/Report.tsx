'use client'
import { useStock } from '../hooks/useStock'

export function Report() {
  const { items } = useStock()
  const low = items.filter((it) => it.onHand <= it.reorder)
  const buyOf = (onHand: number, target: number) => Math.max(0, target - onHand)
  const total = low.reduce((sum, it) => sum + buyOf(it.onHand, it.target), 0)
  return (
    <section aria-label="Report view">
      <h1>Report</h1>
      <p>{`Items low: ${low.length}`}</p>
      <ul>
        {low.map((it) => (
          <li key={it.id}>{`Reorder ${it.name}: buy ${buyOf(it.onHand, it.target)}`}</li>
        ))}
      </ul>
      <p>{`Total to reorder: ${total}`}</p>
    </section>
  )
}
