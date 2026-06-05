'use client'
import { useApp } from '../../components/AppStateProvider'

export default function ScoresPage() {
  const { tally, resetTally } = useApp()
  const games = tally.x + tally.o + tally.draws
  return (
    <section data-testid="page-scores">
      <h1>Scores</h1>
      <span data-testid="tally-x">{tally.x}</span>
      <span data-testid="tally-o">{tally.o}</span>
      <span data-testid="tally-draws">{tally.draws}</span>
      <span data-testid="tally-games">{games}</span>
      <button data-testid="clear-scores" onClick={resetTally}>
        Clear scores
      </button>
    </section>
  )
}
