import type { Bill } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `bills` and an id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listBills(_filter?: { unpaid?: boolean }): Bill[] {
  // TODO: return bills, applying optional unpaid filter
  return []
}

export function findBill(_id: string): Bill | undefined {
  // TODO: look up a bill by id
  return undefined
}

export function createBill(_input: {
  name: string
  amount: number
  dueDay: number
  autopay?: boolean
}): Bill {
  // TODO: append a new unpaid bill with a fresh id and return it
  return { id: '', name: '', amount: 0, dueDay: 1, paid: false, autopay: false }
}

export function updateBill(
  _id: string,
  _patch: { paid?: boolean; autopay?: boolean },
): Bill | undefined {
  // TODO: apply the patch to the bill and return it, or undefined if missing
  return undefined
}
