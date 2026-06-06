'use client'
import { useState } from 'react'

interface Chord {
  id: number
  name: string
  key: string
  type: string
  notes: string
  difficulty: string
  favorite: boolean
}

const SEED: Chord[] = [
  { id: 1, name: 'C Major', key: 'C', type: 'Major', notes: 'C E G', difficulty: 'beginner', favorite: false },
  { id: 2, name: 'G Major', key: 'G', type: 'Major', notes: 'G B D', difficulty: 'beginner', favorite: false },
  { id: 3, name: 'Am', key: 'A', type: 'Minor', notes: 'A C E', difficulty: 'beginner', favorite: false },
  { id: 4, name: 'F Major', key: 'F', type: 'Major', notes: 'F A C', difficulty: 'intermediate', favorite: false },
  { id: 5, name: 'Dm', key: 'D', type: 'Minor', notes: 'D F A', difficulty: 'beginner', favorite: false },
  { id: 6, name: 'Em', key: 'E', type: 'Minor', notes: 'E G B', difficulty: 'beginner', favorite: false },
  { id: 7, name: 'B7', key: 'B', type: 'Dominant', notes: 'B D# F# A', difficulty: 'intermediate', favorite: false },
  { id: 8, name: 'Cmaj7', key: 'C', type: 'Major7', notes: 'C E G B', difficulty: 'intermediate', favorite: false },
]

export default function App() {
  const [chords, setChords] = useState<Chord[]>(SEED.map(c => ({ ...c })))
  const [filterKey, setFilterKey] = useState('All')
  const [filterDifficulty, setFilterDifficulty] = useState('All')
  const [newName, setNewName] = useState('')
  const [newKey, setNewKey] = useState('')
  const [newType, setNewType] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [newDifficulty, setNewDifficulty] = useState('beginner')

  const toggleFavorite = (id: number) => {
    setChords(chords.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c))
  }

  const handleAdd = () => {
    if (!newName.trim() || !newKey.trim()) return
    const newId = chords.length > 0 ? Math.max(...chords.map(c => c.id)) + 1 : 1
    setChords([...chords, {
      id: newId,
      name: newName.trim(),
      key: newKey.trim(),
      type: newType.trim(),
      notes: newNotes.trim(),
      difficulty: newDifficulty,
      favorite: false,
    }])
    setNewName('')
    setNewKey('')
    setNewType('')
    setNewNotes('')
    setNewDifficulty('beginner')
  }

  const visibleChords = chords.filter(c => {
    const keyMatch = filterKey === 'All' || c.key === filterKey
    const diffMatch = filterDifficulty === 'All' || c.difficulty === filterDifficulty
    return keyMatch && diffMatch
  })

  const favoriteCount = chords.filter(c => c.favorite).length

  return (
    <div>
      <h1>Chord Chart</h1>

      <div>
        <select
          aria-label="Filter by key"
          value={filterKey}
          onChange={e => setFilterKey(e.target.value)}
          data-testid="filter-key"
        >
          <option value="All">All</option>
          {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(k => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <select
          aria-label="Filter by difficulty"
          value={filterDifficulty}
          onChange={e => setFilterDifficulty(e.target.value)}
          data-testid="filter-difficulty"
        >
          <option value="All">All</option>
          <option value="beginner">beginner</option>
          <option value="intermediate">intermediate</option>
          <option value="advanced">advanced</option>
        </select>
      </div>

      <div>
        <span data-testid="visible-count">{visibleChords.length}</span>
        <span data-testid="favorite-count">{favoriteCount}</span>
      </div>

      <div data-testid="chord-list">
        {visibleChords.map(c => (
          <div key={c.id} data-testid={`chord-card-${c.id}`}>
            <span data-testid={`chord-name-${c.id}`}>{c.name}</span>
            <span data-testid={`chord-key-${c.id}`}>{c.key}</span>
            <span data-testid={`chord-type-${c.id}`}>{c.type}</span>
            <span data-testid={`chord-notes-${c.id}`}>{c.notes}</span>
            <span data-testid={`chord-difficulty-${c.id}`}>{c.difficulty}</span>
            <button
              onClick={() => toggleFavorite(c.id)}
              data-testid={`favorite-btn-${c.id}`}
            >
              {c.favorite ? 'Unfavorite' : 'Favorite'}
            </button>
          </div>
        ))}
      </div>

      <div>
        <h2>Add Chord</h2>
        <input
          aria-label="Name"
          placeholder="Name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          data-testid="input-name"
        />
        <input
          aria-label="Key"
          placeholder="Key"
          value={newKey}
          onChange={e => setNewKey(e.target.value)}
          data-testid="input-key"
        />
        <input
          aria-label="Type"
          placeholder="Type"
          value={newType}
          onChange={e => setNewType(e.target.value)}
          data-testid="input-type"
        />
        <input
          aria-label="Notes"
          placeholder="Notes"
          value={newNotes}
          onChange={e => setNewNotes(e.target.value)}
          data-testid="input-notes"
        />
        <select
          aria-label="Difficulty"
          value={newDifficulty}
          onChange={e => setNewDifficulty(e.target.value)}
          data-testid="input-difficulty"
        >
          <option value="beginner">beginner</option>
          <option value="intermediate">intermediate</option>
          <option value="advanced">advanced</option>
        </select>
        <button onClick={handleAdd} data-testid="btn-add">Add Chord</button>
      </div>
    </div>
  )
}
