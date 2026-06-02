'use client'
import { useSalon } from '../hooks/useSalon'
import { STYLISTS } from '../lib/types'

export function Stylists() {
  const { appts } = useSalon()
  return (
    <section aria-label="Stylists view">
      <h1>Stylists</h1>
      {STYLISTS.map((name) => {
        const mine = appts.filter((a) => a.stylist === name && a.status !== 'cancelled')
        const count = mine.length
        const revenue = mine
          .filter((a) => a.status === 'completed')
          .reduce((s, a) => s + a.price, 0)
        return (
          <div key={name}>
            <span>{`${name}: ${count} bookings, $${revenue} earned`}</span>
          </div>
        )
      })}
    </section>
  )
}
