'use client'
import { useApp } from '../../components/AppStateProvider'
import ScoreRow from '../../components/ScoreRow'
import { scoresForGame } from '../../lib/leaderboard'

export default function GameDetailPage() {
  const { games, scores, selectedGameId } = useApp()

  const game = games.find((g) => g.id === selectedGameId)
  if (!game) {
    return (
      <section data-testid="page-game-detail">
        <p data-testid="no-game-selected">No game selected.</p>
      </section>
    )
  }

  const ranked = scoresForGame(scores, game.id)

  return (
    <section data-testid="page-game-detail">
      <h1 data-testid="detail-name">{game.name}</h1>
      {ranked.length === 0 ? (
        <p data-testid="no-scores">No scores yet.</p>
      ) : (
        <ul data-testid="score-list">
          {ranked.map((s, i) => (
            <ScoreRow key={s.id} score={s} rank={i + 1} />
          ))}
        </ul>
      )}
    </section>
  )
}
