'use client'
import { useApp } from '../hooks/useApp'

export function Revenue() {
  const { dishes, tickets } = useApp()
  const dishById = (id: number) => dishes.find((d) => d.id === id)

  const agg: { name: string; revenue: number; qty: number }[] = []
  const idx: Record<number, number> = {}
  tickets.forEach((t) => {
    const d = dishById(t.dishId)
    if (!d) return
    if (idx[d.id] === undefined) {
      idx[d.id] = agg.length
      agg.push({ name: d.name, revenue: 0, qty: 0 })
    }
    const row = agg[idx[d.id]]
    row.revenue += d.price * t.qty
    row.qty += t.qty
  })

  agg.sort((a, b) => (b.revenue - a.revenue) || a.name.localeCompare(b.name))
  const top = agg.length > 0 ? agg[0].name : 'none'

  return (
    <section aria-label="Revenue view">
      <h1>Revenue</h1>
      <ul>
        {agg.map((r) => (
          <li key={r.name}>{`${r.name}: $${r.revenue} (${r.qty} sold)`}</li>
        ))}
      </ul>
      <p>{`Top seller: ${top}`}</p>
    </section>
  )
}
