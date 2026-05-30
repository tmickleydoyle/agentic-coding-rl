import type { Feedback, House } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `houses`; seed them; provide __reset() to re-seed. Tests call
// __reset() in beforeEach for isolation.

export type HouseWithCounts = House & { visitorCount: number; feedbackCount: number }

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listHouses(_houseId?: string | null): HouseWithCounts[] {
  // TODO: return houses (each with visitorCount + feedbackCount), optionally one by id
  return []
}

export function findHouse(_id: string): House | undefined {
  // TODO: look up a house by id
  return undefined
}

export function registerVisitor(_id: string, _name: string): HouseWithCounts | undefined {
  // TODO: append a visitor and return the updated house (with counts), or undefined
  return undefined
}

export function addFeedback(_id: string, _feedback: Feedback): HouseWithCounts | undefined {
  // TODO: append feedback and return the updated house (with counts), or undefined
  return undefined
}
