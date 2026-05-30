import type { Bin } from './types'
import { freeSpace } from './types'
import { moveItem } from './move'

// In-memory server store for the API routes. SEPARATE from the client Context state.

let bins: Bin[] = []
let nextId = 1

function seed(): void {
  bins = [
    {
      id: 'b1',
      code: 'A1',
      capacity: 100,
      items: [
        { name: 'Bolts', qty: 40 },
        { name: 'Nuts', qty: 20 },
      ],
    },
    {
      id: 'b2',
      code: 'A2',
      capacity: 50,
      items: [{ name: 'Washers', qty: 50 }],
    },
    {
      id: 'b3',
      code: 'B1',
      capacity: 80,
      items: [],
    },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listBins(filter?: { available?: string | null }): Bin[] {
  let out = bins.slice()
  if (filter?.available === 'true') out = out.filter((b) => freeSpace(b) > 0)
  return out
}

export function findBin(id: string): Bin | undefined {
  return bins.find((b) => b.id === id)
}

export function createBin(input: { code: string; capacity: number }): Bin {
  const bin: Bin = {
    id: `b${nextId++}`,
    code: input.code,
    capacity: input.capacity,
    items: [],
  }
  bins.push(bin)
  return bin
}

export function moveBetween(
  fromId: string,
  toId: string,
  name: string,
  qty: number,
): { ok: boolean; error?: string } {
  const result = moveItem(bins, fromId, toId, name, qty)
  if (!result.ok) return { ok: false, error: result.error }
  bins = result.bins
  return { ok: true }
}
