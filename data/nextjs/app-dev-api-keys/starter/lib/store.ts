import type { ApiKey, Scope } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `keys` and an id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation. GET/POST/PUT responses must
// return MASKED secrets (use maskSecret from ./mask).

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listKeys(_filter?: { status?: string | null; scope?: string | null }): ApiKey[] {
  // TODO: return keys (secrets masked), applying optional status + scope filters
  return []
}

export function createKey(_input: { name: string; scopes?: Scope[] }): ApiKey {
  // TODO: append a new active key (secret sk_<id>_secret) and return it masked
  return { id: '', name: '', secret: '', scopes: ['read'], active: true, usageCount: 0 }
}

export function findKey(_id: string): ApiKey | undefined {
  // TODO: look up a key by id, returning it masked
  return undefined
}

export function revokeKey(_id: string): ApiKey | undefined {
  // TODO: set active=false and return the updated key masked, or undefined if absent
  return undefined
}

export function recordUsage(_id: string): ApiKey | undefined {
  // TODO: increment usageCount and return the updated key masked, or undefined if absent
  return undefined
}

export function deleteKey(_id: string): boolean {
  // TODO: remove the key; return whether it existed
  return false
}

export function hasKey(_id: string): boolean {
  // TODO: return whether a key with this id exists
  return false
}
