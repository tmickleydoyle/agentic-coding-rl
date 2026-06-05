import { clampRollout, type AuditEntry, type Env, type Flag } from './types'

// In-memory server store for the API routes. SEPARATE from the client Context state.
// Tests call __reset() in beforeEach for isolation.

let flags: Flag[] = []
let audit: AuditEntry[] = []
let nextFlagId = 1
let nextAuditId = 1
let nextCreatedAt = 1

function seed(): void {
  flags = [
    {
      id: 'f1',
      key: 'new-checkout',
      description: 'New checkout flow',
      envs: { dev: true, stage: true, prod: false },
      rollout: 50,
    },
    {
      id: 'f2',
      key: 'dark-mode',
      description: 'Dark mode',
      envs: { dev: true, stage: false, prod: false },
      rollout: 25,
    },
    {
      id: 'f3',
      key: 'beta-search',
      description: 'Beta search',
      envs: { dev: false, stage: false, prod: false },
      rollout: 0,
    },
  ]
  audit = []
  nextFlagId = 4
  nextAuditId = 1
  nextCreatedAt = 1
}

seed()

export function __reset(): void {
  seed()
}

function record(flagId: string, action: string, env: Env | null): AuditEntry {
  const entry: AuditEntry = {
    id: `a${nextAuditId++}`,
    flagId,
    action,
    env,
    createdAt: nextCreatedAt++,
  }
  audit.push(entry)
  return entry
}

export function listFlags(filter?: { env?: string | null }): Flag[] {
  let out = flags.slice()
  const env = filter?.env
  if (env === 'dev' || env === 'stage' || env === 'prod') {
    out = out.filter((f) => f.envs[env])
  }
  return out
}

export function findFlag(id: string): Flag | undefined {
  return flags.find((f) => f.id === id)
}

export function createFlag(input: { key: string; description?: string }): Flag {
  const flag: Flag = {
    id: `f${nextFlagId++}`,
    key: input.key,
    description: input.description ?? '',
    envs: { dev: false, stage: false, prod: false },
    rollout: 0,
  }
  flags.push(flag)
  record(flag.id, 'create', null)
  return flag
}

export function updateFlag(
  id: string,
  patch: { env?: Env; enabled?: boolean; rollout?: number },
): Flag | undefined {
  const flag = flags.find((f) => f.id === id)
  if (!flag) return undefined
  if (patch.env) {
    const next = typeof patch.enabled === 'boolean' ? patch.enabled : !flag.envs[patch.env]
    flag.envs[patch.env] = next
    record(flag.id, 'toggle', patch.env)
  }
  if (typeof patch.rollout === 'number') {
    flag.rollout = clampRollout(patch.rollout)
    record(flag.id, 'rollout', null)
  }
  return flag
}

export function deleteFlag(id: string): boolean {
  const idx = flags.findIndex((f) => f.id === id)
  if (idx === -1) return false
  flags.splice(idx, 1)
  return true
}

export function listAudit(filter?: { flagId?: string | null }): AuditEntry[] {
  let out = audit.slice()
  const flagId = filter?.flagId
  if (flagId) out = out.filter((a) => a.flagId === flagId)
  out.sort((a, b) => b.createdAt - a.createdAt)
  return out
}
