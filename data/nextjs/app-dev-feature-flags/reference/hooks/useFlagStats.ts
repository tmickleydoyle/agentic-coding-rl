'use client'
import { useFlags } from '../components/AppStateProvider'
import { ENVS, type AuditEntry, type Env, type Flag } from '../lib/types'

export function enabledCount(flags: Flag[], env: Env): number {
  return flags.filter((f) => f.envs[env]).length
}

export function envSummary(flags: Flag[]): Record<Env, number> {
  const out = { dev: 0, stage: 0, prod: 0 } as Record<Env, number>
  ENVS.forEach((env) => {
    out[env] = enabledCount(flags, env)
  })
  return out
}

export function enabledEnvCount(flag: Flag): number {
  return ENVS.filter((env) => flag.envs[env]).length
}

export function auditForFlag(audit: AuditEntry[], flagId: string): AuditEntry[] {
  return audit.filter((a) => a.flagId === flagId)
}

export function useFlagStats() {
  const { flags } = useFlags()
  const summary = envSummary(flags)
  return { summary }
}
