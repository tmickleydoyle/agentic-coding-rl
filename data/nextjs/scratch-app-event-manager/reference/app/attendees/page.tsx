'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Attendee, Event } from '../../lib/types'

export function AttendeesPage() {
  const { triggerRefresh } = useApp()
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [eventId, setEventId] = useState('')

  function load() {
    fetch('/api/attendees').then(r => r.json()).then(setAttendees)
    fetch('/api/events').then(r => r.json()).then(setEvents)
  }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/attendees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, eventId }),
    })
    setName(''); setEmail(''); setEventId('')
    load(); triggerRefresh()
  }

  function eventName(id: string) {
    return events.find(ev => ev.id === id)?.name ?? id
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Attendees</h1>
      <form data-testid="add-attendee-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <input data-testid="input-attendee-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input data-testid="input-attendee-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <select data-testid="select-attendee-event" value={eventId} onChange={e => setEventId(e.target.value)} required>
          <option value="">Select event</option>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
        </select>
        <button data-testid="btn-add-attendee" type="submit">Add Attendee</button>
      </form>
      <ul data-testid="attendee-list" style={{ listStyle: 'none', padding: 0 }}>
        {attendees.map(a => (
          <li key={a.id} data-testid="attendee-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="attendee-name" style={{ fontWeight: 'bold' }}>{a.name}</span>
            {' | '}
            <span data-testid="attendee-email">{a.email}</span>
            {' | '}
            <span data-testid="attendee-event">{eventName(a.eventId)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
