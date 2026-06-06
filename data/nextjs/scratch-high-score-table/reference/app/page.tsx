'use client'
import { useState } from 'react'

interface ScoreEntry {
  id: number
  player: string
  score: number
  game: string
}

const SEED: ScoreEntry[] = [
  { id: 1, player: 'Alice', score: 9500, game: 'SpaceRun' },
  { id: 2, player: 'Dave', score: 8800, game: 'SpaceRun' },
  { id: 3, player: 'Bob', score: 7200, game: 'SpaceRun' },
  { id: 4, player: 'Carol', score: 6500, game: 'SpaceRun' },
  { id: 5, player: 'Eve', score: 5100, game: 'SpaceRun' },
]

export default function App() {
  const [entries, setEntries] = useState<ScoreEntry[]>(SEED.map(e => ({ ...e })))
  const [player, setPlayer] = useState('')
  const [score, setScore] = useState('')
  const [game, setGame] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [nextId, setNextId] = useState(6)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const s = parseInt(score, 10)
    if (!player.trim() || !game.trim() || score.trim() === '' || isNaN(s) || s < 0) {
      setError('Please fill all fields with valid data')
      return
    }
    setError('')
    setEntries(prev => [...prev, { id: nextId, player: player.trim(), score: s, game: game.trim() }])
    setNextId(n => n + 1)
    setPlayer('')
    setScore('')
    setGame('')
  }

  const handleRemove = (id: number) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  // Sort all entries by score descending
  const sorted = [...entries].sort((a, b) => b.score - a.score)
  // Top 10
  const top10 = sorted.slice(0, 10)

  // Filter for display (ranks based on top10 position)
  const displayed = search
    ? top10.filter(e => e.player.toLowerCase().includes(search.toLowerCase()))
    : top10

  return (
    <div>
      <h1>High Score Table</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="player-input">Player Name</label>
          <input id="player-input" type="text" value={player} onChange={e => setPlayer(e.target.value)} />
        </div>
        <div>
          <label htmlFor="score-input">Score</label>
          <input id="score-input" type="number" value={score} onChange={e => setScore(e.target.value)} />
        </div>
        <div>
          <label htmlFor="game-input">Game</label>
          <input id="game-input" type="text" value={game} onChange={e => setGame(e.target.value)} />
        </div>
        {error && <p data-testid="score-error">{error}</p>}
        <button type="submit">Add Score</button>
      </form>

      <div>
        <label htmlFor="search-input">Search player</label>
        <input
          id="search-input"
          data-testid="search-input"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <span data-testid="score-count">{displayed.length} scores</span>

      <div>
        {displayed.map((entry, idx) => {
          const globalRank = top10.indexOf(entry) + 1
          return (
            <div key={entry.id} data-testid="score-row">
              <span data-testid="score-rank">#{globalRank}</span>
              <span data-testid="score-player">{entry.player}</span>
              <span data-testid="score-value">{entry.score}</span>
              <span data-testid="score-game">{entry.game}</span>
              {globalRank === 1 && <span data-testid="top-badge">TOP</span>}
              <button data-testid="remove-score" onClick={() => handleRemove(entry.id)}>Remove</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
