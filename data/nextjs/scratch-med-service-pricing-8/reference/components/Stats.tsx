'use client'
import { useApp } from '../hooks/useApp'
import { fmt } from '../lib/fmt'

export function Stats() {
  const { services } = useApp()
  const total = services.length
  const active = services.filter((s) => s.active)
  const inactive = total - active.length

  const avg = (arr: { price: number }[]) =>
    arr.length === 0 ? 0 : arr.reduce((s, x) => s + x.price, 0) / arr.length

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total services: ${total}`}</p>
      <p>{`Active: ${active.length}`}</p>
      <p>{`Inactive: ${inactive}`}</p>
      <p>{`Average price: ${fmt(avg(services))}`}</p>
      <p>{`Active average: ${fmt(avg(active))}`}</p>
    </section>
  )
}
