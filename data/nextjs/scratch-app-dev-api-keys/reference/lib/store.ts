import type { ApiKey, Scope } from './types'
import { maskSecret } from './mask'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let keys: ApiKey[] = []
let nextKeyId = 1

function seed(): void {
  keys = [
    { id: 'k1', name: 'CI deploy', secret: 'sk_live_aaaa1111', scopes: ['read', 'write'], active: true, usageCount: 12 },
    { id: 'k2', name: 'Read only', secret: 'sk_live_bbbb2222', scopes: ['read'], active: true, usageCount: 4 },
    { id: 'k3', name: 'Legacy admin', secret: 'sk_live_cccc3333', scopes: ['admin'], active: false, usageCount: 99 },
  ]
  nextKeyId = 4
}

seed()

export function __reset(): void {
  seed()
}

function masked(key: ApiKey): ApiKey {
  return { ...key, secret: maskSecret(key.secret) }
}

export function listKeys(filter?: { status?: string | null; scope?: string | null }): ApiKey[] {
  let out = keys.slice()
  const status = filter?.status
  if (status === 'active') out = out.filter((k) => k.active)
  else if (status === 'revoked') out = out.filter((k) => !k.active)
  const scope = filter?.scope
  if (scope === 'read' || scope === 'write' || scope === 'admin') {
    out = out.filter((k) => k.scopes.indexOf(scope) !== -1)
  }
  return out.map(masked)
}

export function createKey(input: { name: string; scopes?: Scope[] }): ApiKey {
  const id = `k${nextKeyId++}`
  const key: ApiKey = {
    id,
    name: input.name,
    secret: `sk_${id}_secret`,
    scopes: input.scopes && input.scopes.length > 0 ? input.scopes : ['read'],
    active: true,
    usageCount: 0,
  }
  keys.push(key)
  return masked(key)
}

export function findKey(id: string): ApiKey | undefined {
  const key = keys.find((k) => k.id === id)
  return key ? masked(key) : undefined
}

export function revokeKey(id: string): ApiKey | undefined {
  const key = keys.find((k) => k.id === id)
  if (!key) return undefined
  key.active = false
  return masked(key)
}

export function recordUsage(id: string): ApiKey | undefined {
  const key = keys.find((k) => k.id === id)
  if (!key) return undefined
  key.usageCount += 1
  return masked(key)
}

export function deleteKey(id: string): boolean {
  const idx = keys.findIndex((k) => k.id === id)
  if (idx === -1) return false
  keys.splice(idx, 1)
  return true
}

export function hasKey(id: string): boolean {
  return keys.some((k) => k.id === id)
}
