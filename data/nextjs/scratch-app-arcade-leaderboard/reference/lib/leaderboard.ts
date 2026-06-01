import type { Score } from './types'

// Pure helpers shared by the client hook and the API store. No React here.

export function rankScores(scores: Score[]): Score[] {
  return scores
    .map((s, i) => ({ s, i }))
    .sort((a, b) => b.s.points - a.s.points || a.i - b.i)
    .map((x) => x.s)
}

export function scoresForGame(scores: Score[], gameId: string): Score[] {
  return rankScores(scores.filter((s) => s.gameId === gameId))
}

export function topScore(scores: Score[], gameId: string): Score | null {
  const ranked = scoresForGame(scores, gameId)
  return ranked.length > 0 ? ranked[0] : null
}

export function playerCount(scores: Score[]): number {
  const seen: Record<string, true> = {}
  scores.forEach((s) => {
    seen[s.player] = true
  })
  return Object.keys(seen).length
}
