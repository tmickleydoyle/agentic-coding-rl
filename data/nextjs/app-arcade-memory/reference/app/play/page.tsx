'use client'
import { useApp } from '../../components/AppStateProvider'
import CardTile from '../../components/CardTile'
import ScoreBoard from '../../components/ScoreBoard'
import { isWon } from '../../lib/memory'

export default function PlayPage() {
  const { game, pick, reset } = useApp()
  const won = isWon(game)
  return (
    <section data-testid="page-play">
      <h1>Memory Match</h1>
      <ScoreBoard moves={game.moves} matches={game.matches} />
      {won ? <p data-testid="won">You won!</p> : null}
      <div data-testid="board">
        {game.cards.map((c) => (
          <CardTile key={c.id} card={c} onPick={pick} />
        ))}
      </div>
      <button data-testid="new-game" onClick={reset}>
        New game
      </button>
    </section>
  )
}
