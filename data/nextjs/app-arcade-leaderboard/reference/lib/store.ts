import type { Game, Score } from './types'
import { rankScores } from './leaderboard'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider
// state. Tests call __reset() in beforeEach so each test starts from the same seed.

const GAMES: Game[] = [
  { id: 'g1', name: 'Asteroids' },
  { id: 'g2', name: 'Pac-Man' },
  { id: 'g3', name: 'Tetris' },
]

let scores: Score[] = []
let nextScoreId = 1

function seed(): void {
  scores = [
    { id: 's1', gameId: 'g1', player: 'Ada', points: 1200 },
    { id: 's2', gameId: 'g1', player: 'Bo', points: 900 },
    { id: 's3', gameId: 'g1', player: 'Cy', points: 1500 },
    { id: 's4', gameId: 'g2', player: 'Ada', points: 300 },
    { id: 's5', gameId: 'g2', player: 'Di', points: 500 },
    { id: 's6', gameId: 'g3', player: 'Bo', points: 700 },
  ]
  nextScoreId = 7
}

seed()

export function __reset(): void {
  seed()
}

export function listGames(): Game[] {
  return GAMES.slice()
}

export function listScores(filter?: { gameId?: string | null; sort?: string | null }): Score[] {
  let out = scores.slice()
  if (filter?.gameId) out = out.filter((s) => s.gameId === filter.gameId)
  if (filter?.sort === 'rank') out = rankScores(out)
  return out
}

export function findScore(id: string): Score | undefined {
  return scores.find((s) => s.id === id)
}

export type CreateResult =
  | { ok: true; score: Score }
  | { ok: false; error: 'bad game' | 'player required' | 'bad points' }

export function createScore(input: {
  gameId: unknown
  player: unknown
  points: unknown
}): CreateResult {
  const gameId = typeof input.gameId === 'string' ? input.gameId : ''
  if (!GAMES.some((g) => g.id === gameId)) return { ok: false, error: 'bad game' }
  const player = typeof input.player === 'string' ? input.player.trim() : ''
  if (player.length === 0) return { ok: false, error: 'player required' }
  const points = typeof input.points === 'number' ? input.points : NaN
  if (!Number.isFinite(points) || points < 0) return { ok: false, error: 'bad points' }
  const score: Score = { id: `s${nextScoreId++}`, gameId, player, points }
  scores.push(score)
  return { ok: true, score }
}

export function deleteScore(id: string): boolean {
  const idx = scores.findIndex((s) => s.id === id)
  if (idx === -1) return false
  scores.splice(idx, 1)
  return true
}
