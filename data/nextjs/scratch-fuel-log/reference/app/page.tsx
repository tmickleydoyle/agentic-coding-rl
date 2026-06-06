'use client'
import { useState } from 'react'

interface FillUp {
  id: number
  date: string
  gallons: number
  pricePerGallon: number
  odometer: number
  station: string
}

const SEED: FillUp[] = [
  { id: 1, date: '2024-01-05', gallons: 12.5, pricePerGallon: 3.45, odometer: 15200, station: 'Shell' },
  { id: 2, date: '2024-01-18', gallons: 11.0, pricePerGallon: 3.52, odometer: 15580, station: 'BP' },
  { id: 3, date: '2024-02-01', gallons: 13.2, pricePerGallon: 3.38, odometer: 15930, station: 'Shell' },
]

type SortKey = 'date-desc' | 'date-asc' | 'cost-desc' | 'cost-asc'

export default function App() {
  const [fillups, setFillups] = useState<FillUp[]>(SEED.map(f => ({ ...f })))
  const [date, setDate] = useState('')
  const [gallons, setGallons] = useState('')
  const [pricePerGallon, setPricePerGallon] = useState('')
  const [odometer, setOdometer] = useState('')
  const [station, setStation] = useState('')
  const [error, setError] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date-desc')
  const [nextId, setNextId] = useState(4)

  const handleAdd = () => {
    if (!date || !gallons || !pricePerGallon || !odometer ||
        Number(gallons) <= 0 || Number(pricePerGallon) <= 0 || Number(odometer) <= 0) {
      setError('Please fill in all required fields')
      return
    }
    setError('')
    const fillup: FillUp = {
      id: nextId,
      date,
      gallons: Number(gallons),
      pricePerGallon: Number(pricePerGallon),
      odometer: Number(odometer),
      station: station.trim(),
    }
    setFillups(prev => [...prev, fillup])
    setNextId(n => n + 1)
    setDate('')
    setGallons('')
    setPricePerGallon('')
    setOdometer('')
    setStation('')
  }

  const handleDelete = (id: number) => {
    setFillups(prev => prev.filter(f => f.id !== id))
  }

  const sorted = [...fillups].sort((a, b) => {
    if (sortKey === 'date-desc') return b.date.localeCompare(a.date)
    if (sortKey === 'date-asc') return a.date.localeCompare(b.date)
    const costA = a.gallons * a.pricePerGallon
    const costB = b.gallons * b.pricePerGallon
    if (sortKey === 'cost-desc') return costB - costA
    return costA - costB
  })

  const totalFillups = fillups.length
  const totalGallons = fillups.reduce((sum, f) => sum + f.gallons, 0)
  const totalSpent = fillups.reduce((sum, f) => sum + f.gallons * f.pricePerGallon, 0)

  const computeAvgMpg = (): string => {
    const byDate = [...fillups].sort((a, b) => a.date.localeCompare(b.date))
    if (byDate.length < 2) return 'N/A'
    let totalMiles = 0
    let totalGallonsForMpg = 0
    for (let i = 1; i < byDate.length; i++) {
      const miles = byDate[i].odometer - byDate[i - 1].odometer
      if (miles > 0) {
        totalMiles += miles
        totalGallonsForMpg += byDate[i].gallons
      }
    }
    if (totalGallonsForMpg === 0) return 'N/A'
    return (totalMiles / totalGallonsForMpg).toFixed(1) + ' mpg'
  }

  return (
    <div>
      <h1>Fuel Log</h1>

      <div>
        <h2>Add Fill-Up</h2>
        {error && <p data-testid="error-msg">{error}</p>}
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
          <label htmlFor="gallons-input">Gallons</label>
          <input
            id="gallons-input"
            data-testid="gallons-input"
            type="number"
            step="0.1"
            value={gallons}
            onChange={e => setGallons(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="price-input">Price per Gallon</label>
          <input
            id="price-input"
            data-testid="price-input"
            type="number"
            step="0.01"
            value={pricePerGallon}
            onChange={e => setPricePerGallon(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="odometer-input">Odometer</label>
          <input
            id="odometer-input"
            data-testid="odometer-input"
            type="number"
            value={odometer}
            onChange={e => setOdometer(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="station-input">Station</label>
          <input
            id="station-input"
            data-testid="station-input"
            value={station}
            onChange={e => setStation(e.target.value)}
            placeholder="Station (optional)"
          />
        </div>
        <button data-testid="add-btn" onClick={handleAdd}>Add Fill-Up</button>
      </div>

      <div>
        <h2>Summary</h2>
        <p>Total Fill-Ups: <span data-testid="total-fillups">{totalFillups}</span></p>
        <p>Total Gallons: <span data-testid="total-gallons">{totalGallons.toFixed(1)}</span></p>
        <p>Total Spent: <span data-testid="total-spent">${totalSpent.toFixed(2)}</span></p>
        <p>Average MPG: <span data-testid="avg-mpg">{computeAvgMpg()}</span></p>
      </div>

      <div>
        <label htmlFor="sort-select">Sort by</label>
        <select
          id="sort-select"
          data-testid="sort-select"
          value={sortKey}
          onChange={e => setSortKey(e.target.value as SortKey)}
        >
          <option value="date-desc">Date (newest)</option>
          <option value="date-asc">Date (oldest)</option>
          <option value="cost-desc">Cost (highest)</option>
          <option value="cost-asc">Cost (lowest)</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Gallons</th>
            <th>Price/Gal</th>
            <th>Total Cost</th>
            <th>Odometer</th>
            <th>Station</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(f => (
            <tr key={f.id} data-testid="fillup-row">
              <td data-testid={`date-${f.id}`}>{f.date}</td>
              <td data-testid={`gallons-${f.id}`}>{f.gallons}</td>
              <td data-testid={`price-${f.id}`}>${f.pricePerGallon.toFixed(2)}</td>
              <td data-testid={`total-${f.id}`}>${(f.gallons * f.pricePerGallon).toFixed(2)}</td>
              <td data-testid={`odometer-${f.id}`}>{f.odometer}</td>
              <td data-testid={`station-${f.id}`}>{f.station}</td>
              <td>
                <button data-testid={`delete-btn-${f.id}`} onClick={() => handleDelete(f.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
