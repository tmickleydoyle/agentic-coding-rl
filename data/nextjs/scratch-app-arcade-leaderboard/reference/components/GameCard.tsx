'use client'
import type { Game, Score } from '../lib/types'
import { scoresForGame, topScore } from '../lib/leaderboard'

export default function GameCard({
  game,
  scores,
  onOpen,
}: {
  game: Game
  scores: Score[]
  onOpen: (id: string) => void
}) {
  const top = topScore(scores, game.id)
  const count = scoresForGame(scores, game.id).length
  return (
    <li data-testid={`game-${game.id}`}>
      <span data-testid={`game-${game.id}-name`}>{game.name}</span>
      <span data-testid={`game-${game.id}-top`}>{top ? top.points : '-'}</span>
      <span data-testid={`game-${game.id}-count`}>{count}</span>
      <button data-testid={`open-${game.id}`} onClick={() => onOpen(game.id)}>
        Open
      </button>
    </li>
  )
}
