'use client'
import { useState } from 'react'

interface Player {
  id: number
  name: string
  score: number
}

const SEED: Player[] = [
  { id: 1, name: 'Alice', score: 0 },
  { id: 2, name: 'Bob', score: 0 },
  { id: 3, name: 'Carol', score: 0 },
  { id: 4, name: 'David', score: 0 },
]

let nextId = SEED.length + 1

export default function App() {
  const [players, setPlayers] = useState<Player[]>(SEED.map(x => ({ ...x })))
  const [newName, setNewName] = useState('')

  function increment(id: number) {
    setPlayers(xs => xs.map(p => p.id === id ? { ...p, score: p.score + 1 } : p))
  }

  function decrement(id: number) {
    setPlayers(xs => xs.map(p => p.id === id ? { ...p, score: Math.max(0, p.score - 1) } : p))
  }

  function resetOne(id: number) {
    setPlayers(xs => xs.map(p => p.id === id ? { ...p, score: 0 } : p))
  }

  function resetAll() {
    setPlayers(xs => xs.map(p => ({ ...p, score: 0 })))
  }

  function addPlayer() {
    if (!newName.trim()) return
    setPlayers(xs => [...xs, { id: nextId++, name: newName.trim(), score: 0 }])
    setNewName('')
  }

  function removePlayer(id: number) {
    setPlayers(xs => xs.filter(p => p.id !== id))
  }

  function getLeader(): string {
    if (players.length === 0) return '-'
    const maxScore = Math.max(...players.map(p => p.score))
    const leaders = players.filter(p => p.score === maxScore)
    if (leaders.length > 1 || maxScore === 0) return 'Tied'
    return leaders[0].name
  }

  return (
    <div>
      <h1>Score Board</h1>

      <p data-testid="leader">Leader: {getLeader()}</p>

      <div>
        <input
          aria-label="Player name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button onClick={addPlayer}>Add Player</button>
      </div>

      <button onClick={resetAll}>Reset All</button>

      <ul>
        {players.map(p => (
          <li key={p.id} data-testid="player-row">
            <span>{p.name}</span>
            <span data-testid="score">{p.score}</span>
            <button onClick={() => increment(p.id)}>+</button>
            <button onClick={() => decrement(p.id)}>-</button>
            <button onClick={() => resetOne(p.id)}>Reset</button>
            <button onClick={() => removePlayer(p.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
