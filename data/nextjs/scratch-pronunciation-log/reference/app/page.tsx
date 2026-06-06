'use client'
import { useState } from 'react'

interface Entry {
  id: number
  word: string
  rating: number
  notes: string
  date: string
}

const SEED_ENTRIES: Entry[] = [
  { id: 1, word: 'Bonjour', rating: 4, notes: 'Almost got it', date: '2024-01-10' },
  { id: 2, word: 'Merci', rating: 5, notes: 'Perfect', date: '2024-01-10' },
  { id: 3, word: 'Au revoir', rating: 3, notes: 'Need more practice', date: '2024-01-11' },
]

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(SEED_ENTRIES.map(e => ({ ...e })))
  const [word, setWord] = useState('')
  const [rating, setRating] = useState('')
  const [notes, setNotes] = useState('')
  const [nextId, setNextId] = useState(4)
  const [error, setError] = useState(false)

  const average = entries.length === 0
    ? 'N/A'
    : (entries.reduce((sum, e) => sum + e.rating, 0) / entries.length).toFixed(2)

  function handleAdd() {
    const ratingNum = Number(rating)
    if (!word.trim() || !rating || ratingNum < 1 || ratingNum > 5) {
      setError(true)
      return
    }
    const today = new Date().toISOString().slice(0, 10)
    setEntries(prev => [...prev, { id: nextId, word: word.trim(), rating: ratingNum, notes, date: today }])
    setNextId(n => n + 1)
    setWord('')
    setRating('')
    setNotes('')
    setError(false)
  }

  function handleDelete(id: number) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div>
      <h1>Pronunciation Log</h1>

      <div data-testid="average-rating">Average Rating: {average}</div>
      <div data-testid="entry-count">{entries.length} entries</div>

      <div>
        <input
          data-testid="word-input"
          placeholder="Word"
          value={word}
          onChange={e => setWord(e.target.value)}
        />
        <input
          data-testid="rating-input"
          type="number"
          min={1}
          max={5}
          placeholder="Rating 1-5"
          value={rating}
          onChange={e => setRating(e.target.value)}
        />
        <textarea
          data-testid="notes-input"
          placeholder="Notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <button data-testid="add-btn" onClick={handleAdd}>Add Entry</button>
        {error && (
          <div data-testid="error-msg">Please enter a valid word and rating (1-5).</div>
        )}
      </div>

      <div>
        {entries.map(entry => (
          <div key={entry.id} data-testid={`entry-${entry.id}`}>
            <span data-testid={`entry-word-${entry.id}`}>{entry.word}</span>
            <span data-testid={`entry-rating-${entry.id}`}>{entry.rating}</span>
            <span data-testid={`entry-notes-${entry.id}`}>{entry.notes}</span>
            <button data-testid={`delete-${entry.id}`} onClick={() => handleDelete(entry.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
