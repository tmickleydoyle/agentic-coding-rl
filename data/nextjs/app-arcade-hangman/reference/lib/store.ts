export type Result = { id: string; word: string; won: boolean }

let results: Result[] = []
let nextId = 1

function seed(): void {
  results = []
  nextId = 1
}

seed()

export function __reset(): void {
  seed()
}

export function listResults(): Result[] {
  return results.slice()
}

export function statsOf(list: Result[]): { wins: number; losses: number; played: number } {
  let wins = 0
  let losses = 0
  list.forEach((r) => {
    if (r.won) wins += 1
    else losses += 1
  })
  return { wins, losses, played: list.length }
}

export type CreateResult =
  | { ok: true; result: Result }
  | { ok: false; error: 'word required' | 'bad result' }

export function createResult(input: { word: unknown; won: unknown }): CreateResult {
  const word = typeof input.word === 'string' ? input.word.trim() : ''
  if (word.length === 0) return { ok: false, error: 'word required' }
  if (typeof input.won !== 'boolean') return { ok: false, error: 'bad result' }
  const result: Result = { id: `g${nextId++}`, word, won: input.won }
  results.push(result)
  return { ok: true, result }
}

export function deleteResult(id: string): boolean {
  if (id === 'all') {
    results = []
    return true
  }
  const idx = results.findIndex((r) => r.id === id)
  if (idx === -1) return false
  results.splice(idx, 1)
  return true
}
