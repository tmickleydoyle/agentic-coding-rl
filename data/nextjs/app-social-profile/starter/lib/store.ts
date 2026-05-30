import type { Post, Profile } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level profiles/posts + an id counter; seed them; provide __reset()
// to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listUsers(_filter?: { q?: string | null }): Profile[] {
  // TODO: return profiles, applying an optional case-insensitive name ?q= filter
  return []
}

export function findUser(_id: string): Profile | undefined {
  // TODO: look up a profile by id
  return undefined
}

export function createUser(_input: { name: string; bio?: string }): Profile {
  // TODO: append a new profile (bio defaults to '') with a fresh id and return it
  return { id: '', name: '', bio: '' }
}

export function updateUser(
  _id: string,
  _patch: { name?: string; bio?: string },
): Profile | undefined {
  // TODO: apply the patch and return the profile, or undefined if absent
  return undefined
}

export function deleteUser(_id: string): boolean {
  // TODO: remove the profile; return whether it existed
  return false
}

export function listPosts(_authorId?: string): Post[] {
  // TODO: return posts, optionally filtered by authorId
  return []
}
