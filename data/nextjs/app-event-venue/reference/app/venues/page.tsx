'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import VenueCard from '../../components/VenueCard'

export default function VenuesPage() {
  const { venues, dates, isAvailable, selectVenue } = useApp()
  const [date, setDate] = useState(dates[0] ?? '')

  return (
    <section data-testid="page-venues">
      <h1>Venues</h1>
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

      <ul data-testid="venues-list">
        {venues.map((v) => (
          <VenueCard
            key={v.id}
            venue={v}
            status={isAvailable(v.id, date) ? 'available' : 'booked'}
            onView={selectVenue}
          />
        ))}
      </ul>
    </section>
  )
}
