'use client'
import type { Game, Score } from '../lib/types'

export default function GameCard({
  game,
  scores,
  onOpen,
}: {
  game: Game
  scores: Score[]
  onOpen: (id: string) => void
}) {
  // TODO: render name, top points (or '-'), score count and an open-<id> button.
  void scores
  void onOpen
  return <li data-testid={`game-${game.id}`} />
}
