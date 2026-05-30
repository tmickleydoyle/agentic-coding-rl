'use client'
import { useApp } from '../../components/AppStateProvider'

export default function ScoresPage() {
  const { best, game, resetBest } = useApp()
  return (
    <section data-testid="page-scores">
      <h1>Scores</h1>
      <span data-testid="best">{best === null ? '-' : best}</span>
      <span data-testid="current-moves">{game.moves}</span>
      <button data-testid="reset-best" onClick={resetBest}>
        Reset best
      </button>
    </section>
  )
}
