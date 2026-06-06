'use client'
import { useState } from 'react'

interface Event {
  id: number
  name: string
  date: string
  capacity: number
  rsvps: string[]
}

const SEED: Event[] = [
  { id: 1, name: 'Tech Conference 2025', date: '2025-09-15', capacity: 3, rsvps: ['Alice', 'Bob'] },
  { id: 2, name: 'Design Workshop', date: '2025-10-01', capacity: 2, rsvps: ['Carol'] },
  { id: 3, name: 'Startup Mixer', date: '2025-11-10', capacity: 4, rsvps: [] },
  { id: 4, name: 'AI Summit', date: '2025-12-05', capacity: 2, rsvps: ['Dave', 'Eve'] },
]

export default function App() {
  const [events, setEvents] = useState<Event[]>(SEED.map(e => ({ ...e, rsvps: [...e.rsvps] })))
  const [selectedId, setSelectedId] = useState<number>(SEED[0].id)
  const [name, setName] = useState('')

  function handleRsvp() {
    const trimmed = name.trim()
    if (!trimmed) return
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id !== selectedId) return ev
        const spots = ev.capacity - ev.rsvps.length
        if (spots <= 0) return ev
        if (ev.rsvps.some(r => r.toLowerCase() === trimmed.toLowerCase())) return ev
        return { ...ev, rsvps: [...ev.rsvps, trimmed] }
      })
    )
    setName('')
  }

  function handleCancel(eventId: number, rsvpName: string) {
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id !== eventId) return ev
        return { ...ev, rsvps: ev.rsvps.filter(r => r !== rsvpName) }
      })
    )
  }

  const totalRsvps = events.reduce((sum, ev) => sum + ev.rsvps.length, 0)
  const openEvents = events.filter(ev => ev.capacity - ev.rsvps.length > 0).length

  return (
    <div>
      <h1>Event RSVP Manager</h1>
      <p data-testid="total-rsvps">Total RSVPs: {totalRsvps}</p>
      <p data-testid="open-events">Open Events: {openEvents}</p>

      {events.map(ev => {
        const spots = ev.capacity - ev.rsvps.length
        const status = spots > 0 ? 'Open' : 'Full'
        const dateStr = new Date(ev.date + 'T00:00:00').toLocaleDateString()
        return (
          <div key={ev.id} data-testid={`event-card-${ev.id}`}>
            <h2>{ev.name}</h2>
            <p>{dateStr}</p>
            <p data-testid={`spots-${ev.id}`}>Spots left: {spots}</p>
            <span data-testid={`status-${ev.id}`}>{status}</span>
            <ul data-testid={`rsvp-list-${ev.id}`}>
              {ev.rsvps.map(r => (
                <li key={r}>
                  {r}
                  <button onClick={() => handleCancel(ev.id, r)}>Cancel</button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}

      <div>
        <h2>RSVP</h2>
        <select
          aria-label="Select event"
          value={selectedId}
          onChange={e => setSelectedId(Number(e.target.value))}
        >
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.name}</option>
          ))}
        </select>
        <input
          aria-label="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button onClick={handleRsvp}>RSVP</button>
      </div>
    </div>
  )
}
