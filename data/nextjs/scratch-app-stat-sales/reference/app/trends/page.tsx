'use client'
import { useSales } from '../../hooks/useSales'

export default function TrendsPage() {
  const { byMonth } = useSales()
  const jan = byMonth.find((m) => m.month === 'Jan')?.revenue ?? 0
  const mar = byMonth.find((m) => m.month === 'Mar')?.revenue ?? 0
  const direction = mar > jan ? 'up' : mar < jan ? 'down' : 'flat'
  return (
    <section data-testid="page-trends">
      <h1>Trends</h1>
      <ul data-testid="month-list">
        {byMonth.map((m) => (
          <li key={m.month} data-testid={`month-${m.month}`}>
            <span data-testid={`month-${m.month}-revenue`}>{m.revenue}</span>
          </li>
        ))}
      </ul>
      <span data-testid="trend-direction">{direction}</span>
    </section>
  )
}
