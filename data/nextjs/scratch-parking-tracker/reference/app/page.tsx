'use client'
import { useState } from 'react'

interface Session {
  id: number
  location: string
  date: string
  duration: number
  cost: number
  notes: string
}

const SEED: Session[] = [
  { id: 1, location: 'Downtown Garage', date: '2024-01-10', duration: 2, cost: 8.00, notes: 'Level 3' },
  { id: 2, location: 'Airport Lot B', date: '2024-01-12', duration: 48, cost: 72.00, notes: 'Long term' },
  { id: 3, location: 'Street Meter', date: '2024-01-15', duration: 1, cost: 2.50, notes: '' },
]

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(SEED.map(s => ({ ...s })))
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [duration, setDuration] = useState('')
  const [cost, setCost] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')
  const [nextId, setNextId] = useState(4)

  const handleAdd = () => {
    if (!location.trim() || !date || !duration || !cost || Number(duration) <= 0 || Number(cost) < 0) {
      setError('Please fill in all required fields')
      return
    }
    setError('')
    const session: Session = {
      id: nextId,
      location: location.trim(),
      date,
      duration: Number(duration),
      cost: Number(cost),
      notes: notes.trim(),
    }
    setSessions(prev => [...prev, session])
    setNextId(n => n + 1)
    setLocation('')
    setDate('')
    setDuration('')
    setCost('')
    setNotes('')
  }

  const handleDelete = (id: number) => {
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  const filteredSessions = sessions.filter(s =>
    s.location.toLowerCase().includes(filter.toLowerCase())
  )

  const totalSessions = sessions.length
  const totalCost = sessions.reduce((sum, s) => sum + s.cost, 0)
  const avgCost = totalSessions > 0 ? totalCost / totalSessions : 0

  return (
    <div>
      <h1>Parking Tracker</h1>

      <div>
        <h2>Add Parking Session</h2>
        {error && <p data-testid="error-msg">{error}</p>}
        <div>
          <label htmlFor="location-input">Location</label>
          <input
            id="location-input"
            data-testid="location-input"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Location"
          />
        </div>
        <div>
          <label htmlFor="date-input">Date</label>
          <input
            id="date-input"
            data-testid="date-input"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="duration-input">Duration (hours)</label>
          <input
            id="duration-input"
            data-testid="duration-input"
            type="number"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            placeholder="Hours"
          />
        </div>
        <div>
          <label htmlFor="cost-input">Cost ($)</label>
          <input
            id="cost-input"
            data-testid="cost-input"
            type="number"
            step="0.01"
            value={cost}
            onChange={e => setCost(e.target.value)}
            placeholder="Cost"
          />
        </div>
        <div>
          <label htmlFor="notes-input">Notes</label>
          <input
            id="notes-input"
            data-testid="notes-input"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notes (optional)"
          />
        </div>
        <button data-testid="add-btn" onClick={handleAdd}>Add Session</button>
      </div>

      <div>
        <h2>Summary</h2>
        <p>Total Sessions: <span data-testid="total-sessions">{totalSessions}</span></p>
        <p>Total Cost: <span data-testid="total-cost">${totalCost.toFixed(2)}</span></p>
        <p>Average Cost: <span data-testid="avg-cost">${avgCost.toFixed(2)}</span></p>
      </div>

      <div>
        <label htmlFor="filter-input">Filter by Location</label>
        <input
          id="filter-input"
          data-testid="filter-input"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter by location..."
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>Date</th>
            <th>Duration</th>
            <th>Cost</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSessions.map(s => (
            <tr key={s.id} data-testid="session-row">
              <td data-testid={`location-${s.id}`}>{s.location}</td>
              <td data-testid={`date-${s.id}`}>{s.date}</td>
              <td data-testid={`duration-${s.id}`}>{s.duration} hrs</td>
              <td data-testid={`cost-${s.id}`}>${s.cost.toFixed(2)}</td>
              <td data-testid={`notes-${s.id}`}>{s.notes}</td>
              <td>
                <button data-testid={`delete-btn-${s.id}`} onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
