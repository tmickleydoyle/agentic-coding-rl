import type { Initiative, Quarter, Status } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level quarters/initiatives and an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listQuarters(): Quarter[] {
  // TODO: return all quarters
  return []
}

export function listInitiatives(_filter?: {
  quarterId?: string | null
  status?: string | null
}): Initiative[] {
  // TODO: return initiatives, applying optional quarterId + status filters
  return []
}

export function createInitiative(_input: { title: string; quarterId?: string }): Initiative {
  // TODO: append a new initiative (status 'planned') with a fresh id and return it
  return { id: '', title: '', quarterId: '', status: 'planned' }
}

export function findInitiative(_id: string): Initiative | undefined {
  // TODO: look up an initiative by id
  return undefined
}

export function updateInitiative(
  _id: string,
  _patch: { quarterId?: string; status?: Status; title?: string },
): Initiative | undefined {
  // TODO: apply the patch and return the updated initiative, or undefined if absent
  return undefined
}

export function deleteInitiative(_id: string): boolean {
  // TODO: remove the initiative; return whether it existed
  return false
}
