'use client'
import { useSalon } from '../hooks/useSalon'
import { STYLISTS } from '../lib/types'
import { conflictingIds } from '../lib/derive'

export function Reports() {
  const { appts } = useSalon()
  const total = appts.length
  const conflicting = conflictingIds(appts).size
  const clean = total - conflicting
  return (
    <section aria-label="Reports view">
      <h1>Reports</h1>
      <p>{`Total appointments: ${total}`}</p>
      <p>{`Conflict-free: ${clean}`}</p>
      <p>{`In conflict: ${conflicting}`}</p>
      {STYLISTS.map((s) => (
        <p key={s}>{`${s} booked: ${appts.filter((a) => a.stylist === s).length}`}</p>
      ))}
    </section>
  )
}
