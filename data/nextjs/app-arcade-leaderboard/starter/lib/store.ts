import type { Game, Score } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level scores + an id counter; seed them; provide __reset() to re-seed.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listGames(): Game[] {
  // TODO: return the seed games
  return []
}

export function listScores(_filter?: { gameId?: string | null; sort?: string | null }): Score[] {
  // TODO: return scores, applying ?gameId and ?sort=rank
  return []
}

export function findScore(_id: string): Score | undefined {
  // TODO: look up a score by id
  return undefined
}

export type CreateResult =
  | { ok: true; score: Score }
  | { ok: false; error: 'bad game' | 'player required' | 'bad points' }

export function createScore(_input: {
  gameId: unknown
  player: unknown
  points: unknown
}): CreateResult {
  // TODO: validate game/player/points and append; otherwise return an error code
  return { ok: false, error: 'bad game' }
}

export function deleteScore(_id: string): boolean {
  // TODO: remove the score; return whether it existed
  return false
}
