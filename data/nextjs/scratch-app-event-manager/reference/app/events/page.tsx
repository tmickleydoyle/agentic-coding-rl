'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Event } from '../../lib/types'

export function EventsPage() {
  const { triggerRefresh } = useApp()
  const [events, setEvents] = useState<Event[]>([])
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [venue, setVenue] = useState('')
  const [capacity, setCapacity] = useState('')

  function load() { fetch('/api/events').then(r => r.json()).then(setEvents) }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, date, venue, capacity: Number(capacity) }),
    })
    setName(''); setDate(''); setVenue(''); setCapacity('')
    load(); triggerRefresh()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Events</h1>
      <form data-testid="add-event-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <input data-testid="input-event-name" value={name} onChange={e => setName(e.target.value)} placeholder="Event Name" required />
        <input data-testid="input-event-date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <input data-testid="input-event-venue" value={venue} onChange={e => setVenue(e.target.value)} placeholder="Venue" required />
        <input data-testid="input-event-capacity" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="Capacity" required />
        <button data-testid="btn-add-event" type="submit">Add Event</button>
      </form>
      <ul data-testid="event-list" style={{ listStyle: 'none', padding: 0 }}>
        {events.map(ev => (
          <li key={ev.id} data-testid="event-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="event-name" style={{ fontWeight: 'bold' }}>{ev.name}</span>
            {' | '}
            <span data-testid="event-venue">{ev.venue}</span>
            {' | '}
            <span data-testid="event-status" style={{ color: ev.status === 'upcoming' ? 'blue' : 'gray' }}>{ev.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
