'use client'
import { useApp } from '../components/AppStateProvider'
import { isWon } from '../lib/memory'

export function useMemory() {
  const { game } = useApp()
  const totalPairs = game.cards.length / 2
  return {
    moves: game.moves,
    matches: game.matches,
    remaining: totalPairs - game.matches,
    won: isWon(game),
  }
}
