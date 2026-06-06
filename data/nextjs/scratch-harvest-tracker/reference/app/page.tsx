'use client'
import { useState } from 'react'

interface Harvest {
  id: number
  crop: string
  date: string
  weightKg: number
  notes: string
}

const SEED_HARVESTS: Harvest[] = [
  { id: 1, crop: 'Tomatoes', date: '2024-08-15', weightKg: 2.3, notes: 'First big harvest of the season' },
  { id: 2, crop: 'Zucchini', date: '2024-08-14', weightKg: 1.1, notes: 'Getting large quickly' },
  { id: 3, crop: 'Tomatoes', date: '2024-08-10', weightKg: 1.8, notes: 'Mostly cherry tomatoes' },
  { id: 4, crop: 'Basil', date: '2024-08-08', weightKg: 0.2, notes: 'For pesto' },
  { id: 5, crop: 'Zucchini', date: '2024-08-05', weightKg: 0.9, notes: '' },
]

let nextId = 6

export default function App() {
  const [harvests, setHarvests] = useState<Harvest[]>(SEED_HARVESTS.map(h => ({ ...h })))
  const [crop, setCrop] = useState('')
  const [date, setDate] = useState('')
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')
  const [cropFilter, setCropFilter] = useState('All Crops')

  const allCrops = Array.from(new Set(harvests.map(h => h.crop))).sort()

  const filtered = harvests
    .filter(h => cropFilter === 'All Crops' || h.crop === cropFilter)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))

  function getCropTotal(cropName: string): number {
    const total = harvests.filter(h => h.crop === cropName).reduce((sum, h) => sum + h.weightKg, 0)
    return Math.round(total * 10) / 10
  }

  const overallTotal = Math.round(harvests.reduce((sum, h) => sum + h.weightKg, 0) * 10) / 10

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const w = Number(weight)
    if (!crop.trim() || !date || !weight || w <= 0) return
    const newHarvest: Harvest = {
      id: nextId++,
      crop: crop.trim(),
      date,
      weightKg: w,
      notes,
    }
    setHarvests(prev => [...prev, newHarvest])
    setCrop('')
    setDate('')
    setWeight('')
    setNotes('')
  }

  function handleDelete(id: number) {
    setHarvests(prev => prev.filter(h => h.id !== id))
  }

  return (
    <div>
      <h1>Harvest Tracker</h1>

      <form data-testid="harvest-form" onSubmit={handleSubmit}>
        <h2>Log Harvest</h2>
        <input
          type="text"
          data-testid="crop-input"
          value={crop}
          onChange={e => setCrop(e.target.value)}
          placeholder="Crop name"
        />
        <input
          type="date"
          data-testid="harvest-date-input"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <input
          type="number"
          step="0.1"
          data-testid="weight-input"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          placeholder="Weight (kg)"
        />
        <textarea
          data-testid="harvest-notes-input"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Notes (optional)"
        />
        <button type="submit" data-testid="log-harvest-btn">Log Harvest</button>
      </form>

      <select
        data-testid="crop-filter"
        value={cropFilter}
        onChange={e => setCropFilter(e.target.value)}
      >
        <option value="All Crops">All Crops</option>
        {allCrops.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <div data-testid="harvest-list">
        {harvests.length === 0 ? (
          <p data-testid="no-harvests-msg">No harvests logged yet</p>
        ) : (
          filtered.map(h => (
            <div key={h.id} data-testid={`harvest-row-${h.id}`}>
              <span>{h.crop}</span>
              <span>{h.date}</span>
              <span>{h.weightKg} kg</span>
              <span>{h.notes}</span>
              <button
                data-testid={`delete-harvest-${h.id}`}
                onClick={() => handleDelete(h.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div data-testid="totals-panel">
        <h2>Totals by Crop</h2>
        {allCrops.map(c => (
          <div key={c} data-testid={`crop-total-${c}`}>
            <span>{c}</span>
            <span>{getCropTotal(c)} kg</span>
          </div>
        ))}
        <p data-testid="overall-total">Total harvested: {overallTotal} kg</p>
      </div>
    </div>
  )
}
