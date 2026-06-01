import type { Pot } from './types'

// In-memory server store for the API routes. SEPARATE from the client
// SavingsProvider state. Tests call __reset() in beforeEach for isolation.

let pots: Pot[] = []
let nextPotId = 1

function seed(): void {
  pots = [
    { id: 'p1', name: 'Emergency Fund', balance: 1500, goal: 3000 },
    { id: 'p2', name: 'New Laptop', balance: 800, goal: 800 },
    { id: 'p3', name: 'Holiday', balance: 200, goal: 1200 },
  ]
  nextPotId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listPots(): Pot[] {
  return pots.slice()
}

export function findPot(id: string): Pot | undefined {
  return pots.find((p) => p.id === id)
}

export function createPot(input: { name: string; goal?: number }): Pot {
  const pot: Pot = {
    id: `p${nextPotId++}`,
    name: input.name,
    balance: 0,
    goal: input.goal ?? 0,
  }
  pots.push(pot)
  return pot
}

export function updatePot(
  id: string,
  patch: { balance?: number; goal?: number },
): Pot | undefined {
  const pot = findPot(id)
  if (!pot) return undefined
  if (typeof patch.balance === 'number' && patch.balance >= 0) pot.balance = patch.balance
  if (typeof patch.goal === 'number' && patch.goal >= 0) pot.goal = patch.goal
  return pot
}

export function deletePot(id: string): boolean {
  const idx = pots.findIndex((p) => p.id === id)
  if (idx === -1) return false
  pots.splice(idx, 1)
  return true
}
