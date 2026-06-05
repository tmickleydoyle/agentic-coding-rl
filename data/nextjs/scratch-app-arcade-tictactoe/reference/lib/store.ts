export type MatchResult = 'X' | 'O' | 'draw'
export type Match = { id: string; result: MatchResult }

let matches: Match[] = []
let nextId = 1

function seed(): void {
  matches = []
  nextId = 1
}

seed()

export function __reset(): void {
  seed()
}

export function listMatches(): Match[] {
  return matches.slice()
}

export function tallyOf(list: Match[]): { x: number; o: number; draws: number } {
  const t = { x: 0, o: 0, draws: 0 }
  list.forEach((m) => {
    if (m.result === 'X') t.x += 1
    else if (m.result === 'O') t.o += 1
    else t.draws += 1
  })
  return t
}

export function createMatch(result: unknown): Match | null {
  if (result !== 'X' && result !== 'O' && result !== 'draw') return null
  const match: Match = { id: `m${nextId++}`, result }
  matches.push(match)
  return match
}

export function deleteMatch(id: string): boolean {
  if (id === 'all') {
    matches = []
    return true
  }
  const idx = matches.findIndex((m) => m.id === id)
  if (idx === -1) return false
  matches.splice(idx, 1)
  return true
}
