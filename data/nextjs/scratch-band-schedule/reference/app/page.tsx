'use client'
import { useState } from 'react'

interface Rehearsal {
  id: number
  title: string
  date: string
  time: string
  location: string
  attendees: string[]
  notes: string
}

const SEED: Rehearsal[] = [
  { id: 1, title: 'Weekly Rehearsal', date: '2024-02-05', time: '19:00', location: 'Studio A', attendees: ['Alice', 'Bob', 'Carol'], notes: 'Focus on new setlist' },
  { id: 2, title: 'Pre-show Run-through', date: '2024-02-10', time: '14:00', location: 'Venue Backstage', attendees: ['Alice', 'Bob', 'Carol', 'Dave'], notes: 'Full set with stage presence' },
  { id: 3, title: 'New Song Workshop', date: '2024-02-12', time: '18:30', location: 'Studio A', attendees: ['Alice', 'Carol'], notes: 'Work on original material' },
  { id: 4, title: 'Weekly Rehearsal', date: '2024-02-19', time: '19:00', location: 'Studio B', attendees: ['Alice', 'Bob', 'Dave'], notes: 'Timing and dynamics' },
]

export default function App() {
  const [rehearsals, setRehearsals] = useState<Rehearsal[]>(SEED.map(r => ({ ...r, attendees: [...r.attendees] })))
  const [filterLocation, setFilterLocation] = useState('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [attendeesInput, setAttendeesInput] = useState('')
  const [notes, setNotes] = useState('')

  const handleAdd = () => {
    if (!title.trim() || !date) return
    const parsed = attendeesInput
      ? attendeesInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : []
    const newId = rehearsals.length > 0 ? Math.max(...rehearsals.map(r => r.id)) + 1 : 1
    const updated = [...rehearsals, { id: newId, title: title.trim(), date, time, location, attendees: parsed, notes }]
    updated.sort((a, b) => a.date.localeCompare(b.date))
    setRehearsals(updated)
    setTitle('')
    setDate('')
    setTime('')
    setLocation('')
    setAttendeesInput('')
    setNotes('')
  }

  const handleDelete = (id: number) => {
    setRehearsals(rehearsals.filter(r => r.id !== id))
  }

  const sortedRehearsals = [...rehearsals].sort((a, b) => a.date.localeCompare(b.date))

  const filteredRehearsals = filterLocation
    ? sortedRehearsals.filter(r => r.location.toLowerCase().includes(filterLocation.toLowerCase()))
    : sortedRehearsals

  const uniqueAttendees = (() => {
    const set: Record<string, boolean> = {}
    rehearsals.forEach(r => {
      r.attendees.forEach(a => { set[a] = true })
    })
    return Object.keys(set).length
  })()

  return (
    <div>
      <h1>Band Schedule</h1>

      <div>
        <h2>Add Rehearsal</h2>
        <input
          aria-label="Title"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          data-testid="input-title"
        />
        <input
          type="date"
          aria-label="Date"
          value={date}
          onChange={e => setDate(e.target.value)}
          data-testid="input-date"
        />
        <input
          type="time"
          aria-label="Time"
          value={time}
          onChange={e => setTime(e.target.value)}
          data-testid="input-time"
        />
        <input
          aria-label="Location"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          data-testid="input-location"
        />
        <input
          aria-label="Attendees"
          placeholder="Attendees (comma-separated)"
          value={attendeesInput}
          onChange={e => setAttendeesInput(e.target.value)}
          data-testid="input-attendees"
        />
        <input
          aria-label="Notes"
          placeholder="Notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          data-testid="input-notes"
        />
        <button onClick={handleAdd} data-testid="btn-add">Add Rehearsal</button>
      </div>

      <div>
        <input
          aria-label="Filter by location"
          placeholder="Filter by location"
          value={filterLocation}
          onChange={e => setFilterLocation(e.target.value)}
          data-testid="filter-location"
        />
      </div>

      <div>
        <span data-testid="stat-total">{rehearsals.length}</span>
        <span data-testid="stat-unique-attendees">{uniqueAttendees}</span>
      </div>

      <ul data-testid="rehearsal-list">
        {filteredRehearsals.map(r => (
          <li key={r.id} data-testid={`rehearsal-item-${r.id}`}>
            <span data-testid={`rehearsal-title-${r.id}`}>{r.title}</span>
            <span data-testid={`rehearsal-date-${r.id}`}>{r.date}</span>
            <span data-testid={`rehearsal-time-${r.id}`}>{r.time}</span>
            <span data-testid={`rehearsal-location-${r.id}`}>{r.location}</span>
            <span data-testid={`attendees-${r.id}`}>{r.attendees.join(', ')}</span>
            <span data-testid={`rehearsal-notes-${r.id}`}>{r.notes}</span>
            <button onClick={() => handleDelete(r.id)} data-testid={`delete-btn-${r.id}`}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
