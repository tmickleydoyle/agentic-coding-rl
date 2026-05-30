import type { Score } from './types'

// Pure helpers shared by the client hook and the API store. No React here.
// TODO: implement ranking + aggregation. The stubs below compile but are wrong.

export function rankScores(_scores: Score[]): Score[] {
  // TODO: return a new array sorted by points descending (stable for ties)
  return []
}

export function scoresForGame(_scores: Score[], _gameId: string): Score[] {
  // TODO: ranked scores for one game
  return []
}

export function topScore(_scores: Score[], _gameId: string): Score | null {
  // TODO: the single highest score for a game, or null
  return null
}

export function playerCount(_scores: Score[]): number {
  // TODO: number of distinct player names
  return 0
}
