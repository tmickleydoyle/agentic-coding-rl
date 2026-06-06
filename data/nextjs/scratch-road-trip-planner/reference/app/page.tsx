'use client'
import { useState } from 'react'

interface Stop {
  id: number
  city: string
  state: string
  miles: number
  fuel: number
  hotel: number
  notes: string
}

const SEED: Stop[] = [
  { id: 1, city: 'San Francisco', state: 'CA', miles: 0, fuel: 0, hotel: 150, notes: 'Start' },
  { id: 2, city: 'Monterey', state: 'CA', miles: 120, fuel: 18, hotel: 130, notes: '17-Mile Drive' },
  { id: 3, city: 'Los Angeles', state: 'CA', miles: 340, fuel: 51, hotel: 200, notes: 'End' },
]

export default function App() {
  const [stops, setStops] = useState<Stop[]>(SEED.map(s => ({ ...s })))
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [miles, setMiles] = useState('')
  const [fuel, setFuel] = useState('')
  const [hotel, setHotel] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [nextId, setNextId] = useState(4)

  const handleAdd = () => {
    if (!city.trim() || !state.trim() || miles === '' || fuel === '' || hotel === '' ||
        Number(miles) < 0 || Number(fuel) < 0 || Number(hotel) < 0) {
      setError('Please fill in all required fields')
      return
    }
    setError('')
    setStops(prev => [...prev, {
      id: nextId,
      city: city.trim(),
      state: state.trim(),
      miles: Number(miles),
      fuel: Number(fuel),
      hotel: Number(hotel),
      notes: notes.trim(),
    }])
    setNextId(n => n + 1)
    setCity('')
    setState('')
    setMiles('')
    setFuel('')
    setHotel('')
    setNotes('')
  }

  const handleDelete = (id: number) => {
    setStops(prev => prev.filter(s => s.id !== id))
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    setStops(prev => {
      const arr = [...prev]
      const tmp = arr[index - 1]
      arr[index - 1] = arr[index]
      arr[index] = tmp
      return arr
    })
  }

  const handleMoveDown = (index: number) => {
    setStops(prev => {
      if (index === prev.length - 1) return prev
      const arr = [...prev]
      const tmp = arr[index + 1]
      arr[index + 1] = arr[index]
      arr[index] = tmp
      return arr
    })
  }

  const filtered = stops.filter(s => s.city.toLowerCase().includes(search.toLowerCase()))

  const totalMiles = stops.reduce((sum, s) => sum + s.miles, 0)
  const totalFuel = stops.reduce((sum, s) => sum + s.fuel, 0)
  const totalHotel = stops.reduce((sum, s) => sum + s.hotel, 0)
  const totalCost = totalFuel + totalHotel

  return (
    <div>
      <h1>Road Trip Planner</h1>

      <div>
        <h2>Add Stop</h2>
        {error && <p data-testid="error-msg">{error}</p>}
        <div>
          <label htmlFor="city-input">City</label>
          <input
            id="city-input"
            data-testid="city-input"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="City"
          />
        </div>
        <div>
          <label htmlFor="state-input">State</label>
          <input
            id="state-input"
            data-testid="state-input"
            value={state}
            onChange={e => setState(e.target.value)}
            placeholder="CA"
            maxLength={2}
          />
        </div>
        <div>
          <label htmlFor="miles-input">Miles to this stop</label>
          <input
            id="miles-input"
            data-testid="miles-input"
            type="number"
            value={miles}
            onChange={e => setMiles(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="fuel-input">Fuel Cost ($)</label>
          <input
            id="fuel-input"
            data-testid="fuel-input"
            type="number"
            step="0.01"
            value={fuel}
            onChange={e => setFuel(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="hotel-input">Hotel Cost ($)</label>
          <input
            id="hotel-input"
            data-testid="hotel-input"
            type="number"
            step="0.01"
            value={hotel}
            onChange={e => setHotel(e.target.value)}
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
        <button data-testid="add-btn" onClick={handleAdd}>Add Stop</button>
      </div>

      <div>
        <h2>Trip Summary</h2>
        <p>Stops: <span data-testid="stop-count">{stops.length}</span></p>
        <p>Total Miles: <span data-testid="total-miles">{totalMiles} mi</span></p>
        <p>Total Fuel: <span data-testid="total-fuel">${totalFuel.toFixed(2)}</span></p>
        <p>Total Hotel: <span data-testid="total-hotel">${totalHotel.toFixed(2)}</span></p>
        <p>Total Cost: <span data-testid="total-cost">${totalCost.toFixed(2)}</span></p>
      </div>

      <div>
        <label htmlFor="search-input">Search by City</label>
        <input
          id="search-input"
          data-testid="search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search cities..."
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>State</th>
            <th>Miles</th>
            <th>Fuel</th>
            <th>Hotel</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s, idx) => {
            const originalIdx = stops.indexOf(s)
            return (
              <tr key={s.id} data-testid="stop-row">
                <td data-testid={`city-${s.id}`}>{s.city}</td>
                <td data-testid={`state-${s.id}`}>{s.state}</td>
                <td data-testid={`miles-${s.id}`}>{s.miles} mi</td>
                <td data-testid={`fuel-${s.id}`}>${s.fuel.toFixed(2)}</td>
                <td data-testid={`hotel-${s.id}`}>${s.hotel.toFixed(2)}</td>
                <td data-testid={`notes-${s.id}`}>{s.notes}</td>
                <td>
                  <button data-testid={`move-up-${s.id}`} onClick={() => handleMoveUp(originalIdx)}>Move Up</button>
                  <button data-testid={`move-down-${s.id}`} onClick={() => handleMoveDown(originalIdx)}>Move Down</button>
                  <button data-testid={`delete-btn-${s.id}`} onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
