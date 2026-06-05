import type { Pot } from './types'

// In-memory server store for the API routes (separate from client Context state).
// TODO: hold module-level `pots` + id counter; seed them; __reset() re-seeds (test isolation).

export function __reset(): void {
  // TODO: re-seed to the initial pots
}
export function listPots(): Pot[] {
  return [] // TODO: return all pots
}
export function findPot(_id: string): Pot | undefined {
  return undefined // TODO
}
export function createPot(input: { name: string; goal?: number }): Pot {
  // TODO: create + store a pot (balance 0) and return it
  return { id: '', name: input.name, balance: 0, goal: input.goal ?? 0 }
}
export function updatePot(_id: string, _patch: { name?: string; goal?: number; balance?: number }): Pot | undefined {
  return undefined // TODO: patch + return the pot (undefined if missing)
}
export function deletePot(_id: string): boolean {
  return false // TODO: remove the pot, return whether it existed
}
