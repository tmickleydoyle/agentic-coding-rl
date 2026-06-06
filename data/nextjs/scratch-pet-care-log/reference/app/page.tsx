'use client'
import { useState } from 'react'

const TYPES = ['Feeding', 'Walk', 'Grooming', 'Vet Visit', 'Play', 'Other']

interface CareEntry {
  id: number
  date: string
  type: string
  note: string
}

const SEED: CareEntry[] = [
  { id: 1, date: '2024-04-01', type: 'Feeding', note: 'Morning kibble' },
  { id: 2, date: '2024-04-01', type: 'Walk', note: '30 min park walk' },
  { id: 3, date: '2024-04-02', type: 'Feeding', note: 'Evening kibble' },
  { id: 4, date: '2024-04-02', type: 'Vet Visit', note: 'Annual checkup' },
  { id: 5, date: '2024-04-03', type: 'Feeding', note: 'Morning kibble' },
]

export default function App() {
  const [entries, setEntries] = useState<CareEntry[]>(SEED.map(e => ({ ...e })))
  const [date, setDate] = useState('')
  const [actType, setActType] = useState('Feeding')
  const [note, setNote] = useState('')
  const [filter, setFilter] = useState('All')
  const [nextId, setNextId] = useState(SEED.length + 1)

  const filtered = filter === 'All' ? entries : entries.filter(e => e.type === filter)
  const feedingCount = entries.filter(e => e.type === 'Feeding').length

  function handleLog() {
    if (!date.trim()) return
    setEntries(prev => [...prev, { id: nextId, date, type: actType, note }])
    setNextId(n => n + 1)
    setDate('')
    setNote('')
    setActType('Feeding')
  }

  function handleDelete(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div>
      <h1>Pet Care Log</h1>
      <p data-testid="pet-name">Buddy (Dog)</p>
      <p data-testid="feeding-count">Total feedings: {feedingCount}</p>
      <label>
        Filter by type
        <select aria-label="Filter by type" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
      <p data-testid="entry-count">{filtered.length} entries</p>
      <ul>
        {filtered.map(e => (
          <li key={e.id} data-testid="care-entry">
            {e.date} | {e.type} | {e.note}
            <button data-testid="delete-entry" onClick={() => handleDelete(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <label>
          Date
          <input type="date" aria-label="Date" value={date} onChange={ev => setDate(ev.target.value)} />
        </label>
        <label>
          Activity Type
          <select aria-label="Activity Type" value={actType} onChange={ev => setActType(ev.target.value)}>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label>
          Note
          <input aria-label="Note" value={note} onChange={ev => setNote(ev.target.value)} />
        </label>
        <button onClick={handleLog}>Log Activity</button>
      </div>
    </div>
  )
}
