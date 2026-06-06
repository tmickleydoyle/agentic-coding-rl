'use client'
import { useState } from 'react'

type Difficulty = 'easy' | 'medium' | 'hard'
type FilterType = 'all' | Difficulty

interface Attempt {
  id: number
  puzzle: string
  difficulty: Difficulty
  time: number
}

const SEED: Attempt[] = [
  { id: 1, puzzle: 'Sudoku Easy', difficulty: 'easy', time: 120 },
  { id: 2, puzzle: 'Sudoku Hard', difficulty: 'hard', time: 480 },
  { id: 3, puzzle: 'Crossword', difficulty: 'medium', time: 300 },
  { id: 4, puzzle: 'Sudoku Easy', difficulty: 'easy', time: 95 },
]

export default function App() {
  const [attempts, setAttempts] = useState<Attempt[]>(SEED.map(a => ({ ...a })))
  const [puzzle, setPuzzle] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [time, setTime] = useState('')
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [nextId, setNextId] = useState(5)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = parseInt(time, 10)
    if (!puzzle.trim() || isNaN(t) || t <= 0) {
      setError('Please enter a valid puzzle name and time')
      return
    }
    setError('')
    setAttempts(prev => [...prev, { id: nextId, puzzle: puzzle.trim(), difficulty, time: t }])
    setNextId(n => n + 1)
    setPuzzle('')
    setDifficulty('easy')
    setTime('')
  }

  const handleDelete = (id: number) => {
    setAttempts(prev => prev.filter(a => a.id !== id))
  }

  // Compute best time per puzzle name
  const bestByPuzzle: Record<string, number> = {}
  attempts.forEach(a => {
    if (bestByPuzzle[a.puzzle] === undefined || a.time < bestByPuzzle[a.puzzle]) {
      bestByPuzzle[a.puzzle] = a.time
    }
  })

  const filtered = filter === 'all' ? attempts : attempts.filter(a => a.difficulty === filter)
  const sorted = [...filtered].sort((a, b) => a.time - b.time)

  return (
    <div>
      <h1>Puzzle Timer</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="puzzle-input">Puzzle Name</label>
          <input id="puzzle-input" type="text" value={puzzle} onChange={e => setPuzzle(e.target.value)} />
        </div>
        <div>
          <label htmlFor="difficulty-select">Difficulty</label>
          <select id="difficulty-select" value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)}>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </div>
        <div>
          <label htmlFor="time-input">Time (seconds)</label>
          <input id="time-input" type="number" value={time} onChange={e => setTime(e.target.value)} />
        </div>
        {error && <p data-testid="attempt-error">{error}</p>}
        <button type="submit">Log Attempt</button>
      </form>

      <div>
        <button data-testid="filter-all" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All</button>
        <button data-testid="filter-easy" aria-pressed={filter === 'easy'} onClick={() => setFilter('easy')}>Easy</button>
        <button data-testid="filter-medium" aria-pressed={filter === 'medium'} onClick={() => setFilter('medium')}>Medium</button>
        <button data-testid="filter-hard" aria-pressed={filter === 'hard'} onClick={() => setFilter('hard')}>Hard</button>
      </div>

      <span data-testid="attempt-count">{sorted.length} attempts</span>

      <div>
        {sorted.map(a => (
          <div key={a.id} data-testid="attempt-item">
            <span data-testid="attempt-puzzle">{a.puzzle}</span>
            <span data-testid="attempt-difficulty">{a.difficulty}</span>
            <span data-testid="attempt-time">{a.time}s</span>
            {bestByPuzzle[a.puzzle] === a.time && <span data-testid="best-badge">Best</span>}
            <button data-testid="delete-attempt" onClick={() => handleDelete(a.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
