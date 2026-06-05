'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function AvailabilityPage() {
  const { times, availableTables, navigate } = useApp()
  const [time, setTime] = useState(times[0] ?? '')
  const [party, setParty] = useState(2)

  const tables = availableTables(time, party)

  return (
    <section data-testid="page-availability">
      <h1>Availability</h1>
      <label htmlFor="time">Time</label>
      <select
        id="time"
        data-testid="time-select"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      >
        {times.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <label htmlFor="party">Party</label>
      <input
        id="party"
        type="number"
        data-testid="party-input"
        value={party}
        onChange={(e) => setParty(Number(e.target.value))}
      />

      {tables.length === 0 ? (
        <p data-testid="none-available">No tables available.</p>
      ) : (
        <ul data-testid="available-list">
          {tables.map((t) => (
            <li key={t.id} data-testid={`avail-${t.id}`}>
              <span data-testid={`avail-${t.id}-name`}>{t.name}</span>
              <span data-testid={`avail-${t.id}-capacity`}>{t.capacity}</span>
              <button data-testid={`reserve-${t.id}`} onClick={() => navigate('reserve')}>
                Reserve
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
