'use client'
import { useState } from 'react'

interface Seed {
  id: number
  name: string
  variety: string
  quantity: number
  unit: string
  expiryYear: number
  planted: boolean
}

const SEED_DATA: Seed[] = [
  { id: 1, name: 'Beefsteak Tomato', variety: 'Heirloom', quantity: 50, unit: 'seeds', expiryYear: 2025, planted: false },
  { id: 2, name: 'Basil', variety: 'Genovese', quantity: 3, unit: 'packets', expiryYear: 2024, planted: false },
  { id: 3, name: 'Zucchini', variety: 'Black Beauty', quantity: 12, unit: 'seeds', expiryYear: 2026, planted: true },
  { id: 4, name: 'Sunflower', variety: 'Giant Russian', quantity: 25, unit: 'seeds', expiryYear: 2025, planted: false },
]

const CURRENT_YEAR = 2025
let nextId = 5

export default function App() {
  const [seeds, setSeeds] = useState<Seed[]>(SEED_DATA.map(s => ({ ...s })))
  const [name, setName] = useState('')
  const [variety, setVariety] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('seeds')
  const [expiryYear, setExpiryYear] = useState('')
  const [filterUnplanted, setFilterUnplanted] = useState(false)
  const [filterExpiring, setFilterExpiring] = useState(false)
  const [error, setError] = useState('')

  const displayed = seeds.filter(s => {
    if (filterUnplanted && s.planted) return false
    if (filterExpiring && s.expiryYear > CURRENT_YEAR + 1) return false
    return true
  })

  const unplantedCount = seeds.filter(s => !s.planted).length

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !variety.trim()) {
      setError('Name and variety are required')
      return
    }
    const qty = Number(quantity)
    const expiry = Number(expiryYear)
    if (!quantity || qty <= 0) {
      setError('Quantity must be > 0')
      return
    }
    if (!expiryYear || expiry < 2020 || String(expiry).length !== 4) {
      setError('Expiry year must be a 4-digit year >= 2020')
      return
    }
    const newSeed: Seed = {
      id: nextId++,
      name: name.trim(),
      variety: variety.trim(),
      quantity: qty,
      unit,
      expiryYear: expiry,
      planted: false,
    }
    setSeeds(prev => [...prev, newSeed])
    setName('')
    setVariety('')
    setQuantity('')
    setUnit('seeds')
    setExpiryYear('')
  }

  function handleMarkPlanted(id: number) {
    setSeeds(prev => prev.map(s => s.id === id ? { ...s, planted: true } : s))
  }

  function handleDelete(id: number) {
    setSeeds(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div>
      <h1>Seed Inventory</h1>

      <form data-testid="add-seed-form" onSubmit={handleSubmit}>
        <h2>Add Seed</h2>
        {error && <p role="alert">{error}</p>}
        <input
          type="text"
          data-testid="seed-name-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          data-testid="seed-variety-input"
          value={variety}
          onChange={e => setVariety(e.target.value)}
          placeholder="Variety"
        />
        <input
          type="number"
          data-testid="seed-quantity-input"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          placeholder="Quantity"
        />
        <select
          data-testid="seed-unit-select"
          value={unit}
          onChange={e => setUnit(e.target.value)}
        >
          <option value="seeds">seeds</option>
          <option value="packets">packets</option>
          <option value="grams">grams</option>
        </select>
        <input
          type="number"
          data-testid="seed-expiry-input"
          value={expiryYear}
          onChange={e => setExpiryYear(e.target.value)}
          placeholder="Expiry Year"
        />
        <button type="submit" data-testid="add-seed-btn">Add Seed</button>
      </form>

      <div>
        <label>
          <input
            type="checkbox"
            data-testid="unplanted-filter"
            checked={filterUnplanted}
            onChange={e => setFilterUnplanted(e.target.checked)}
          />
          Show only unplanted
        </label>
        <label>
          <input
            type="checkbox"
            data-testid="expiring-filter"
            checked={filterExpiring}
            onChange={e => setFilterExpiring(e.target.checked)}
          />
          Show only expiring soon (&le; {CURRENT_YEAR + 1})
        </label>
      </div>

      <p data-testid="summary">Total: {seeds.length} seed entries, {unplantedCount} unplanted</p>

      <table data-testid="seed-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Variety</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Expiry Year</th>
            <th>Planted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map(seed => (
            <tr key={seed.id} data-testid={`seed-row-${seed.id}`}>
              <td>{seed.name}</td>
              <td>{seed.variety}</td>
              <td>{seed.quantity}</td>
              <td>{seed.unit}</td>
              <td>{seed.expiryYear}</td>
              <td>{seed.planted ? 'Yes' : 'No'}</td>
              <td>
                <button
                  data-testid={`mark-planted-${seed.id}`}
                  onClick={() => handleMarkPlanted(seed.id)}
                  disabled={seed.planted}
                >
                  Mark Planted
                </button>
                <button
                  data-testid={`delete-seed-${seed.id}`}
                  onClick={() => handleDelete(seed.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
