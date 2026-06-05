export type Run = { id: string; moves: number }

let runs: Run[] = []
let nextId = 1

function seed(): void {
  runs = []
  nextId = 1
}

seed()

export function __reset(): void {
  seed()
}

export function listRuns(): Run[] {
  return runs.slice()
}

export function bestOf(list: Run[]): number | null {
  if (list.length === 0) return null
  let min = list[0].moves
  list.forEach((r) => {
    if (r.moves < min) min = r.moves
  })
  return min
}

export function createRun(moves: unknown): Run | null {
  if (typeof moves !== 'number' || !Number.isInteger(moves) || moves < 1) return null
  const run: Run = { id: `r${nextId++}`, moves }
  runs.push(run)
  return run
}

export function deleteRun(id: string): boolean {
  const idx = runs.findIndex((r) => r.id === id)
  if (idx === -1) return false
  runs.splice(idx, 1)
  return true
}
