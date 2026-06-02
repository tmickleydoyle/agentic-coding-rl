'use client'
import { useSalon } from '../hooks/useSalon'
import { serviceStats } from '../lib/derive'

export function Services() {
  const { sales } = useSalon()
  const stats = serviceStats(sales)
  return (
    <section aria-label="Services view">
      <h1>Services</h1>
      {stats.map((s) => (
        <div key={s.name}>
          <span>{`${s.name}: ${s.count} sold, $${s.revenue} revenue`}</span>
        </div>
      ))}
    </section>
  )
}
