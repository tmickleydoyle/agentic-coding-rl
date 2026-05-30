import type { Group, Person } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level people/groups + id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listPeople(): Person[] {
  // TODO: return all people
  return []
}

export function listGroups(_filter?: { memberId?: string | null }): Group[] {
  // TODO: return groups, applying an optional memberId filter
  return []
}

export function createGroup(_input: { name: string; adminId: string }): Group {
  // TODO: append a new group (memberIds [adminId]) with a fresh id and return it
  return { id: '', name: '', adminId: '', memberIds: [] }
}

export function findGroup(_id: string): Group | undefined {
  // TODO: look up a group by id
  return undefined
}

export function patchMembers(
  _id: string,
  _patch: { add?: string; remove?: string },
): Group | undefined {
  // TODO: add/remove a member (admin can never be removed); undefined if absent
  return undefined
}

export function deleteGroup(_id: string): boolean {
  // TODO: remove the group; return whether it existed
  return false
}
