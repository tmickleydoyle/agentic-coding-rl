export type Entry = { id: string; name: string; score: number }

let entries: Entry[] = []
let nextId = 3

function seed(): void {
  entries = [
    { id: 'e1', name: 'Ada', score: 50 },
    { id: 'e2', name: 'Bo', score: 30 },
  ]
  nextId = 3
}

seed()

export function __reset(): void {
  seed()
}

export function listEntries(): Entry[] {
  return entries
    .map((e, i) => ({ e, i }))
    .sort((a, b) => b.e.score - a.e.score || a.i - b.i)
    .map((x) => x.e)
}

export type CreateResult =
  | { ok: true; entry: Entry }
  | { ok: false; error: 'name required' | 'bad score' }

export function createEntry(input: { name: unknown; score: unknown }): CreateResult {
  const name = typeof input.name === 'string' ? input.name.trim() : ''
  if (name.length === 0) return { ok: false, error: 'name required' }
  const score = typeof input.score === 'number' ? input.score : NaN
  if (!Number.isFinite(score) || score < 0) return { ok: false, error: 'bad score' }
  const entry: Entry = { id: `e${nextId++}`, name, score }
  entries.push(entry)
  return { ok: true, entry }
}

export function deleteEntry(id: string): boolean {
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return false
  entries.splice(idx, 1)
  return true
}
