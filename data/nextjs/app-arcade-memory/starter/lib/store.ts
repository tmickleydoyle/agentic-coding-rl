export type Run = { id: string; moves: number }

// In-memory server store, separate from the client Context state.
// TODO: hold module-level runs + an id counter; provide __reset() to clear.

export function __reset(): void {
  // TODO: clear runs and reset the id counter
}

export function listRuns(): Run[] {
  // TODO: return recorded runs
  return []
}

export function bestOf(_list: Run[]): number | null {
  // TODO: smallest moves, or null when empty
  return null
}

export function createRun(_moves: unknown): Run | null {
  // TODO: validate a finite integer moves >= 1 and append; null if invalid
  return null
}

export function deleteRun(_id: string): boolean {
  // TODO: remove a run; return whether it existed
  return false
}
