'use client'
import { useState } from 'react'

const MOODS = ['Happy', 'Sad', 'Anxious', 'Calm', 'Excited', 'Angry']

interface MoodEntry {
  id: number
  date: string
  mood: string
  note: string
}

const SEED: MoodEntry[] = [
  { id: 1, date: '2024-03-01', mood: 'Happy', note: 'Had a great day at work' },
  { id: 2, date: '2024-03-02', mood: 'Anxious', note: 'Big presentation coming up' },
  { id: 3, date: '2024-03-03', mood: 'Calm', note: 'Relaxing weekend morning' },
]

export default function App() {
  const [entries, setEntries] = useState<MoodEntry[]>(SEED.map(e => ({ ...e })))
  const [date, setDate] = useState('')
  const [mood, setMood] = useState('Happy')
  const [note, setNote] = useState('')
  const [filter, setFilter] = useState('All')
  const [nextId, setNextId] = useState(SEED.length + 1)

  const filtered = filter === 'All' ? entries : entries.filter(e => e.mood === filter)

  function handleAdd() {
    if (!date.trim() || !mood) return
    setEntries(prev => [...prev, { id: nextId, date, mood, note }])
    setNextId(n => n + 1)
    setDate('')
    setNote('')
    setMood('Happy')
  }

  function handleClear() {
    setEntries([])
  }

  return (
    <div>
      <h1>Mood Journal</h1>
      <label>
        Filter by mood
        <select aria-label="Filter by mood" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All</option>
          {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>
      <p data-testid="entry-count">{filtered.length} entries</p>
      <ul>
        {filtered.map(e => (
          <li key={e.id} data-testid="mood-entry">
            {e.date} | {e.mood} | {e.note}
          </li>
        ))}
      </ul>
      <div>
        <label>
          Date
          <input type="date" aria-label="Date" value={date} onChange={ev => setDate(ev.target.value)} />
        </label>
        <label>
          Mood
          <select aria-label="Mood" value={mood} onChange={ev => setMood(ev.target.value)}>
            {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label>
          Note
          <textarea aria-label="Note" value={note} onChange={ev => setNote(ev.target.value)} />
        </label>
        <button onClick={handleAdd}>Add Entry</button>
      </div>
      <button onClick={handleClear}>Clear All</button>
    </div>
  )
}
