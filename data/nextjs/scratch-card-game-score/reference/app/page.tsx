'use client'
import { useState } from 'react'

interface Player {
  id: number
  name: string
  rounds: number[]
}

const SEED: Player[] = [
  { id: 1, name: 'Alice', rounds: [15, 22] },
  { id: 2, name: 'Bob', rounds: [10, 18] },
  { id: 3, name: 'Carol', rounds: [20, 5] },
]

function cloneSeed(): Player[] {
  return SEED.map(p => ({ ...p, rounds: [...p.rounds] }))
}

export default function App() {
  const [players, setPlayers] = useState<Player[]>(cloneSeed())
  const [inputs, setInputs] = useState<Record<number, string>>({ 1: '', 2: '', 3: '' })
  const [error, setError] = useState('')

  const totals: Record<number, number> = {}
  players.forEach(p => { totals[p.id] = p.rounds.reduce((a, b) => a + b, 0) })

  const maxTotal = Math.max(...players.map(p => totals[p.id]))
  const roundsPlayed = players[0].rounds.length
  const currentRound = roundsPlayed + 1

  const handleInputChange = (id: number, val: string) => {
    setInputs(prev => ({ ...prev, [id]: val }))
  }

  const handleAddRound = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed: Record<number, number> = {}
    for (const p of players) {
      const val = inputs[p.id].trim()
      const n = Number(val)
      if (val === '' || isNaN(n)) {
        setError('Please enter valid scores for all players')
        return
      }
      parsed[p.id] = n
    }
    setError('')
    setPlayers(prev => prev.map(p => ({ ...p, rounds: [...p.rounds, parsed[p.id]] })))
    const cleared: Record<number, string> = {}
    players.forEach(p => { cleared[p.id] = '' })
    setInputs(cleared)
  }

  const handleReset = () => {
    setPlayers(cloneSeed())
    setInputs({ 1: '', 2: '', 3: '' })
    setError('')
  }

  return (
    <div>
      <h1>Card Game Score Tracker</h1>

      <span data-testid="current-round">Round {currentRound}</span>
      <span data-testid="round-count">{roundsPlayed} rounds played</span>

      <div>
        {players.map(p => (
          <div key={p.id} data-testid="player-row">
            <span data-testid="player-name">{p.name}</span>
            {totals[p.id] === maxTotal && <span data-testid="leader-badge">Leader</span>}
            <span data-testid="player-total">{totals[p.id]}</span>
            <span data-testid="player-rounds">{p.rounds.join(', ')}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddRound}>
        {players.map(p => (
          <div key={p.id}>
            <label htmlFor={`score-${p.id}`}>{p.name} score</label>
            <input
              id={`score-${p.id}`}
              type="number"
              value={inputs[p.id]}
              onChange={e => handleInputChange(p.id, e.target.value)}
            />
          </div>
        ))}
        {error && <p data-testid="score-error">{error}</p>}
        <button type="submit">Add Round</button>
      </form>

      <button data-testid="reset-btn" onClick={handleReset}>Reset Game</button>
    </div>
  )
}
