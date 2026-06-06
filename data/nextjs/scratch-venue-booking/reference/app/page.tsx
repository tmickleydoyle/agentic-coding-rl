'use client'
import { useState } from 'react'

type VenueType = 'conference' | 'outdoor' | 'meeting' | 'social'

interface Venue {
  id: number
  name: string
  capacity: number
  pricePerDay: number
  type: VenueType
}

interface Booking {
  id: number
  venueId: number
  date: string
  organizer: string
  guests: number
}

const VENUES: Venue[] = [
  { id: 1, name: 'Grand Hall', capacity: 500, pricePerDay: 2000, type: 'conference' },
  { id: 2, name: 'Garden Terrace', capacity: 150, pricePerDay: 800, type: 'outdoor' },
  { id: 3, name: 'Boardroom A', capacity: 20, pricePerDay: 300, type: 'meeting' },
  { id: 4, name: 'Rooftop Lounge', capacity: 100, pricePerDay: 1200, type: 'social' },
]

const SEED_BOOKINGS: Booking[] = [
  { id: 1, venueId: 1, date: '2025-09-20', organizer: 'Alice Corp', guests: 400 },
  { id: 2, venueId: 2, date: '2025-09-20', organizer: 'Bob Events', guests: 120 },
  { id: 3, venueId: 1, date: '2025-09-21', organizer: 'Carol Inc', guests: 300 },
]

export default function App() {
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS.map(b => ({ ...b })))
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedVenueId, setSelectedVenueId] = useState<number>(VENUES[0].id)
  const [date, setDate] = useState('')
  const [organizer, setOrganizer] = useState('')
  const [guests, setGuests] = useState<string>('')
  const [bookingError, setBookingError] = useState('')

  const filteredVenues = typeFilter === 'all' ? VENUES : VENUES.filter(v => v.type === typeFilter)

  function handleBook() {
    const org = organizer.trim()
    const d = date.trim()
    const g = Number(guests)
    if (!org || !d || g <= 0) return
    const venue = VENUES.find(v => v.id === selectedVenueId)
    if (!venue) return
    if (g > venue.capacity) return
    const alreadyBooked = bookings.some(b => b.venueId === selectedVenueId && b.date === d)
    if (alreadyBooked) {
      setBookingError('Venue already booked on that date')
      return
    }
    const maxId = bookings.reduce((m, b) => Math.max(m, b.id), 0)
    setBookings(prev => [...prev, { id: maxId + 1, venueId: selectedVenueId, date: d, organizer: org, guests: g }])
    setOrganizer('')
    setDate('')
    setGuests('')
    setBookingError('')
  }

  function cancelBooking(id: number) {
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  const totalRevenue = bookings.reduce((sum, b) => {
    const venue = VENUES.find(v => v.id === b.venueId)
    return sum + (venue ? venue.pricePerDay : 0)
  }, 0)

  return (
    <div>
      <h1>Venue Booking System</h1>

      <p data-testid="total-bookings">Total Bookings: {bookings.length}</p>
      <p data-testid="total-revenue">Total Revenue: ${totalRevenue}</p>

      <div>
        <select aria-label="Filter by type" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">all</option>
          <option value="conference">conference</option>
          <option value="outdoor">outdoor</option>
          <option value="meeting">meeting</option>
          <option value="social">social</option>
        </select>
      </div>

      <div>
        {filteredVenues.map(v => (
          <div key={v.id} data-testid={`venue-${v.id}`}>
            <h2>{v.name}</h2>
            <p data-testid={`capacity-${v.id}`}>Capacity: {v.capacity}</p>
            <p data-testid={`price-${v.id}`}>Price: ${v.pricePerDay}/day</p>
            <span data-testid={`type-${v.id}`}>{v.type}</span>
          </div>
        ))}
      </div>

      <div>
        <h2>Book a Venue</h2>
        <select aria-label="Select venue" value={selectedVenueId} onChange={e => setSelectedVenueId(Number(e.target.value))}>
          {VENUES.map(v => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
        <input aria-label="Date" value={date} onChange={e => setDate(e.target.value)} placeholder="YYYY-MM-DD" />
        <input aria-label="Organizer" value={organizer} onChange={e => setOrganizer(e.target.value)} />
        <input aria-label="Guest count" type="number" value={guests} onChange={e => setGuests(e.target.value)} />
        <button onClick={handleBook}>Book Venue</button>
        {bookingError && <p data-testid="booking-error">{bookingError}</p>}
      </div>

      <div>
        <h2>Booking History</h2>
        <ul>
          {bookings.map(b => {
            const venue = VENUES.find(v => v.id === b.venueId)
            const cost = venue ? venue.pricePerDay : 0
            return (
              <li key={b.id} data-testid={`booking-${b.id}`}>
                <span>{venue?.name}</span>
                <span>{b.date}</span>
                <span>{b.organizer}</span>
                <span>{b.guests} guests</span>
                <span data-testid={`booking-cost-${b.id}`}>${cost}</span>
                <button onClick={() => cancelBooking(b.id)}>Cancel</button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
