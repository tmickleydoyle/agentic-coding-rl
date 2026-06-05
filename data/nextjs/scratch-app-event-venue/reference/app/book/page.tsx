'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function BookPage() {
  const { venues, dates, selectedVenueId, book, navigate } = useApp()
  const venue = venues.find((v) => v.id === selectedVenueId)
  const [organizer, setOrganizer] = useState('')
  const [date, setDate] = useState(dates[0] ?? '')
  const [attendees, setAttendees] = useState(1)
  const [error, setError] = useState('')
  const [bookError, setBookError] = useState(false)

  if (!venue) {
    return (
      <section data-testid="page-book">
        <h1>Book</h1>
        <p data-testid="no-venue">No venue selected.</p>
      </section>
    )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setBookError(false)
    if (organizer.trim().length === 0) {
      setError('Organizer is required')
      return
    }
    setError('')
    const ok = book({ venueId: venue.id, date, attendees, organizer: organizer.trim() })
    if (!ok) {
      setBookError(true)
      return
    }
    setOrganizer('')
    navigate('bookings')
  }

  return (
    <section data-testid="page-book">
      <h1>Book {venue.name}</h1>
      <form data-testid="book-form" onSubmit={onSubmit}>
        <label htmlFor="organizer">Organizer</label>
        <input
          id="organizer"
          data-testid="organizer-input"
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
        />

        <label htmlFor="date">Date</label>
        <select
          id="date"
          data-testid="date-select"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        >
          {dates.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <label htmlFor="attendees">Attendees</label>
        <input
          id="attendees"
          type="number"
          data-testid="attendees-input"
          value={attendees}
          onChange={(e) => setAttendees(Number(e.target.value))}
        />

        {error ? <p data-testid="form-error">{error}</p> : null}
        {bookError ? <p data-testid="book-error">Could not book this venue.</p> : null}

        <button type="submit" data-testid="submit-book">
          Book
        </button>
      </form>
    </section>
  )
}
