'use client'
import { useState } from 'react'
import { useSalon } from '../hooks/useSalon'
import { STYLISTS, SLOTS, DURATIONS, fmt, endOf } from '../lib/types'
import { conflictingIds } from '../lib/derive'

export function Schedule() {
  const { appts, addAppt, removeAppt, conflictsOnly } = useSalon()
  const [client, setClient] = useState('')
  const [stylist, setStylist] = useState(STYLISTS[0])
  const [start, setStart] = useState(SLOTS[0].minutes)
  const [duration, setDuration] = useState(DURATIONS[0])

  const conflicts = conflictingIds(appts)
  const visible = appts.filter((a) => !conflictsOnly || conflicts.has(a.id))

  return (
    <section aria-label="Schedule view">
      <h1>Schedule</h1>
      <input aria-label="Client" value={client} onChange={(e) => setClient(e.target.value)} />
      <select aria-label="Stylist" value={stylist} onChange={(e) => setStylist(e.target.value)}>
        {STYLISTS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select aria-label="Start time" value={start} onChange={(e) => setStart(Number(e.target.value))}>
        {SLOTS.map((s) => (
          <option key={s.minutes} value={s.minutes}>{s.label}</option>
        ))}
      </select>
      <select aria-label="Duration" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
        {DURATIONS.map((d) => (
          <option key={d} value={d}>{`${d} min`}</option>
        ))}
      </select>
      <button
        onClick={() => {
          addAppt(client, stylist, start, duration)
          setClient('')
        }}
      >
        Book slot
      </button>
      <ul>
        {visible.map((a) => (
          <li key={a.id}>
            <span>
              {`${a.client} with ${a.stylist}: ${fmt(a.start)}-${fmt(endOf(a))}${conflicts.has(a.id) ? ' (conflict)' : ''}`}
            </span>
            <button aria-label={`Remove ${a.client}`} onClick={() => removeAppt(a.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
