'use client'
import { useState } from 'react'

interface Gig {
  id: number
  venue: string
  date: string
  city: string
  pay: number
  status: string
  notes: string
}

const SEED: Gig[] = [
  { id: 1, venue: 'The Blue Moon', date: '2024-01-20', city: 'Austin', pay: 150, status: 'completed', notes: 'Great crowd' },
  { id: 2, venue: 'Rock Arena', date: '2024-02-14', city: 'Dallas', pay: 500, status: 'confirmed', notes: "Valentine's show" },
  { id: 3, venue: 'Café Noir', date: '2024-01-28', city: 'Austin', pay: 80, status: 'completed', notes: 'Acoustic set' },
  { id: 4, venue: 'The Venue', date: '2024-03-01', city: 'Houston', pay: 300, status: 'pending', notes: 'Awaiting contract' },
  { id: 5, venue: 'Sound Garden', date: '2024-02-22', city: 'Austin', pay: 200, status: 'confirmed', notes: 'Birthday party' },
]

export default function App() {
  const [gigs, setGigs] = useState<Gig[]>(SEED.map(g => ({ ...g })))
  const [filterStatus, setFilterStatus] = useState('All')
  const [venue, setVenue] = useState('')
  const [date, setDate] = useState('')
  const [city, setCity] = useState('')
  const [pay, setPay] = useState('')
  const [status, setStatus] = useState('pending')
  const [notes, setNotes] = useState('')

  const handleAdd = () => {
    if (!venue.trim() || !date) return
    const newId = gigs.length > 0 ? Math.max(...gigs.map(g => g.id)) + 1 : 1
    const newPay = parseFloat(pay) || 0
    setGigs([...gigs, { id: newId, venue: venue.trim(), date, city, pay: newPay, status, notes }])
    setVenue('')
    setDate('')
    setCity('')
    setPay('')
    setStatus('pending')
    setNotes('')
  }

  const handleDelete = (id: number) => {
    setGigs(gigs.filter(g => g.id !== id))
  }

  const handleStatusChange = (id: number, newStatus: string) => {
    setGigs(gigs.map(g => g.id === id ? { ...g, status: newStatus } : g))
  }

  const sortedGigs = [...gigs].sort((a, b) => a.date.localeCompare(b.date))

  const visibleGigs = filterStatus === 'All'
    ? sortedGigs
    : sortedGigs.filter(g => g.status === filterStatus)

  const totalEarnings = gigs.filter(g => g.status === 'completed').reduce((sum, g) => sum + g.pay, 0)
  const upcomingCount = gigs.filter(g => g.status === 'confirmed' || g.status === 'pending').length

  return (
    <div>
      <h1>Gig Tracker</h1>

      <div>
        <span data-testid="stat-total-gigs">{gigs.length}</span>
        <span data-testid="stat-total-earnings">${totalEarnings}</span>
        <span data-testid="stat-upcoming">{upcomingCount}</span>
      </div>

      <div>
        <select
          aria-label="Filter by status"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          data-testid="filter-status"
        >
          <option value="All">All</option>
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
        </select>
      </div>

      <div>
        <h2>Add Gig</h2>
        <input
          aria-label="Venue"
          placeholder="Venue"
          value={venue}
          onChange={e => setVenue(e.target.value)}
          data-testid="input-venue"
        />
        <input
          type="date"
          aria-label="Date"
          value={date}
          onChange={e => setDate(e.target.value)}
          data-testid="input-date"
        />
        <input
          aria-label="City"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
          data-testid="input-city"
        />
        <input
          type="number"
          aria-label="Pay"
          placeholder="Pay"
          value={pay}
          onChange={e => setPay(e.target.value)}
          data-testid="input-pay"
        />
        <select
          aria-label="Status"
          value={status}
          onChange={e => setStatus(e.target.value)}
          data-testid="input-status"
        >
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="completed">completed</option>
          <option value="cancelled">cancelled</option>
        </select>
        <input
          aria-label="Notes"
          placeholder="Notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          data-testid="input-notes"
        />
        <button onClick={handleAdd} data-testid="btn-add">Add Gig</button>
      </div>

      <ul data-testid="gig-list">
        {visibleGigs.map(g => (
          <li key={g.id} data-testid={`gig-item-${g.id}`}>
            <span data-testid={`gig-venue-${g.id}`}>{g.venue}</span>
            <span data-testid={`gig-date-${g.id}`}>{g.date}</span>
            <span data-testid={`gig-city-${g.id}`}>{g.city}</span>
            <span data-testid={`gig-pay-${g.id}`}>${g.pay}</span>
            <span data-testid={`gig-notes-${g.id}`}>{g.notes}</span>
            <select
              aria-label={`Status for ${g.venue}`}
              value={g.status}
              onChange={e => handleStatusChange(g.id, e.target.value)}
              data-testid={`status-select-${g.id}`}
            >
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
            <button onClick={() => handleDelete(g.id)} data-testid={`delete-btn-${g.id}`}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
