export type Entry = { id: string; name: string; score: number }

// In-memory server store, separate from the client Context state.
// TODO: hold module-level entries + an id counter; seed e1/e2; provide __reset().

export function __reset(): void {
  // TODO: re-seed to e1 Ada/50, e2 Bo/30 and reset the id counter to 3
}

export function listEntries(): Entry[] {
  // TODO: return entries ranked by score descending (stable)
  return []
}

export type CreateResult =
  | { ok: true; entry: Entry }
  | { ok: false; error: 'name required' | 'bad score' }

export function createEntry(_input: { name: unknown; score: unknown }): CreateResult {
  // TODO: validate name/score and append; otherwise return an error code
  return { ok: false, error: 'name required' }
}

export function deleteEntry(_id: string): boolean {
  // TODO: remove an entry; return whether it existed
  return false
}
