'use client'
import { useStudio } from '../hooks/useStudio'

export function Roster() {
  const { classes, bookings, hideFull } = useStudio()

  const rows = classes.map((c) => {
    const confirmed = bookings.filter((b) => b.classId === c.id && !b.waitlisted).length
    const waitlist = bookings.filter((b) => b.classId === c.id && b.waitlisted).length
    return { ...c, confirmed, waitlist, full: confirmed >= c.capacity }
  })
  const visible = rows.filter((r) => !hideFull || !r.full)

  return (
    <section aria-label="Roster view">
      <h1>Roster</h1>
      {visible.map((r) => (
        <div key={r.id}>
          <span>{`${r.name}: ${r.confirmed}/${r.capacity} booked`}</span>
          {r.full && <span>{`${r.name} FULL`}</span>}
          {r.waitlist > 0 && <span>{`${r.name} waitlist: ${r.waitlist}`}</span>}
        </div>
      ))}
    </section>
  )
}
