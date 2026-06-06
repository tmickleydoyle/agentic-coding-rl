'use client'
import { useState } from 'react'

interface RateEntry {
  id: number
  from: string
  to: string
  rate: number
  lastUpdated: string
}

const SEED: RateEntry[] = [
  { id: 1, from: 'USD', to: 'EUR', rate: 0.9200, lastUpdated: '2024-01-10' },
  { id: 2, from: 'USD', to: 'GBP', rate: 0.7900, lastUpdated: '2024-01-10' },
  { id: 3, from: 'USD', to: 'JPY', rate: 149.50, lastUpdated: '2024-01-11' },
  { id: 4, from: 'EUR', to: 'GBP', rate: 0.8587, lastUpdated: '2024-01-12' },
  { id: 5, from: 'GBP', to: 'JPY', rate: 189.24, lastUpdated: '2024-01-15' },
]

export default function App() {
  const [rates, setRates] = useState<RateEntry[]>(SEED.map(r => ({ ...r })))
  const [fromInput, setFromInput] = useState('')
  const [toInput, setToInput] = useState('')
  const [rateInput, setRateInput] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editRateValue, setEditRateValue] = useState('')

  function addRate() {
    const from = fromInput.trim().toUpperCase()
    const to = toInput.trim().toUpperCase()
    const rate = parseFloat(rateInput)
    if (!from || !to || isNaN(rate) || rate <= 0) return
    const duplicate = rates.some(r => r.from === from && r.to === to)
    if (duplicate) return
    const maxId = rates.reduce((m, r) => Math.max(m, r.id), 0)
    const today = new Date().toISOString().slice(0, 10)
    setRates(prev => [...prev, { id: maxId + 1, from, to, rate, lastUpdated: today }])
    setFromInput('')
    setToInput('')
    setRateInput('')
  }

  function deleteRate(id: number) {
    setRates(prev => prev.filter(r => r.id !== id))
    if (editingId === id) setEditingId(null)
  }

  function startEdit(id: number, currentRate: number) {
    setEditingId(id)
    setEditRateValue(currentRate.toString())
  }

  function saveEdit(id: number) {
    const rate = parseFloat(editRateValue)
    if (isNaN(rate) || rate <= 0) return
    const today = new Date().toISOString().slice(0, 10)
    setRates(prev => prev.map(r => r.id === id ? { ...r, rate, lastUpdated: today } : r))
    setEditingId(null)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  return (
    <div>
      <h1>Exchange Rate Table</h1>

      <div>
        <input
          data-testid="from-input"
          type="text"
          placeholder="From"
          value={fromInput}
          onChange={e => setFromInput(e.target.value.toUpperCase())}
        />
        <input
          data-testid="to-input"
          type="text"
          placeholder="To"
          value={toInput}
          onChange={e => setToInput(e.target.value.toUpperCase())}
        />
        <input
          data-testid="rate-input"
          type="number"
          placeholder="Rate"
          value={rateInput}
          onChange={e => setRateInput(e.target.value)}
        />
        <button data-testid="add-btn" onClick={addRate}>Add Rate</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Rate</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody data-testid="rates-table">
          {rates.map(r => (
            <tr key={r.id} data-testid={`row-${r.id}`}>
              <td>{r.from}</td>
              <td>{r.to}</td>
              <td data-testid={`rate-cell-${r.id}`}>
                {editingId === r.id ? (
                  <input
                    data-testid={`rate-edit-${r.id}`}
                    type="number"
                    value={editRateValue}
                    onChange={e => setEditRateValue(e.target.value)}
                  />
                ) : (
                  r.rate.toFixed(4)
                )}
              </td>
              <td>{r.lastUpdated}</td>
              <td>
                {editingId === r.id ? (
                  <>
                    <button data-testid={`save-btn-${r.id}`} onClick={() => saveEdit(r.id)}>Save</button>
                    <button data-testid={`cancel-btn-${r.id}`} onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <button data-testid={`edit-btn-${r.id}`} onClick={() => startEdit(r.id, r.rate)}>Edit</button>
                )}
                <button data-testid={`delete-btn-${r.id}`} onClick={() => deleteRate(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p data-testid="rate-count">Showing {rates.length} rates</p>
    </div>
  )
}
