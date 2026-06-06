'use client'
import { useState } from 'react'

// half-moves: [white1, black1, white2, black2, ...]
const SEED_MOVES = ['e4', 'e5', 'Nf3', 'Nc6']

interface MoveRow {
  number: number
  white: string
  black: string
}

function buildRows(halfMoves: string[]): MoveRow[] {
  const rows: MoveRow[] = []
  for (let i = 0; i < halfMoves.length; i += 2) {
    rows.push({
      number: Math.floor(i / 2) + 1,
      white: halfMoves[i] || '',
      black: halfMoves[i + 1] || '',
    })
  }
  return rows
}

export default function App() {
  const [halfMoves, setHalfMoves] = useState<string[]>([...SEED_MOVES])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const isWhiteTurn = halfMoves.length % 2 === 0

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) {
      setError('Move cannot be empty')
      return
    }
    setError('')
    setHalfMoves(prev => [...prev, input.trim()])
    setInput('')
  }

  const handleUndo = () => {
    setHalfMoves(prev => prev.slice(0, -1))
    setError('')
  }

  const handleClear = () => {
    setHalfMoves([])
    setInput('')
    setError('')
  }

  const rows = buildRows(halfMoves)

  return (
    <div>
      <h1>Chess Notation Recorder</h1>

      <span data-testid="current-turn">{isWhiteTurn ? 'White to move' : 'Black to move'}</span>

      <form onSubmit={handleAdd}>
        <label htmlFor="move-input">Enter move</label>
        <input
          id="move-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        {error && <p data-testid="move-error">{error}</p>}
        <button type="submit">Add Move</button>
      </form>

      <div>
        <button data-testid="undo-btn" onClick={handleUndo} disabled={halfMoves.length === 0}>
          Undo
        </button>
        <button data-testid="clear-btn" onClick={handleClear}>
          Clear All
        </button>
      </div>

      <span data-testid="move-count">{halfMoves.length} moves</span>

      <div>
        {rows.map(row => (
          <div key={row.number} data-testid="move-row">
            <span data-testid="move-number">{row.number}.</span>
            <span data-testid="move-white">{row.white}</span>
            <span data-testid="move-black">{row.black}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
