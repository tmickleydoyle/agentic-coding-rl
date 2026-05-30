import type { AuditEntry, Env, Flag } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `flags`, `audit`, and id + createdAt counters; seed 3 flags with an
// empty audit; provide __reset() to re-seed. Each mutating call appends an audit entry. Tests
// call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listFlags(_filter?: { env?: string | null }): Flag[] {
  // TODO: return flags; with ?env=, only flags enabled in that env
  return []
}

export function findFlag(_id: string): Flag | undefined {
  // TODO: look up a flag by id
  return undefined
}

export function createFlag(_input: { key: string; description?: string }): Flag {
  // TODO: append a flag (envs all false, rollout 0), record a 'create' audit entry, return it
  return { id: '', key: '', description: '', envs: { dev: false, stage: false, prod: false }, rollout: 0 }
}

export function updateFlag(
  _id: string,
  _patch: { env?: Env; enabled?: boolean; rollout?: number },
): Flag | undefined {
  // TODO: set/toggle env enabled and/or clamp+set rollout, recording audit entries; undefined if absent
  return undefined
}

export function deleteFlag(_id: string): boolean {
  // TODO: remove the flag; return whether it existed
  return false
}

export function listAudit(_filter?: { flagId?: string | null }): AuditEntry[] {
  // TODO: return audit entries newest first, optionally filtered by flagId
  return []
}
