'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function SubmitPage() {
  const { games, submitScore, openGame } = useApp()
  const [gameId, setGameId] = useState(games[0]?.id ?? '')
  const [player, setPlayer] = useState('')
  const [points, setPoints] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = submitScore(gameId, player, Number(points))
    if (id === null) {
      setError('A game, a player name and non-negative points are required')
      return
    }
    setError('')
    openGame(gameId)
  }

  return (
    <section data-testid="page-submit">
      <h1>Submit a score</h1>
      <form data-testid="submit-form" onSubmit={onSubmit}>
        <select
          data-testid="game-select"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        >
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <input
          data-testid="player-input"
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
        />
        <input
          data-testid="points-input"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
        {error ? <p data-testid="submit-error">{error}</p> : null}
        <button type="submit" data-testid="submit-score">
          Submit
        </button>
      </form>
    </section>
  )
}
