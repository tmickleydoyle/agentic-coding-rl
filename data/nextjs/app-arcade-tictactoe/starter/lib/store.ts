export type MatchResult = 'X' | 'O' | 'draw'
export type Match = { id: string; result: MatchResult }

// In-memory server store, separate from the client Context state.
// TODO: hold module-level matches + an id counter; provide __reset() to clear.

export function __reset(): void {
  // TODO: clear the history and reset the id counter
}

export function listMatches(): Match[] {
  // TODO: return recorded matches
  return []
}

export function tallyOf(_list: Match[]): { x: number; o: number; draws: number } {
  // TODO: count results into x / o / draws
  return { x: 0, o: 0, draws: 0 }
}

export function createMatch(_result: unknown): Match | null {
  // TODO: validate the result and append; null if invalid
  return null
}

export function deleteMatch(_id: string): boolean {
  // TODO: remove one match (or all when id==='all'); return whether anything matched
  return false
}
