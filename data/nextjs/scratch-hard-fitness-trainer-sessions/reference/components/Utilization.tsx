'use client'
import { useStudio } from '../hooks/useStudio'

export function Utilization() {
  const { trainers, sessions, hideAvailable } = useStudio()

  const rows = trainers.map((t) => {
    const booked = sessions
      .filter((s) => s.trainerId === t.id)
      .reduce((sum, s) => sum + s.hours, 0)
    return { ...t, booked, overbooked: booked > t.cap }
  })
  const visible = rows.filter((r) => !hideAvailable || r.booked >= r.cap)

  const totalCap = trainers.reduce((sum, t) => sum + t.cap, 0)
  const totalBooked = sessions.reduce((sum, s) => sum + s.hours, 0)
  const pct = totalCap === 0 ? 0 : Math.round((totalBooked / totalCap) * 100)

  return (
    <section aria-label="Utilization view">
      <h1>Utilization</h1>
      {visible.map((r) => (
        <div key={r.id}>
          <span>{`${r.name}: ${r.booked}/${r.cap}h`}</span>
          {r.overbooked && <span>{`${r.name} overbooked`}</span>}
        </div>
      ))}
      <p>{`Studio utilization: ${pct}%`}</p>
    </section>
  )
}
