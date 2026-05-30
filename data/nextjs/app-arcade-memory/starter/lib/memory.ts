import type { Card, Game } from './types'

// Pure memory-match logic. No React, no timers. The stubs below compile but are wrong.

export function buildDeck(_symbols: string[]): Card[] {
  // TODO: two cards per symbol (first copies then second copies), ids c0.., face-down
  return []
}

export function newGame(symbols: string[]): Game {
  // TODO: { cards: buildDeck(symbols), moves: 0, matches: 0, firstPick: null }
  return { cards: buildDeck(symbols), moves: 0, matches: 0, firstPick: null }
}

export function flip(game: Game, _id: string): Game {
  // TODO: first/second pick logic, match marking, pending-mismatch guard
  return game
}

export function clearMismatch(game: Game): Game {
  // TODO: flip lingering unmatched face-up cards back down
  return game
}

export function isWon(_game: Game): boolean {
  // TODO: every card matched
  return false
}

export function bestScore(_prev: number | null, moves: number): number {
  // TODO: lower of prev and moves
  return moves
}
