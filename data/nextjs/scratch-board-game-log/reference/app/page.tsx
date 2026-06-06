'use client'
import { useState } from 'react'

interface Session {
  id: number
  game: string
  players: string
  winner: string
  duration: number
  date: string
}

const SEED: Session[] = [
  { id: 1, game: 'Catan', players: 'Alice, Bob, Carol', winner: 'Alice', duration: 90, date: '2024-01-10' },
  { id: 2, game: 'Chess', players: 'Dave, Eve', winner: 'Eve', duration: 45, date: '2024-01-12' },
  { id: 3, game: 'Ticket Ride', players: 'Alice, Frank, Bob, Carol', winner: 'Frank', duration: 120, date: '2024-01-15' },
]

export default function App() {
  const [sessions, setSessions] = useState<Session[]>(SEED.map(s => ({ ...s })))
  const [game, setGame] = useState('')
  const [players, setPlayers] = useState('')
  const [winner, setWinner] = useState('')
  const [duration, setDuration] = useState('')
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'duration'>('date')
  const [nextId, setNextId] = useState(4)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dur = parseInt(duration, 10)
    if (!game.trim() || !players.trim() || !winner.trim() || isNaN(dur) || dur <= 0) {
      setError('Please fill all fields correctly')
      return
    }
    setError('')
    const today = new Date().toISOString().slice(0, 10)
    const newSession: Session = { id: nextId, game: game.trim(), players: players.trim(), winner: winner.trim(), duration: dur, date: today }
    setSessions(prev => [newSession, ...prev])
    setNextId(n => n + 1)
    setGame('')
    setPlayers('')
    setWinner('')
    setDuration('')
  }

  const handleDelete = (id: number) => {
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  const filtered = sessions.filter(s => s.game.toLowerCase().includes(filter.toLowerCase()))

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'duration') return b.duration - a.duration
    return b.date.localeCompare(a.date)
  })

  return (
    <div>
      <h1>Board Game Log</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="game-input">Game Name</label>
          <input id="game-input" type="text" value={game} onChange={e => setGame(e.target.value)} />
        </div>
        <div>
          <label htmlFor="players-input">Players (comma-separated)</label>
          <input id="players-input" type="text" value={players} onChange={e => setPlayers(e.target.value)} />
        </div>
        <div>
          <label htmlFor="winner-input">Winner</label>
          <input id="winner-input" type="text" value={winner} onChange={e => setWinner(e.target.value)} />
        </div>
        <div>
          <label htmlFor="duration-input">Duration (minutes)</label>
          <input id="duration-input" type="number" value={duration} onChange={e => setDuration(e.target.value)} />
        </div>
        {error && <p data-testid="form-error">{error}</p>}
        <button type="submit">Add Session</button>
      </form>

      <div>
        <label htmlFor="filter-input">Filter by game</label>
        <input id="filter-input" data-testid="filter-input" type="text" value={filter} onChange={e => setFilter(e.target.value)} />
      </div>

      <div>
        <button data-testid="sort-date" aria-pressed={sortBy === 'date'} onClick={() => setSortBy('date')}>Sort by Date</button>
        <button data-testid="sort-duration" aria-pressed={sortBy === 'duration'} onClick={() => setSortBy('duration')}>Sort by Duration</button>
      </div>

      <span data-testid="session-count">{sorted.length} sessions</span>

      <div>
        {sorted.map(s => (
          <div key={s.id} data-testid="session-item">
            <span data-testid="session-game">{s.game}</span>
            <span data-testid="session-winner">{s.winner}</span>
            <span data-testid="session-duration">{s.duration} min</span>
            <span data-testid="session-players">{s.players}</span>
            <button data-testid="delete-session" onClick={() => handleDelete(s.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
