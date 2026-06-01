import type { Part, Series } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let series: Series[] = []
let parts: Part[] = []
let nextPartId = 1

function seed(): void {
  series = [
    { id: 's1', title: 'Learning Rust', author: 'Ada' },
    { id: 's2', title: 'Async Patterns', author: 'Lin' },
  ]
  parts = [
    { id: 'x1', seriesId: 's1', order: 1, title: 'Setup', read: true },
    { id: 'x2', seriesId: 's1', order: 2, title: 'Ownership', read: true },
    { id: 'x3', seriesId: 's1', order: 3, title: 'Lifetimes', read: false },
    { id: 'x4', seriesId: 's2', order: 1, title: 'Event loop', read: true },
    { id: 'x5', seriesId: 's2', order: 2, title: 'Promises', read: false },
    { id: 'x6', seriesId: 's2', order: 3, title: 'Async/await', read: false },
  ]
  nextPartId = 7
}

seed()

export function __reset(): void {
  seed()
}

export function listSeries(): Series[] {
  return series.slice()
}

export function findSeries(id: string): Series | undefined {
  return series.find((s) => s.id === id)
}

export function listParts(seriesId?: string | null): Part[] {
  if (seriesId) {
    return parts.filter((p) => p.seriesId === seriesId).sort((a, b) => a.order - b.order)
  }
  return parts.slice()
}

export function createPart(input: { seriesId: string; title: string }): Part {
  const inSeries = parts.filter((p) => p.seriesId === input.seriesId)
  const maxOrder = inSeries.reduce((m, p) => (p.order > m ? p.order : m), 0)
  const part: Part = {
    id: `x${nextPartId++}`,
    seriesId: input.seriesId,
    order: maxOrder + 1,
    title: input.title,
    read: false,
  }
  parts.push(part)
  return part
}

export function findPart(id: string): Part | undefined {
  return parts.find((p) => p.id === id)
}

export function updatePart(id: string, patch: { read?: boolean }): Part | undefined {
  const part = parts.find((p) => p.id === id)
  if (!part) return undefined
  if (typeof patch.read === 'boolean') part.read = patch.read
  return part
}
