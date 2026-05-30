'use client'
import { useFlags } from '../components/AppStateProvider'
import type { AuditEntry, Env, Flag } from '../lib/types'

export function enabledCount(_flags: Flag[], _env: Env): number {
  // TODO: how many flags are enabled in this env
  return 0
}

export function envSummary(_flags: Flag[]): Record<Env, number> {
  // TODO: enabled counts per env
  return { dev: 0, stage: 0, prod: 0 }
}

export function enabledEnvCount(_flag: Flag): number {
  // TODO: how many of this flag's envs are enabled
  return 0
}

export function auditForFlag(_audit: AuditEntry[], _flagId: string): AuditEntry[] {
  // TODO: audit entries for a flag
  return []
}

export function useFlagStats() {
  const { flags } = useFlags()
  const summary = envSummary(flags)
  return { summary }
}
