'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Session, Event } from '../../lib/types'

export function SchedulePage() {
  const { triggerRefresh } = useApp()
  const [sessions, setSessions] = useState<Session[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [title, setTitle] = useState('')
  const [eventId, setEventId] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [speaker, setSpeaker] = useState('')

  function load() {
    fetch('/api/sessions').then(r => r.json()).then(setSessions)
    fetch('/api/events').then(r => r.json()).then(setEvents)
  }
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, eventId, startTime, endTime, speaker }),
    })
    setTitle(''); setEventId(''); setStartTime(''); setEndTime(''); setSpeaker('')
    load(); triggerRefresh()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Schedule</h1>
      <form data-testid="add-session-form" onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '2rem' }}>
        <input data-testid="input-session-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Session Title" required />
        <select data-testid="select-session-event" value={eventId} onChange={e => setEventId(e.target.value)} required>
          <option value="">Select event</option>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
        </select>
        <input data-testid="input-session-start" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
        <input data-testid="input-session-end" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
        <input data-testid="input-session-speaker" value={speaker} onChange={e => setSpeaker(e.target.value)} placeholder="Speaker" required />
        <button data-testid="btn-add-session" type="submit">Add Session</button>
      </form>
      <ul data-testid="session-list" style={{ listStyle: 'none', padding: 0 }}>
        {sessions.map(s => (
          <li key={s.id} data-testid="session-item" style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '0.5rem' }}>
            <span data-testid="session-title" style={{ fontWeight: 'bold' }}>{s.title}</span>
            {' | '}
            <span data-testid="session-speaker">{s.speaker}</span>
            {' | '}
            <span data-testid="session-time">{s.startTime} - {s.endTime}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
