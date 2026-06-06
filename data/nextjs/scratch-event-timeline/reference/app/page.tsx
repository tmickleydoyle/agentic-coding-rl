'use client'
import { useState } from 'react'

interface TimelineEvent {
  id: number
  date: string
  title: string
  description: string
}

const SEED: TimelineEvent[] = [
  { id: 1, date: '2024-01-15', title: 'Project Kickoff', description: 'Team gathered to start the project' },
  { id: 2, date: '2024-03-10', title: 'First Prototype', description: 'Initial prototype demo completed' },
  { id: 3, date: '2024-05-22', title: 'Beta Launch', description: 'Beta version released to testers' },
  { id: 4, date: '2024-08-05', title: 'User Testing', description: 'Conducted user testing sessions' },
  { id: 5, date: '2024-11-30', title: 'Public Launch', description: 'Product launched to the public' },
]

export default function App() {
  const [events, setEvents] = useState<TimelineEvent[]>(SEED.map(e => ({ ...e })))
  const [date, setDate] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [nextId, setNextId] = useState(SEED.length + 1)

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date))

  function addEvent() {
    if (!date.trim() || !title.trim() || !description.trim()) return
    const newEvent: TimelineEvent = { id: nextId, date, title: title.trim(), description: description.trim() }
    setEvents(prev => [...prev, newEvent])
    setNextId(n => n + 1)
    setDate('')
    setTitle('')
    setDescription('')
  }

  function deleteEvent(id: number) {
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div>
      <h1>Event Timeline</h1>
      <p data-testid="event-count">{events.length} events</p>

      <div>
        {sorted.map(ev => (
          <div key={ev.id} data-testid="event-card">
            <span data-testid="event-date">{ev.date}</span>
            <strong data-testid="event-title">{ev.title}</strong>
            <p data-testid="event-description">{ev.description}</p>
            <button onClick={() => deleteEvent(ev.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div>
        <h2>Add Event</h2>
        <label>
          Event Date
          <input
            aria-label="Event Date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </label>
        <label>
          Event Title
          <input
            aria-label="Event Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>
        <label>
          Event Description
          <textarea
            aria-label="Event Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </label>
        <button onClick={addEvent}>Add Event</button>
      </div>
    </div>
  )
}
